import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "models", "male.glb");
const temp = path.join(root, "models", "male-web.glb");

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

console.log("reading male model");
const doc = await io.read(file);
console.log("compressing");
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: "high" }));
await io.write(temp, doc);
fs.renameSync(temp, file);
console.log("wrote", file, (fs.statSync(file).size / 1e6).toFixed(1), "MB");
