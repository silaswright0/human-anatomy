// Classifies a catalog mesh as bone, muscle, pelvis, or organ.
// The shared wall is bone (except the pelvis) plus body-wall muscle.

const BONE = [
  "hip-bone",
  "frontal-bone",
  "parietal-bone",
  "occipital-bone",
  "temporal-bone",
  "sphenoid-bone",
  "zygomatic-bone",
  "palatine-bone",
  "lacrimal-bone",
  "nasal-bone",
  "cuboid-bone",
  "sesamoid-bone",
  "cuneiform-bone",
  "costal-cartilage",
  "intervertebral-disk",
  "nucleus-pulposus",
  "inferior-nasal-concha",
  "compact-bone",
  "spongy-bone",
  "vertebra",
  "vertebrae",
  "sternum",
  "manubrium",
  "xiphoid",
  "clavicle",
  "scapula",
  "humerus",
  "radius",
  "ulna",
  "femur",
  "patella",
  "tibia",
  "fibula",
  "calcaneus",
  "talus",
  "navicular",
  "capitate",
  "hamate",
  "lunate",
  "scaphoid",
  "pisiform",
  "trapezium",
  "trapezoid",
  "triquetral",
  "metacarpal",
  "metatarsal",
  "phalanx",
  "mandible",
  "maxilla",
  "ethmoid",
  "vomer",
  "hyoid",
  "sacrum",
  "coccyx",
  "ilium",
  "ischium",
  "pubis",
  "acetabulum",
  "atlas",
  "axis",
  "rib",
  "condyle",
];

const PELVIS = ["hip-bone", "ilium", "ischium", "pubis", "sacrum", "coccyx", "acetabulum", "os-coxae", "innominate"];

const MUSCLE = [
  "abductor", "adductor", "anconeus", "aryepiglotticus", "biceps", "brachialis", "brachioradialis",
  "buccinator", "bulbospongiosus", "coccygeus", "constrictor", "coracobrachialis", "cremaster",
  "deltoid", "depressor", "diaphragm", "digastric", "dilator", "erector", "extensor", "fibularis",
  "flexor", "gastrocnemius", "gemellus", "genioglossus", "geniohyoid", "gluteus", "gracilis",
  "hyoglossus", "iliacus", "iliococcygeus", "iliocostalis", "iliopsoas", "infraspinatus",
  "intercostal", "interosseous", "interspinal", "intertransvers", "ischiocavernosus", "latissimus",
  "levator", "longissimus", "longus", "lumbrical", "masseter", "multifidus", "mylohyoid", "nasalis",
  "oblique", "obliquus", "occipitofrontalis", "omohyoid", "opponens", "orbicularis", "palatoglossus",
  "palatopharyngeus", "palmaris", "pectineus", "pectoralis", "peroneus", "piriformis", "plantaris",
  "platysma", "popliteus", "pronator", "psoas", "pterygoid", "pubococcygeus", "puborectalis",
  "pyramidalis", "quadratus", "quadriceps", "rectus", "rhomboid", "risorius", "rotator",
  "salpingopharyngeus", "sartorius", "scalenus", "semimembranosus", "semispinalis", "semitendinosus",
  "serratus", "soleus", "sphincter", "spinalis", "splenius", "sternocleidomastoid", "sternohyoid",
  "sternothyroid", "styloglossus", "stylohyoid", "stylopharyngeus", "subclavius", "subscapularis",
  "supinator", "supraspinatus", "temporalis", "tensor", "teres", "thyro-arytenoid", "tibialis",
  "transversus", "trapezius", "triceps", "vastus", "vocalis", "zygomaticus", "crico-arytenoid",
  "obturator-externus", "obturator-internus", "linea-alba",
];

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function has(key, phrase) {
  return key === phrase || key.startsWith(`${phrase}-`) || key.endsWith(`-${phrase}`) || key.includes(`-${phrase}-`);
}

function hasPrefix(key, phrase) {
  return key.split("-").some((part) => part.startsWith(phrase));
}

function any(key, phrases) {
  return phrases.some((phrase) => has(key, phrase));
}

function falseMuscle(key) {
  return /allen|gyrus|vein|artery|arteria|tendon|ampulla|nerve|ligament/.test(key);
}

function extraocular(key) {
  if (/levator-palpebrae|palpebrae-superioris|tendinous-ring|check-ligament|ciliary-muscle/.test(key)) return true;
  if (/trochlea/.test(key) && /oblique/.test(key)) return true;
  if (/(superior|inferior)-oblique/.test(key)) return true;
  if (/(inferior|superior|lateral|medial)-rectus/.test(key) && !/capitis|abdominis/.test(key)) return true;
  return false;
}

function organMuscle(key) {
  return /papillary|smooth-muscle|bladder-neck/.test(key);
}

function jointLigament(key) {
  return /cruciate|collateral-ligament|patellar-ligament|plantar-ligament|iliotibial|meniscus|anterolateral-ligament|enthesis/.test(key);
}

