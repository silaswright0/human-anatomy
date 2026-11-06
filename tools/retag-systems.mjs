import fs from "fs";
import path from "path";
import { applyRetag, summarize } from "./system-tags.mjs";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "js", "catalog.js");
const text = fs.readFileSync(file, "utf8");
const start = text.indexOf("[");
const end = text.indexOf("];");
const list = JSON.parse(text.slice(start, end + 1));
const report = summarize(list);
console.log("systems", report.systems);
console.log("leftover skeletal organs", report.leftover.length);
if (process.argv.includes("--dry")) process.exit(0);

const tagged = applyRetag(list);
fs.writeFileSync(file, text.slice(0, start) + JSON.stringify(tagged) + text.slice(end + 1));
console.log("wrote", file, tagged.length, "meshes");
