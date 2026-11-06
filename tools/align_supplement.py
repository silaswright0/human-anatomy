"""Rotate the Z-Anatomy supplement onto the male body and keep it only if the pose matches."""
import json
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parents[1]
ZA = ROOT / "tools" / "cache" / "anatomy.glb"
MALE = ROOT / "models" / "male.glb"
OUT = ROOT / "models" / "supplement.glb"
RECORDS = ROOT / "tools" / "cache" / "male-records.json"

LANDMARK = "abdominal part of left pectoralis major"
MALE_LANDMARK = "abdominal-part-of-left-pectoralis-major"


def as_perm(verts, kind):
    x, y, z = verts[:, 0], verts[:, 1], verts[:, 2]
    table = {
        "xyz": (x, y, z),
        "xzy": (x, z, -y),
        "xzY": (x, z, y),
        "xZy": (x, -z, y),
        "Xzy": (-x, z, -y),
        "yzx": (y, z, x),
    }
    a, b, c = table[kind]
    return np.column_stack([a, b, c]).astype(np.float32)


def main():
    records = json.loads(RECORDS.read_text(encoding="utf-8"))
    wanted = {r["raw"].lower(): r for r in records if r["source"] == "z-anatomy"}
    print("loading")
    za = trimesh.load(ZA, force="scene")
    male = trimesh.load(MALE, force="scene")
    src0 = np.asarray(za.geometry[LANDMARK].vertices, np.float32)
    dst = np.asarray(male.geometry[MALE_LANDMARK].vertices, np.float32)
    sternum = np.asarray(male.geometry["body-of-sternum"].vertices, np.float32)
    sternum_c = sternum.mean(0)

    best = None
    for kind in ("xyz", "xzy", "xzY", "xZy", "Xzy", "yzx"):
        src = as_perm(src0, kind)
        src_size = float(np.max(src.max(0) - src.min(0)))
        dst_size = float(np.max(dst.max(0) - dst.min(0)))
        scale = dst_size / src_size
        shift = (dst.min(0) + dst.max(0)) / 2 - (src.min(0) + src.max(0)) / 2 * scale

        def place(raw_name):
            geom = za.geometry.get(raw_name)
            if geom is None:
                return None
            v = as_perm(np.asarray(geom.vertices, np.float32), kind) * scale + shift
            return v

        rectus = place("left rectus abdominis")
        frontalis = place("right frontalis")
        lat = place("right latissimus dorsi")
        if rectus is None or frontalis is None or lat is None:
            print(kind, "missing check mesh")
            continue
        rectus_span = rectus.max(0) - rectus.min(0)
        tall = float(rectus_span[1] / max(rectus_span[2], 1e-4))
        above = float(frontalis.mean(0)[1] - sternum_c[1])
        behind = float(sternum_c[2] - lat.mean(0)[2])
        score = tall + above * 4 + behind * 2
        print(kind, "tall", round(tall, 2), "above", round(above, 3), "behind", round(behind, 3), "score", round(score, 2))
        if best is None or score > best[0]:
            best = (score, kind, scale, shift, tall, above, behind)

    score, kind, scale, shift, tall, above, behind = best
    if tall < 1.4 or above < 0.15 or behind < 0.02:
        if OUT.exists():
            OUT.unlink()
        kept = [r for r in records if r["source"] != "z-anatomy"]
        RECORDS.write_text(json.dumps(kept), encoding="utf-8")
        print("dropped supplement; alignment was not reliable")
        return

    scene = trimesh.Scene()
    for raw, rec in wanted.items():
        geom = za.geometry.get(raw)
        if geom is None:
            continue
        verts = as_perm(np.asarray(geom.vertices, np.float32), kind) * scale + shift
        mesh = trimesh.Trimesh(verts, np.asarray(geom.faces, np.int32), process=False)
        scene.add_geometry(mesh, geom_name=rec["id"], node_name=rec["id"])
    scene.export(OUT)
    print("wrote", OUT, round(OUT.stat().st_size / 1e6, 2), "MB", kind)


if __name__ == "__main__":
    main()
