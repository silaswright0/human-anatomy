import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const models = [
  ["female-organs.glb", "female-organs"],
  ["male-organs.glb", "male-organs"],
  ["shared-wall.glb", "shared-wall"],
  ["female-gaps.glb", "female-gaps"],
  ["male-gaps.glb", "male-gaps"],
];
const chunk = 3 * 1024 * 1024;

for (const [file, key] of models) {
  const source = path.join(root, "models", file);
  const target = path.join(root, "models", `${key}.data.js`);
  const bytes = fs.readFileSync(source);
  const handle = fs.openSync(target, "w");
  fs.writeSync(handle, `window.ATLAS_MODEL_B64=window.ATLAS_MODEL_B64||{};window.ATLAS_MODEL_B64[${JSON.stringify(key)}]="`);
  for (let offset = 0; offset < bytes.length; offset += chunk) {
    fs.writeSync(handle, bytes.subarray(offset, offset + chunk).toString("base64"));
  }
  fs.writeSync(handle, '";\n');
  fs.closeSync(handle);
  console.log("wrote", target, (fs.statSync(target).size / 1e6).toFixed(1), "MB");
}
