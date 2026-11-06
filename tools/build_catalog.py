"""Write js/catalog.js from the packed models and the existing essays."""
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
RECORDS = json.loads((ROOT / "tools" / "cache" / "male-records.json").read_text(encoding="utf-8"))

RULES = [
    ("cardiovascular", re.compile(r"artery|arteries|\bvein\b|venous|aorta|vena cava|\batrium\b|ventricle|\bvalve\b|capillary|coronary|portal|\bblood\b|cardiac|myocardium|endocardium|pericardium|\bheart\b", re.I)),
    ("nervous", re.compile(r"\bnerve\b|plexus|ganglion|\bbrain\b|cerebr|cerebell|spinal cord|thalamus|hypothalamus|\bpons\b|medulla|meninx|meninges|gyrus|sulcus", re.I)),
    ("lymphatic", re.compile(r"lymph|spleen|thymus|tonsil", re.I)),
    ("endocrine", re.compile(r"thyroid|parathyroid|adrenal|pituitary|pineal|islet", re.I)),
    ("reproductive", re.compile(r"uterus|ovary|ovari|testis|testes|penis|prostate|vagina|vulva|clitoris|epididym|seminal|uterine tube|mammary|scrotum|spermatic|labium|labia|ductus deferens|\bbreast\b", re.I)),
    ("respiratory", re.compile(r"\blung\b|pulmon|bronch|trachea|larynx|pharynx|nasal|pleura|alveol", re.I)),
    ("digestive", re.compile(r"stomach|\bliver\b|gall ?bladder|pancreas|intestin|colon|esophag|duoden|jejun|ileum|cecum|caecum|appendix|rectum|tongue|tooth|teeth|gingiva|parotid|submandibular|\boral\b", re.I)),
    ("urinary", re.compile(r"kidney|ureter|\bbladder\b|urethra|renal", re.I)),
    ("muscular", re.compile(r"\bmuscle\b|tendon|diaphragm|\bfascia\b|pectoralis|latissimus|gluteus|biceps|triceps|deltoid|brachii|quadriceps|sartorius|gastrocnemius|soleus|tibialis|peroneus|fibularis|masseter|temporalis|pterygoid|orbicularis|frontalis|zygomaticus|risorius|mentalis|nasalis|procerus|corrugator|multifidus|rotatores|\boblique\b|abdominis|intercostal|serratus|trapezius|rhomboideus|rhomboid|levator|depressor|supraspinatus|infraspinatus|subscapularis|\bteres\b|brachialis|coracobrachialis|anconeus|pronator|supinator|\bflexor\b|\bextensor\b|abductor|adductor|opponens|lumbrical|interosse|psoas|iliacus|iliopsoas|piriformis|gemellus|quadratus|gracilis|semimembranosus|semitendinosus|popliteus|plantaris|\bvastus\b|rectus femoris", re.I)),
    ("integumentary", re.compile(r"\bskin\b|dermis|epidermis|\bnail\b|areola|nipple|adipose|\bfat\b", re.I)),
    ("skeletal", re.compile(r"\bbone\b|vertebra|\brib\b|cartilage|skull|\bfemur\b|\btibia\b|\bfibula\b|humerus|\bradius\b|\bulna\b|pelvis|sacrum|coccyx|calcaneus|talus|phalanx|metatars|metacar|carpal|tarsal|patella|clavicle|scapula|sternum|mandible|maxilla|ligament|\bjoint\b|meniscus|navicular|cuneiform|cuboid|scaphoid|lunate|hamate|capitate|pisiform|trapez|hyoid|\bdisc\b", re.I)),
]

PREFERRED = {
    ("heart", "male"): "wall-of-ventricle",
    ("heart", "female"): "VH_F_left_ventricle",
    ("uterus", "female"): "VH_F_body_of_uterus",
    ("liver", "female"): "VH_F_diaphragmatic_surface_of_liver",
}


def systems_for(name):
    if re.search(r"\b(third|fourth|lateral) ventricle\b|interventricular foramen", name, re.I):
        return ["nervous"]
    found = []
    for system, pattern in RULES:
        if pattern.search(name) and system not in found:
            found.append(system)
    if re.search(r"pancreas", name, re.I) and "endocrine" not in found:
        found.append("endocrine")
    if "muscular" in found and "skeletal" in found:
        found = [system for system in found if system != "skeletal"]
    if re.search(r"gall ?bladder", name, re.I):
        found = [system for system in found if system != "urinary"]
    return found or ["skeletal"]


def side_of(name):
    n = name.lower().replace("_", " ")
    if re.search(r"\bleft\b|(^| )l$", n):
        return "patient-left"
    if re.search(r"\bright\b|(^| )r$", n):
        return "patient-right"
    return None


def slug(name):
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", name.lower()))


def display_name(raw):
    n = re.sub(r"^VH_[FM]_", "", raw).replace("_", " ")
    n = re.sub(r"\b(left|right)\b", "", n, flags=re.I)
    n = re.sub(r"\s+[lr]\s*$", "", n, flags=re.I)
    n = re.sub(r"\s+", " ", n).strip(" -")
    if not n:
        n = raw
    return n[0].upper() + n[1:]


