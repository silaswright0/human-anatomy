"""Pack BodyParts3D into models/male.glb and any non-overlapping Z-Anatomy meshes into models/supplement.glb."""
import json
import re
import zipfile
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parents[1]
ZIP = ROOT / "tools" / "cache" / "isa_BP3D_4.0_obj_99.zip"
ZA = ROOT / "tools" / "cache" / "anatomy.glb"
MAP = ROOT / "tools" / "cache" / "mesh_mapping.json"

RULES = [
    ("cardiovascular", re.compile(r"artery|arteries|vein|venous|aorta|vena cava|atrium|ventricle|valve of|capillary|coronary|portal|blood|cardiac|myocardium|endocardium|pericardium|heart", re.I)),
    ("nervous", re.compile(r"nerve|plexus|ganglion|brain|cerebr|cerebell|spinal cord|thalamus|hypothalamus|pons|medulla|meninx|meninges|cortex|gyrus|sulcus", re.I)),
    ("lymphatic", re.compile(r"lymph|spleen|thymus|tonsil", re.I)),
    ("endocrine", re.compile(r"thyroid|parathyroid|adrenal|pituitary|pineal|islet", re.I)),
    ("reproductive", re.compile(r"uterus|ovary|ovari|testis|testes|penis|prostate|vagina|vulva|clitoris|epididym|seminal|uterine tube|mammary|scrotum|spermatic|labium|labia|ductus deferens", re.I)),
    ("respiratory", re.compile(r"lung|pulmon|bronch|trachea|larynx|pharynx|nasal|pleura|alveol|lobe of", re.I)),
    ("digestive", re.compile(r"stomach|liver|gall ?bladder|pancreas|intestin|colon|esophag|duoden|jejun|ileum|cecum|caecum|appendix|rectum|tongue|tooth|teeth|gingiva|parotid|submandibular|oral cavity|mouth", re.I)),
    ("urinary", re.compile(r"kidney|ureter|bladder|urethra|renal", re.I)),
    ("muscular", re.compile(r"muscle|tendon|diaphragm", re.I)),
    ("integumentary", re.compile(r"\bskin\b|dermis|epidermis|\bnail\b|areola|nipple|adipose|\bfat\b", re.I)),
    ("skeletal", re.compile(r"bone|vertebra|rib|cartilage|skull|femur|tibia|fibula|humerus|radius|ulna|pelvis|sacrum|coccyx|calcaneus|talus|phalanx|metatars|metacar|carpal|tarsal|patella|clavicle|scapula|sternum|mandible|maxilla|ligament|joint|meniscus|navicular|cuneiform|cuboid|scaphoid|lunate|hamate|capitate|pisiform|trapez|hyoid|disc", re.I)),
]

NC = re.compile(r"cochlea|semicircular|utricle|saccule|inner ear|vestibular|kidney", re.I)


def systems_for(name):
    found = []
    for system, pattern in RULES:
        if pattern.search(name) and system not in found:
            found.append(system)
    if "pancreas" in name.lower() and "endocrine" not in found:
        found.append("endocrine")
    return found or ["skeletal"]


def side_of(name):
    n = name.lower().replace("_", " ")
    if re.search(r"\bleft\b|\bl\b$| sinistr", n):
        return "patient-left"
    if re.search(r"\bright\b|\br\b$| dextr", n):
        return "patient-right"
    return None


def slug(name):
    s = name.lower().replace("_", " ")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:96] or "part"


def display_name(raw):
    n = re.sub(r"^VH_[FM]_", "", raw)
    n = n.replace("_", " ")
    n = re.sub(r"\b(left|right)\b", "", n, flags=re.I)
    n = re.sub(r"\s+[lr]\s*$", "", n, flags=re.I)
    n = re.sub(r"\s+", " ", n).strip(" -")
    if not n:
        n = raw
    return n[0].upper() + n[1:]


def parse_obj(text):
    name = None
    verts = []
    faces = []
    for line in text.splitlines():
        if line.startswith("# English name"):
            name = line.split(":", 1)[1].strip()
        elif line.startswith("v "):
            x, y, z = (float(v) for v in line.split()[1:4])
            verts.append((x, z, -y))
        elif line.startswith("f "):
            idx = [int(tok.split("/")[0]) - 1 for tok in line.split()[1:]]
            if len(idx) >= 3:
                for i in range(1, len(idx) - 1):
                    faces.append((idx[0], idx[i], idx[i + 1]))
    if not verts or not faces or not name:
        return None
    return name, np.asarray(verts, np.float32), np.asarray(faces, np.int32)


