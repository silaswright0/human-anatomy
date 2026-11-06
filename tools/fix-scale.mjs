import fs from "fs";
import path from "path";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { compactPrimitive, dedup, getBounds, meshopt, prune, unpartition } from "@gltf-transform/functions";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import { MeshoptEncoder } from "meshoptimizer";

const root = path.resolve(import.meta.dirname, "..");

function positionScale(accessor) {
  if (!accessor.getNormalized()) return 1;
  if (accessor.getComponentType() === 5122) return 1 / 32767;
  if (accessor.getComponentType() === 5120) return 1 / 127;
  if (accessor.getComponentType() === 5123) return 1 / 65535;
  if (accessor.getComponentType() === 5121) return 1 / 255;
  return 1;
}

function worldX(matrix, x, y, z) {
  return matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
}

function worldXs(node, prim) {
  const attribute = prim.getAttribute("POSITION");
  const position = attribute.getArray();
  const scale = positionScale(attribute);
  const matrix = node.getWorldMatrix();
  const xs = new Float64Array(position.length / 3);
  xs.fill(Number.NaN);
  const index = prim.getIndices().getArray();
  for (let i = 0; i < index.length; i += 1) {
    const vertex = index[i];
    if (!Number.isNaN(xs[vertex])) continue;
    const offset = vertex * 3;
    xs[vertex] = worldX(matrix, position[offset] * scale, position[offset + 1] * scale, position[offset + 2] * scale);
  }
  return xs;
}

function largestGap(xs) {
  const values = [];
  for (const x of xs) if (!Number.isNaN(x)) values.push(x);
  values.sort((a, b) => a - b);
  let gap = 0;
  let at = 0;
  for (let i = 1; i < values.length; i += 1) {
    const span = values[i] - values[i - 1];
    if (span > gap) {
      gap = span;
      at = i;
    }
  }
  return { gap, at, count: values.length, values };
}

function expandPositions(doc, prim) {
  const packed = prim.getAttribute("POSITION");
  const scale = positionScale(packed);
  if (scale === 1) return;
  const raw = packed.getArray();
  const floats = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) floats[i] = raw[i] * scale;
  prim.setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(floats));
}

function writeIndices(doc, prim, values) {
  prim.setIndices(doc.createAccessor().setArray(new Uint32Array(values)).setType("SCALAR"));
  compactPrimitive(prim);
  expandPositions(doc, prim);
}

function cloneAccessor(doc, accessor) {
  return doc.createAccessor().setType(accessor.getType()).setNormalized(accessor.getNormalized()).setArray(accessor.getArray().slice());
}

function clonePrimitive(doc, prim) {
  const copy = doc.createPrimitive().setMode(prim.getMode());
  for (const semantic of prim.listSemantics()) copy.setAttribute(semantic, cloneAccessor(doc, prim.getAttribute(semantic)));
  if (prim.getIndices()) copy.setIndices(cloneAccessor(doc, prim.getIndices()).setType("SCALAR"));
  if (prim.getMaterial()) copy.setMaterial(prim.getMaterial());
  return copy;
}

function copyTransform(from, to) {
  const matrix = from.getMatrix();
  if (matrix) {
    to.setMatrix(matrix.slice());
    return;
  }
  to.setTranslation(from.getTranslation().slice());
  to.setRotation(from.getRotation().slice());
  to.setScale(from.getScale().slice());
}

function clipSpike(doc, node) {
  let dropped = 0;
  let kept = 0;
  for (const prim of node.getMesh().listPrimitives()) {
    const xs = worldXs(node, prim);
    const split = largestGap(xs);
    const minor = Math.min(split.at, split.count - split.at) / split.count;
    if (split.gap < 0.02 || minor > 0.02) {
      console.log("left intact", node.getName(), { gapCm: +(split.gap * 100).toFixed(2), minor: +minor.toFixed(4) });
      continue;
    }
    const limit = split.values[split.at - 1];
    const highTail = split.at > split.count / 2;
    const index = prim.getIndices().getArray();
    const next = [];
    for (let i = 0; i < index.length; i += 3) {
      let inside = true;
      for (let k = 0; k < 3; k += 1) {
        const x = xs[index[i + k]];
        if (highTail ? x > limit : x < limit) inside = false;
      }
      if (!inside) {
        dropped += 1;
        continue;
      }
      next.push(index[i], index[i + 1], index[i + 2]);
      kept += 1;
    }
    writeIndices(doc, prim, next);
  }
  const box = getBounds(node);
  const size = box.max.map((value, index) => +((value - box.min[index]) * 100).toFixed(2));
  console.log("clipped", node.getName(), { kept, dropped, size });
  if (Math.max(...size) > 4) throw new Error(`${node.getName()} is still oversized`);
}