def essays_from_data():
    start = DATA.find("window.ATLAS_PARTS = {")
    body = DATA[start:]
    found = {}
    for match in re.finditer(r'^\s{2}(?:"([^"]+)"|([A-Za-z0-9-]+)):\s*\{', body, re.M):
        key = match.group(1) or match.group(2)
        chunk = body[match.start():match.start() + 700]
        name = re.search(r'name:\s*"([^"]+)"', chunk)
        aliases = re.search(r"aliases:\s*\[(.*?)\]", chunk, re.S)
        alias_list = re.findall(r'"([^"]+)"', aliases.group(1)) if aliases else []
        found[key] = {"name": name.group(1) if name else key, "aliases": [a.lower() for a in alias_list]}
    return found


def essay_for(raw, label, essays):
    display = label.lower()
    for key in (slug(label), slug(re.sub(r"\b(left|right)\b", "", raw, flags=re.I)), slug(raw)):
        if key in essays:
            return key
    for key, essay in essays.items():
        if essay["name"].lower() == display or display in essay["aliases"]:
            return key
    return None


def female_nodes():
    data = (ROOT / "models" / "female.glb").read_bytes()
    length = struct.unpack_from("<I", data, 12)[0]
    doc = json.loads(data[20:20 + length])
    names = []
    for node in doc.get("nodes", []):
        if "mesh" not in node or not node.get("name"):
            continue
        if re.search(r"placenta|umbilical", node["name"], re.I):
            continue
        names.append(node["name"])
    return names


def main():
    essays = essays_from_data()
    meshes = []
    seen = set()

    def add(item):
        if item["id"] in seen:
            return
        seen.add(item["id"])
        meshes.append(item)

    for rec in RECORDS:
        label = rec["name"]
        add({
            "id": rec["id"],
            "name": label,
            "systems": systems_for(rec["raw"]),
            "sex": "male",
            "side": rec.get("side"),
            "source": rec["source"],
            "essay": essay_for(rec["raw"], label, essays),
        })

    for raw in female_nodes():
        label = display_name(raw)
        add({
            "id": raw,
            "name": label,
            "systems": systems_for(raw + " " + label),
            "sex": "female",
            "side": side_of(raw),
            "source": "hubmap",
            "essay": essay_for(raw, label, essays),
        })

    by_id = {item["id"]: item for item in meshes}
    for (essay_id, sex), mesh_id in PREFERRED.items():
        item = by_id.get(mesh_id)
        if item and item["sex"] == sex and not item.get("essay"):
            item["essay"] = essay_id

    payload = json.dumps(meshes, ensure_ascii=False, separators=(",", ":"))
    text = f"""/* Generated by tools/build_catalog.py. Mesh names, systems, and which essay to reuse. */
window.ATLAS_MESH_LIST = {payload};
(function () {{
  const essays = window.ATLAS_PARTS;
  const next = {{}};
  const alias = {{}};
  window.ATLAS_MESH_LIST.forEach((item) => {{
    const essay = item.essay ? essays[item.essay] : null;
    next[item.id] = {{
      name: item.name,
      latin: essay ? essay.latin || "" : "",
      systems: item.systems,
      sex: item.sex,
      side: item.side || null,
      source: item.source,
      depth: essay && essay.depth != null ? essay.depth : 6,
      aliases: essay && essay.aliases ? essay.aliases.slice() : [],
      overview: essay ? essay.overview : item.name + " on the reference model.",
      sections: essay && essay.sections ? essay.sections : [{{
        title: "Structure and function",
        paragraphs: [item.name + " is carried on the reference model. A longer written account has not been added for this structure."],
      }}],
      related: essay && essay.related ? essay.related : [],
      stats: essay ? essay.stats : undefined,
    }};
    if (!item.essay) return;
    const bucket = alias[item.essay] || (alias[item.essay] = []);
    bucket.push({{ id: item.id, side: item.side || null, sex: item.sex }});
  }});
  Object.keys(essays).forEach((id) => {{
    if (!next[id] && !alias[id]) next[id] = essays[id];
  }});
  window.ATLAS_PARTS = next;
  window.ATLAS_ALIAS = alias;
  window.atlasResolve = function (id, side, sex) {{
    const wantSex = sex && sex !== "both" ? sex : null;
    const list = alias[id] || [];
    const filtered = list.filter((item) => (!wantSex || item.sex === wantSex) && (!side || !item.side || item.side === side));
    if (filtered.length) {{
      const sided = side ? filtered.find((item) => item.side === side) : null;
      const hit = sided || filtered[0];
      return {{ id: hit.id, side: side || hit.side || null, sex: hit.sex }};
    }}
    const part = next[id];
    if (!part) return null;
    if (wantSex && part.sex && part.sex !== "both" && part.sex !== wantSex) return null;
    return {{
      id: id,
      side: side || part.side || null,
      sex: part.sex && part.sex !== "both" ? part.sex : (wantSex || "female"),
    }};
  }};
}})();
"""
    (ROOT / "js" / "catalog.js").write_text(text, encoding="utf-8")
    print("meshes", len(meshes), "bytes", (ROOT / "js" / "catalog.js").stat().st_size)


if __name__ == "__main__":
    main()
