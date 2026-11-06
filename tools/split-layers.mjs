import fs from "fs";
import path from "path";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { cloneDocument, compactPrimitive, dedup, getBounds, mergeDocuments, meshopt, prune, unpartition } from "@gltf-transform/functions";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import { MeshoptEncoder } from "meshoptimizer";
import { applyRetag, classify } from "./system-tags.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dry = process.argv.includes("--dry");

function loadCatalog() {
  const file = path.join(root, "js", "catalog.js");
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("[");
  const end = text.indexOf("];");
  const list = JSON.parse(text.slice(start, end + 1));
  return { file, text, start, end, list };
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function mul(a, s) {
  return [a[0] * s, a[1] * s, a[2] * s];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function lengthOf(a) {
  return Math.hypot(a[0], a[1], a[2]);
}
function norm(a) {
  const span = lengthOf(a) || 1;
  return mul(a, 1 / span);
}
function matMul(a, b) {
  const out = new Array(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] = a[row] * b[column * 4]
        + a[4 + row] * b[column * 4 + 1]
        + a[8 + row] * b[column * 4 + 2]
        + a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}
function matTranslate(v) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v[0], v[1], v[2], 1];
}
function matScale(s) {
  return [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1];
}
function matBasis(axes) {
  const [x, y, z] = axes;
  return [x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, 0, 0, 0, 1];
}
function matTranspose(m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
}
function transformPoint(matrix, point) {
  const x = point[0];
  const y = point[1];
  const z = point[2];
  const w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w,
  ];
}

function frame(origin, vertebra, tibia) {
  const x = norm(sub(vertebra, origin));
  const z = norm(cross(x, sub(tibia, origin)));
  const y = cross(z, x);
  return { origin, axes: [x, y, z], scale: lengthOf(sub(vertebra, origin)) };
}

function centerOf(doc, name) {
  const node = doc.getRoot().listNodes().find((item) => item.getName() === name && item.getMesh());
  if (!node) throw new Error(`Missing landmark ${name}`);
  const box = getBounds(node);
  return [
    (box.min[0] + box.max[0]) / 2,
    (box.min[1] + box.max[1]) / 2,
    (box.min[2] + box.max[2]) / 2,
  ];
}

function labelsOf(node) {
  const names = [];
  if (node.getName()) names.push(node.getName());
  const meshName = node.getMesh() && node.getMesh().getName();
  if (meshName && meshName !== node.getName()) names.push(meshName);
  return names.length ? names : [""];
}

function namesOf(doc) {
  const names = [];
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    names.push(...labelsOf(node));
  }
  return names;
}

function worldY(matrix, x, y, z) {
  return matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
}

// Meshopt leaves the skin positions as normalized int16. getArray() returns the
// raw integers, so they have to be scaled before the node matrix means meters.
function positionScale(accessor) {
  if (!accessor.getNormalized()) return 1;
  if (accessor.getComponentType() === 5122) return 1 / 32767;
  if (accessor.getComponentType() === 5120) return 1 / 127;
  if (accessor.getComponentType() === 5123) return 1 / 65535;
  if (accessor.getComponentType() === 5121) return 1 / 255;
  return 1;
}