function splitEars(doc, node) {
  const prim = node.getMesh().listPrimitives()[0];
  const xs = worldXs(node, prim);
  const split = largestGap(xs);
  if (split.gap < 0.05) throw new Error("External ear has no gap between the two pinnae");
  const mid = (split.values[split.at - 1] + split.values[split.at]) / 2;
  const lower = [];
  const upper = [];
  const index = prim.getIndices().getArray();
  let cross = 0;
  for (let i = 0; i < index.length; i += 3) {
    const side = [xs[index[i]], xs[index[i + 1]], xs[index[i + 2]]];
    if (side.every((x) => x < mid)) lower.push(index[i], index[i + 1], index[i + 2]);
    else if (side.every((x) => x > mid)) upper.push(index[i], index[i + 1], index[i + 2]);
    else cross += 1;
  }
  if (!lower.length || !upper.length) throw new Error("External ear did not divide into two pinnae");
  const rightPrim = prim;
  const leftPrim = clonePrimitive(doc, prim);
  writeIndices(doc, rightPrim, lower);
  writeIndices(doc, leftPrim, upper);
  node.setName("right-external-ear");
  node.getMesh().setName("right-external-ear");
  const leftMesh = doc.createMesh("left-external-ear").addPrimitive(leftPrim);
  const leftNode = doc.createNode("left-external-ear").setMesh(leftMesh);
  copyTransform(node, leftNode);
  const parent = node.getParentNode();
  if (parent) parent.addChild(leftNode);
  else doc.getRoot().listScenes()[0].addChild(leftNode);
  for (const ear of [node, leftNode]) {
    const box = getBounds(ear);
    const size = box.max.map((value, index) => +((value - box.min[index]) * 100).toFixed(2));
    console.log("ear", ear.getName(), { triangles: ear === node ? lower.length / 3 : upper.length / 3, cross, size });
    if (Math.max(...size) > 8) throw new Error(`${ear.getName()} is still head-wide`);
  }
}

function dropBuccal(doc) {
  let dropped = 0;
  for (const node of [...doc.getRoot().listNodes()]) {
    const name = node.getName() || (node.getMesh() && node.getMesh().getName()) || "";
    if (!/buccal/i.test(name) || !node.getMesh()) continue;
    node.dispose();
    dropped += 1;
  }
  console.log("dropped buccal", dropped);
}

function dropCatalog(ids) {
  const file = path.join(root, "js", "catalog.js");
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("[");
  const end = text.indexOf("];");
  const list = JSON.parse(text.slice(start, end + 1)).filter((item) => !ids.includes(item.id));
  fs.writeFileSync(file, text.slice(0, start) + JSON.stringify(list) + text.slice(end + 1));
  console.log("catalog", list.length);
}

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

const pack = () => [prune(), dedup(), meshopt({ encoder: MeshoptEncoder, level: "high" }), unpartition()];

console.log("reading male organs");
const male = await io.read(path.join(root, "models", "male-organs.glb"));
const eyeNames = ["right-sclera", "right-cornea", "right-choroid-2", "suspensory-ligament-of-right-lens"];
for (const name of eyeNames) {
  const node = male.getRoot().listNodes().find((item) => item.getName() === name && item.getMesh());
  if (!node) throw new Error(`Missing ${name}`);
  clipSpike(male, node);
}
const ear = male.getRoot().listNodes().find((item) => item.getName() === "external-ear" && item.getMesh());
if (ear) splitEars(male, ear);
else console.log("external ear already split");
await male.transform(...pack());
await io.write(path.join(root, "models", "male-organs.glb"), male);

console.log("reading female organs");
const female = await io.read(path.join(root, "models", "female-organs.glb"));
dropBuccal(female);
await female.transform(...pack());
await io.write(path.join(root, "models", "female-organs.glb"), female);

dropCatalog(["external-ear", "VH_F_buccal_mucosa"]);
console.log("wrote organ files");
