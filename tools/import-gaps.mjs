import fs from "fs";
import path from "path";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression } from "@gltf-transform/extensions";
import { cloneDocument, dedup, meshopt, prune, unpartition } from "@gltf-transform/functions";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import { MeshoptEncoder } from "meshoptimizer";
import { classify } from "./system-tags.mjs";

const root = path.resolve(import.meta.dirname, "..");

function loadCatalog() {
  const file = path.join(root, "js", "catalog.js");
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("[");
  const end = text.indexOf("];");
  const list = JSON.parse(text.slice(start, end + 1));
  return { file, text, start, end, list };
}

function labelsOf(node) {
  const names = [];
  if (node.getName()) names.push(node.getName());
  const meshName = node.getMesh() && node.getMesh().getName();
  if (meshName && meshName !== node.getName()) names.push(meshName);
  return names.filter(Boolean);
}

function namesOf(doc) {
  const names = [];
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    names.push(...labelsOf(node));
  }
  return names;
}

function keyOf(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function identity(name) {
  return keyOf(name).replace(/^vh-[fm]-/, "").replace(/^(left|right)-/, "").replace(/-(left|right)$/, "");
}

function covered(id, set) {
  if (set.has(id)) return true;
  const stem = id.replace(/-(a|b|c|d|\d+)$/, "");
  if (stem !== id && set.has(stem)) return true;
  for (const other of set) {
    if (other.length < 8) continue;
    if (id.startsWith(`${other}-`) || other.startsWith(`${id}-`)) return true;
  }
  return false;
}

const sexSpecific = /uterus|ovary|vagina|cervix|broad-ligament|mesosalpinx|fallopian|testis|testicular|epididymis|prostate|penis|scrotum|spermatic|deferent|seminal|cavernosum|spongiosum|glans|bulbourethral|ejaculatory|prostatic|nipple|areola|lactiferous|mammary|breast|clitoris|labia|placenta|urethra|amnion|umbilical|chorionic|basal-plate/;
const central = /allen-|gyrus|thalamus|cerebr|cerebell|hippocamp|amygdala|ventricle|pons|medulla|midbrain|corpus-callosum|spinal-cord|fornix|caudate|putamen|hypothalamus/;
const pelvis = /hip-bone|ilium|ischium|pubis|sacrum|acetabulum|os-coxae|innominate/;

const maleToFemale = /artery|vein|vena|aorta|plexus|ganglion|(^|-)nerve($|-)|ramus|esophagus|oesophagus|stomach|jejun|pituitary|hypophysis|adrenal|suprarenal|eyebrow|pubic-hair|hair-of|external-ear|auricle|nasal-bone|nasal-concha|calcaneal|levator-palpebrae|mesentery|lacrimal-gland|nasolacrimal|external-nose/;
const femaleToMale = /caecum|cecum|parotid|tonsil|lymph|coccyx|bile-duct|renal-cortex|renal-medulla|renal-pelvis|conjunctiva|ciliary-muscle|dura|lung|pleura|olfactory-bulb|falciform|ligamentum-venosum|round-ligament-of-liver|hepatic-duct|bronchus|trachea/;

function wanted(name, pattern) {
  const key = keyOf(name);
  if (!key || sexSpecific.test(key) || central.test(key) || pelvis.test(key)) return false;
  if (/skin|femur|tibia|fibula|humerus|scapula|sternum|patella|vertebra/.test(key)) return false;
  if (/amnion|placenta|chorionic|basal-plate|umbilical|subcutaneous-abdominal-adipose|(^|-)fat(-|$)/.test(key)) return false;
  if (/ascending-aorta|descending-aorta|descending-thoracic-aorta|abdominal-aorta|thoracic-aorta|inferior-vena-cava|superior-vena-cava/.test(key)) return false;
  return pattern.test(key);
}

async function subset(doc, keep) {
  const copy = cloneDocument(doc);
  for (const node of [...copy.getRoot().listNodes()]) {
    if (!node.getMesh()) continue;
    if (!labelsOf(node).some(keep)) node.dispose();
  }
  await copy.transform(prune());
  return copy;
}

function identities(doc) {
  const set = new Set();
  for (const name of namesOf(doc)) set.add(identity(name));
  return set;
}

function titleOf(id) {
  return id
    .replace(/^VH_[FM]_/i, "")
    .replace(/_/g, "-")
    .replace(/-(l|r)$/i, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sideOf(id) {
  const key = keyOf(id);
  if (/(^|-)(left|l)$/.test(key) || key.startsWith("left-")) return "patient-left";
  if (/(^|-)(right|r)$/.test(key) || key.startsWith("right-")) return "patient-right";
  return null;
}

function systemOf(id, source) {
  const key = keyOf(id);
  if (/vagina|cervix|broad-ligament|round-ligament-of-uterus|ovarian-ligament/.test(key)) return "reproductive";
  if (/bronchus|trachea|lung|pleura|inferomedial-segment/.test(key)) return "respiratory";
  if (/duodenum|ileum|bile|parotid|tonsil|caecum|cecum|jejun|esophagus|stomach|mesentery/.test(key)) return "digestive";
  if (/bladder|renal-/.test(key)) return "urinary";
  if (/retina|ciliary|conjunctiva|dura|olfactory/.test(key)) return "nervous";
  if (/placenta|amnion|chorionic|umbilical|basal-plate/.test(key)) return "reproductive";
  if (/lymph/.test(key)) return "lymphatic";
  if (/coccyx/.test(key)) return "skeletal";
  return classify({ id, name: titleOf(id), systems: ["skeletal"], source }).system;
}

const forced = {
  VH_F_broad_ligament: "reproductive",
  VH_F_cervix: "reproductive",
  VH_F_vagina: "reproductive",
  VH_F_ciliary_body_L: "nervous",
  VH_F_ciliary_body_R: "nervous",
  VH_F_duodenum_superior: "digestive",
  VH_F_fundus_of_urinary_bladder_base: "urinary",
  VH_F_ileum: "digestive",
  VH_F_left_inferomedial_segment: "respiratory",
  VH_F_left_main_bronchus: "respiratory",
  VH_F_retina_L: "nervous",
  VH_F_retina_R: "nervous",
  VH_F_right_main_bronchus: "respiratory",
  VH_F_trachea: "respiratory",
};

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

console.log("reading plates");
const female = await io.read(path.join(root, "models", "female-organs.glb"));
const male = await io.read(path.join(root, "models", "male-organs.glb"));
const wall = await io.read(path.join(root, "models", "shared-wall.glb"));
const femaleIds = identities(female);
for (const id of identities(wall)) femaleIds.add(id);
const maleIds = identities(male);
for (const id of identities(wall)) maleIds.add(id);

const femaleGaps = await subset(male, (name) => wanted(name, maleToFemale) && !covered(identity(name), femaleIds));
const maleGaps = await subset(female, (name) => wanted(name, femaleToMale) && !covered(identity(name), maleIds));
const femaleNames = namesOf(femaleGaps);
const maleNames = namesOf(maleGaps);
console.log("female gaps", femaleNames.length, "male gaps", maleNames.length);
if (!femaleNames.some((name) => /femoral|brachial|jugular|popliteal|esophagus|stomach|jejun/i.test(name))) {
  throw new Error("Female gap layer did not keep the missing vessels or gut");
}
if (!maleNames.some((name) => /caecum|cecum|parotid|tonsil|lymph|coccyx|lung|bronchus|bile/i.test(name))) {
  throw new Error("Male gap layer did not keep the missing HuBMAP organs");
}
if (femaleNames.some((name) => /uterus|prostate|penis|vagina|hip-bone|sternum/i.test(name))) {
  throw new Error("Female gap layer kept a structure that stays on one plate");
}

const catalog = loadCatalog();
const byId = new Map(catalog.list.map((item) => [item.id, item]));

function ensure(id, source, sex) {
  const existing = byId.get(id);
  if (existing) {
    if (sex === "both") existing.sex = "both";
    if (forced[id]) existing.systems = [forced[id]];
    return;
  }
  const systems = [forced[id] || systemOf(id, source)];
  const item = {
    id,
    name: titleOf(id),
    systems,
    sex,
    side: sideOf(id),
    source,
    essay: null,
  };
  catalog.list.push(item);
  byId.set(id, item);
}

const femaleOrganNames = new Set(namesOf(female));
const maleOrganNames = new Set(namesOf(male));
for (const name of femaleOrganNames) {
  if (!byId.has(name)) ensure(name, "hubmap", "female");
}
for (const name of femaleNames) ensure(name, byId.get(name)?.source || "bodyparts3d", "both");
for (const name of maleNames) ensure(name, byId.get(name)?.source || "hubmap", "both");
const femaleHas = new Set([...femaleOrganNames, ...femaleNames]);
const maleHas = new Set([...maleOrganNames, ...maleNames]);
for (const item of catalog.list) {
  if (item.sex !== "both" || classify(item).role !== "organ") continue;
  const onFemale = femaleHas.has(item.id);
  const onMale = maleHas.has(item.id);
  if (onFemale && !onMale) item.sex = "female";
  if (onMale && !onFemale) item.sex = "male";
}

await femaleGaps.transform(dedup(), meshopt({ encoder: MeshoptEncoder, level: "high" }), unpartition());
await maleGaps.transform(dedup(), meshopt({ encoder: MeshoptEncoder, level: "high" }), unpartition());
await io.write(path.join(root, "models", "female-gaps.glb"), femaleGaps);
await io.write(path.join(root, "models", "male-gaps.glb"), maleGaps);

const next = catalog.text.slice(0, catalog.start) + JSON.stringify(catalog.list) + catalog.text.slice(catalog.end + 1);
fs.writeFileSync(catalog.file, next);
console.log("catalog", catalog.list.length);
console.log("female sample", femaleNames.filter((name) => /femoral|esophagus|stomach|jejun|pituitary|adrenal|jugular|sciatic|vagus/i.test(name)).slice(0, 40).join(", "));
console.log("male sample", maleNames.filter((name) => /caecum|parotid|tonsil|lymph|coccyx|lung|bronchus|bile|trachea|conjunctiva|dura/i.test(name)).slice(0, 40).join(", "));