// The HuBMAP skin is one mesh of the whole body. The neck and below draw a
// second trunk and a second pair of arms over the shared wall. The head stays.
function clipSkinToHead(doc, neck) {
  const node = doc.getRoot().listNodes().find((item) => {
    const name = item.getName() || (item.getMesh() && item.getMesh().getName()) || "";
    return name === "VH_F_skin";
  });
  if (!node || !node.getMesh()) return;
  const matrix = node.getWorldMatrix();
  let kept = 0;
  let dropped = 0;
  for (const prim of node.getMesh().listPrimitives()) {
    const attribute = prim.getAttribute("POSITION");
    const position = attribute.getArray();
    const scale = positionScale(attribute);
    const src = prim.getIndices().getArray();
    const next = [];
    for (let i = 0; i < src.length; i += 3) {
      let above = true;
      for (let k = 0; k < 3; k += 1) {
        const vertex = src[i + k] * 3;
        const y = worldY(matrix, position[vertex] * scale, position[vertex + 1] * scale, position[vertex + 2] * scale);
        if (y < neck) above = false;
      }
      if (!above) {
        dropped += 1;
        continue;
      }
      next.push(src[i], src[i + 1], src[i + 2]);
      kept += 1;
    }
    // Vertex ids run past 65535, so the index list has to stay 32-bit until
    // compactPrimitive drops the unused body vertices.
    prim.setIndices(doc.createAccessor().setArray(new Uint32Array(next)).setType("SCALAR"));
    compactPrimitive(prim);
    // meshopt skips the inverse transform on positions that are already int16
    // and would otherwise scale the node from the old full-body bounds.
    const packed = prim.getAttribute("POSITION");
    const packedScale = positionScale(packed);
    if (packedScale !== 1) {
      const raw = packed.getArray();
      const floats = new Float32Array(raw.length);
      for (let i = 0; i < raw.length; i += 1) floats[i] = raw[i] * packedScale;
      prim.setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(floats));
    }
  }
  console.log("clipped skin to the head", { kept, dropped, neck });
}

async function subset(doc, keep) {
  const copy = cloneDocument(doc);
  for (const node of [...copy.getRoot().listNodes()]) {
    if (!node.getMesh()) continue;
    if (!labelsOf(node).every(keep)) node.dispose();
  }
  await copy.transform(prune());
  return copy;
}

function assertIncludes(label, names, pattern) {
  if (!names.some((name) => pattern.test(name))) throw new Error(`${label} is missing ${pattern}`);
}
function assertExcludes(label, names, pattern) {
  const hit = names.find((name) => pattern.test(name));
  if (hit) throw new Error(`${label} still has ${hit}`);
}

const catalog = loadCatalog();
const byId = new Map(catalog.list.map((item) => [item.id, item]));
function roleOf(name) {
  const item = byId.get(name);
  if (!item) return "organ";
  return classify(item).role;
}
const wallRole = (name) => roleOf(name) === "wall-bone" || roleOf(name) === "wall-muscle";

// Some HuBMAP limb meshes are absent from the catalog, so the role pass kept them.
// They sit on top of the shared legs.
function replacedFemaleLimb(name) {
  const key = String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (/femur|rectus-femoris|quadriceps|articular-cartilage-of-knee/.test(key)) return true;
  if (/cruciate|meniscus|patellar-ligament|collateral-ligament|anterolateral-ligament|perichondular|enthesis/.test(key)) return true;
  return false;
}

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

console.log("reading models");
const female = await io.read(path.join(root, "models", "female.glb"));
const male = await io.read(path.join(root, "models", "male.glb"));
const supplement = await io.read(path.join(root, "models", "supplement.glb"));

const femaleFrame = frame(
  centerOf(female, "VH_F_sternum"),
  centerOf(female, "VH_F_thoracic_vertebra_6"),
  centerOf(female, "VH_F_tibia_L"),
);
const maleFrame = frame(
  centerOf(male, "body-of-sternum"),
  centerOf(male, "sixth-thoracic-vertebra"),
  centerOf(male, "left-tibia"),
);
// Both references are already adult height. Matching the short sternum-to-vertebra
// gap would shrink the whole wall, so the fit keeps height and aligns the chest.
const scale = 1;
const matrix = matMul(
  matTranslate(femaleFrame.origin),
  matMul(
    matBasis(femaleFrame.axes),
    matMul(matScale(scale), matMul(matTranspose(matBasis(maleFrame.axes)), matTranslate(mul(maleFrame.origin, -1)))),
  ),
);
const maleSternum = centerOf(male, "body-of-sternum");
const maleVertebra = centerOf(male, "sixth-thoracic-vertebra");
const maleTibia = centerOf(male, "left-tibia");
const sternumError = lengthOf(sub(transformPoint(matrix, maleSternum), femaleFrame.origin));
const vertebraError = lengthOf(sub(transformPoint(matrix, maleVertebra), centerOf(female, "VH_F_thoracic_vertebra_6")));
const tibiaError = lengthOf(sub(transformPoint(matrix, maleTibia), centerOf(female, "VH_F_tibia_L")));
console.log("fit", {
  scale,
  femaleSpan: femaleFrame.scale,
  maleSpan: maleFrame.scale,
  sternumError,
  vertebraError,
  tibiaError,
});
if (sternumError > 0.01 || vertebraError > 0.05) {
  throw new Error("Sternum and vertebra did not land on the female chest");
}