function rehome(key) {
  if (/conjunctiva|eyebrow|tarsal-plate|external-ear|pubic-hair|hair-of-head|^lip$|lip-/.test(key) || has(key, "lip")) {
    if (/cruciate|ligament|frenulum/.test(key)) {
      /* fall through for non-skin uses of lip-shaped names */
    } else return "integumentary";
  }
  if (/cornea|sclera|iris|lens|retina|choroid|vitreous|pupil|fovea|macula|optic-disc|optic-part|ciliary|corona-ciliaris|aqueous|trabecular|schlemm|ora-serrata|anterior-chamber|eyeball|lacrimal|nasolacrimal|suspensory-ligament-of/.test(key)) {
    return "nervous";
  }
  if (/lactiferous/.test(key)) return "reproductive";
  if (/suspensory-ligament/.test(key)) return "integumentary";
  if (/^allen-|amygdala|caudate|putamen|geniculate|colliculus|corpus-callosum|midbrain|fornix|pallidus|habenula|claustrum|optic-chiasm|optic-tract|optic-radiation|dura-mater|commissure|internal-capsule|mammillary|tegmentum|substantia|white-matter|piriform|operculum|striatum|thalamus|hypothalamus|accumbens|insula|cortex|gyrus|gyri|lobule|cuneus|precuneus|forebrain|hindbrain|septum-telencephalon|lamina-terminalis|tuber-cinereum|peduncle|stria-terminalis/.test(key)) {
    return "nervous";
  }
  if (/uterine|uterus|fallopian|mesosalpinx|uterosacral|deferent|cervical-os|uterovesical/.test(key)) return "reproductive";
  if (/calyx/.test(key)) return "urinary";
  if (/carina|hilum|arytenoid|cricoid|corniculate|cuneiform-cartilage|epiglott|epiglotic|vocal-ligament|conus-elasticus|thyrohyoid|alar-cartilage|thyroid-cartilage/.test(key)) {
    return "respiratory";
  }
  if (/hippocampus|interpeduncular|septum-of-telencephalon|septum-telencephalon/.test(key)) return "nervous";
  if (/vein|artery|arteria|aorta|celiac-trunk|costocervical|thyrocervical|palmar-arch|plantar-arch|interventricular|marginal-branch|ventricular-branch/.test(key) || has(key, "trunk") || has(key, "arch")) {
    return "cardiovascular";
  }
  if (/duct|omentum|jejun|jejen|gingiva|ginviva|papilla|palate|mucosa|taenia|ileocecal|porta-hepatis|ampulla|bile|hepatic|pancreatic|frenulum|buccal|mouth-floor|uncinate|ucinate|lobe|segment/.test(key)) {
    return "digestive";
  }
  if (/follicle|paracortex|lymph/.test(key)) return "lymphatic";
  if (/sublingual-gland/.test(key)) return "digestive";
  if (/^lip$/.test(key) || has(key, "eyebrow") || has(key, "pubic-hair")) return "integumentary";
  return null;
}

function isMuscle(key) {
  if (falseMuscle(key)) return false;
  if (hasPrefix(key, "intertransvers") || hasPrefix(key, "interspinal")) return true;
  if (/raphe/.test(key)) return true;
  return any(key, MUSCLE);
}

export function classify(item) {
  const key = normalize(`${item.id} ${item.name}`);
  const current = item.systems[0] || "skeletal";
  if (item.source === "z-anatomy" && !extraocular(key)) {
    return { system: "muscular", role: "wall-muscle" };
  }
  if (current !== "skeletal") {
    if (current === "muscular" && !extraocular(key) && !organMuscle(key) && !/tendon/.test(key)) {
      return { system: "muscular", role: "wall-muscle" };
    }
    return { system: current, role: "organ" };
  }
  if (/tendon/.test(key)) return { system: "muscular", role: "organ" };
  if (organMuscle(key)) return { system: "cardiovascular", role: "organ" };
  if (extraocular(key)) return { system: "muscular", role: "organ" };
  if (isMuscle(key)) return { system: "muscular", role: "wall-muscle" };
  if (/stylohyoid-ligament/.test(key)) return { system: "skeletal", role: "wall-bone" };
  if (jointLigament(key) || /perichondular/.test(key)) return { system: "skeletal", role: "organ" };
  if (any(key, BONE)) {
    return { system: "skeletal", role: any(key, PELVIS) ? "pelvis" : "wall-bone" };
  }
  const system = rehome(key);
  if (system) return { system, role: "organ" };
  return { system: "skeletal", role: "organ" };
}

export function applyRetag(list) {
  return list.map((item) => {
    const result = classify(item);
    const tagged = { ...item, systems: [result.system] };
    if ((item.source === "bodyparts3d" || item.source === "z-anatomy") && (result.role === "wall-bone" || result.role === "wall-muscle")) {
      tagged.sex = "both";
    }
    return tagged;
  });
}

export function summarize(list) {
  const systems = {};
  const roles = {};
  const leftover = [];
  const femaleWall = [];
  for (const item of list) {
    const result = classify(item);
    systems[result.system] = (systems[result.system] || 0) + 1;
    const roleKey = `${item.source}|${result.role}`;
    roles[roleKey] = (roles[roleKey] || 0) + 1;
    if (result.role === "organ" && result.system === "skeletal") leftover.push(`${item.source} ${item.id}`);
    if (item.sex === "female" && result.role === "wall-muscle") femaleWall.push(item.id);
  }
  return { systems, roles, leftover, femaleWall };
}
