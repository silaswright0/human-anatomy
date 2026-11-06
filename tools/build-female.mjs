import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "models", "female.glb");
const output = path.join(root, "models", "female.glb");

await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
console.log("reading female model");
const doc = await io.read(input);
let dropped = 0;
for (const node of doc.getRoot().listNodes()) {
  const name = node.getName() || "";
  if (/placenta|umbilical/i.test(name)) {
    node.dispose();
    dropped += 1;
  }
}
console.log("removed pregnancy meshes", dropped);
console.log("simplifying");
await doc.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.12, error: 1 }),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: "high" })
);
fs.mkdirSync(path.dirname(output), { recursive: true });
await io.write(output, doc);
const bytes = fs.statSync(output).size;
console.log("wrote", output, (bytes / 1e6).toFixed(1), "MB");