def maybe_simplify(verts, faces):
    if len(faces) < 8000:
        return verts, faces
    mesh = trimesh.Trimesh(verts, faces, process=False)
    target = max(2500, int(len(faces) * 0.35))
    try:
        mesh = mesh.simplify_quadric_decimation(target)
        return np.asarray(mesh.vertices, np.float32), np.asarray(mesh.faces, np.int32)
    except Exception:
        return verts, faces


def main():
    print("reading BodyParts3D")
    pieces = []
    names = set()
    with zipfile.ZipFile(ZIP) as archive:
        for info in archive.infolist():
            if not info.filename.lower().endswith(".obj"):
                continue
            parsed = parse_obj(archive.read(info).decode("utf-8", "replace"))
            if not parsed:
                continue
            name, verts, faces = parsed
            verts, faces = maybe_simplify(verts, faces)
            sid = slug(name)
            used = {p["id"] for p in pieces}
            n = 2
            while sid in used:
                sid = f"{slug(name)}-{n}"
                n += 1
            pieces.append({
                "id": sid,
                "raw": name,
                "name": display_name(name),
                "systems": systems_for(name),
                "side": side_of(name),
                "source": "bodyparts3d",
                "sex": "male",
                "verts": verts,
                "faces": faces,
            })
            names.add(name.lower())
    print("male meshes", len(pieces))

    all_v = np.vstack([p["verts"] for p in pieces])
    lo = all_v.min(axis=0)
    hi = all_v.max(axis=0)
    center = (lo + hi) / 2
    height = max(hi[1] - lo[1], 1)
    scale = 1.7 / height
    print("height mm", round(float(height), 1), "scale", round(float(scale), 6))
    for piece in pieces:
        piece["verts"] = (piece["verts"] - center) * scale

    def export(group, path):
        scene = trimesh.Scene()
        for piece in group:
            mesh = trimesh.Trimesh(piece["verts"], piece["faces"], process=False)
            scene.add_geometry(mesh, geom_name=piece["id"], node_name=piece["id"])
        path.parent.mkdir(parents=True, exist_ok=True)
        scene.export(path)
        print("wrote", path, round(path.stat().st_size / 1e6, 1), "MB", len(group))

    export(pieces, ROOT / "models" / "male.glb")

    supplement = []
    mapping = json.loads(MAP.read_text(encoding="utf-8"))
    by_source = {}
    for item in mapping:
        by_source.setdefault(item.get("source"), set()).add(item["name"].lower())
    wanted = {
        name for name in by_source.get("z-anatomy", set())
        if name not in names and not NC.search(name)
    }
    print("z-anatomy candidates", len(wanted), "of", len(by_source.get("z-anatomy", set())))
    if wanted:
        loaded = trimesh.load(ZA, force="scene")
        shared = None
        for node_name, geom in loaded.geometry.items():
            if node_name.lower() in names:
                shared = (node_name.lower(), geom)
                break
        male_match = next((p for p in pieces if shared and p["raw"].lower() == shared[0]), None)
        transform = None
        if shared and male_match is not None:
            src = np.asarray(shared[1].vertices, np.float32)
            src_lo, src_hi = src.min(0), src.max(0)
            dst = male_match["verts"]
            dst_lo, dst_hi = dst.min(0), dst.max(0)
            src_size = float(np.max(src_hi - src_lo))
            dst_size = float(np.max(dst_hi - dst_lo))
            if src_size > 1e-6:
                s = dst_size / src_size
                shift = (dst_lo + dst_hi) / 2 - (src_lo + src_hi) / 2 * s
                transform = (s, shift)
                print("alignment", shared[0], "scale", round(s, 4))
        if transform is None:
            print("skipping z-anatomy: no shared landmark to align it")
        else:
            scale, shift = transform
            for node_name, geom in loaded.geometry.items():
                key = node_name.lower()
                if key not in wanted:
                    continue
                verts = np.asarray(geom.vertices, np.float32) * scale + shift
                faces = np.asarray(geom.faces, np.int32)
                supplement.append({
                    "id": slug("za " + node_name),
                    "raw": node_name,
                    "name": display_name(node_name),
                    "systems": systems_for(node_name),
                    "side": side_of(node_name),
                    "source": "z-anatomy",
                    "sex": "male",
                    "verts": verts,
                    "faces": faces,
                })
            if supplement:
                export(supplement, ROOT / "models" / "supplement.glb")
            else:
                print("no unique z-anatomy meshes after the name check")

    records = []
    for piece in pieces + supplement:
        records.append({k: piece[k] for k in ("id", "raw", "name", "systems", "side", "source", "sex")})
    out = ROOT / "tools" / "cache" / "male-records.json"
    out.write_text(json.dumps(records), encoding="utf-8")
    print("records", len(records))


if __name__ == "__main__":
    main()
