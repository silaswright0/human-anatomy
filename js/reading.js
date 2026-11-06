(function () {
  const BOOK = "https://med.libretexts.org/Bookshelves/Anatomy_and_Physiology/Human_Anatomy_(OERI)/";
  const CREDIT = "Human Anatomy (OERI). Menefee, Jenks, Mazzasette, and Nguyen, ASCCC OERI. CC BY 4.0.";

  function section(slug, title) {
    return { title, url: BOOK + slug, credit: CREDIT };
  }

  const P = {
    intro: section("01%3A_An_Introduction_to_the_Human_Body/1.02%3A_Overview_of_Anatomy_and_Physiology", "Overview of anatomy and physiology"),
    skin: section("04%3A_Integumentary_System/4.02%3A_Layers_of_the_Skin", "Layers of the skin"),
    skinAccessories: section("04%3A_Integumentary_System/4.03%3A_Accessory_Structures_of_the_Skin", "Accessory structures of the skin"),
    epithelium: section("03%3A_Tissue_Level_of_Organization/3.03%3A_Epithelial_Tissue", "Epithelial tissue"),
    connective: section("03%3A_Tissue_Level_of_Organization/3.04%3A_Connective_Tissue", "Connective tissue"),
    boneTissue: section("05%3A_Bone_Tissue_and_Skeletal_System/5.03%3A_Bone_Structure", "Bone structure"),
    skull: section("06%3A_Axial_Skeleton/6.03%3A_The_Skull", "The skull"),
    vertebral: section("06%3A_Axial_Skeleton/6.04%3A_The_Vertebral_Column", "The vertebral column"),
    thorax: section("06%3A_Axial_Skeleton/6.05%3A_The_Thoracic_Cage", "The thoracic cage"),
    skeletonDivisions: section("06%3A_Axial_Skeleton/6.02%3A_Divisions_of_the_Skeletal_System", "Divisions of the skeletal system"),
    pectoral: section("07%3A_Appendicular_Skeleton/7.02%3A_The_Pectoral_Girdle", "The pectoral girdle"),
    upperLimbBones: section("07%3A_Appendicular_Skeleton/7.03%3A_Bones_of_the_Upper_Limb", "Bones of the upper limb"),
    pelvis: section("07%3A_Appendicular_Skeleton/7.04%3A_The_Pelvic_Girdle_and_Pelvis", "The pelvic girdle and pelvis"),
    lowerLimbBones: section("07%3A_Appendicular_Skeleton/7.05%3A_Bones_of_the_Lower_Limb", "Bones of the lower limb"),
    fibrousJoints: section("08%3A_Joints/8.03%3A_Fibrous_Joints", "Fibrous joints"),
    cartilaginousJoints: section("08%3A_Joints/8.04%3A_Cartilaginous_Joints", "Cartilaginous joints"),
    synovialJoints: section("08%3A_Joints/8.05%3A_Synovial_Joints", "Synovial joints"),
    selectedJoints: section("08%3A_Joints/8.07%3A_Anatomy_of_Selected_Synovial_Joints", "Anatomy of selected synovial joints"),
    muscleTissue: section("09%3A_Skeletal_Muscle_Tissue/9.03%3A_Skeletal_Muscle", "Skeletal muscle"),
    headMuscles: section("10%3A_Muscular_System/10.04%3A_Axial_Muscles_of_the_Head_Neck_and_Back", "Axial muscles of the head, neck, and back"),
    trunkMuscles: section("10%3A_Muscular_System/10.05%3A_Axial_Muscles_of_the_Abdominal_Wall_and_Thorax", "Axial muscles of the abdominal wall and thorax"),
    upperMuscles: section("10%3A_Muscular_System/10.06%3A_Appendicular_Muscles_of_the_Pectoral_Girdle_and_Upper_Limbs", "Appendicular muscles of the pectoral girdle and upper limbs"),
    lowerMuscles: section("10%3A_Muscular_System/10.07%3A_Appendicular_Muscles_of_the_Pelvic_Girdle_and_Lower_Limbs", "Appendicular muscles of the pelvic girdle and lower limbs"),
    muscleIntro: section("10%3A_Muscular_System/10.01%3A_Introduction_to_the_Muscular_System", "Introduction to the muscular system"),
    brainCoverings: section("12%3A_Central_and_Peripheral_Nervous_System/12.02%3A_Support_and_Protection_of_the_Brain", "Support and protection of the brain"),
    cerebrum: section("12%3A_Central_and_Peripheral_Nervous_System/12.03%3A_Brain-_Cerebrum", "Brain: cerebrum"),
    brainstem: section("12%3A_Central_and_Peripheral_Nervous_System/12.04%3A_Brain-_Diencephalon_Brainstem_Cerebellum_and_Limbic_System", "Brain: diencephalon, brainstem, cerebellum, and limbic system"),
    cranialNerves: section("12%3A_Central_and_Peripheral_Nervous_System/12.05%3A_Cranial_Nerves", "Cranial nerves"),
    spinalCord: section("12%3A_Central_and_Peripheral_Nervous_System/12.06%3A_Spinal_Cord_and_Spinal_Nerves", "Spinal cord and spinal nerves"),
    senses: section("13%3A_Somatic_Senses_Integration_and_Motor_Responses/13.02%3A_Touch_Taste_and_Smell", "Touch, taste, and smell"),
    eyeEar: section("13%3A_Somatic_Senses_Integration_and_Motor_Responses/13.03%3A_Hearing_Balance_and_Vision", "Hearing, balance, and vision"),
    autonomic: section("14%3A_Autonomic_Nervous_System/14.02%3A_Divisions_of_the_Autonomic_Nervous_System", "Divisions of the autonomic nervous system"),
    nervousIntro: section("12%3A_Central_and_Peripheral_Nervous_System/12.01%3A_Introduction_to_the_Central_and_Peripheral_Nervous_System", "Introduction to the central and peripheral nervous system"),
    pituitary: section("15%3A_Endocrine_System/15.03%3A_Pituitary_Gland_and_Hypothalamus", "Pituitary gland and hypothalamus"),
    thyroid: section("15%3A_Endocrine_System/15.04%3A_Thyroid_Gland", "Thyroid gland"),
    parathyroid: section("15%3A_Endocrine_System/15.05%3A_Parathyroid_Glands", "Parathyroid glands"),
    adrenal: section("15%3A_Endocrine_System/15.06%3A_Adrenal_Glands", "Adrenal glands"),
    pineal: section("15%3A_Endocrine_System/15.07%3A_Pineal_Gland", "Pineal gland"),
    gonadalHormones: section("15%3A_Endocrine_System/15.08%3A_Gonadal_and_Placental_Hormones", "Gonadal and placental hormones"),
    endocrinePancreas: section("15%3A_Endocrine_System/15.09%3A_Endocrine_Pancreas", "The endocrine pancreas"),
    endocrineIntro: section("15%3A_Endocrine_System/15.02%3A_An_Overview_of_the_Endocrine_System", "An overview of the endocrine system"),
    heart: section("17%3A_Cardiovascular_System_-_Heart/17.02%3A_Heart_Anatomy", "Heart anatomy"),
    coronary: section("17%3A_Cardiovascular_System_-_Heart/17.04%3A_Coronary_Circulation", "Coronary circulation"),
    vessels: section("18%3A_Cardiovascular_System_-_Blood_Vessels_and_Circulation/18.03%3A_Circulatory_Pathways", "Circulatory pathways"),
    vesselWall: section("18%3A_Cardiovascular_System_-_Blood_Vessels_and_Circulation/18.02%3A_Structure_and_Function_of_Blood_Vessels", "Structure and function of blood vessels"),
    lymphVessels: section("19%3A_Lymphatic_and_Immune_System/19.03%3A_Anatomy_of_Lymphatic_Vessels", "Anatomy of lymphatic vessels"),
    lymphOrgans: section("19%3A_Lymphatic_and_Immune_System/19.04%3A_Anatomy_of_Lymphatic_Organs_and_Tissues", "Anatomy of lymphatic organs and tissues"),
    airways: section("20%3A_Respiratory_System/20.02%3A_Organs_and_Structures_of_the_Respiratory_System", "Organs and structures of the respiratory system"),
    lungs: section("20%3A_Respiratory_System/20.03%3A_The_Lungs", "The lungs"),
    mouth: section("21%3A_Digestive_System/21.04%3A_Mouth_Pharynx_and_Esophagus", "The mouth, pharynx, and esophagus"),
    stomach: section("21%3A_Digestive_System/21.05%3A_Stomach", "The stomach"),
    intestines: section("21%3A_Digestive_System/21.06%3A_Small_and_Large_Intestines", "The small and large intestines"),
    liver: section("21%3A_Digestive_System/21.07%3A_Accessory_Organs_in_Digestion-_Liver_Pancreas_and_Gallbladder", "Accessory organs in digestion: the liver, pancreas, and gallbladder"),
    digestiveIntro: section("21%3A_Digestive_System/21.02%3A_Organs_of_the_Digestive_System", "Organs of the digestive system"),
    kidney: section("22%3A_Urinary_System/22.02%3A_Overview_of_the_Kidney", "Overview of the kidney"),
    kidneyMicro: section("22%3A_Urinary_System/22.03%3A_Microscopic_Anatomy_of_the_Kidney", "Microscopic anatomy of the kidney"),
    urinaryTract: section("22%3A_Urinary_System/22.04%3A_Urinary_Tract", "The urinary tract"),
    maleRepro: section("23%3A_Reproductive_System/23.02%3A_Anatomy_of_the_Male_Reproductive_System", "Anatomy of the male reproductive system"),
    femaleRepro: section("23%3A_Reproductive_System/23.03%3A_Anatomy_of_the_Female_Reproductive_System", "Anatomy of the female reproductive system"),
    reproIntro: section("23%3A_Reproductive_System/23.01%3A_Introduction_to_the_Reproductive_System", "Introduction to the reproductive system"),
  };

  const FALLBACK = {
    integumentary: P.skin,
    skeletal: P.skeletonDivisions,
    muscular: P.muscleIntro,
    nervous: P.nervousIntro,
    endocrine: P.endocrineIntro,
    cardiovascular: P.vessels,
    lymphatic: P.lymphOrgans,
    respiratory: P.airways,
    digestive: P.digestiveIntro,
    urinary: P.kidney,
    reproductive: P.reproIntro,
  };

  function textOf(part) {
    return `${part.id} ${part.name} ${part.latin || ""}`.toLowerCase().replace(/[_-]+/g, " ");
  }

  function has(text, ...words) {
    return words.some((word) => {
      const body = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?:^|[^a-z0-9])${body}(?:[^a-z0-9]|$)`).test(text);
    });
  }

  function isVessel(text) {
    return has(text, "artery", "arteries", "vein", "veins", "vena", "aorta");
  }

  function pick(text, systems, sex) {
    const inSys = (id) => systems.includes(id);
    const vessel = isVessel(text);

    if (has(text, "pituitary", "hypophysis", "hypothalamus")) return P.pituitary;
    if (has(text, "parathyroid")) return P.parathyroid;
    if (has(text, "pineal")) return P.pineal;
    if (!vessel && has(text, "adrenal", "suprarenal") && !has(text, "liver")) return P.adrenal;
    if (has(text, "thyroid gland", "lobe of thyroid", "isthmus of thyroid")) return P.thyroid;
    if (has(text, "islet", "islets of langerhans") && !has(text, "pancreatic duct")) return P.endocrinePancreas;

    if ((has(text, "coronary") || (vessel && has(text, "cardiac"))) && !has(text, "ligament")) return P.coronary;
    if (has(text, "sagittal sinus", "transverse sinus", "sigmoid sinus", "straight sinus", "cavernous sinus", "petrosal sinus", "occipital sinus", "confluence of sinuses")) return P.brainCoverings;
    if (vessel) return P.vessels;
    if (!vessel && has(text, "heart", "atrium", "atria", "ventricle", "myocardium", "pericardium", "endocardium", "chordae", "mitral", "tricuspid", "aortic valve", "pulmonary valve", "papillary muscle")) {
      if (!inSys("nervous") && !inSys("urinary")) return P.heart;
    }

    if (has(text, "spleen", "thymus", "tonsil")) return P.lymphOrgans;
    if (has(text, "lymph node", "lymphatic", "thoracic duct", "cisterna chyli")) return P.lymphVessels;

    if (!vessel && !has(text, "nerve") && has(text, "cochlea", "cochlear", "semicircular", "malleus", "incus", "stapes", "tympanic", "auricle", "pinna", "eustachian", "auditory tube", "external ear", "inner ear", "middle ear")) return P.eyeEar;
    if (!vessel && !has(text, "nerve") && (has(text, "vestibule", "vestibular") && !has(text, "nasal", "oral", "larynx", "laryngeal", "aortic", "mouth"))) return P.eyeEar;
    if (!vessel && !has(text, "nerve", "ganglion") && has(text, "cornea", "sclera", "scleral", "retina", "iris", "pupil", "lens", "choroid", "ciliary", "ciliaris", "vitreous", "aqueous", "fovea", "macula", "conjunctiva", "lacrimal", "nasolacrimal", "eyelid", "tarsal plate", "eyeball", "anterior chamber", "optic disc", "schlemm", "trabecular meshwork", "corneo")) {
      if (!has(text, "choroid plexus")) return P.eyeEar;
    }

    if (has(text, "olfactory bulb", "olfactory tract", "taste", "taste bud")) return P.senses;
    if (has(text, "meninges", "dura mater", "arachnoid", "pia mater", "choroid plexus", "lateral ventricle", "third ventricle", "fourth ventricle", "cerebral aqueduct", "interventricular foramen", "tentorium", "falx")) return P.brainCoverings;
    if (has(text, "cerebellum", "cerebelli", "brainstem", "midbrain", "pons", "medulla oblongata", "thalamus", "hippocampus", "amygdala", "amygdaloid", "limbic", "fornix", "habenula", "mammillary", "geniculate", "colliculus", "interpeduncular", "tuber cinereum", "stria terminalis", "lamina terminalis", "piriform")) return P.brainstem;
    if (inSys("nervous") && has(text, "medulla") && !has(text, "medulla oblongata")) return P.brainstem;
    if (!vessel && (inSys("nervous") && has(text, "caudate", "accumbens", "claustrum", "basal forebrain", "septal nuclei", "telencephalon") || has(text, "cerebrum", "cerebral", "gyrus", "sulcus", "hemisphere", "insula", "insular", "corpus callosum", "basal ganglia", "basal ganglion", "caudate nucleus", "putamen", "globus pallidus", "frontal lobe", "parietal lobe", "temporal lobe", "occipital lobe", "internal capsule", "anterior commissure", "posterior commissure"))) return P.cerebrum;
    if (has(text, "spinal cord", "cauda equina", "spinal nerve", "brachial plexus", "lumbar plexus", "sacral plexus", "cervical plexus", "sciatic", "femoral nerve", "median nerve", "ulnar nerve", "radial nerve", "phrenic")) return P.spinalCord;
    if (has(text, "olfactory nerve", "optic nerve", "optic chiasm", "optic tract", "oculomotor", "trochlear nerve", "trigeminal", "abducens", "abducent", "facial nerve", "vestibulocochlear", "vestibular nerve", "glossopharyngeal", "vagus", "accessory nerve", "hypoglossal", "ethmoidal nerve", "frontal nerve", "nasociliary", "infratrochlear", "lacrimal nerve", "cranial nerve")) return P.cranialNerves;
    if (has(text, "sympathetic", "parasympathetic", "autonomic", "ciliary ganglion", "pterygopalatine", "otic ganglion", "submandibular ganglion")) return P.autonomic;
    if (inSys("nervous") && has(text, "nerve", "ganglion", "ramus", "plexus")) return P.spinalCord;

    if (!vessel && (has(text, "lung", "pleura", "lingula") || /(?:^|[^a-z0-9])(?:bronch|alveol)/.test(text))) return P.lungs;
    if (!vessel && has(text, "trachea", "tracheal", "larynx", "laryngeal", "cricoid", "arytenoid", "corniculate", "epiglottis", "epiglotic", "epiglottic", "vocal", "cricothyroid", "thyroarytenoid", "thyroid cartilage", "alar cartilage", "nasal cartilage", "nasal cavity", "nasal septum", "paranasal", "maxillary sinus", "frontal sinus", "ethmoidal sinus", "sphenoidal sinus", "pharynx", "nostril", "concha")) {
      if (!inSys("skeletal") && !inSys("digestive")) return P.airways;
    }

    if (!vessel && (has(text, "liver", "hepatic", "biliary", "bile", "gallbladder", "cystic", "pancreas", "pancreatic", "porta hepatis", "quadrate lobe", "caudate lobe", "uncinate", "ucinate", "hepatopancreatic", "heptopancreatic", "duodenal ampulla", "ligamentum venosum") || (inSys("digestive") && (has(text, "lobe") || /(?:^|[^a-z0-9])segment\d*(?:[^a-z0-9]|$)/.test(text))))) return P.liver;
    if (!vessel && has(text, "stomach", "gastric", "pylor", "duodenal cap")) return P.stomach;
    if (!vessel && has(text, "duodenum", "jejunum", "jejenum", "ileum", "ileocecal", "cecum", "caecum", "colon", "colic", "appendix", "mesoappendix", "mesocolon", "rectum", "anus", "anal", "intestine", "tenia", "taenia", "haustra", "mesentery", "omentum")) return P.intestines;
    if (!vessel && has(text, "papilla", "papillae") && !has(text, "renal", "duodenal")) return P.mouth;
    if (!vessel && has(text, "tooth", "teeth", "molar", "premolar", "incisor", "canine tooth", "gingiva", "ginviva", "tongue", "palate", "uvula", "lip", "oral", "mouth", "esophagus", "oesophagus", "salivary", "parotid", "submandibular", "sublingual", "pharynx")) return P.mouth;

    if (has(text, "glomerulus", "nephron", "renal tubule", "loop of henle", "bowman")) return P.kidneyMicro;
    if (has(text, "ureter", "urinary bladder", "urethra", "trigone")) {
      if (!inSys("reproductive")) return P.urinaryTract;
    }
    if (!vessel && has(text, "kidney", "renal", "calyx", "calyxes", "renal pelvis", "renal papilla", "renal pyramid")) return P.kidney;

    if (has(text, "testis", "testes", "epididymis", "deferent", "vas deferens", "spermatic", "seminal", "prostate", "penis", "scrotum", "corpus cavernosum", "corpus spongiosum", "glans")) return P.maleRepro;
    if (has(text, "ovary", "uterus", "uterine", "fallopian", "oviduct", "vagina", "clitoris", "labia", "labium", "cervix", "endometrium", "mammary", "lactiferous", "nipple", "areola", "cervicovaginal", "mesovarium")) return P.femaleRepro;

    if (has(text, "suture", "gomphosis", "fontanelle", "fontanel")) return P.fibrousJoints;
    if (has(text, "symphysis", "intervertebral disc", "intervertebral disk")) return P.cartilaginousJoints;
    if (has(text, "ligament", "meniscus", "joint", "articulation")) {
      if (has(text, "stylohyoid ligament")) return P.skull;
      if (has(text, "periodontal")) return P.mouth;
      if (inSys("integumentary")) return P.femaleRepro;
      if (has(text, "rectus", "oblique", "palpebrae", "tendinous ring")) return P.headMuscles;
      return P.selectedJoints;
    }

    if (has(text, "skull", "cranium", "mandible", "maxilla", "zygomatic", "frontal bone", "parietal", "temporal bone", "occipital bone", "sphenoid", "ethmoid", "nasal bone", "lacrimal bone", "palatine", "vomer", "hyoid", "ossicle", "concha")) return P.skull;
    if (has(text, "vertebra", "vertebral", "sacrum", "coccyx") || (inSys("skeletal") && has(text, "atlas", "axis"))) return P.vertebral;
    if (has(text, "rib", "sternum", "manubrium", "xiphoid", "costal cartilage", "costal")) return P.thorax;
    if (has(text, "scapula", "clavicle")) return P.pectoral;
    if (has(text, "humerus", "radius", "ulna", "carpal", "metacarpal", "capitate", "hamate", "lunate", "pisiform", "scaphoid", "trapezium", "trapezoid", "triquetrum", "triquetral") || (has(text, "phalanx", "phalanges", "sesamoid") && has(text, "finger", "thumb", "hand"))) return P.upperLimbBones;
    if (has(text, "hip bone", "ilium", "ischium", "pubis", "acetabulum", "pelvic girdle", "obturator foramen", "os coxae", "coxal")) return P.pelvis;
    if (has(text, "femur", "tibia", "fibula", "patella", "tarsal", "metatarsal", "calcaneus", "talus", "navicular", "cuneiform", "cuboid") || (has(text, "phalanx", "phalanges", "sesamoid") && has(text, "toe", "foot"))) return P.lowerLimbBones;

    if (has(text, "iliotibial")) return P.lowerMuscles;
    if (inSys("muscular") && has(text, "of foot", "of leg", "plantar", "obturator externus", "obturator internus", "pectineus", "flexor accessorius", "tensor fasciae latae", "coccygeus", "iliococcygeus", "pubococcygeus", "puborectalis", "levator ani")) return P.lowerMuscles;
    if (inSys("muscular") && has(text, "of hand", "of forearm", "of wrist", "levator scapulae", "rhomboid", "extensor indicis", "extensor digiti minimi")) return P.upperMuscles;

    if (has(text, "superior rectus", "inferior rectus", "medial rectus", "lateral rectus", "superior oblique", "inferior oblique", "levator palpebrae", "tendinous ring", "oculi", "oris", "capitis", "colli", "cervicis", "nuchae", "masseter", "temporalis", "pterygoid", "buccinator", "platysma", "sternocleidomastoid", "scalene", "splenius", "semispinalis", "longissimus", "iliocostalis", "spinalis", "multifidus", "trapezius", "digastric", "mylohyoid", "geniohyoid", "sternohyoid", "sternothyroid", "omohyoid", "thyrohyoid", "genioglossus", "hyoglossus", "styloglossus", "frontalis", "occipitalis", "zygomaticus", "mentalis", "risorius", "nasalis", "procerus", "corrugator", "rotator", "rotatores")) return P.headMuscles;
    if (has(text, "diaphragm", "intercostal", "pectoralis", "serratus", "latissimus", "subclavius", "rectus abdominis", "transversus abdominis", "external oblique", "internal oblique", "quadratus lumborum", "abdominis", "thoracis", "thoracolumbar", "linea alba", "costarum")) return P.trunkMuscles;
    if (has(text, "gluteus", "iliopsoas", "psoas", "iliacus", "rectus femoris", "vastus", "biceps femoris", "semitendinosus", "semimembranosus", "gastrocnemius", "soleus", "tibialis", "fibularis", "peroneus", "adductor longus", "adductor brevis", "adductor magnus", "adductor minimus", "adductor hallucis", "gracilis", "sartorius", "piriformis", "gemellus", "popliteus", "femoris", "hallucis", "plantaris", "calcaneal", "digitorum longus", "digitorum brevis")) return P.lowerMuscles;
    if (has(text, "deltoid", "biceps", "triceps", "brachialis", "brachioradialis", "coracobrachialis", "infraspinatus", "supraspinatus", "subscapularis", "teres", "pronator", "supinator", "carpi", "pollicis", "digitorum", "palmaris", "anconeus", "brachii", "adductor pollicis")) return P.upperMuscles;
    if (has(text, "tendon", "aponeurosis") && inSys("muscular")) return P.muscleTissue;

    if (has(text, "artery", "vein", "vena cava", "aorta", "capillary", "sinus") && inSys("cardiovascular")) return P.vessels;
    if (has(text, "hair", "nail", "sebaceous", "sweat", "eyebrow", "eyelash", "arrector")) return P.skinAccessories;
    if (has(text, "skin", "epidermis", "dermis", "hypodermis", "cutis")) return P.skin;
    if (has(text, "cartilage", "fascia", "adipose", "marrow")) return inSys("skeletal") ? P.boneTissue : P.connective;
    if (has(text, "mucosa", "epithelium")) return P.epithelium;

    if (inSys("reproductive")) {
      if (sex === "female" || has(text, "female")) return P.femaleRepro;
      if (sex === "male" || has(text, "male")) return P.maleRepro;
    }
    return FALLBACK[systems[0]] || P.intro;
  }

  window.ATLAS_READING_INTRO = P.intro;
  window.atlasReading = function (part, sex) {
    if (!part) return P.intro;
    const systems = part.systems || [];
    const plateSex = part.sex === "female" || part.sex === "male" ? part.sex : sex;
    return pick(textOf(part), systems, plateSex || "both");
  };
})();
