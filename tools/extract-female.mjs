import fs from "fs";
import path from "path";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { compactPrimitive, dedup, getBounds, meshopt, prune, unpartition } from "@gltf-transform/functions";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import { MeshoptEncoder } from "meshoptimizer";
import { classify } from "./system-tags.mjs";

const root = path.resolve(import.meta.dirname, "..");

function loadCatalog() {
  const file = path.join(root, "js", "catalog.js");
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("[");
  const end = text.indexOf("];");
  return JSON.parse(text.slice(start, end + 1));
}

function labelsOf(node) {
  const names = [];
  if (node.getName()) names.push(node.getName());
  const meshName = node.getMesh() && node.getMesh().getName();
  if (meshName && meshName !== node.getName()) names.push(meshName);
  return names.length ? names : [""];
}

function keyOf(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function positionScale(accessor) {
  if (!accessor.getNormalized()) return 1;
  if (accessor.getComponentType() === 5122) return 1 / 32767;
  if (accessor.getComponentType() === 5120) return 1 / 127;
  if (accessor.getComponentType() === 5123) return 1 / 65535;
  if (accessor.getComponentType() === 5121) return 1 / 255;
  return 1;
}

function worldY(matrix, x, y, z) {
  return matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
}

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
    prim.setIndices(doc.createAccessor().setArray(new Uint32Array(next)).setType("SCALAR"));
    compactPrimitive(prim);
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

const catalog = loadCatalog();
const byId = new Map(catalog.map((item) => [item.id, item]));

function wallRole(name) {
  const item = byId.get(name);
  if (!item) return false;
  const role = classify(item).role;
  return role === "wall-bone" || role === "wall-muscle";
}

function replacedFemaleLimb(name) {
  const key = keyOf(name);
  if (/femur|rectus-femoris|quadriceps|articular-cartilage-of-knee/.test(key)) return true;
  if (/cruciate|meniscus|patellar-ligament|collateral-ligament|anterolateral-ligament|perichondular|enthesis/.test(key)) return true;
  return false;
}

function bareBone(name) {
  const key = keyOf(name);
  if (/vertebra|intervertebral|nucleus-pulposus|manubrium/.test(key)) return true;
  if (/(^|-)rib(s)?(-|$)/.test(key)) return true;
  if (/(^|-)(femur|tibia|fibula|patella|humerus|scapula|clavicle|ulna|radius|sternum)(-|$)/.test(key)) return true;
  if (/lower-limb|upper-limb|muscles-of-knee|ligaments-of-knee/.test(key)) return true;
  if (/^vh-f-knee/.test(key)) return true;
  return false;
}

function foreignState(name) {
  const key = keyOf(name);
  if (/amnion|placenta|chorionic|basal-plate|umbilical/.test(key)) return true;
  if (/subcutaneous-abdominal-adipose|(^|-)fat(-|$)/.test(key)) return true;
  return false;
}

function keep(name) {
  if (!name) return false;
  if (wallRole(name) || replacedFemaleLimb(name) || bareBone(name) || foreignState(name)) return false;
  if (/buccal-mucosa/.test(keyOf(name))) return false;
  return true;
}

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

console.log("reading united female");
const doc = await io.read(path.join(root, "models", "source", "3d-vh-f-united.glb"));
let dropped = 0;
for (const node of [...doc.getRoot().listNodes()]) {
  if (!node.getMesh()) continue;
  if (labelsOf(node).every(keep)) continue;
  node.dispose();
  dropped += 1;
}
console.log("dropped meshes", dropped);
clipSkinToHead(doc, 0.64);
await doc.transform(prune());
const names = [];
for (const node of doc.getRoot().listNodes()) {
  if (node.getMesh()) names.push(...labelsOf(node));
}
const joined = names.join("\n");
if (!/uterus|ovary/i.test(joined)) throw new Error("Female organs lost the uterus");
if (!/ilium/i.test(joined)) throw new Error("Female organs lost the ilium");
if (!/olfactory-bulb|olfactory_bulb/i.test(joined)) throw new Error("Olfactory bulb was not kept");
if (/sternum|femur|humerus/i.test(joined)) throw new Error("A wall bone stayed in the female organs");
const skin = doc.getRoot().listNodes().find((node) => (node.getName() || "") === "VH_F_skin");
if (skin) {
  const box = getBounds(skin);
  console.log("skin bounds", box.min.map((value) => value.toFixed(3)), box.max.map((value) => value.toFixed(3)));
  if (box.min[1] < 0.6) throw new Error("Skin still includes the body below the jaw");
}
console.log("kept", names.length);
await doc.transform(dedup(), meshopt({ encoder: MeshoptEncoder, level: "high" }), unpartition());
const target = path.join(root, "models", "female-organs.glb");
await io.write(target, doc);
console.log("wrote", target, (fs.statSync(target).size / 1e6).toFixed(1), "MB");