console.log("splitting");
const femaleOrgans = await subset(female, (name) => !wallRole(name) && !replacedFemaleLimb(name));
clipSkinToHead(femaleOrgans, 0.64);
const maleOrgans = await subset(male, (name) => !wallRole(name));
const shared = await subset(male, wallRole);
const extra = await subset(supplement, (name) => roleOf(name) === "wall-muscle");
mergeDocuments(shared, extra);
const scenes = shared.getRoot().listScenes();
const primary = scenes[0];
for (const scene of scenes.slice(1)) {
  for (const child of [...scene.listChildren()]) primary.addChild(child);
  scene.dispose();
}

const femaleNames = namesOf(femaleOrgans);
const maleNames = namesOf(maleOrgans);
const wallNames = namesOf(shared);
console.log("counts", { female: femaleNames.length, male: maleNames.length, wall: wallNames.length });
assertIncludes("female organs", femaleNames, /uterus|ovary/i);
assertIncludes("female organs", femaleNames, /ilium/i);
assertExcludes("female organs", femaleNames, /(sternum|rib|humerus|scapula)(_|$)/i);
assertExcludes("female organs", femaleNames, /femur|rectus-femoris|rectus_femoris|cruciate|meniscus/i);
assertIncludes("male organs", maleNames, /prostate|testis/i);
assertIncludes("male organs", maleNames, /hip-bone/i);
assertIncludes("male organs", maleNames, /artery|aorta/i);
assertExcludes("male organs", maleNames, /(^|-)(rib|scapula|humerus)$/);
assertIncludes("wall", wallNames, /rib/);
assertIncludes("wall", wallNames, /scapula/);
assertIncludes("wall", wallNames, /humerus/);
assertIncludes("wall", wallNames, /za-.*latissimus|rectus-abdominis|za-left-rectus-abdominis/);
assertExcludes("wall", wallNames, /hip-bone|uterus|prostate/);

if (dry) {
  console.log("dry run only");
  process.exit(0);
}

console.log("compressing");
const pack = () => [dedup(), meshopt({ encoder: MeshoptEncoder, level: "high" }), unpartition()];
await femaleOrgans.transform(...pack());
await maleOrgans.transform(...pack());
await shared.transform(...pack());

const models = path.join(root, "models");
await io.write(path.join(models, "female-organs.glb"), femaleOrgans);
await io.write(path.join(models, "male-organs.glb"), maleOrgans);
await io.write(path.join(models, "shared-wall.glb"), shared);
const fit = { matrix, scale, sternumError, vertebraError, tibiaError };
fs.writeFileSync(path.join(models, "female-wall.json"), JSON.stringify(fit));
fs.writeFileSync(path.join(models, "female-wall.data.js"), `window.ATLAS_WALL_FIT=${JSON.stringify({ matrix })};\n`);

const tagged = applyRetag(catalog.list);
fs.writeFileSync(catalog.file, catalog.text.slice(0, catalog.start) + JSON.stringify(tagged) + catalog.text.slice(catalog.end + 1));
for (const name of ["female-organs.glb", "male-organs.glb", "shared-wall.glb"]) {
  const bytes = fs.statSync(path.join(models, name)).size;
  console.log("wrote", name, (bytes / 1e6).toFixed(1), "MB");
}
console.log("wrote catalog", tagged.length);
