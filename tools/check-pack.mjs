import fs from "fs";

for (const name of ["female", "male", "supplement"]) {
  const text = fs.readFileSync(`models/${name}.data.js`, "utf8");
  const start = text.indexOf('="') + 2;
  const end = text.lastIndexOf('";');
  const packed = Buffer.from(text.slice(start, end), "base64");
  const glb = fs.readFileSync(`models/${name}.glb`);
  const same = packed.length === glb.length && packed.subarray(0, 16).equals(glb.subarray(0, 16)) && packed.subarray(-16).equals(glb.subarray(-16));
  console.log(name, same ? "ok" : "BAD", packed.length, glb.length);
}
