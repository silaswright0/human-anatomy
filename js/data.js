window.ATLAS_SYSTEMS = [
  { id: "integumentary", name: "Integumentary", color: "#e7b8a4", blurb: "Skin and its glands, plus hair and nails. A barrier, a sense organ, and a regulator of heat and water." },
  { id: "skeletal", name: "Skeletal", color: "#eadcc8", blurb: "Bone and cartilage. Support, protection, leverage for muscle, a mineral bank, and the marrow where blood cells form." },
  { id: "muscular", name: "Muscular", color: "#d15b66", blurb: "Skeletal muscle moves joints and holds posture. Attachments and fiber direction decide the action at each joint." },
  { id: "nervous", name: "Nervous", color: "#e6c56a", blurb: "Brain, spinal cord, and nerves. Fast signaling, and the integration of sensation, movement, and much of homeostasis." },
  { id: "endocrine", name: "Endocrine", color: "#e0b15a", blurb: "Glands that release hormones into the blood. Slower control of growth, metabolism, salt and water, and reproduction." },
  { id: "cardiovascular", name: "Cardiovascular", color: "#e15b55", blurb: "Heart and vessels. A closed circuit for gases, nutrients, hormones, heat, and immune cells." },
  { id: "lymphatic", name: "Lymphatic", color: "#8eae88", blurb: "Lymph vessels, nodes, thymus, and spleen. Fluid return to the blood, and a large part of immunity." },
  { id: "respiratory", name: "Respiratory", color: "#e7aebc", blurb: "Airways and lungs. Ventilation, gas exchange, and a share of acid-base balance and speech." },
  { id: "digestive", name: "Digestive", color: "#d09a62", blurb: "The tube from mouth to anus, with the liver, gallbladder, and pancreas. Breakdown, absorption, and elimination." },
  { id: "urinary", name: "Urinary", color: "#d47a6a", blurb: "Kidneys, ureters, bladder, and urethra. Filters plasma and sets volume, ions, and pH." },
  { id: "reproductive", name: "Reproductive", color: "#d989aa", blurb: "Gonads, ducts, and the organs of pregnancy and lactation. Gametes and sex steroids." },
];

window.ATLAS_PARTS = {
  skin: {
    name: "Skin",
    latin: "Cutis",
    systems: ["integumentary"],
    depth: 0,
    plate: 1,
    aliases: ["integument", "epidermis", "dermis"],
    overview: "The body's outer organ. It keeps water in, keeps most microbes out, reports touch, and helps set temperature.",
    stats: [
      { label: "Area", value: "1.5–2 m²" },
      { label: "Main layers", value: "3" },
      { label: "Renewal", value: "weeks" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "Skin has an epidermis, a dermis, and a fatty hypodermis. The epidermis is stratified squamous epithelium. Its living base, the stratum basale, divides and pushes cells outward. They fill with keratin, die, and form the stratum corneum. Thick skin on the palms and soles adds a clear stratum lucidum and has no hair. Thin skin covers most of the body and carries hair.",
        "The dermis is connective tissue. A loose papillary layer interlocks with the epidermis; a dense reticular layer holds collagen and elastin. The hypodermis anchors skin to fascia and stores fat. Hair follicles, sebaceous glands, and sweat glands grow down from the epidermis into the dermis.",
      ]},
      { title: "Cells", paragraphs: [
        "Keratinocytes are the majority. Melanocytes, from neural crest, make melanin and pass it to neighboring keratinocytes; skin color is mostly about melanin activity, not about how many melanocytes a person has. Langerhans cells present antigen. Merkel cells help sense light touch.",
      ]},
      { title: "Function", paragraphs: [
        "The acid mantle, the lipid film, and the keratin barrier limit water loss and colonization. Sweat and cutaneous blood flow dump or conserve heat. Nerve endings report touch, pressure, pain, temperature, and vibration. Ultraviolet light on the epidermis starts vitamin D synthesis: 7-dehydrocholesterol becomes cholecalciferol, which liver and kidney later activate.",
        "Eccrine sweat glands open on the skin and serve cooling. Apocrine glands, mainly in the axilla and groin, open into hair follicles and become active at puberty. Sebaceous glands oil the hair and skin.",
      ]},
    ],
    related: ["mammary", "skull"],
  },
  skull: {
    name: "Skull",
    latin: "Cranium",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.5,
    aliases: ["cranium", "head bone"],
    overview: "Twenty-two bones house the brain and the openings of the face. Six tiny ear ossicles sit apart from that count, inside the temporal bones.",
    stats: [
      { label: "Skull bones", value: "22" },
      { label: "Ear ossicles", value: "6" },
      { label: "Movable facial bone", value: "Mandible" },
    ],
    sections: [
      { title: "Regions", paragraphs: [
        "The neurocranium holds the brain: frontal, paired parietals, paired temporals, occipital, sphenoid, and ethmoid. The facial skeleton holds the jaws, nose, and orbits: mandible, paired maxillae, zygomatics, nasals, lacrimals, palatines, and inferior nasal conchae, plus the unpaired vomer.",
        "Sutures lock most of these bones. The coronal suture separates frontal from parietals, the sagittal suture separates the parietals, and the lambdoid suture meets the occipital bone. The mandible is the only freely movable bone of the face, at the temporomandibular joint. The auditory ossicles move too, but they are inside the middle ear.",
      ]},
      { title: "Openings worth knowing", paragraphs: [
        "The foramen magnum passes the brainstem, which continues as the spinal cord, with the vertebral arteries. The cribriform plate of the ethmoid passes olfactory filaments. The optic canal passes the optic nerve. The superior orbital fissure passes several nerves to the eye muscles. The carotid canal and jugular foramen pass the internal carotid artery and the sigmoid-to-jugular venous drainage.",
        "Paranasal sinuses in the frontal, maxillary, ethmoid, and sphenoid bones lighten the skull and add resonance to the voice. They drain into the nasal cavity.",
      ]},
      { title: "Function", paragraphs: [
        "The vault protects the brain. The base provides passages for nerves and vessels without giving up that protection. The jaws and zygomas anchor the muscles of biting and expression. On this plate the skull is drawn translucent so the brain shows through the vault, with the orbits and nasal aperture left open.",
      ]},
    ],
    related: ["brain", "vertebral-column"],
  },
  brain: {
    name: "Brain",
    latin: "Encephalon",
    systems: ["nervous"],
    depth: 32,
    plate: 1,
    aliases: ["cerebrum", "encephalon"],
    overview: "The central processor of the nervous system: perception, movement, language, memory, emotion, and the autonomic set-points of the body.",
    stats: [
      { label: "Neurons", value: "~86 billion" },
      { label: "Major parts", value: "3" },
      { label: "Cranial nerves", value: "12 pairs" },
    ],
    sections: [
      { title: "Gross structure", paragraphs: [
        "The brain has a cerebrum, a cerebellum, and a brainstem. The cerebrum is two hemispheres joined by the corpus callosum, with a folded cortex of gyri and sulci. Lobes are frontal, parietal, temporal, and occipital, plus the hidden insula and the limbic structures on the medial face. The diencephalon, deep in the forebrain, includes the thalamus and hypothalamus.",
        "The cerebellum sits posterior and inferior and coordinates movement, posture, and motor learning. The brainstem — midbrain, pons, and medulla — continues through the foramen magnum as the spinal cord. Most cranial nerves attach to the brainstem. This anterior plate shows the cerebral hemispheres and a short brainstem; the cerebellum is posterior and is not drawn as a separate mass.",
      ]},
      { title: "Coverings and fluid", paragraphs: [
        "Three meninges wrap the brain: dura, arachnoid, and pia. Cerebrospinal fluid is made by the choroid plexus. It flows from the lateral ventricles through the interventricular foramina into the third ventricle, down the cerebral aqueduct into the fourth, then out through the median and lateral apertures into the subarachnoid space. Arachnoid granulations return it to the dural venous sinuses.",
      ]},
      { title: "Function", paragraphs: [
        "Frontal cortex plans movement and much of working behavior; the precentral gyrus is the primary motor map. Parietal cortex, especially the postcentral gyrus, is the primary map of body sensation. Temporal cortex serves hearing and much of memory; occipital cortex serves vision. The hypothalamus runs endocrine and autonomic set-points: temperature, thirst, hunger, and circadian timing, largely through the pituitary.",
        "Language is often left-dominant, with production weighted toward the inferior frontal gyrus and comprehension toward the posterior temporal region, but the pattern varies. Blood reaches the brain through the internal carotids and vertebral arteries, which meet in the arterial circle at the base. A blood-brain barrier of tight endothelial junctions keeps many molecules out of the tissue.",
      ], list: [
        "I Olfactory — smell",
        "II Optic — vision, and a tract of the central nervous system",
        "III Oculomotor, IV trochlear, VI abducens — eye movement",
        "V Trigeminal — facial sensation and chewing",
        "VII Facial — expression, taste on the anterior tongue, tears and saliva",
        "VIII Vestibulocochlear — hearing and balance",
        "IX Glossopharyngeal and X vagus — pharynx, and the vagus as the great parasympathetic nerve to chest and abdomen",
        "XI Accessory — sternocleidomastoid and trapezius",
        "XII Hypoglossal — tongue",
      ]},
    ],
    related: ["spinal-cord", "pituitary", "skull"],
  },
  "spinal-cord": {
    name: "Spinal cord",
    latin: "Medulla spinalis",
    systems: ["nervous"],
    depth: 58,
    plate: 0.95,
    aliases: ["cord", "cauda equina"],
    overview: "The cable between brain and body. In adults it ends near the first lumbar vertebra; nerve roots continue below it as the cauda equina.",
    stats: [
      { label: "Adult end", value: "L1–L2" },
      { label: "Nerve pairs", value: "31" },
      { label: "Enlargements", value: "Cervical, lumbar" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The cord is a cylinder of gray matter inside and white matter outside, the reverse of the cerebral cortex. Gray matter holds cell bodies in dorsal (sensory) and ventral (motor) horns, with a lateral horn for sympathetic neurons in the thoracolumbar region. White matter is ascending and descending tracts.",
        "It is enlarged where limbs are served: cervical for the arms, lumbosacral for the legs. Because the vertebral column outgrows the cord, the adult cord ends at about L1 or L2. Below that, dorsal and ventral roots travel in the lumbar cistern as the cauda equina before exiting their foramina. A filum terminale anchors the end. This plate draws that stop, and the fan of roots below it, on purpose.",
      ]},
      { title: "Function", paragraphs: [
        "Sensory neurons enter by dorsal roots; motor neurons leave by ventral roots. A spinal nerve is the mix of the two, just beyond the dorsal-root ganglion. Simple reflexes, such as the stretch reflex, close in the cord without waiting for the brain. Pain and temperature cross soon after entry and ascend; many touch and proprioceptive fibers ascend on the same side before crossing in the medulla.",
        "A needle can enter the lumbar cistern below the cord, commonly at L3–L4 or L4–L5, because the roots move aside. That is a surface landmark, not a procedure to attempt from a diagram.",
      ]},
    ],
    related: ["brain", "vertebral-column", "peripheral-nerves"],
  },
  "vertebral-column": {
    name: "Vertebral column",
    latin: "Columna vertebralis",
    systems: ["skeletal"],
    depth: 55,
    plate: 0.45,
    aliases: ["spine", "backbone", "vertebrae"],
    overview: "The segmented axis of the trunk. It protects the cord, carries the head, and transmits weight to the pelvis.",
    stats: [
      { label: "Regions", value: "7 · 12 · 5" },
      { label: "Sacrum", value: "5 fused" },
      { label: "Curves", value: "4" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "A typical adult column has 7 cervical, 12 thoracic, and 5 lumbar vertebrae, a sacrum of 5 fused vertebrae, and a coccyx of about 3 to 5 fused pieces. Curves alternate: cervical lordosis, thoracic kyphosis, lumbar lordosis, sacral kyphosis. The curves share load and keep the center of mass over the feet.",
        "A typical vertebra has a body for weight and a vertebral arch for the canal. Pedicles and laminae form the arch. The spinous and transverse processes are levers for muscle. Articular processes make the facet joints. The atlas, C1, has no body and holds the skull. The axis, C2, has a dens that acts as the pivot for head rotation. Thoracic vertebrae carry ribs. Lumbar vertebrae have large bodies.",
      ]},
      { title: "Discs and canal", paragraphs: [
        "Intervertebral discs sit between bodies: a tough annulus fibrosus around a gel nucleus pulposus. Discs account for roughly a quarter of the column's length and compress through the day. The canal holds the cord down to about L1–L2 and the cauda equina below. Spinal nerves leave through intervertebral foramina: 8 cervical pairs, 12 thoracic, 5 lumbar, 5 sacral, and 1 coccygeal.",
      ]},
    ],
    related: ["spinal-cord", "sacrum", "pelvis"],
  },
  sternum: {
    name: "Sternum",
    latin: "Sternum",
    systems: ["skeletal"],
    depth: 12,
    plate: 0.72,
    aliases: ["breastbone"],
    overview: "The flat bone in the anterior midline of the chest. It is the front of the thoracic cage and lies in front of the heart.",
    sections: [
      { title: "Structure", paragraphs: [
        "Three parts make the sternum: manubrium, body, and xiphoid process. The jugular notch sits at the top of the manubrium, between the clavicles. The sternal angle, where manubrium meets body, is a palpable ridge. It marks the second costal cartilage, the level of the T4–T5 disc, the tracheal bifurcation, and the start of the aortic arch's usual span.",
        "The xiphoid is cartilage in youth and often bone later. It is a landmark for the lower border of the heart and the front of the diaphragm, and a poor place to press.",
      ]},
      { title: "Relations", paragraphs: [
        "The sternum is anterior to the thymus, the great vessels, and the right ventricle. That is why this plate keeps a window over the midline of the chest: the bone is real and anterior, and the heart is drawn behind it so both can be read. Costal cartilages of ribs 1 to 7 reach its edges. The clavicles meet the manubrium at the sternoclavicular joints, the only skeletal joints between the upper limb and the axial skeleton.",
      ]},
    ],
    related: ["heart", "rib-1", "clavicle"],
  },
  clavicle: {
    name: "Clavicle",
    latin: "Clavicula",
    systems: ["skeletal"],
    depth: 10,
    plate: 0.8,
    aliases: ["collarbone"],
    overview: "A horizontal strut from sternum to scapula. It holds the shoulder out from the trunk so the arm can swing clear of the chest.",
    sections: [
      { title: "Structure", paragraphs: [
        "The medial end is rounded and meets the manubrium. The lateral end is flat and meets the acromion. The shaft is curved, convex forward medially and concave forward laterally. It is subcutaneous for almost its whole length, which is why a break is easy to see and easy to feel.",
        "It is a membrane bone and begins to ossify in the fifth or sixth week, earlier than the other limb bones. Its medial epiphysis is among the last in the body to fuse, often in the early twenties.",
      ]},
      { title: "Function", paragraphs: [
        "The clavicle transmits force from the arm to the axial skeleton and gives origin to part of pectoralis major, deltoid, and sternocleidomastoid. Under it run the subclavian vessels and the brachial plexus, crossing the first rib. A fractured clavicle can threaten those structures, which is why the bone is more than a cosmetic ridge.",
      ]},
    ],
    related: ["scapula", "sternum", "pectoralis"],
  },
  scapula: {
    name: "Scapula",
    latin: "Scapula",
    systems: ["skeletal"],
    depth: 52,
    plate: 0.38,
    aliases: ["shoulder blade"],
    overview: "The shoulder blade on the posterior chest wall. The glenoid holds the head of the humerus, and the spine of the scapula is a lever for trapezius.",
    sections: [
      { title: "Structure", paragraphs: [
        "The scapula is a triangular flat bone. Its posterior spine ends laterally as the acromion, which meets the clavicle. The coracoid process projects forward and gives attachment to pectoralis minor, the short head of biceps, and coracobrachialis. The glenoid cavity faces laterally and holds the head of the humerus. Above the spine is the supraspinous fossa; below it, the infraspinous fossa. The deep face is the subscapular fossa.",
      ]},
      { title: "Function", paragraphs: [
        "It is a mobile base for the upper limb. Trapezius, serratus anterior, rhomboids, and levator scapulae slide it on the chest wall so the glenoid can point the arm. The rotator cuff muscles take origin from its fossae and hold the humeral head into the shallow glenoid.",
      ]},
    ],
    related: ["clavicle", "humerus", "deltoid"],
  },
  humerus: {
    name: "Humerus",
    latin: "Humerus",
    systems: ["skeletal"],
    depth: 28,
    plate: 0.7,
    aliases: ["upper arm bone"],
    overview: "The single bone of the arm, from the shoulder joint to the elbow.",
    sections: [
      { title: "Structure", paragraphs: [
        "The head faces medially and upward into the glenoid. The anatomical neck is the edge of the articular cartilage. The surgical neck, below the tubercles, is a common fracture site and the neighbor of the axillary nerve and the posterior circumflex humeral vessels. The greater and lesser tubercles flank the intertubercular groove, which holds the tendon of the long head of biceps.",
        "The deltoid tuberosity is halfway down the lateral shaft. Posteriorly the radial nerve and deep artery spiral in the radial groove. Distally, the capitulum meets the radial head and the trochlea meets the ulna. The olecranon fossa accepts the olecranon when the elbow extends. Medial and lateral epicondyles are the origins of the forearm flexors and extensors.",
      ]},
      { title: "Function", paragraphs: [
        "It is the lever of the arm. Deltoid and the rotator cuff move the head. Biceps, brachialis, and triceps cross the elbow from the shaft and tubercles. Fractures of the shaft can injure the radial nerve; fractures of the surgical neck can injure the axillary nerve. Those pairings are why the bone is taught with its nerves, not as an isolated rod.",
      ]},
    ],
    related: ["scapula", "radius", "deltoid", "biceps"],
  },
  radius: {
    name: "Radius",
    latin: "Radius",
    systems: ["skeletal"],
    depth: 22,
    plate: 0.7,
    aliases: ["forearm"],
    overview: "The lateral bone of the forearm, on the thumb side. It rotates around the ulna in pronation and supination.",
    sections: [
      { title: "Structure", paragraphs: [
        "The radial head is proximal and disc-shaped. It meets the capitulum of the humerus and spins inside the annular ligament against the ulna. The neck leads to the radial tuberosity, where the biceps tendon inserts. The shaft widens toward the wrist. Distally the radius, not the ulna, makes most of the wrist joint. The styloid process is lateral and sits a little distal to the ulnar styloid.",
        "An interosseous membrane binds the shaft to the ulna and transmits force. In the anatomical position the palms face forward, so the radius is lateral. On this plate the outer of the two forearm lines is the radius.",
      ]},
      { title: "Function", paragraphs: [
        "Biceps and the supinator spin it so the palm faces up. Pronator teres and pronator quadratus spin it the other way, crossing it over the ulna. It also carries the brachioradialis insertion and gives origin to forearm extensors and to flexor pollicis longus. A fall on an outstretched hand often breaks the distal radius.",
      ]},
    ],
    related: ["ulna", "humerus", "biceps"],
  },
  ulna: {
    name: "Ulna",
    latin: "Ulna",
    systems: ["skeletal"],
    depth: 24,
    plate: 0.68,
    aliases: ["forearm"],
    overview: "The medial bone of the forearm. It forms the hinge of the elbow and is nearly still while the radius rotates.",
    sections: [
      { title: "Structure", paragraphs: [
        "The proximal end is the heavy one. The olecranon is the point of the elbow and the insertion of triceps. The trochlear notch grips the trochlea of the humerus. The coronoid process braces the joint in flexion. The radial notch on the lateral side receives the radial head.",
        "The shaft tapers to a small distal head and a styloid process. The head is not part of the main wrist joint; a disc of fibrocartilage separates it from the carpus. On this plate the inner of the two forearm lines is the ulna.",
      ]},
      { title: "Function", paragraphs: [
        "With the humerus it makes a stable hinge. The radius then adds rotation. Brachialis inserts on the coronoid, so the main elbow flexor pulls on the ulna, while biceps pulls on the radius and also supinates. The interosseous membrane shares longitudinal load between the two bones.",
      ]},
    ],
    related: ["radius", "humerus"],
  },
  pelvis: {
    name: "Pelvis",
    latin: "Pelvis",
    systems: ["skeletal"],
    depth: 36,
    plate: 0.62,
    aliases: ["hip bone", "pelvic girdle"],
    overview: "The basin that transfers the weight of the trunk to the femurs and protects the pelvic organs. Female and male pelves differ in average shape.",
    sections: [
      { title: "Structure", paragraphs: [
        "Each hip bone is three bones that fuse at the acetabulum in late adolescence: ilium above, ischium below and behind, pubis in front. The two hip bones meet at the pubic symphysis and meet the sacrum at the sacroiliac joints. The acetabulum receives the femoral head. The obturator foramen, mostly closed by membrane in life, sits between pubis and ischium.",
        "The pelvic brim, from sacral promontory along the linea terminalis to the pubic symphysis, divides a false (greater) pelvis above from a true (lesser) pelvis below. The true pelvis has an inlet, a cavity, and an outlet.",
      ]},
      { title: "Sex differences", paragraphs: [
        "These are tendencies used in osteology, with plenty of overlap. A female pelvis is more often wider, with a rounder inlet, a wider subpubic angle nearer a right angle, and a shallower greater pelvis. A male pelvis is more often narrower and taller, with a heart-shaped inlet and a more acute subpubic angle. This plate draws that difference: wider iliac wings and a wider arch on the female figure, a taller and narrower basin on the male.",
        "The difference matters for childbirth because the neonatal head must pass the inlet, the mid-cavity, and the outlet. It also changes the angle of the femur at the knee. It does not sort every individual skeleton into a neat category.",
      ]},
    ],
    related: ["femur", "vertebral-column", "bladder", "uterus"],
  },
  femur: {
    name: "Femur",
    latin: "Femur",
    systems: ["skeletal"],
    depth: 32,
    plate: 0.72,
    aliases: ["thigh bone"],
    overview: "The longest and strongest bone in the body, from the hip joint to the knee.",
    sections: [
      { title: "Structure", paragraphs: [
        "The head is a sphere with a fovea for the ligament of the head, a minor blood supply in adults. The neck meets the shaft at about 125 degrees. Greater and lesser trochanters are levers for the gluteal and iliopsoas muscles. The shaft has a posterior linea aspera for the adductors and vasti. Distal condyles meet the tibia; the patella rides the trochlear groove in front.",
        "Most of the blood to the adult femoral head arrives along the neck in retinacular arteries from the medial circumflex femoral artery. A displaced fracture of the neck can tear those vessels and leave the head short of blood.",
      ]},
      { title: "Function", paragraphs: [
        "It carries body weight and lengthens the stride. Gluteus medius and minimus, on the greater trochanter, keep the pelvis level when the opposite foot is off the ground. Quadriceps extend the knee from the shaft and, for rectus femoris, also flex the hip. The hamstrings, on the posterior thigh, extend the hip and flex the knee.",
      ]},
    ],
    related: ["pelvis", "patella", "tibia", "quadriceps"],
  },
  patella: {
    name: "Patella",
    aspect: "anterior",
    latin: "Patella",
    systems: ["skeletal"],
    depth: 8,
    plate: 0.92,
    aliases: ["kneecap"],
    overview: "The largest sesamoid bone. It sits in the quadriceps tendon and lengthens the lever of knee extension.",
    sections: [
      { title: "Structure", paragraphs: [
        "The patella ossifies within the tendon in childhood. Its posterior surface is thick articular cartilage against the femoral trochlea. The quadriceps tendon arrives from above; the patellar ligament continues to the tibial tuberosity. A subcutaneous position makes it easy to feel and easy to break in a direct blow.",
      ]},
      { title: "Function", paragraphs: [
        "By holding the extensor tendon off the axis of the knee, it increases the moment arm of quadriceps, so the same muscle force produces more torque. It also protects the front of the knee joint. The vastus medialis helps keep it from drifting laterally as the knee extends.",
      ]},
    ],
    related: ["femur", "quadriceps", "tibia"],
  },
  tibia: {
    name: "Tibia",
    latin: "Tibia",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.75,
    aliases: ["shin", "shinbone"],
    overview: "The medial weight-bearing bone of the leg. Its anterior border and medial surface lie directly under the skin.",
    sections: [
      { title: "Structure", paragraphs: [
        "The proximal end is a plateau of two condyles that meet the femoral condyles, with a tibial tuberosity in front for the patellar ligament. The shaft is triangular. The anterior border is the shin. Distally the medial malleolus forms the inner ankle and grips the talus. The fibula runs parallel on the lateral side but carries little weight.",
      ]},
      { title: "Function", paragraphs: [
        "Almost all of the load from the knee reaches the ankle through the tibia. Its subcutaneous face is why a kick to the shin hurts and why the bone is a useful landmark. The knee's cruciate and collateral ligaments, and the menisci, stabilize the joint the tibia shares with the femur; they are inside the joint and are not drawn here.",
      ]},
    ],
    related: ["fibula", "femur", "patella"],
  },
  fibula: {
    name: "Fibula",
    latin: "Fibula",
    systems: ["skeletal"],
    depth: 26,
    plate: 0.6,
    aliases: ["calf bone"],
    overview: "The slender lateral bone of the leg. It is a site for muscle attachment and forms the outer ankle, not a pillar for body weight.",
    sections: [
      { title: "Structure", paragraphs: [
        "The head sits just below the knee and meets the lateral tibial condyle, not the femur in any important way. The common fibular nerve wraps the neck and is easily injured there. The shaft is buried in muscle. The distal end is the lateral malleolus, which reaches farther down than the medial malleolus and stabilizes the ankle.",
      ]},
      { title: "Function", paragraphs: [
        "It anchors many muscles of the leg and gives the ankle a lateral buttress. An interosseous membrane ties it to the tibia. Because it bears little axial load, a fracture can be surprisingly easy to walk on, and equally easy to miss, while the ankle joint is still unstable.",
      ]},
    ],
    related: ["tibia", "femur"],
  },
  deltoid: {
    name: "Deltoid",
    latin: "Musculus deltoideus",
    systems: ["muscular"],
    depth: 10,
    plate: 0.7,
    aliases: ["shoulder muscle"],
    overview: "The cap of the shoulder. It abducts the arm and, with its front and back fibers, flexes and extends it.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: lateral clavicle, acromion, and spine of the scapula",
        "Insertion: deltoid tuberosity of the humerus",
        "Innervation: axillary nerve, C5–C6",
        "Action: abduction of the arm after the first few degrees; anterior fibers flex and medially rotate, posterior fibers extend and laterally rotate",
      ], paragraphs: [
        "Supraspinatus starts abduction. Deltoid takes over and lifts the arm out to the side. The axillary nerve crosses the surgical neck, so a dislocation or a fracture there can paralyze this muscle and leave a patch of numbness over the outer shoulder.",
      ]},
    ],
    related: ["humerus", "scapula", "pectoralis"],
  },
  pectoralis: {
    name: "Pectoralis major",
    aspect: "anterior",
    latin: "Musculus pectoralis major",
    systems: ["muscular"],
    depth: 9,
    plate: 0.22,
    ghost: true,
    aliases: ["pec", "chest muscle"],
    overview: "The large fan on the front of the chest. It adducts and medially rotates the arm.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: medial clavicle, sternum, and the upper costal cartilages",
        "Insertion: lateral lip of the intertubercular groove of the humerus",
        "Innervation: lateral and medial pectoral nerves",
        "Action: adduction and medial rotation of the humerus; the clavicular head also flexes the arm",
      ], paragraphs: [
        "The muscle lies in front of the ribs and the pericardium. Pectoralis minor, deep to it, stabilizes the scapula and is not given a separate outline here.",
      ]},
    ],
    related: ["sternum", "humerus", "heart", "mammary"],
  },
  "rectus-abdominis": {
    name: "Rectus abdominis",
    aspect: "anterior",
    latin: "Musculus rectus abdominis",
    systems: ["muscular"],
    depth: 9,
    plate: 0.16,
    ghost: true,
    aliases: ["abs", "abdominal muscle"],
    overview: "The paired vertical muscle of the anterior abdominal wall. It flexes the trunk and compresses the abdomen.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: pubic crest and pubic symphysis",
        "Insertion: xiphoid process and costal cartilages of ribs 5 to 7",
        "Innervation: lower intercostal nerves, about T7 to T12",
        "Action: flexes the trunk, compresses the abdominal contents, and helps forced expiration",
      ], paragraphs: [
        "Tendinous intersections cross the muscle and give it a segmented look. The linea alba, a fibrous seam, separates the two bellies in the midline. The rectus sheath, from the aponeuroses of the oblique and transversus muscles, encloses it.",
      ]},
    ],
    related: ["external-oblique", "sternum", "small-intestine"],
  },
  "external-oblique": {
    name: "External oblique",
    aspect: "anterior",
    latin: "Musculus obliquus externus abdominis",
    systems: ["muscular"],
    depth: 8,
    plate: 0.14,
    ghost: true,
    aliases: ["oblique"],
    overview: "The outermost sheet of the lateral abdominal wall. Its fibers run downward and forward, like hands into pockets.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: outer surfaces of the lower eight ribs",
        "Insertion: iliac crest, and by aponeurosis into the linea alba and pubis",
        "Innervation: lower intercostal nerves and the subcostal nerve",
        "Action: compresses the abdomen; one side rotates the trunk toward the opposite side and bends it to the same side",
      ], paragraphs: [
        "Internal oblique fibers run the other way, and transversus abdominis runs horizontally beneath them. Together the three layers make a corset. Their aponeuroses form the rectus sheath and the inguinal ligament. The inguinal canal, a passage through this wall, carries the spermatic cord in males and the round ligament of the uterus in females.",
      ]},
    ],
    related: ["rectus-abdominis", "rib-10", "pelvis"],
  },
  biceps: {
    name: "Biceps brachii",
    aspect: "anterior",
    latin: "Musculus biceps brachii",
    systems: ["muscular"],
    depth: 12,
    plate: 0.64,
    aliases: ["biceps"],
    overview: "The two-headed muscle on the front of the arm. It flexes the elbow and is the main supinator of the forearm.",
    sections: [
      { title: "Attachments and action", list: [
        "Short head origin: coracoid process of the scapula",
        "Long head origin: supraglenoid tubercle, tendon running through the shoulder joint",
        "Insertion: radial tuberosity, and the bicipital aponeurosis into the forearm fascia",
        "Innervation: musculocutaneous nerve, C5–C6",
        "Action: supinates the forearm and flexes the elbow; it also helps flex the shoulder",
      ], paragraphs: [
        "Brachialis, deep to it, is the steadier elbow flexor because it inserts on the ulna and does not care about pronation. Biceps is strongest as a flexor when the forearm is already supinated. The long-head tendon is a common source of shoulder pain where it runs in the intertubercular groove.",
      ]},
    ],
    related: ["humerus", "radius", "scapula"],
  },
  quadriceps: {
    name: "Quadriceps femoris",
    aspect: "anterior",
    latin: "Musculus quadriceps femoris",
    systems: ["muscular"],
    depth: 12,
    plate: 0.58,
    aliases: ["quads", "thigh muscle"],
    overview: "The great extensor of the knee: four heads on the front of the thigh, one tendon, and the patella in that tendon.",
    sections: [
      { title: "Attachments and action", list: [
        "Rectus femoris: from the anterior inferior iliac spine and the rim of the acetabulum; it also flexes the hip",
        "Vastus lateralis: greater trochanter and lateral linea aspera",
        "Vastus medialis: medial linea aspera; its lower fibers help keep the patella centered",
        "Vastus intermedius: anterior shaft of the femur, deep to rectus",
        "Insertion: patella, then the patellar ligament to the tibial tuberosity",
        "Innervation: femoral nerve, L2–L4",
        "Action: extends the knee",
      ], paragraphs: [
        "The hamstrings lie on the back of the thigh. They flex the knee and extend the hip, the opposite pattern at the knee. A tap on the patellar ligament stretches the quadriceps and triggers a monosynaptic reflex: the knee extends.",
      ]},
    ],
    related: ["femur", "patella", "tibia", "pelvis"],
  },
  scm: {
    name: "Sternocleidomastoid",
    aspect: "anterior",
    latin: "Musculus sternocleidomastoideus",
    systems: ["muscular"],
    depth: 8,
    plate: 0.75,
    aliases: ["scm", "neck muscle"],
    overview: "The rope of muscle from the skull to the sternum and clavicle. One side turns the face to the opposite side.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: manubrium of the sternum and the medial clavicle",
        "Insertion: mastoid process and the lateral superior nuchal line",
        "Innervation: spinal accessory nerve (cranial nerve XI), with sensory branches from the cervical plexus",
        "Action: one side tilts the head to the same side and rotates the face to the opposite side; both sides together flex the neck",
      ], paragraphs: [
        "It divides the neck into anterior and posterior triangles, a map used for finding the carotid pulse, lymph nodes, and the accessory nerve. The muscle is a useful landmark because it is subcutaneous and easy to see when the head is turned against resistance.",
      ]},
    ],
    related: ["sternum", "clavicle", "skull"],
  },
  trapezius: {
    name: "Trapezius",
    latin: "Musculus trapezius",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 6,
    plate: 0.55,
    aliases: ["traps"],
    overview: "The broad superficial muscle of the upper back and the neck. It moves the scapula and steadies the shoulder.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: superior nuchal line, external occipital protuberance, nuchal ligament, and spinous processes of C7 to T12",
        "Insertion: lateral third of the clavicle, the acromion, and the spine of the scapula",
        "Innervation: spinal accessory nerve (cranial nerve XI); C3 and C4 carry proprioception",
        "Action: upper fibers elevate the scapula, middle fibers retract it, lower fibers depress it; upper and lower fibers together rotate the glenoid upward",
      ], paragraphs: [
        "The two sides together form a diamond from the occiput to the lower thoracic spine. The upper fibers shrug the shoulder. Loss of the accessory nerve lets the scapula sag and makes lifting the arm overhead weak, because the glenoid no longer rotates up to make room for the humerus.",
      ]},
    ],
    related: ["scapula", "clavicle", "latissimus"],
  },
  latissimus: {
    name: "Latissimus dorsi",
    latin: "Musculus latissimus dorsi",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 7,
    plate: 0.48,
    aliases: ["lat", "lats"],
    overview: "The wide sheet from the lower back to the humerus. It extends, adducts, and medially rotates the arm.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: spinous processes of about T7 to T12, the thoracolumbar fascia, the iliac crest, and the lower ribs",
        "Insertion: floor of the intertubercular groove of the humerus",
        "Innervation: thoracodorsal nerve, C6 to C8",
        "Action: extension, adduction, and medial rotation of the humerus",
      ], paragraphs: [
        "It is a climbing muscle: it pulls the trunk up toward a fixed arm. The thoracodorsal nerve crosses the axilla on the muscle's deep surface and is a landmark in axillary surgery. With teres major it forms the posterior fold of the axilla.",
      ]},
    ],
    related: ["humerus", "trapezius", "pelvis"],
  },
  triceps: {
    name: "Triceps brachii",
    latin: "Musculus triceps brachii",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 11,
    plate: 0.62,
    aliases: ["triceps"],
    overview: "The three-headed muscle on the back of the arm. It is the extensor of the elbow.",
    sections: [
      { title: "Attachments and action", list: [
        "Long head origin: infraglenoid tubercle of the scapula",
        "Lateral head origin: posterior humerus above the spiral groove",
        "Medial head origin: posterior humerus below the spiral groove",
        "Insertion: olecranon of the ulna",
        "Innervation: radial nerve, C6 to C8",
        "Action: extends the elbow; the long head also extends and adducts the shoulder",
      ], paragraphs: [
        "The radial nerve and the deep artery of the arm run in the spiral groove between the origins of the lateral and medial heads. A midshaft fracture of the humerus can injure that nerve and weaken wrist and finger extension as well as the triceps.",
      ]},
    ],
    related: ["humerus", "ulna", "scapula"],
  },
  "gluteus-maximus": {
    name: "Gluteus maximus",
    latin: "Musculus gluteus maximus",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 5,
    plate: 0.72,
    aliases: ["glute", "glutes"],
    overview: "The heavy muscle of the buttock. It extends the hip and is the main muscle for rising from a chair and for climbing.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: ilium behind the posterior gluteal line, the sacrum, the coccyx, and the sacrotuberous ligament",
        "Insertion: gluteal tuberosity of the femur and the iliotibial tract",
        "Innervation: inferior gluteal nerve, L5 to S2",
        "Action: extends and laterally rotates the hip; the upper fibers abduct and the lower fibers adduct",
      ], paragraphs: [
        "Most of the muscle inserts into the iliotibial tract rather than the bone, so it also steadies the knee. Gluteus medius and minimus, deep to it, keep the pelvis level during single-leg stance. The sciatic nerve leaves the pelvis below piriformis and is covered here by gluteus maximus.",
      ]},
    ],
    related: ["pelvis", "femur", "hamstrings"],
  },
  hamstrings: {
    name: "Hamstrings",
    latin: "Musculi ischiocrurales",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 10,
    plate: 0.64,
    aliases: ["hamstring", "biceps femoris", "semitendinosus", "semimembranosus"],
    overview: "The three muscles on the back of the thigh. They extend the hip and flex the knee.",
    sections: [
      { title: "Attachments and action", list: [
        "Semitendinosus, semimembranosus, and the long head of biceps femoris arise from the ischial tuberosity",
        "The short head of biceps femoris arises from the linea aspera of the femur",
        "Insertions: semitendinosus on the upper medial tibia, semimembranosus on the posterior medial tibial condyle, biceps femoris on the head of the fibula",
        "Innervation: tibial nerve, except the short head of biceps femoris, which takes the common fibular nerve",
        "Action: extend the hip and flex the knee; they also rotate the flexed knee",
      ], paragraphs: [
        "They cross both the hip and the knee, so a stretch that flexes the hip and extends the knee lengthens them. A strain is common where the tendons leave the ischial tuberosity. The sciatic nerve runs deep to the muscle bellies in the posterior thigh.",
      ]},
    ],
    related: ["femur", "pelvis", "tibia", "gluteus-maximus"],
  },
  gastrocnemius: {
    name: "Gastrocnemius",
    latin: "Musculus gastrocnemius",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 10,
    plate: 0.66,
    aliases: ["calf", "gastroc"],
    overview: "The superficial two-headed muscle of the calf. It plantarflexes the ankle and flexes the knee.",
    sections: [
      { title: "Attachments and action", list: [
        "Origin: a medial head from the medial femoral condyle and a lateral head from the lateral femoral condyle",
        "Insertion: the calcaneus, by the calcaneal tendon shared with soleus",
        "Innervation: tibial nerve, S1 to S2",
        "Action: plantarflexes the foot and flexes the knee",
      ], paragraphs: [
        "Soleus, deep to it, plantarflexes the ankle without crossing the knee and is the steadier postural muscle. Together they are the triceps surae. The tibial nerve and the posterior tibial vessels pass between the deep and superficial muscle groups of the calf. A rupture of the calcaneal tendon removes this push-off.",
      ]},
    ],
    related: ["femur", "tibia", "fibula"],
  },
  diaphragm: {
    name: "Diaphragm",
    latin: "Diaphragma",
    systems: ["muscular", "respiratory"],
    depth: 24,
    plate: 1,
    aliases: ["breathing muscle"],
    overview: "The dome of skeletal muscle between chest and abdomen. It is the main muscle of quiet breathing.",
    stats: [
      { label: "Nerve", value: "Phrenic C3–C5" },
      { label: "Caval opening", value: "T8" },
      { label: "Aortic opening", value: "T12" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "Muscle fibers arise from the xiphoid, the inner faces of the lower six ribs, and the lumbar vertebrae by two crura and by arcuate ligaments. They insert into a central tendon. The right dome sits higher than the left because the liver is beneath it. The heart rests on the central tendon.",
        "Three openings are worth memorizing. The inferior vena cava passes at about T8, in the central tendon, so it widens as the diaphragm contracts and venous return rises. The esophagus and the vagus trunks pass at about T10, through muscle, which helps close the esophagus. The aorta, thoracic duct, and often the azygos vein pass behind the diaphragm at about T12, so aortic flow is not pinched by inspiration.",
      ]},
      { title: "Physiology", paragraphs: [
        "The phrenic nerves, from cervical roots C3, C4, and C5, provide the motor supply. In quiet inspiration the domes descend, thoracic volume rises, intrapleural pressure falls, and air enters. Quiet expiration is mostly elastic recoil, not muscle work. Forced expiration recruits the abdominal wall, which pushes the domes up.",
        "A high spinal cord injury can spare the diaphragm if it is below C5, and can paralyze it if the phrenic segments are destroyed. Hiccups are spasmodic contractions of this muscle.",
      ]},
    ],
    related: ["lung", "liver", "heart", "vena-cava"],
  },
  "peripheral-nerves": {
    name: "Peripheral nerves",
    latin: "Nervi peripherici",
    systems: ["nervous"],
    depth: 20,
    plate: 0.85,
    aliases: ["nerves", "brachial plexus", "femoral nerve"],
    overview: "The cables leaving the spinal cord. On this plate the brachial plexus is projected into the arm, and the femoral nerve down the front of the thigh.",
    sections: [
      { title: "What is drawn", paragraphs: [
        "A spinal nerve forms from a dorsal sensory root and a ventral motor root, then splits into rami. In the neck and lower back, ventral rami braid into plexuses so each limb muscle gets fibers from more than one spinal level. The brachial plexus, from about C5 to T1, supplies the shoulder and arm. The femoral nerve, from the lumbar plexus (about L2 to L4), runs on the front of the thigh and supplies quadriceps and skin of the anterior thigh and medial leg.",
        "The sciatic nerve, the largest in the body, is posterior in the thigh and is not drawn as if it were an anterior structure. Median, ulnar, and radial nerves share the arm; the gold line here is a projection of that bundle, not a claim that one nerve lies exactly on the skin.",
      ]},
      { title: "Function", paragraphs: [
        "Peripheral nerves carry motor axons out, sensory axons in, and in many cases autonomic fibers. A nerve is a bundle of axons wrapped in endoneurium, fascicles in perineurium, and the whole nerve in epineurium. Regeneration after a cut, when it happens, is slow, on the order of a millimeter a day, and only in the periphery: central axons do not regrow the same way.",
      ]},
    ],
    related: ["spinal-cord", "biceps", "quadriceps"],
  },
  pituitary: {
    name: "Pituitary gland",
    latin: "Hypophysis",
    systems: ["endocrine"],
    depth: 48,
    plate: 1,
    aliases: ["hypophysis", "master gland"],
    overview: "A pea-sized gland in the sella turcica of the sphenoid bone, slung under the hypothalamus. It links the nervous system to the endocrine system.",
    sections: [
      { title: "Structure", paragraphs: [
        "The anterior lobe, or adenohypophysis, grows up from the roof of the embryonic mouth and talks to the hypothalamus by a portal blood system. The posterior lobe, or neurohypophysis, is a downgrowth of the brain. Its hormones are made in hypothalamic nuclei and shipped down axons for release.",
        "It sits just behind the optic chiasm. An expanding mass there can press the crossing fibers and narrow the outer fields of vision.",
      ]},
      { title: "Hormones", paragraphs: [
        "The anterior lobe releases growth hormone, prolactin, ACTH, TSH, FSH, and LH. Releasing and inhibiting hormones from the hypothalamus control them. Growth hormone drives growth and shifts metabolism; too much before the growth plates close causes gigantism, and after they close, acromegaly. ACTH drives the adrenal cortex. TSH drives the thyroid. FSH and LH run the gonads. Prolactin supports milk production.",
        "The posterior lobe releases antidiuretic hormone and oxytocin. ADH inserts water channels in the collecting duct of the kidney. Oxytocin contracts the uterus in labor and the myoepithelial cells of the breast in milk ejection. Both are also neuromodulators in the brain.",
      ]},
    ],
    related: ["brain", "thyroid", "adrenal", "ovary", "testis"],
  },
  thyroid: {
    name: "Thyroid gland",
    latin: "Glandula thyroidea",
    systems: ["endocrine"],
    depth: 15,
    plate: 1,
    aliases: ["thyroid"],
    overview: "A butterfly-shaped gland on the front of the trachea. Its hormones set the metabolic rate. Four small parathyroid glands hide on its back.",
    sections: [
      { title: "Structure", paragraphs: [
        "Two lobes and a connecting isthmus wrap the upper trachea, usually over the second to fourth tracheal rings. The gland is made of follicles: a ball of cells around a lake of colloid that stores thyroglobulin. Iodine from the diet is attached to tyrosine on that protein. The cells then release thyroxine (T4) and a smaller amount of triiodothyronine (T3). T3 is the more active hormone; much of the circulating T4 is converted to T3 in other tissues.",
        "C cells between follicles make calcitonin, which lowers blood calcium by restraining osteoclasts. In humans its day-to-day role is smaller than parathyroid hormone. The four parathyroids, posterior and not drawn as separate dots, make that hormone and are the main minute-to-minute defense of blood calcium.",
      ]},
      { title: "Control", paragraphs: [
        "TSH from the pituitary tells the follicle cells to make and release hormone. T3 and T4 feed back and suppress TSH. Too little hormone slows metabolism, heart rate, and gut motility, and in a child it impairs growth and brain development. Too much speeds the heart, the gut, and heat production. The gland moves when you swallow, because it is wrapped in the pretracheal fascia.",
      ]},
    ],
    related: ["larynx", "trachea", "pituitary"],
  },
  adrenal: {
    name: "Adrenal gland",
    latin: "Glandula suprarenalis",
    systems: ["endocrine"],
    depth: 48,
    plate: 1,
    aliases: ["suprarenal gland"],
    overview: "A cap on each kidney with two organs in one: a steroid cortex and a catecholamine medulla.",
    sections: [
      { title: "Cortex", paragraphs: [
        "Three zones make three families of steroid. The outer zona glomerulosa makes aldosterone, which tells the kidney to save sodium and lose potassium. The wide zona fasciculata makes cortisol, which raises blood glucose, supports blood pressure, and restrains inflammation. The inner zona reticularis makes androgen precursors. ACTH from the pituitary drives cortisol. Aldosterone is driven mainly by angiotensin II and by high potassium, not by ACTH.",
        "Loss of the cortex is life-threatening because cortisol and aldosterone cannot be replaced by any other gland. Cortisol also permits catecholamines and glucagon to do their work; without it, stress is poorly met.",
      ]},
      { title: "Medulla", paragraphs: [
        "The medulla is modified sympathetic nervous tissue. Preganglionic sympathetic fibers, unusual in that they do not stop at a ganglion first, drive chromaffin cells to release epinephrine and some norepinephrine into the blood. The surge raises heart rate, widens the airways, and mobilizes glucose. It is the hormonal half of the fight-or-flight response; the nerve half is faster and more local.",
      ]},
    ],
    related: ["kidney", "pituitary", "pancreas"],
  },
  pancreas: {
    name: "Pancreas",
    latin: "Pancreas",
    systems: ["digestive", "endocrine"],
    depth: 42,
    plate: 1,
    aliases: ["pancreatic gland"],
    overview: "A gland behind the stomach with two jobs: digestive juice into the duodenum, and insulin and glucagon into the blood.",
    sections: [
      { title: "Structure", paragraphs: [
        "The head sits in the C-shaped duodenum, the body crosses the midline, and the tail reaches the spleen. Most of the gland is exocrine acini. They make enzymes as inactive precursors: trypsinogen, chymotrypsinogen, procarboxypeptidase, plus active amylase and lipase. The main duct joins the common bile duct and opens at the major duodenal papilla. An accessory duct often opens a little above it.",
        "Islands of endocrine cells, the islets of Langerhans, are scattered through the tissue. Beta cells make insulin, alpha cells glucagon, delta cells somatostatin, and PP cells pancreatic polypeptide. Beta cells are the majority.",
      ]},
      { title: "Physiology", paragraphs: [
        "Secretin, released when acid enters the duodenum, drives a bicarbonate-rich watery juice that neutralizes chyme. Cholecystokinin drives enzyme secretion and also contracts the gallbladder. Enteropeptidase on the duodenal brush border clips trypsinogen to trypsin, and trypsin then activates the other proteases. Releasing active protease inside the pancreas itself is the disaster of pancreatitis.",
        "After a meal, rising glucose and incretin hormones prompt insulin. Insulin lets muscle and fat take up glucose and tells the liver to store glycogen. Between meals, glucagon tells the liver to break glycogen down and to make new glucose. Somatostatin damps both. The two systems share one organ and one blood supply, but they do not share a duct: hormones leave by capillaries, enzymes by the duct.",
      ]},
    ],
    related: ["small-intestine", "stomach", "spleen", "liver"],
  },
  ovary: {
    name: "Ovary",
    latin: "Ovarium",
    systems: ["endocrine", "reproductive"],
    sex: "female",
    depth: 38,
    plate: 1,
    aliases: ["ovaries", "gonad"],
    overview: "The female gonad. It matures oocytes and releases them, and it makes estradiol and progesterone.",
    sections: [
      { title: "Structure", paragraphs: [
        "Each ovary lies against the lateral wall of the pelvis, hung between the ovarian ligament medially and the suspensory ligament laterally. The suspensory ligament carries the ovarian vessels. A cortex holds follicles; a medulla holds vessels. The surface is a cuboidal epithelium often called germinal, which is a bad name: the germ cells migrated in from the yolk sac and did not arise from that covering.",
        "A follicle is an oocyte plus its nurturing cells. Primordial follicles wait. Each cycle a cohort grows. Usually one becomes dominant, fills with fluid, and is the Graafian follicle. At ovulation the oocyte, still a secondary oocyte paused in meiosis, leaves with its zona pellucida and a cloud of granulosa cells.",
      ]},
      { title: "Cycle", paragraphs: [
        "FSH from the pituitary recruits the cohort. Growing follicles make estradiol, which rebuilds the endometrium and, at a sustained high level, triggers an LH surge. LH causes ovulation, often near day 14 of a 28-day cycle, though real cycles vary. The emptied follicle becomes the corpus luteum and secretes progesterone, and some estrogen, for about two weeks. If no pregnancy occurs it fades to a corpus albicans and menstruation follows. If a conceptus implants, its hCG keeps the corpus luteum alive until the placenta takes over steroid production.",
      ]},
    ],
    related: ["uterus", "uterine-tube", "pituitary"],
  },
  testis: {
    name: "Testis",
    aspect: "anterior",
    latin: "Testis",
    systems: ["endocrine", "reproductive"],
    sex: "male",
    depth: 4,
    plate: 1,
    aliases: ["testicle", "testes"],
    overview: "The male gonad. It makes sperm in seminiferous tubules and testosterone in the tissue between them.",
    stats: [
      { label: "Sperm production", value: "~74 days" },
      { label: "Cooler than core", value: "2–3 °C" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "Each testis sits in the scrotum, outside the abdomen, because spermatogenesis runs a little cooler than core temperature. The cremaster muscle and the dartos smooth muscle adjust how close the testes hang. A pampiniform plexus of veins cools incoming arterial blood. The tunica albuginea is the fibrous coat. Septa divide the interior into lobules of coiled seminiferous tubules.",
        "Sertoli cells inside the tubules nurse developing sperm and form a blood-testis barrier. Leydig cells in the interstitial tissue make testosterone under LH. FSH supports the Sertoli cells. Sperm leave the tubules into the rete testis, then the epididymis, a comma-shaped duct on the posterior side where they mature and are stored. This anterior drawing shows the testis and the start of the duct; the epididymis is mostly posterior.",
      ]},
      { title: "Pathway and hormones", paragraphs: [
        "From the epididymis, sperm travel the ductus deferens, join the seminal vesicle's duct to form the ejaculatory duct, cross the prostate, and enter the urethra. The whole trip from spermatogonium to a sperm in the ejaculate takes on the order of two and a half months.",
        "Testosterone maintains the ducts, the glands, muscle mass, and libido, and it is converted to dihydrotestosterone in skin and prostate. Negative feedback on LH and GnRH keeps the level steady. The left testicular vein usually drains to the left renal vein, the right to the inferior vena cava, which is why a dilated venous plexus is more often felt on the left.",
      ]},
    ],
    related: ["ductus-deferens", "prostate", "penis", "pituitary"],
  },
  thymus: {
    name: "Thymus",
    latin: "Thymus",
    systems: ["lymphatic"],
    depth: 18,
    plate: 0.75,
    aliases: ["thymus gland"],
    overview: "A lymphoid organ in the anterior mediastinum where T lymphocytes learn to recognize antigen and to tolerate the body's own proteins.",
    sections: [
      { title: "Structure", paragraphs: [
        "The thymus lies behind the manubrium, in front of the great vessels and the trachea, and often extends into the neck in children. It is large in childhood and shrinks after puberty, replaced gradually by fat, though it never disappears entirely. Lobules have a dense cortex and a paler medulla. Hassall corpuscles, whorls of epithelial cells, mark the medulla.",
      ]},
      { title: "Function", paragraphs: [
        "T-cell precursors arrive from the bone marrow. In the cortex they are tested: those that cannot see the body's MHC molecules die, and those that attack the body's own peptides too strongly are removed. Survivors leave as naive T cells. Epithelial cells of the thymus, not the lymphocytes themselves, run this schooling. Without a thymus, cell-mediated immunity and the T-cell help that B cells need both fail.",
      ]},
    ],
    related: ["heart", "sternum", "lymph-nodes"],
  },
  spleen: {
    name: "Spleen",
    latin: "Lien",
    systems: ["lymphatic"],
    depth: 40,
    plate: 1,
    aliases: ["splen"],
    overview: "A soft, blood-rich organ in the left upper abdomen, against ribs 9 to 11. It filters blood and mounts immune responses.",
    sections: [
      { title: "Structure", paragraphs: [
        "The spleen sits posterolateral in the patient's left upper quadrant, under the diaphragm and against the stomach, the left kidney, and the tail of the pancreas. Its artery comes from the celiac trunk. White pulp is lymphoid tissue around arteries, a place for lymphocytes to meet antigen in the blood. Red pulp is a filter of cords and sinusoids. Macrophages there remove worn red cells and debris.",
      ]},
      { title: "Function", paragraphs: [
        "Besides filtration and immunity, the spleen stores platelets and, in the fetus, makes blood cells. An adult can live without one. After removal, encapsulated bacteria are harder to clear, because the spleen is especially good at catching organisms that are poorly opsonized. The capsule is thin, so trauma to the left lower ribs can rupture it and bleed into the abdomen.",
      ]},
    ],
    related: ["pancreas", "stomach", "liver"],
  },
  "lymph-nodes": {
    name: "Lymph nodes",
    latin: "Nodi lymphoidei",
    systems: ["lymphatic"],
    depth: 7,
    plate: 1,
    aliases: ["lymph glands", "nodes"],
    overview: "Small filters along lymph vessels. Clusters in the neck, armpit, and groin are the ones this plate marks.",
    sections: [
      { title: "Structure", paragraphs: [
        "A node has a capsule, a cortex of B-cell follicles, a paracortex rich in T cells, and a medulla of cords and sinuses. Lymph arrives by several afferent vessels, percolates through the sinuses, and leaves by one or two vessels at the hilum. Blood vessels enter at the hilum too.",
        "The nodes drawn here are superficial groups: cervical along the neck, axillary in the armpit, and inguinal in the groin. Deeper groups follow the aorta, the trachea, and the intestines. Most lymph from the breast drains to the axillary nodes, which is why those nodes matter in breast disease. The thoracic duct returns lymph from most of the body to the venous angle on the left; a smaller right lymphatic duct serves the right upper quadrant.",
      ]},
      { title: "Function", paragraphs: [
        "Nodes are where adaptive immunity often starts. Dendritic cells arrive with antigen, and lymphocytes that recognize it proliferate. A working node swells. Lymph itself is the overflow of tissue fluid, on the order of 2 to 4 liters a day returned to the blood, plus fats absorbed by lacteals in the intestine. Block a major duct and that fluid collects in the tissues.",
      ]},
    ],
    related: ["spleen", "thymus", "mammary"],
  },
  heart: {
    name: "Heart",
    latin: "Cor",
    systems: ["cardiovascular"],
    depth: 20,
    plate: 1,
    aliases: ["cardiac", "myocardium"],
    overview: "A four-chamber muscular pump in the middle mediastinum. It drives a low-pressure circuit through the lungs and a high-pressure circuit through the rest of the body.",
    stats: [
      { label: "Mass", value: "250–350 g" },
      { label: "Resting output", value: "~5 L/min" },
      { label: "Stroke volume", value: "~70 mL" },
    ],
    sections: [
      { title: "Location", paragraphs: [
        "The heart sits behind the sternum and the costal cartilages, between the lungs, on the diaphragm. About two thirds of it lies to the left of the midline. The apex, formed by the left ventricle, points down and to the left, usually to the fifth intercostal space in the midclavicular line.",
        "The right border is mostly right atrium. The anterior surface is mostly right ventricle. The left border is mostly left ventricle. The left atrium is largely posterior. A fibrous pericardium and a serous sac enclose it; the visceral layer of that sac is the epicardium.",
      ]},
      { title: "Chambers and valves", paragraphs: [
        "Right atrium receives the venae cavae and the coronary sinus. Blood crosses the tricuspid valve into the right ventricle, then the pulmonary valve into the pulmonary trunk. Pulmonary veins return blood to the left atrium. It crosses the mitral valve into the left ventricle, then the aortic valve into the aorta. The left ventricular wall is about three times as thick as the right, because it feeds the whole systemic circuit rather than only the lungs.",
        "Chordae tendineae and papillary muscles tether the atrioventricular valves so they do not flip when the ventricles contract. The semilunar valves, aortic and pulmonary, need no chordae; filling of their cusps after ejection snaps them shut. Listening posts are classical: aortic at the right second intercostal space, pulmonary at the left second, tricuspid near the lower left sternal edge, mitral at the apex.",
      ]},
      { title: "Conduction and coronary flow", paragraphs: [
        "The sinoatrial node, high in the right atrium, sets the pace. The impulse crosses the atria, pauses in the atrioventricular node, then runs the bundle of His, the bundle branches, and the Purkinje network so the ventricles contract from the apex upward. Parasympathetic vagus slows the nodes. Sympathetic nerves speed them and strengthen contraction.",
        "The left coronary artery divides into the anterior interventricular (left anterior descending) artery and the circumflex. The right coronary artery supplies the right side and, in most people, the posterior descending artery. Flow in these vessels is greatest in diastole, when the heart muscle is relaxed and the aortic valve no longer covers the coronary openings.",
      ]},
      { title: "Physiology", paragraphs: [
        "Cardiac output is heart rate times stroke volume. At rest that is often about 5 liters a minute, the entire blood volume each minute. Stroke volume rises, within limits, when the ventricle fills more: a stretched sarcomere contracts harder. That is the Frank–Starling relation, and it is how the two sides of the heart stay matched. Ejection fraction, the share of ventricular volume sent out each beat, is normally well above half.",
        "Average female hearts are lighter in absolute grams and similar once body size is taken into account. The plate uses one heart shape for both figures.",
      ]},
    ],
    related: ["lung", "aorta", "vena-cava", "diaphragm"],
  },
  aorta: {
    name: "Aorta",
    latin: "Aorta",
    systems: ["cardiovascular"],
    depth: 44,
    plate: 1,
    aliases: ["aortic arch"],
    overview: "The great elastic artery leaving the left ventricle. It distributes oxygenated blood to the whole systemic circulation.",
    sections: [
      { title: "Course", paragraphs: [
        "The ascending aorta leaves the left ventricle and immediately gives the coronary arteries. The arch curves up and to the patient's left, over the left main bronchus. Its usual three branches are the brachiocephalic trunk, the left common carotid, and the left subclavian. The descending thoracic aorta runs beside the vertebral column, passes behind the diaphragm at about T12, and becomes the abdominal aorta.",
        "Unpaired abdominal branches are the celiac trunk, the superior mesenteric artery, and the inferior mesenteric artery. Paired branches include the renals, the gonadals, and the lumbars. The aorta divides into the common iliac arteries at about L4. On this plate the arch, the descending trunk, and the bifurcation are drawn, with the three arch branches as short stubs.",
      ]},
      { title: "Wall and pressure", paragraphs: [
        "The wall has an intima, a thick media of elastic lamellae and smooth muscle, and an adventitia. Elastic recoil in diastole keeps blood moving while the ventricle rests: the Windkessel effect. Systemic arterial pressure is often taught as about 120 over 80 millimeters of mercury. The aorta itself is where that pressure wave begins.",
      ]},
    ],
    related: ["heart", "vena-cava", "kidney"],
  },
  "vena-cava": {
    name: "Vena cava",
    latin: "Vena cava",
    systems: ["cardiovascular"],
    depth: 44,
    plate: 1,
    aliases: ["vena cava", "cava", "svc", "ivc"],
    overview: "The two great veins that return systemic blood to the right atrium: a superior vena cava from the upper body and an inferior vena cava from the lower.",
    sections: [
      { title: "Course", paragraphs: [
        "The superior vena cava forms behind the right first costal cartilage from the two brachiocephalic veins and descends into the right atrium. It drains the head, neck, upper limbs, and much of the chest wall. The inferior vena cava forms at about L5 from the common iliac veins, climbs the posterior abdomen to the right of the aorta, grooves the liver, and pierces the diaphragm at about T8 to enter the right atrium.",
        "Hepatic veins empty into the inferior vena cava. The hepatic portal vein does not: it carries blood from the gut to the liver first. Mixing those two vessels up is a classic error. The cavae themselves are usually described as valveless. A small, often incomplete eustachian valve may sit where the inferior vena cava meets the atrium. Valves are a feature of the limb veins, not of these trunks.",
      ]},
      { title: "Function", paragraphs: [
        "Venous pressure is low, a few millimeters of mercury. Flow depends on the pressure left after the capillaries, on valves and muscle pumps in the limbs, on respiratory pressure swings, and on the heart's suction as the atrium relaxes. The inferior cava's thoracic segment widens when the diaphragm contracts, which helps pull abdominal venous blood toward the heart during inspiration.",
      ]},
    ],
    related: ["heart", "aorta", "portal-vein", "liver"],
  },
  "portal-vein": {
    name: "Hepatic portal vein",
    latin: "Vena portae hepatis",
    systems: ["cardiovascular"],
    depth: 41,
    plate: 1,
    aliases: ["portal vein"],
    overview: "The vein that carries blood from the gut, pancreas, and spleen to the liver. It is not a branch of the vena cava.",
    sections: [
      { title: "Course", paragraphs: [
        "The superior mesenteric and splenic veins meet behind the neck of the pancreas to form the portal vein. It climbs to the porta hepatis and divides into right and left branches beside the hepatic artery and the bile duct. Inside the liver the blood enters sinusoids, meets hepatocytes, and leaves by hepatic veins into the inferior vena cava. There are two capillary beds in series: one in the gut, one in the liver. That is what 'portal' means.",
      ]},
      { title: "Function", paragraphs: [
        "This is how absorbed sugars and amino acids reach the liver before the rest of the body, and how the liver can detoxify what the gut has taken up. Pressure in the portal vein is normally low, well under the pressure in the cava. If flow through the liver is blocked, pressure rises and blood seeks other routes, through veins at the lower esophagus, the umbilicus, and the rectum. Those collateral routes are the clinical face of portal hypertension.",
      ]},
    ],
    related: ["liver", "small-intestine", "spleen", "vena-cava"],
  },
  trachea: {
    name: "Trachea",
    latin: "Trachea",
    systems: ["respiratory"],
    depth: 17,
    plate: 1,
    aliases: ["windpipe"],
    overview: "The airway from the larynx to the bronchi. It splits at the carina, about at the sternal angle, and the right bronchus is the steeper of the two.",
    stats: [
      { label: "Length", value: "~10–12 cm" },
      { label: "Start", value: "C6" },
      { label: "Carina", value: "T4–T5" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The wall is a stack of C-shaped hyaline cartilages, open at the back, where trachealis muscle and connective tissue complete the tube. The lining is ciliated pseudostratified columnar epithelium with mucus glands. Cilia beat debris upward toward the pharynx.",
        "At the carina it divides. The right main bronchus is shorter, wider, and more vertical than the left, so an inhaled object more often enters the right lung. The left bronchus passes under the aortic arch. The carina is extremely sensitive; touching it triggers a cough.",
      ]},
      { title: "Function", paragraphs: [
        "The trachea is a conducting airway. No gas exchange happens here. Its cartilage keeps it from collapsing when inspiration lowers the pressure inside the chest. The posterior muscle can narrow the airway a little during cough, raising the speed of the expired jet so mucus is thrown off the wall.",
      ]},
    ],
    related: ["larynx", "lung", "esophagus"],
  },
  larynx: {
    name: "Larynx",
    latin: "Larynx",
    systems: ["respiratory"],
    depth: 14,
    plate: 1,
    aliases: ["voice box"],
    overview: "The voice box at the top of the trachea. It guards the airway during swallowing and produces sound.",
    sections: [
      { title: "Structure", paragraphs: [
        "The framework is cartilage. The thyroid cartilage is a shield, open at the back; its anterior ridge is the laryngeal prominence, typically larger when testosterone has acted on the cartilage at puberty. Below it sits the cricoid, the only complete ring. Arytenoid cartilages perch on the cricoid and swing the vocal ligaments. The epiglottis is an elastic flap that tips over the inlet during swallowing.",
        "The vocal folds are mucous membrane over the vocal ligaments. The gap between them is the rima glottidis. Above them is a vestibular fold, the false cord, which does not make the voice.",
      ]},
      { title: "Function", paragraphs: [
        "During swallowing the larynx rises, the epiglottis covers the inlet, and the vocal folds close. That keeps food in the esophagus, which lies behind. For speech, expired air sets the folds vibrating. Pitch rises when the cricothyroid muscle tenses them, and it falls when other intrinsic muscles shorten and slacken them. Louder speech is mostly higher air pressure, not a different muscle. The recurrent laryngeal nerves, branches of the vagus, supply most of the intrinsic muscles. The left one loops under the aortic arch, which is why chest disease can change the voice.",
      ]},
    ],
    related: ["trachea", "thyroid", "esophagus"],
  },
  lung: {
    name: "Lung",
    latin: "Pulmo",
    systems: ["respiratory"],
    depth: 26,
    plate: 1,
    aliases: ["lungs", "pulmonary"],
    overview: "The organs of gas exchange. The right lung has three lobes; the left has two, and a notch for the heart.",
    stats: [
      { label: "Tidal breath", value: "~500 mL" },
      { label: "Alveoli", value: "hundreds of millions" },
      { label: "Right lobes", value: "3" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "Each lung sits in its own pleural sac: visceral pleura on the lung, parietal pleura on the chest wall, and a thin film of fluid between them. The right lung has upper, middle, and lower lobes, divided by a horizontal and an oblique fissure. The left has upper and lower lobes and an oblique fissure; its upper lobe includes the lingula, and its front edge is notched for the heart.",
        "The hilum admits a main bronchus, a pulmonary artery, and two pulmonary veins, with bronchiolar vessels and lymphatics. Bronchi branch to bronchioles. Conducting airways end at the terminal bronchiole. Respiratory bronchioles, alveolar ducts, and alveolar sacs are where gas is exchanged.",
      ]},
      { title: "The exchange surface", paragraphs: [
        "Alveoli number in the hundreds of millions. Type I cells are thin and make the wall. Type II cells make surfactant, a phospholipid film that lowers surface tension so small alveoli do not collapse. Macrophages patrol the air space. The barrier a gas molecule crosses is the type I cell, a shared basement membrane, and the capillary endothelium, well under a micrometer in the thin parts.",
      ]},
      { title: "Physiology", paragraphs: [
        "Quiet inspiration is diaphragm and, to a lesser extent, external intercostals. A typical quiet breath moves about 500 milliliters. Total lung capacity averages higher in larger bodies, often near 6 liters in men and lower in women, mostly tracking body size. Not all of a breath reaches alveoli: anatomic dead space in the airways is about 150 milliliters.",
        "Oxygen in alveolar air diffuses into capillary blood and binds hemoglobin. Carbon dioxide, produced by tissues, travels in blood mostly as bicarbonate and diffuses out into the alveolus. Pulmonary arterial pressure is low, about a fifth of systemic pressure, which keeps the thin exchange surface from being flooded. Airway and blood-flow are matched locally: low oxygen constricts lung arterioles and sends blood toward better-ventilated alveoli.",
      ]},
    ],
    related: ["trachea", "heart", "diaphragm"],
  },
  esophagus: {
    name: "Esophagus",
    latin: "Oesophagus",
    systems: ["digestive"],
    depth: 46,
    plate: 1,
    aliases: ["food pipe", "gullet"],
    overview: "The muscular tube from the pharynx to the stomach. It lies behind the trachea and then behind the heart, and it crosses the diaphragm at about T10.",
    stats: [
      { label: "Length", value: "~25 cm" },
      { label: "Start", value: "C6" },
      { label: "Through diaphragm", value: "T10" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The esophagus begins where the pharynx ends, at the lower border of the cricoid cartilage. It descends behind the trachea, slightly left of midline, passes behind the left main bronchus and the left atrium, and enters the abdomen to meet the stomach. The upper third of its muscle is skeletal, the lower third smooth, and the middle mixed. The lining is stratified squamous, built for abrasion, not for acid.",
        "In the thorax it has adventitia rather than a serosal coat, so disease spreads along it more readily than from an organ wrapped in peritoneum. Three places are narrower: at the start, where the aortic arch and left bronchus cross, and at the diaphragm.",
      ]},
      { title: "Function", paragraphs: [
        "Swallowing begins under voluntary control and then a peristaltic wave takes over. An upper sphincter keeps air out of the esophagus at rest. A lower sphincter, more a zone of pressure than a thick anatomical ring, keeps acid in the stomach. It relaxes as the swallow arrives and then closes. The vagus carries the parasympathetic supply that coordinates this.",
      ]},
    ],
    related: ["stomach", "trachea", "diaphragm"],
  },
  stomach: {
    name: "Stomach",
    latin: "Gaster",
    systems: ["digestive"],
    depth: 28,
    plate: 1,
    aliases: ["gaster", "gastric"],
    overview: "A muscular reservoir under the left dome of the diaphragm. It churns food, starts protein digestion, and meters chyme into the duodenum.",
    sections: [
      { title: "Structure", paragraphs: [
        "Regions are the cardia at the esophageal opening, the dome-like fundus, the body, and the pyloric antrum and canal. The lesser curvature faces the liver; the greater curvature faces the spleen and the colon. Folds called rugae flatten as the stomach fills. A pyloric sphincter times emptying. The lining is simple columnar epithelium that dives into gastric pits and glands.",
        "Parietal cells secrete hydrochloric acid and intrinsic factor. Chief cells secrete pepsinogen. Mucous cells protect the surface. G cells in the antrum release gastrin into the blood. Enterochromaffin-like cells release histamine locally, which pushes parietal cells harder. The wall follows the usual gut plan: mucosa, submucosa, a muscularis with an extra inner oblique layer, and serosa.",
      ]},
      { title: "Function", paragraphs: [
        "Acid brings the lumen toward pH 1.5 to 3.5, which kills many swallowed microbes and converts pepsinogen to pepsin. Pepsin begins protein digestion. Intrinsic factor is required later, in the ileum, for vitamin B12 absorption. The stomach absorbs little food; alcohol and some drugs are exceptions. Churning produces chyme, which the pylorus releases in spurts as the duodenum signals with hormones and nerves that it can cope.",
        "Three phases set secretion. The cephalic phase is vagal, triggered by the sight and smell of food. The gastric phase is stretch and peptides in the lumen. The intestinal phase is mostly inhibitory, so a full duodenum slows the stomach down.",
      ]},
    ],
    related: ["esophagus", "liver", "pancreas", "small-intestine"],
  },
  liver: {
    name: "Liver",
    latin: "Hepar",
    systems: ["digestive"],
    depth: 30,
    plate: 1,
    aliases: ["hepar", "hepatic"],
    overview: "The largest gland, under the right dome of the diaphragm. It makes bile, builds and breaks down fuel, and filters what the portal vein brings from the gut.",
    stats: [
      { label: "Mass", value: "~1.2–1.5 kg" },
      { label: "Portal blood", value: "~75%" },
      { label: "Segments", value: "8" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "Anatomical lobes are right, left, caudate, and quadrate. The falciform ligament and the ligamentum teres, a remnant of the umbilical vein, mark the front. Functionally the liver is eight segments, each with its own branch of the portal vein, hepatic artery, and bile duct. That segmental map, not the surface lobes, is what surgeons follow.",
        "The porta hepatis admits the portal vein and the hepatic artery and lets the bile duct leave. Inside, plates of hepatocytes line sinusoids. A classical lobule is a hexagon with a central vein and portal triads at the corners: a branch each of portal vein, hepatic artery, and bile duct. Kupffer cells in the sinusoids are macrophages. Stellate cells in the space of Disse store vitamin A and, when the liver is injured, lay down scar.",
      ]},
      { title: "Function", paragraphs: [
        "Hepatocytes make bile, which emulsifies fat. They store glycogen, make glucose when the fast is long, build urea from amino-acid nitrogen, make most plasma proteins including albumin and the clotting factors, and run the cytochrome enzymes that modify drugs and toxins. They store iron, copper, and the fat-soluble vitamins. Blood leaving the sinusoids enters central veins, then hepatic veins, then the inferior vena cava. Bile flows the other way, into canaliculi and out the ducts.",
        "About three quarters of hepatic blood is venous blood from the portal vein, low in oxygen but rich in absorbed nutrients. The hepatic artery supplies the rest, and most of the oxygen. There is no second liver. Loss of a large share of it is survivable because hepatocytes can regenerate, but acute failure of what remains is not something any other organ can cover.",
      ]},
    ],
    related: ["gallbladder", "portal-vein", "stomach", "vena-cava"],
  },
  gallbladder: {
    name: "Gallbladder",
    latin: "Vesica biliaris",
    systems: ["digestive"],
    depth: 22,
    plate: 1,
    aliases: ["gall bladder", "cholecyst"],
    overview: "A pear-shaped sac on the underside of the liver. It stores and concentrates bile and empties it into the duodenum after a meal.",
    sections: [
      { title: "Structure", paragraphs: [
        "Fundus, body, and neck lead to the cystic duct, which joins the common hepatic duct to form the common bile duct. The fundus often lies near the tip of the right ninth costal cartilage. The lining is folded so the sac can expand. It holds on the order of 30 to 50 milliliters, and it concentrates bile by absorbing water.",
      ]},
      { title: "Function", paragraphs: [
        "Bile salts, made by the liver from cholesterol, emulsify dietary fat so lipase can reach it. Most of those salts are reabsorbed in the terminal ileum and returned to the liver, an enterohepatic circulation. Between meals the sphincter at the duodenal papilla is closed and bile backs up into the gallbladder. Fat and protein in the duodenum release cholecystokinin, which contracts the gallbladder and relaxes the sphincter. Bilirubin, a breakdown product of heme, gives bile its color and leaves the body in the stool.",
      ]},
    ],
    related: ["liver", "small-intestine", "pancreas"],
  },
  "small-intestine": {
    name: "Small intestine",
    latin: "Intestinum tenue",
    systems: ["digestive"],
    depth: 29,
    plate: 1,
    aliases: ["duodenum", "jejunum", "ileum"],
    overview: "The long, coiled tube where most chemical digestion and almost all nutrient absorption happen.",
    stats: [
      { label: "In life", value: "~3–5 m" },
      { label: "Duodenum", value: "~25 cm" },
      { label: "Surface", value: "Folds, villi, microvilli" },
    ],
    sections: [
      { title: "Regions", paragraphs: [
        "The duodenum is short, C-shaped, and mostly retroperitoneal. It receives chyme, bile, and pancreatic juice at the major papilla. Brunner glands in its submucosa secrete alkaline mucus. The jejunum and ileum are peritoneal and hang on a mesentery. The jejunum has a richer circular fold pattern and does much of the absorption. The ileum ends at the ileocecal valve. Its wall carries Peyer patches of lymphoid tissue, and it is the site that absorbs the intrinsic-factor–B12 complex and reclaims bile salts.",
        "Length in a living person is often about 3 to 5 meters. A dissected intestine is longer because its muscle has relaxed. Circular folds, villi, and the microvilli of the brush border multiply the surface.",
      ]},
      { title: "Physiology", paragraphs: [
        "Pancreatic enzymes and brush-border enzymes finish the breakdown of starch, protein, and fat. Monosaccharides and amino acids enter capillaries in the villus. Fats are reassembled and leave in lacteals as chylomicrons. Segmentation mixes chyme; peristalsis moves it on. Secretin and cholecystokinin, released by duodenal cells, coordinate bile and pancreatic juice with the meal. Water follows the absorbed solutes, so the intestine also reclaims several liters of secreted fluid each day.",
      ]},
    ],
    related: ["stomach", "large-intestine", "pancreas", "liver"],
  },
  "large-intestine": {
    name: "Large intestine",
    latin: "Intestinum crassum",
    systems: ["digestive"],
    depth: 27,
    plate: 1,
    aliases: ["colon", "bowel"],
    overview: "The wider, shorter bowel around the small intestine. It reclaims water and salt and stores feces.",
    stats: [
      { label: "Length", value: "~1.5 m" },
      { label: "Parts", value: "Colon and rectum" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The cecum, with the appendix, sits in the right iliac fossa. The colon ascends, turns at the hepatic flexure, crosses as the transverse colon, turns at the splenic flexure, descends, and becomes the sigmoid colon, then the rectum and anal canal. Three bands of longitudinal muscle, the taeniae coli, pucker the wall into haustra. Small fat tags, the omental appendices, dot the surface.",
        "There are no villi. Mucus glands lubricate the contents. The ileocecal valve slows backflow. The anal canal has an internal sphincter of smooth muscle and an external sphincter of skeletal muscle under the pudendal nerve.",
      ]},
      { title: "Function", paragraphs: [
        "About a liter of fluid may enter from the small intestine each day; most of the water and salt is absorbed, leaving a few hundred grams of stool. Bacteria ferment leftover carbohydrate and make a modest amount of vitamin K and some B vitamins. Mass movements a few times a day, often after a meal, shift contents toward the sigmoid. Stretch of the rectum brings the urge to defecate. The drawing frames the small intestine with this bowel so both can be selected.",
      ]},
    ],
    related: ["small-intestine", "appendix", "liver"],
  },
  appendix: {
    name: "Appendix",
    latin: "Appendix vermiformis",
    systems: ["digestive"],
    depth: 31,
    plate: 1,
    aliases: ["vermiform appendix"],
    overview: "A narrow worm of lymphoid tissue on the cecum, in the right lower abdomen.",
    sections: [
      { title: "Structure", paragraphs: [
        "The appendix opens off the cecum below the ileocecal junction. It is usually a few centimeters to about ten long, and its position varies: often behind the cecum, sometimes into the pelvis, sometimes in front of the ileum. The surface landmark called McBurney's point, one third of the way from the anterior superior iliac spine to the umbilicus, is only a guide to the base.",
        "Its wall is rich in lymphoid follicles, especially in childhood. One hypothesis is that it shelters a reservoir of gut bacteria that can recolonize the colon after diarrhea. That is a hypothesis, not a settled function. What is settled is that a blocked, inflamed appendix can perforate, because the organ is a blind tube with a thin wall.",
      ]},
    ],
    related: ["large-intestine", "small-intestine"],
  },
  kidney: {
    name: "Kidney",
    latin: "Ren",
    systems: ["urinary"],
    depth: 50,
    plate: 1,
    aliases: ["ren", "renal"],
    overview: "A retroperitoneal filter on each side of the spine. It sets the volume, ion content, and pH of the blood, and it makes several hormones.",
    stats: [
      { label: "GFR", value: "~120 mL/min" },
      { label: "Filtered daily", value: "~180 L" },
      { label: "Urine", value: "~1–2 L" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The kidneys lie on the posterior abdominal wall, from about T12 to L3. The right kidney sits lower than the left because of the liver. A hilum on the medial border admits the renal artery and vein and lets the ureter leave. The right renal artery is usually longer; the left renal vein is usually longer and receives the left gonadal and left adrenal veins.",
        "A cortex surrounds pyramids of medulla. Papillae drip urine into minor calyces, then a major calyx, the renal pelvis, and the ureter. The ureter is about 25 centimeters, retroperitoneal, and enters the bladder obliquely so that bladder pressure closes it. It is narrow at the pelvis, at the pelvic brim, and at the bladder wall. Each kidney drawn here includes its ureter down toward the bladder.",
      ]},
      { title: "The nephron", paragraphs: [
        "Each kidney has about a million nephrons. A glomerulus is a knot of capillaries inside Bowman's capsule. The filter is fenestrated endothelium, a basement membrane, and the slit diaphragms between podocyte feet. Water, ions, glucose, and small metabolites pass. Cells and most plasma protein stay in the blood.",
        "The proximal tubule reabsorbs about two thirds of the filtrate, including essentially all of the glucose in health, by active transport of sodium and water that follows. The loop of Henle multiplies a salty gradient in the medulla, up toward 1200 milliosmoles per liter in the inner medulla. The distal tubule and collecting duct are where aldosterone saves sodium and where antidiuretic hormone inserts aquaporins so water can follow the medullary gradient. Without ADH, a large volume of dilute urine leaves.",
      ]},
      { title: "Beyond filtration", paragraphs: [
        "Juxtaglomerular cells release renin when pressure falls, when the macula densa senses less sodium chloride, or when sympathetic nerves fire. Renin starts the cascade to angiotensin II, which constricts vessels, releases aldosterone, and promotes thirst and ADH. The kidney also makes erythropoietin, which drives red-cell production, and it activates vitamin D by a final hydroxylation. About 180 liters are filtered each day and about 1 to 2 liters become urine. The difference is reabsorption, not a failure to drink.",
      ]},
    ],
    related: ["bladder", "adrenal", "aorta", "vena-cava"],
  },
  bladder: {
    name: "Urinary bladder",
    latin: "Vesica urinaria",
    systems: ["urinary"],
    depth: 22,
    plate: 0.9,
    aliases: ["bladder"],
    overview: "A muscular reservoir for urine in the anterior pelvis, directly behind the pubic bones.",
    stats: [
      { label: "Urge often near", value: "300–400 mL" },
      { label: "Lining", value: "Transitional" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The empty bladder is a pyramid behind the pubis. As it fills it rises into the abdomen. The detrusor is the smooth muscle of the wall. At the base, a smooth triangle, the trigone, runs between the two ureteric orifices and the internal urethral orifice. The lining is transitional epithelium, built to stretch and to keep urine out of the wall.",
        "In females the bladder sits in front of the uterus and vagina, and the urethra is short, about 4 centimeters, which is one reason ascending infection is more common. In males the prostate surrounds the first part of a much longer urethra. On both plates the bladder is drawn a little low so the organs behind it remain visible; in life it is the anterior organ of the two.",
      ]},
      { title: "Emptying", paragraphs: [
        "Stretch receptors trigger a parasympathetic reflex, from the pelvic splanchnic nerves at S2 to S4, that contracts the detrusor and relaxes the internal sphincter. The external urethral sphincter is skeletal muscle under the pudendal nerve and is the part a person can hold closed. Sympathetic fibers allow the bladder to fill without contracting. Continence is the balance of those three.",
      ]},
    ],
    related: ["kidney", "uterus", "prostate"],
  },
  "uterine-tube": {
    name: "Uterine tube",
    latin: "Tuba uterina",
    systems: ["reproductive"],
    sex: "female",
    depth: 36,
    plate: 1,
    aliases: ["fallopian tube", "oviduct"],
    overview: "The paired tube that carries the oocyte from ovary to uterus. Fertilization, when it happens, is usually in its ampulla.",
    sections: [
      { title: "Structure", paragraphs: [
        "Each tube is about 10 centimeters. From the uterus outward the parts are a short intramural segment, a narrow isthmus, a wide ampulla, and an infundibulum fringed with fimbriae. The fimbriae are not attached to the ovary. At ovulation they sweep over its surface and the current of cilia draws the oocyte in. The lining is ciliated columnar epithelium with secretory peg cells.",
      ]},
      { title: "Function", paragraphs: [
        "Cilia and peristalsis move the oocyte toward the uterus over several days. Sperm swim the other way. The ampulla is the usual meeting place. A conceptus that implants in the tube instead of the uterus cannot come to term there and can rupture the tube. That is why tubal anatomy is taught with its clinical risk, not only as a passageway.",
      ]},
    ],
    related: ["ovary", "uterus"],
  },
  uterus: {
    name: "Uterus",
    latin: "Uterus",
    systems: ["reproductive"],
    sex: "female",
    depth: 34,
    plate: 1,
    aliases: ["womb"],
    overview: "A hollow muscular organ between the bladder and the rectum. It receives the conceptus, houses the pregnancy, and sheds its lining each cycle if no pregnancy occurs.",
    sections: [
      { title: "Structure", paragraphs: [
        "The parts are fundus, body, isthmus, and cervix. The cervical canal opens at an internal os into the uterus and an external os into the vagina. The usual position is anteverted and anteflexed, folded forward over the bladder, though a retroverted uterus is a common variant. The wall has a perimetrium where peritoneum covers it, a thick myometrium of smooth muscle, and an endometrium.",
        "The endometrium has a basal layer that stays and a functional layer that grows and is shed. The broad ligament is a drape of peritoneum, not the main support. The cardinal ligaments at the cervix, and the uterosacral ligaments, hold the uterus up. The round ligaments run to the labia majora through the inguinal canals and help keep the anteverted tilt.",
      ]},
      { title: "Cycle and pregnancy", paragraphs: [
        "Estrogen from the growing follicle makes the functional layer proliferate. After ovulation, progesterone from the corpus luteum makes the glands secretory and ready for an embryo. If implantation does not occur, hormone levels fall and the functional layer is shed as menses. A typical cycle is often described as 28 days. Many healthy cycles are shorter or longer.",
        "If an embryo implants, the endometrium becomes the maternal side of the placenta. The myometrium grows enormously, stays quiet under progesterone for most of pregnancy, and becomes responsive to oxytocin near term. Blood reaches the uterus mainly by the uterine arteries from the internal iliac arteries, with a contribution from the ovarian arteries.",
      ]},
    ],
    related: ["ovary", "uterine-tube", "vagina", "bladder"],
  },
  vagina: {
    name: "Vagina",
    latin: "Vagina",
    systems: ["reproductive"],
    sex: "female",
    depth: 32,
    plate: 1,
    aliases: ["birth canal"],
    overview: "The fibromuscular canal from the cervix to the vestibule. It lies behind the bladder and urethra and in front of the rectum.",
    sections: [
      { title: "Structure", paragraphs: [
        "The canal is about 7 to 9 centimeters along its posterior wall, shorter in front. The cervix projects into its upper end, leaving fornices around that projection. The lining is non-keratinized stratified squamous epithelium, folded into rugae in the relaxed state. Glycogen from the epithelial cells feeds lactobacilli, which keep the lumen acidic. The vagina has no glands of its own. Lubrication is a transudate through the wall, plus mucus from the cervix and secretions from the greater vestibular glands at the opening.",
      ]},
      { title: "Function", paragraphs: [
        "It receives the penis during intercourse, carries menstrual outflow, and is the soft-tissue birth canal. Its wall stretches because of rugae and because the surrounding tissue is elastic. Arteries come from the vaginal, uterine, and internal pudendal vessels. Lymph from the upper vagina tends toward iliac nodes; the lowest part drains toward inguinal nodes.",
      ]},
    ],
    related: ["uterus", "bladder"],
  },
  mammary: {
    name: "Mammary gland",
    aspect: "anterior",
    latin: "Glandula mammaria",
    systems: ["reproductive", "integumentary"],
    sex: "female",
    depth: 5,
    plate: 0.95,
    aliases: ["breast", "mammary"],
    overview: "A modified sweat gland in the superficial fascia of the chest. It makes milk under hormonal control after pregnancy.",
    sections: [
      { title: "Structure", paragraphs: [
        "Each breast contains about 15 to 20 lobes of glandular tissue draining through lactiferous ducts toward the nipple. A lactiferous sinus just deep to the nipple can hold a little milk. Suspensory ligaments of connective tissue run from the dermis to the fascia and shape the breast. The nipple and areola have smooth muscle and sebaceous glands. Arteries arrive from the internal thoracic and lateral thoracic vessels.",
        "Most lymph drains to the axillary nodes, with a share to nodes along the internal thoracic artery. That drainage is why the axilla is examined when the breast is diseased. The glands sit on pectoralis major, over ribs 2 to 6, and are anterior to the chest wall. On this plate they are drawn laterally so the heart and medial lungs remain visible. Males have rudimentary ducts along the same milk line; glandular growth in a male is gynecomastia and is a hormonal event, not a separate organ.",
      ]},
      { title: "Function", paragraphs: [
        "Estrogen grows the ducts at puberty. Progesterone, with estrogen, develops the lobules. In pregnancy both expand the gland. Prolactin from the pituitary drives milk production. Oxytocin, released when the infant nurses, contracts myoepithelial cells and ejects the milk. Colostrum in the first days is rich in antibodies and lower in fat than mature milk.",
      ]},
    ],
    related: ["pectoralis", "lymph-nodes", "pituitary", "skin"],
  },
  "ductus-deferens": {
    name: "Ductus deferens",
    latin: "Ductus deferens",
    systems: ["reproductive"],
    sex: "male",
    depth: 27,
    plate: 1,
    aliases: ["vas deferens"],
    overview: "The muscular tube that carries sperm from the epididymis to the ejaculatory duct. It is the structure divided in a vasectomy.",
    sections: [
      { title: "Course", paragraphs: [
        "It begins at the tail of the epididymis, ascends in the spermatic cord through the inguinal canal, crosses the pelvic brim, and runs along the lateral wall of the pelvis. It then passes behind the bladder, enlarges as an ampulla, and joins the duct of the seminal vesicle to form the ejaculatory duct. The ejaculatory duct crosses the prostate and opens into the prostatic urethra.",
        "The wall is thick smooth muscle with a narrow lumen, which is why the cord feels like a hard wire inside the softer vessels. Seminal vesicles, posterior to the bladder and not drawn as separate organs on this anterior plate, add a fructose-rich fluid. The duct itself stores and propels sperm; it does not make the bulk of the semen.",
      ]},
      { title: "Function", paragraphs: [
        "Sympathetic nerves cause strong peristalsis at emission, delivering sperm into the urethra to mix with secretions of the seminal vesicles, prostate, and bulbourethral glands. Sperm removed from the testis are not yet good swimmers. Maturation happens in the epididymis; the ductus is the rapid-transit segment after that.",
      ]},
    ],
    related: ["testis", "prostate", "penis"],
  },
  prostate: {
    name: "Prostate",
    latin: "Prostata",
    systems: ["reproductive"],
    sex: "male",
    depth: 30,
    plate: 1,
    aliases: ["prostate gland"],
    overview: "A gland the size of a walnut under the bladder, wrapped around the first part of the male urethra. Its secretion is part of semen.",
    stats: [
      { label: "Young adult mass", value: "~20–30 g" },
      { label: "Surrounds", value: "Prostatic urethra" },
    ],
    sections: [
      { title: "Structure", paragraphs: [
        "The base lies against the bladder neck and the apex against the pelvic floor. The prostatic urethra passes through it, and the ejaculatory ducts enter its posterior wall to open beside a mound called the seminal colliculus. Zones used in pathology differ from the older lobe names. The peripheral zone is the largest and the usual site of carcinoma. The transition zone around the urethra is the usual site of benign enlargement. An anterior fibromuscular stroma contains little gland.",
      ]},
      { title: "Function", paragraphs: [
        "Prostatic fluid is slightly alkaline and contains enzymes, including prostate-specific antigen, that keep semen fluid after ejaculation. The alkalinity helps sperm in the acidic vagina. Growth and function depend on androgens, especially dihydrotestosterone made in the gland from testosterone. The gland often enlarges with age and can obstruct the urethra it surrounds. That is a disease of the transition zone, distinct from the cancers that usually begin farther out.",
      ]},
    ],
    related: ["bladder", "ductus-deferens", "penis", "testis"],
  },
  penis: {
    name: "Penis",
    aspect: "anterior",
    latin: "Penis",
    systems: ["reproductive"],
    sex: "male",
    depth: 3,
    plate: 1,
    aliases: ["phallus"],
    overview: "The male organ of copulation and the outlet of the urethra. Two erectile bodies and a third that carries the urethra make up the shaft.",
    sections: [
      { title: "Structure", paragraphs: [
        "The root is fixed in the perineum: two crura along the pubic arch, and a bulb in the midline. The free body, or shaft, ends in the glans. Paired corpora cavernosa fill with blood for erection. A single corpus spongiosum, on the underside, contains the spongy urethra and expands distally as the glans, so the urethra stays open when the other bodies are rigid. A dense tunica albuginea surrounds the cavernosa. The drawing is a flat anterior diagram: shaft, glans, and the line of the urethra.",
        "The male urethra has three parts. The prostatic part crosses the prostate. The short membranous part crosses the pelvic floor and is the least dilatable. The spongy part runs the length of the corpus spongiosum and opens at the tip of the glans. The scrotum, the cutaneous sac around the testes, is outlined around them on this plate.",
      ]},
      { title: "Erection and emission", paragraphs: [
        "Erection is a parasympathetic event from the pelvic splanchnic nerves, S2 to S4. Nitric oxide relaxes the smooth muscle of the helicine arteries and the trabeculae. The cavernosa fill, the veins under the tunica are compressed, and blood is trapped. Emission of semen into the urethra is sympathetic. Ejaculation proper is rhythmic contraction of the bulbospongiosus muscle, supplied by the pudendal nerve. Detumescence is sympathetic vasoconstriction and the escape of the trapped blood.",
        "Arterial supply is from the internal pudendal artery. Sensory nerves are branches of the pudendal nerve. The clitoris, on the female plate, uses the same cavernous mechanism on a smaller scale and with a different anatomy.",
      ]},
    ],
    related: ["testis", "prostate", "bladder", "ductus-deferens"],
  },
  eye: {
    name: "Eye",
    latin: "Oculus",
    aspect: "anterior",
    systems: ["nervous"],
    depth: 2,
    plate: 1,
    aliases: ["eyeball", "globe", "oculus"],
    overview: "The organ of vision. A lens focuses light on a retina of photoreceptors, and the optic nerve carries that signal to the brain.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The wall has three coats. The outer fibrous coat is sclera and, in front, the clear cornea. The middle vascular coat is the choroid, the ciliary body, and the iris, whose pupil lets light in. The inner coat is the retina. A lens, held by zonular fibers, changes shape for near focus. Aqueous humor fills the chamber in front of the lens. Vitreous humor fills the chamber behind it.",
        "Rods serve dim light. Cones serve color and detail and concentrate at the fovea. Axons of retinal ganglion cells leave at the optic disc, the blind spot, as the optic nerve. The nerve is sheathed by meninges and is really a tract of the central nervous system. Most fibers cross in the optic chiasm.",
      ]},
    ],
    related: ["brain", "skull"],
  },
  pharynx: {
    name: "Pharynx",
    latin: "Pharynx",
    systems: ["digestive", "respiratory"],
    depth: 36,
    plate: 1,
    aliases: ["throat"],
    overview: "The shared muscular passage behind the nasal cavity, the mouth, and the larynx. Food and air both cross it.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Three parts stack from above: nasopharynx, oropharynx, and laryngopharynx. The soft palate closes the nasopharynx in swallowing. Palatine tonsils sit in the side walls of the oropharynx. Constrictor muscles, supplied by the vagus, squeeze a bolus downward. The laryngopharynx opens forward into the larynx and continues down as the esophagus.",
      ]},
    ],
    related: ["larynx", "esophagus", "trachea"],
  },
  parotid: {
    name: "Parotid gland",
    latin: "Glandula parotidea",
    systems: ["digestive"],
    depth: 8,
    plate: 0.9,
    aliases: ["parotid"],
    overview: "The largest salivary gland, wrapped on the ramus of the mandible in front of the ear. Its watery saliva reaches the mouth opposite the second upper molar.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The gland is serous. The parotid duct crosses the masseter, pierces buccinator, and opens into the vestibule of the mouth. The facial nerve enters the gland and splits into its five terminal branches inside it, so surgery here risks the muscles of the face. Secretion is driven by parasympathetic fibers that hitchhike along the glossopharyngeal nerve and the auriculotemporal nerve.",
      ]},
    ],
    related: ["submandibular", "pharynx"],
  },
  submandibular: {
    name: "Submandibular gland",
    latin: "Glandula submandibularis",
    systems: ["digestive"],
    depth: 10,
    plate: 0.9,
    aliases: ["submandibular", "submaxillary"],
    overview: "A mixed salivary gland under the mandible. It makes most of the resting saliva.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The gland is mostly serous, with mucous acini. Its duct runs forward along the floor of the mouth and opens beside the frenulum of the tongue. Parasympathetic secretomotor fibers travel in the chorda tympani, a branch of the facial nerve, and synapse in the submandibular ganglion. A smaller sublingual gland sits beside the duct and opens by many short ducts.",
      ]},
    ],
    related: ["parotid", "pharynx"],
  },
  epiglottis: {
    name: "Epiglottis",
    latin: "Epiglottis",
    systems: ["respiratory"],
    depth: 14,
    plate: 1,
    aliases: ["epiglottis"],
    overview: "A leaf of elastic cartilage at the entrance of the larynx. It folds over the airway during swallowing.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The leaf stands behind the tongue and in front of the laryngeal inlet, attached by its stem to the thyroid cartilage. In swallowing, the hyoid and the larynx rise and the epiglottis tips back, so the bolus passes into the piriform recesses and the esophagus rather than the trachea. It is not a lid that one closes by will. Taste buds dot its surface.",
      ]},
    ],
    related: ["larynx", "pharynx", "trachea"],
  },
  bronchus: {
    name: "Main bronchus",
    latin: "Bronchus principalis",
    systems: ["respiratory"],
    depth: 26,
    plate: 1,
    aliases: ["bronchi", "bronchus"],
    overview: "The two airways from the trachea into the lungs. The right is shorter, wider, and steeper than the left.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The trachea splits at the carina, about at the sternal angle. The right main bronchus runs a shorter, more vertical course, which is why an inhaled object more often enters the right lung. The left crosses under the aortic arch and is longer. Each main bronchus divides into lobar bronchi, then segmental bronchi, and the wall loses its cartilage only at the bronchioles. The lining is ciliated, and mucus moves dust up toward the pharynx.",
      ]},
    ],
    related: ["trachea", "lung", "larynx"],
  },
  "pulmonary-trunk": {
    name: "Pulmonary trunk",
    latin: "Truncus pulmonalis",
    systems: ["cardiovascular"],
    depth: 22,
    plate: 1,
    aliases: ["pulmonary artery"],
    overview: "The great artery of the right ventricle. It carries venous blood to the lungs and splits into right and left pulmonary arteries.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The trunk leaves the right ventricle behind the pulmonary valve, runs up and to the left, and divides under the aortic arch. The ligamentum arteriosum, a remnant of the fetal ductus arteriosus, ties it to the underside of the arch. Pressure in this circuit is about a fifth of aortic pressure, so the wall is thinner than the aorta's. Pulmonary veins, usually four, return oxygenated blood to the left atrium. They are not branches of this trunk.",
      ]},
    ],
    related: ["heart", "lung", "aorta"],
  },
  "bile-duct": {
    name: "Bile duct",
    latin: "Ductus choledochus",
    systems: ["digestive"],
    depth: 28,
    plate: 1,
    aliases: ["common bile duct", "choledochus"],
    overview: "The duct that carries bile from the liver and the gallbladder into the duodenum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Right and left hepatic ducts join as the common hepatic duct. The cystic duct from the gallbladder meets it, and the common bile duct continues down in the free edge of the lesser omentum, behind the duodenum, and into the head of the pancreas. It usually joins the pancreatic duct in a shared ampulla that opens on the major duodenal papilla. A sphincter there stays closed between meals, so bile backs up the cystic duct into the gallbladder.",
      ]},
    ],
    related: ["liver", "gallbladder", "duodenum", "pancreas"],
  },
  duodenum: {
    name: "Duodenum",
    latin: "Duodenum",
    systems: ["digestive"],
    depth: 32,
    plate: 1,
    aliases: ["duodenum"],
    overview: "The first and shortest part of the small intestine, a C-shaped loop around the head of the pancreas. Bile and pancreatic juice enter here.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Four parts are described: a short cap beside the pylorus, a descending part that receives the ampulla, a horizontal part that crosses the great vessels, and an ascending part that turns forward at the duodenojejunal flexure. Most of it is retroperitoneal. Brunner glands in the wall secrete alkaline mucus that protects the lining from acid. Iron and calcium absorption are especially associated with this segment.",
      ]},
    ],
    related: ["stomach", "pancreas", "bile-duct", "small-intestine"],
  },
  rectum: {
    name: "Rectum",
    latin: "Rectum",
    systems: ["digestive"],
    depth: 34,
    plate: 1,
    aliases: ["rectum"],
    overview: "The pelvic continuation of the sigmoid colon, in front of the sacrum and behind the bladder. It stores feces until defecation.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The rectum follows the curve of the sacrum and then turns back at the anorectal flexure, a bend held by the puborectalis sling. Unlike the colon, it has no taeniae and no omental appendices. Transverse folds, the rectal valves, mark the lining. The anal canal below it is lined by stratified squamous epithelium and is held closed by internal smooth and external striated sphincters. Distension of the rectum is the signal for the defecation reflex.",
      ]},
    ],
    related: ["large-intestine", "bladder"],
  },
  ureter: {
    name: "Ureter",
    latin: "Ureter",
    systems: ["urinary"],
    depth: 40,
    plate: 1,
    aliases: ["ureter"],
    overview: "The muscular tube from each kidney to the bladder. Peristalsis, not gravity, drives the urine.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Each ureter is about 25 centimeters long. It leaves the renal pelvis at the hilum, runs down on the psoas, crosses the pelvic brim at the bifurcation of the common iliac artery, and enters the bladder wall obliquely. That oblique tunnel acts as a valve: as the bladder fills, it pinches the ureter shut so urine does not reflux. Narrowings at the pelviureteric junction, the pelvic brim, and the bladder wall are where a stone tends to lodge.",
      ]},
    ],
    related: ["kidney", "bladder"],
  },
  urethra: {
    name: "Urethra",
    latin: "Urethra",
    systems: ["urinary"],
    depth: 12,
    plate: 1,
    aliases: ["urethra"],
    overview: "The outlet from the bladder. In the female it is short and separate from the genital tract. In the male it is long and also carries semen.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The female urethra is about 4 centimeters and opens in the vestibule, in front of the vaginal opening. Its shortness is part of why bladder infection reaches women more readily. The male urethra has prostatic, membranous, and spongy parts. The membranous part, where it crosses the pelvic floor, is the least dilatable. The spongy part runs in the corpus spongiosum to the tip of the glans. An internal sphincter of smooth muscle at the bladder neck is involuntary. The external sphincter, striated and supplied by the pudendal nerve, is the one under voluntary control.",
      ]},
    ],
    related: ["bladder", "prostate", "penis", "vulva"],
  },
  epididymis: {
    name: "Epididymis",
    latin: "Epididymis",
    aspect: "anterior",
    sex: "male",
    systems: ["reproductive"],
    depth: 5,
    plate: 1,
    aliases: ["epididymis"],
    overview: "The coiled tube on the posterolateral side of each testis. Sperm mature here and are stored until emission.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The head caps the upper pole of the testis and receives the efferent ductules. The body and tail continue as a single highly coiled duct, several meters long if unwound, and the tail turns upward as the ductus deferens. Sperm that leave the testis cannot yet swim well or fertilize. Passage through the epididymis, over days, adds that capacity. The wall is smooth muscle, and sympathetic contraction at emission empties the tail into the ductus.",
      ]},
    ],
    related: ["testis", "ductus-deferens"],
  },
  "seminal-vesicle": {
    name: "Seminal vesicle",
    latin: "Glandula vesiculosa",
    sex: "male",
    systems: ["reproductive"],
    depth: 30,
    plate: 1,
    aliases: ["seminal vesicle"],
    overview: "A paired gland behind the bladder. Its secretion is most of the volume of semen and is rich in fructose.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Each vesicle is a coiled sac, not a store of sperm. The duct of the vesicle joins the ductus deferens to form the ejaculatory duct, which crosses the prostate and opens in the prostatic urethra. Fructose feeds the sperm. Prostaglandins and coagulating proteins are in the same fluid. The vesicles lie above the prostate and in front of the rectum, which is why they can be felt through the anterior rectal wall.",
      ]},
    ],
    related: ["prostate", "ductus-deferens", "bladder"],
  },
  parathyroid: {
    name: "Parathyroid glands",
    latin: "Glandulae parathyroideae",
    systems: ["endocrine"],
    depth: 18,
    plate: 1,
    aliases: ["parathyroid"],
    overview: "Four small glands on the back of the thyroid. Their hormone is the minute-to-minute defense of blood calcium.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Usually two superior and two inferior glands sit on the posterior thyroid, each about the size of a lentil. Chief cells secrete parathyroid hormone when ionized calcium in the blood falls. The hormone raises calcium by telling bone to release it, the kidney to keep it and to activate vitamin D, and the gut, through that vitamin, to absorb more. Calcitonin from the thyroid's C cells pushes the other way, but in adult humans parathyroid hormone is the dominant control. Removing all four glands causes tetany as calcium falls.",
      ]},
    ],
    related: ["thyroid", "kidney"],
  },
  pineal: {
    name: "Pineal gland",
    latin: "Glandula pinealis",
    systems: ["endocrine", "nervous"],
    depth: 46,
    plate: 1,
    aliases: ["pineal", "epiphysis"],
    overview: "A small midline gland on the back of the third ventricle. It secretes melatonin and marks the night.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The gland is a dorsal outgrowth of the diencephalon. Pinealocytes make melatonin from serotonin, and release rises in the dark under sympathetic input that has been relayed from the retina through the suprachiasmatic nucleus. Melatonin signals night length to the rest of the body. In many adults the gland calcifies, which makes it a useful midline marker on a radiograph. It does not, despite an old reputation, house the soul.",
      ]},
    ],
    related: ["brain", "pituitary"],
  },
  cerebellum: {
    name: "Cerebellum",
    latin: "Cerebellum",
    systems: ["nervous"],
    depth: 48,
    plate: 0.7,
    aliases: ["cerebellum", "little brain"],
    overview: "The folded hindbrain under the occipital lobes. It times movement, holds balance, and stores motor skill. It does not initiate the movement.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "A narrow vermis lies in the midline, with a hemisphere on each side. The surface is folia, and the cortex is a sheet of gray matter over white matter and deep nuclei. Three pairs of peduncles tie it to the brainstem: the inferior brings sensory maps of the body and of the inner ear, the middle brings a copy of the intended movement from the cerebral cortex by way of the pons, and the superior carries the correction out. Damage makes movement clumsy and the gait wide, with intention tremor, rather than paralysis.",
      ]},
    ],
    related: ["brain", "spinal-cord"],
  },
  "thoracic-duct": {
    name: "Thoracic duct",
    latin: "Ductus thoracicus",
    systems: ["lymphatic"],
    depth: 44,
    plate: 1,
    aliases: ["thoracic duct"],
    overview: "The main lymph channel. It returns lymph from most of the body to the venous blood at the root of the neck.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The duct begins at the cisterna chyli, in front of the upper lumbar vertebrae, and ascends through the aortic opening of the diaphragm. In the chest it lies between the aorta and the azygos vein, then crosses toward the left and empties into the junction of the left subclavian and internal jugular veins. It carries all lymph except that from the right upper limb, the right thorax, and the right side of the head and neck, which uses a short right lymphatic duct. After a fatty meal the lymph in it, chyle, is milky with absorbed triglyceride.",
      ]},
    ],
    related: ["lymph-nodes", "aorta", "vena-cava"],
  },
  vulva: {
    name: "Vulva",
    latin: "Vulva",
    aspect: "anterior",
    sex: "female",
    systems: ["reproductive"],
    depth: 3,
    plate: 1,
    aliases: ["vulva", "pudendum", "labia", "clitoris"],
    overview: "The external female genitalia. Labia enclose a vestibule that receives the urethra and the vagina, and the clitoris is the erectile organ at its front.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The mons and the labia majora are folds of skin and fat. The labia minora are thinner folds without hair, and they meet in front at the clitoris. The clitoris has crura, a body, and a glans, built of corpora cavernosa like the penis but not traversed by the urethra. Between the minora is the vestibule: the urethral opening in front, the vaginal opening behind it, and the ducts of the greater vestibular glands at the sides. Those glands lubricate the opening. The same parasympathetic mechanism that erects the penis engorges the clitoris and the vestibular bulbs.",
        "The drawing is a flat anterior diagram of the labia and the glans, at the scale of the other pelvic organs. It is not a portrait of an individual body.",
      ]},
    ],
    related: ["vagina", "urethra", "uterus", "ovary"],
  },
  ear: {
    name: "Ear",
    latin: "Auricula",
    systems: ["integumentary"],
    depth: 4,
    plate: 1,
    aliases: ["pinna", "auricle", "external ear"],
    overview: "The pinna of the external ear. Elastic cartilage under skin collects sound and turns it into the external acoustic meatus.",
    stats: [
      { label: "Length", value: "~6–6.5 cm" },
      { label: "Cartilage", value: "Elastic" },
    ],
    sections: [
      { title: "Structure and function", paragraphs: [
        "The helix is the outer rim. Inside it, the antihelix splits above into two crura around the triangular fossa. The tragus overlaps the front of the opening, the antitragus faces it, and the lobule below is fat and fibrous tissue rather than cartilage. The hollow concha leads into the external acoustic meatus, a canal of about 2.5 cm that ends at the tympanic membrane. A little wax from ceruminous glands, and the S-shape of the canal, keep debris off that membrane.",
        "The pinna funnels sound and adds a spectral cue the brain uses for elevation and for front-versus-back. The middle-ear ossicles, malleus, incus, and stapes, sit deeper, inside the temporal bone, and are not drawn as separate bones here. The same outline is used on the posterior plate, where the medial folds are hidden.",
      ]},
    ],
    related: ["skull", "eye"],
  },
  thumb: {
    name: "Thumb",
    latin: "Pollex",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["pollex", "first digit"],
    overview: "The first digit of the hand. It has two phalanges and a saddle joint at the wrist that lets the pad meet the other fingers.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The thumb metacarpal meets the trapezium in a saddle-shaped carpometacarpal joint. That joint flexes, extends, abducts, adducts, and rotates, which together are opposition. Distal to it are only two phalanges, a proximal and a distal, unlike the three in each other finger. The thenar muscles, abductor pollicis brevis, flexor pollicis brevis, and opponens pollicis, shape the ball of the thumb. Flexor pollicis longus is the long flexor, and it has its own tendon sheath.",
        "The thumb stands on the radial side of the hand, the same side as the radius. Its nail is drawn on the anterior plate. Opposition is what makes a precision grip against the index finger and a power grip across the palm.",
      ]},
    ],
    related: ["index-finger", "radius", "little-finger"],
  },
  "index-finger": {
    name: "Index finger",
    latin: "Digitus secundus",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["index", "forefinger", "second digit"],
    overview: "The second digit. With the thumb it is the main digit of precision grip, and it has an extensor of its own.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Three phalanges, proximal, middle, and distal, meet at hinge joints. The proximal phalanx also meets the metacarpal head at a condyloid joint that allows a little side-to-side motion as well as flexion. Extensor indicis joins the extensor digitorum tendon on the back of the hand, which is why this finger can point while the others stay flexed. Flexor digitorum superficialis inserts on the middle phalanx and flexor digitorum profundus on the distal phalanx, the deep tendon passing through a split in the superficial one.",
        "On the plate the three phalanges are the bone segments inside the digit, and the nail sits on the distal phalanx in the anterior view.",
      ]},
    ],
    related: ["thumb", "middle-finger", "radius"],
  },
  "middle-finger": {
    name: "Middle finger",
    latin: "Digitus medius",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["middle", "third digit", "long finger"],
    overview: "The third and longest digit. Its metacarpal is the axis used to name abduction and adduction of the fingers.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Like the index and ring fingers it has three phalanges. Movement away from its axis, in either direction, is abduction; movement back toward it is adduction. Interossei and lumbricals flex the metacarpophalangeal joints and extend the interphalangeal joints, which is the position used to hold a flat object. The long flexors and extensor digitorum supply the stronger sweep of a fist and of opening the hand.",
      ]},
    ],
    related: ["index-finger", "ring-finger"],
  },
  "ring-finger": {
    name: "Ring finger",
    latin: "Digitus annularis",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["ring", "fourth digit"],
    overview: "The fourth digit. It shares tendon slips with its neighbors, so it moves less freely on its own than the index finger.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Three phalanges, the same joint pattern as the index and middle fingers. Extensor digitorum sends it a tendon that is tied to the tendons of the middle and little fingers by juncturae on the back of the hand, which limits independent extension. Its profundus tendon is often partly fused with the middle finger's, so the two flex together. The name annularis is the older anatomical word for this digit.",
      ]},
    ],
    related: ["middle-finger", "little-finger"],
  },
  "little-finger": {
    name: "Little finger",
    latin: "Digitus minimus manus",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["little finger", "pinky", "fifth digit"],
    overview: "The fifth digit, on the ulnar side of the hand. Hypothenar muscles give it a small share of the opposition the thumb has.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Three short phalanges. Abductor digiti minimi, flexor digiti minimi brevis, and opponens digiti minimi form the hypothenar eminence and are supplied, with most of the small muscles of the hand, by the ulnar nerve. That nerve's sensory branch also serves the ulnar one and a half digits. The little finger helps lock a power grip against the palm and widens the span of the hand.",
      ]},
    ],
    related: ["ring-finger", "ulna", "thumb"],
  },
  hallux: {
    name: "Great toe",
    latin: "Hallux",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["big toe", "hallux", "first toe"],
    overview: "The first toe. Two phalanges, set on the medial side of the foot, and the digit that pushes off in walking.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The hallux has a proximal and a distal phalanx, like the thumb, and a metatarsal that bears much of the forefoot load. Two small sesamoids usually sit under the metatarsal head in the tendons of flexor hallucis brevis; they are not given separate outlines here. Flexor hallucis longus, from the calf, flexes the toe. Extensor hallucis longus lifts it. In gait the weight rolls onto this toe at push-off. A bunion is a drift of this metatarsal and toe toward the midline of the body, with a swollen joint on the medial side.",
      ]},
    ],
    related: ["second-toe", "tibia"],
  },
  "second-toe": {
    name: "Second toe",
    latin: "Digitus secundus pedis",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["second toe", "long toe"],
    overview: "The second toe. Often the longest toe, and one of the lesser toes that share the work of balance on the forefoot.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Three phalanges. Extensor digitorum longus and brevis lift it, and flexor digitorum longus and brevis curl it. The second metatarsal is seated tightly against the cuneiforms, so this ray is a relatively fixed axis of the forefoot. The plate draws the phalanges as one bone line inside the toe, with the nail on the anterior view.",
      ]},
    ],
    related: ["hallux", "third-toe"],
  },
  "third-toe": {
    name: "Third toe",
    latin: "Digitus tertius pedis",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["third toe"],
    overview: "The middle lesser toe. Three phalanges, sharing the long flexor and extensor tendons of the lateral toes.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The third toe is narrower than the second and longer than the fifth. Its joints are the same hinge pattern: metatarsophalangeal, proximal interphalangeal, and distal interphalangeal. Interossei and lumbricals of the foot balance flexion at the ball of the foot against extension of the toe joints, which keeps the toes on the ground during stance rather than clawing.",
      ]},
    ],
    related: ["second-toe", "fourth-toe"],
  },
  "fourth-toe": {
    name: "Fourth toe",
    latin: "Digitus quartus pedis",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["fourth toe"],
    overview: "The fourth toe. A lesser toe of three phalanges, on the lateral side of the forefoot.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It receives a slip of flexor digitorum longus and of extensor digitorum longus. The tendon of the long flexor crosses in the sole, so the lateral toes are pulled from the medial side of the ankle. With the little toe it widens the base that shares load when the foot rocks onto the forefoot.",
      ]},
    ],
    related: ["third-toe", "little-toe"],
  },
  "little-toe": {
    name: "Little toe",
    latin: "Digitus minimus pedis",
    systems: ["skeletal", "integumentary"],
    depth: 8,
    plate: 1,
    aliases: ["little toe", "fifth toe", "pinky toe"],
    overview: "The fifth toe, on the lateral edge of the foot. The shortest toe, with three small phalanges.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Abductor digiti minimi and flexor digiti minimi brevis, in the sole, move this toe and support the lateral arch. The fifth metatarsal base is the bump on the outer foot and the insertion of peroneus brevis. The toe itself is small, but the ray it sits on is part of the lateral column that shares weight with the heel and the great toe.",
      ]},
    ],
    related: ["fourth-toe", "fibula", "hallux"],
  },
  "rib-1": {
    name: "First rib",
    latin: "Costa prima",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib","ribs","rib cage"],
    overview: "The shortest, broadest, and most curved rib. It sits under the clavicle and carries grooves for the subclavian vessels.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Its head meets T1 only. A scalene tubercle separates the groove for the subclavian vein in front from the groove for the subclavian artery and the lower trunk of the brachial plexus behind. The shaft is flat, so this rib is easy to hide behind the clavicle on an anterior plate.",
      ]},
    ],
    related: ["rib-2","clavicle","sternum"],
  },
  "rib-2": {
    name: "Second rib",
    latin: "Costa secunda",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "About twice the length of the first. Serratus anterior takes part of its origin from a tuberosity on the shaft.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The head meets T1 and T2. The tuberosity for serratus anterior is a useful landmark when counting ribs on the living chest, because the second costal cartilage meets the sternum at the sternal angle.",
      ]},
    ],
    related: ["rib-1","rib-3","sternum"],
  },
  "rib-3": {
    name: "Third rib",
    latin: "Costa tertia",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A typical true rib, with its own costal cartilage reaching the sternum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Head, neck, tubercle, and a shaft that slopes down and forward. The costal groove on the inner lower edge holds the intercostal vein, artery, and nerve, vein uppermost.",
      ]},
    ],
    related: ["rib-2","rib-4","sternum"],
  },
  "rib-4": {
    name: "Fourth rib",
    latin: "Costa quarta",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A typical true rib in the mid-chest, sloping down from the thoracic spine toward the sternum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The tubercle meets the transverse process of its own vertebra. External intercostal muscle lifts the shaft during inspiration; internal intercostal muscle can draw it down.",
      ]},
    ],
    related: ["rib-3","rib-5","lung"],
  },
  "rib-5": {
    name: "Fifth rib",
    latin: "Costa quinta",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A typical true rib. The nipple in the male often lies near this level, though that is a surface landmark, not an attachment.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The shaft is long enough to give the mid-thorax most of its side-to-side width when the rib is raised. The costal cartilage still reaches the sternum on its own.",
      ]},
    ],
    related: ["rib-4","rib-6","lung"],
  },
  "rib-6": {
    name: "Sixth rib",
    latin: "Costa sexta",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A typical true rib, one of the longer ribs of the cage.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Its cartilage reaches the sternum. The neurovascular bundle in the groove is why a chest tube is passed along the upper border of a rib, not the lower border, where the vessels and nerve sit.",
      ]},
    ],
    related: ["rib-5","rib-7","lung"],
  },
  "rib-7": {
    name: "Seventh rib",
    latin: "Costa septima",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "The last true rib. It is often the longest, and it is the last rib with a cartilage of its own to the sternum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Ribs below this one borrow the seventh cartilage to reach the front of the chest. The seventh cartilage is the start of the costal margin that can be felt sloping up toward the sternum.",
      ]},
    ],
    related: ["rib-6","rib-8","sternum"],
  },
  "rib-8": {
    name: "Eighth rib",
    latin: "Costa octava",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "The first false rib. Its cartilage joins the cartilage of the seventh instead of meeting the sternum itself.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The head meets the demifacets of T7 and T8. With the ninth and tenth ribs it forms the costal margin, the lower edge of the front of the cage.",
      ]},
    ],
    related: ["rib-7","rib-9","sternum"],
  },
  "rib-9": {
    name: "Ninth rib",
    latin: "Costa nona",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A false rib in the costal margin. Its cartilage runs up into the cartilage above.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The shaft is still a typical rib, with a groove for the intercostal vessels and nerve. The liver lies deep to the right ninth rib; the spleen lies deep to the left.",
      ]},
    ],
    related: ["rib-8","rib-10","liver"],
  },
  "rib-10": {
    name: "Tenth rib",
    latin: "Costa decima",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "The last rib of the costal margin. Below it the abdominal wall has no bony front.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Its cartilage joins the margin rather than the sternum. The tip of the tenth costal cartilage is a common surface landmark for the upper abdomen.",
      ]},
    ],
    related: ["rib-9","rib-11","diaphragm"],
  },
  "rib-11": {
    name: "Eleventh rib",
    latin: "Costa undecima",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "A floating rib. It has no cartilage to the sternum or to the rib above, and it ends in the abdominal wall.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The head usually meets T11 only. The neck and tubercle are slight. The end of the shaft is tipped with a cap of cartilage buried in muscle, including quadratus lumborum and the diaphragm.",
      ]},
    ],
    related: ["rib-10","rib-12","diaphragm"],
  },
  "rib-12": {
    name: "Twelfth rib",
    latin: "Costa duodecima",
    systems: ["skeletal"],
    depth: 16,
    plate: 0.5,
    aliases: ["rib"],
    overview: "The shortest floating rib. It has no neck and no tubercle, and it does not reach the front of the abdomen.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Quadratus lumborum, the diaphragm, and transversus abdominis attach to it. The kidney lies in front of its medial end, which is why a low twelfth rib matters in approaches to the kidney from behind.",
      ]},
    ],
    related: ["rib-11","kidney","diaphragm"],
  },
  "sacrum": {
    name: "Sacrum",
    latin: "Os sacrum",
    systems: ["skeletal"],
    depth: 40,
    plate: 0.85,
    aliases: [],
    overview: "Five fused vertebrae forming the back wall of the pelvis. It locks the two hip bones to the spine.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The promontory is the front lip of the first sacral body and the back of the pelvic inlet. Alae spread to the sacroiliac joints. The sacral canal continues the vertebral canal and opens at the sacral hiatus. Anterior and posterior foramina pass the sacral nerves. A female sacrum is, on average, shorter and wider than a male one. On the posterior plate the dorsal surface and the sacral crests face the viewer.",
      ]},
    ],
    related: ["coccyx","pelvis","vertebral-column"],
  },
  "coccyx": {
    name: "Coccyx",
    latin: "Os coccygis",
    systems: ["skeletal"],
    depth: 36,
    plate: 0.9,
    aliases: [],
    overview: "The tail bone, usually three to five fused pieces below the sacrum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is a remnant of the tail. Gluteus maximus and the pelvic floor, including coccygeus and part of levator ani, attach to it. It does not bear weight. A fall onto the buttocks can injure the joint between sacrum and coccyx.",
      ]},
    ],
    related: ["sacrum","gluteus-maximus","pelvis"],
  },
  "mandible": {
    name: "Mandible",
    latin: "Mandibula",
    systems: ["skeletal"],
    depth: 12,
    plate: 0.8,
    aliases: [],
    overview: "The lower jaw, and the only freely movable bone of the skull. It hinges and glides at the temporomandibular joints.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The body carries the lower teeth. A ramus rises on each side to a condyle, which meets the temporal bone, and a coronoid process, which takes temporalis. Masseter covers the outer ramus. The mental foramen, on the body, passes the mental nerve to the chin and lower lip. The angle of the jaw is what you feel at the back of the cheek.",
      ]},
    ],
    related: ["skull","masseter","hyoid"],
  },
  "hyoid": {
    name: "Hyoid",
    latin: "Os hyoideum",
    systems: ["skeletal"],
    depth: 8,
    plate: 1,
    aliases: [],
    overview: "A U-shaped bone in the front of the neck. It is the only bone in the body that does not meet another bone.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "A body and two greater horns face backward. Suprahyoid muscles pull it up and forward during swallowing; infrahyoid muscles steady it. The larynx hangs from it by the thyrohyoid membrane, so the hyoid moves when you swallow. It sits at about the level of the third cervical vertebra.",
      ]},
    ],
    related: ["mandible","larynx","tongue"],
  },
  "calcaneus": {
    name: "Calcaneus",
    latin: "Calcaneus",
    systems: ["skeletal"],
    depth: 14,
    plate: 1,
    aliases: ["heel","heel bone","os calcis"],
    overview: "The heel bone, and the largest bone of the foot. The Achilles tendon inserts on its back.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The tuberosity is the back of the heel you stand on. A shelf on the medial side, the sustentaculum tali, holds the headward part of the talus. The front meets the cuboid. The bone is short and wide, not a long bone, which is why the heel reads as a block under the ankle rather than as another toe ray. On the posterior view it is the superficial bone of the heel.",
      ]},
    ],
    related: ["talus","cuboid","gastrocnemius"],
  },
  "talus": {
    name: "Talus",
    latin: "Talus",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: ["ankle bone","astragalus"],
    overview: "The ankle bone. It sits in the mortise between the tibia and the fibula and passes the body's weight to the heel and the midfoot.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The trochlea on top is wider in front than behind, so the ankle is more stable in dorsiflexion. The head points forward and medially into the navicular. No muscle attaches to the talus. Its blood supply is easily interrupted by a fracture of the neck, which is why that injury is treated with care.",
      ]},
    ],
    related: ["calcaneus","tibia","navicular"],
  },
  "navicular": {
    name: "Navicular",
    latin: "Os naviculare",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: [],
    overview: "The boat-shaped bone on the medial midfoot, between the head of the talus and the three cuneiforms.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Tibialis posterior inserts on its tuberosity, which can be felt just below and in front of the medial malleolus. A sesamoid or an accessory navicular sometimes sits in that tendon. The bone's job is to pass load from the talus into the medial arch.",
      ]},
    ],
    related: ["talus","medial-cuneiform","tibialis-anterior"],
  },
  "cuboid": {
    name: "Cuboid",
    latin: "Os cuboideum",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: [],
    overview: "The cube-like bone on the lateral midfoot, between the calcaneus and the fourth and fifth metatarsals.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "A groove on its plantar face holds the tendon of peroneus longus as that tendon crosses under the foot to the medial cuneiform and the first metatarsal. The cuboid is the keystone of the lateral column of the foot.",
      ]},
    ],
    related: ["calcaneus","metatarsal-5","metatarsal-4"],
  },
  "medial-cuneiform": {
    name: "Medial cuneiform",
    latin: "Os cuneiforme mediale",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: ["first cuneiform"],
    overview: "The largest of the three wedge-shaped cuneiforms. It sits under the first metatarsal.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The wedge is arranged so the broad face is dorsal, which helps keep the transverse arch. It meets the navicular behind, the intermediate cuneiform beside it, and the first metatarsal in front. Part of tibialis anterior and peroneus longus insert nearby.",
      ]},
    ],
    related: ["navicular","metatarsal-1","intermediate-cuneiform"],
  },
  "intermediate-cuneiform": {
    name: "Intermediate cuneiform",
    latin: "Os cuneiforme intermedium",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: ["second cuneiform"],
    overview: "The smallest cuneiform, wedged between the medial and lateral cuneiforms under the second metatarsal.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is recessed, so the base of the second metatarsal sits back into a socket. That lock is one reason the second ray is a relatively fixed axis of the forefoot.",
      ]},
    ],
    related: ["medial-cuneiform","lateral-cuneiform","metatarsal-2"],
  },
  "lateral-cuneiform": {
    name: "Lateral cuneiform",
    latin: "Os cuneiforme laterale",
    systems: ["skeletal"],
    depth: 16,
    plate: 1,
    aliases: ["third cuneiform"],
    overview: "The lateral wedge of the cuneiform row, under the third metatarsal and against the cuboid.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It completes the row that turns the navicular's load into the medial three metatarsals. Its side against the cuboid is the boundary between the medial and lateral columns of the foot.",
      ]},
    ],
    related: ["intermediate-cuneiform","cuboid","metatarsal-3"],
  },
  "metatarsal-1": {
    name: "First metatarsal",
    latin: "Os metatarsale I",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.95,
    aliases: ["first metatarsal"],
    overview: "The shortest and thickest metatarsal. It carries the great toe and a large share of the push-off load.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Two sesamoids usually sit under its head, in the tendons of flexor hallucis brevis. The head is what you feel as the ball of the foot on the medial side. A bunion is a drift of this bone toward the midline, with the toe drifting the other way.",
      ]},
    ],
    related: ["hallux","medial-cuneiform","metatarsal-2"],
  },
  "metatarsal-2": {
    name: "Second metatarsal",
    latin: "Os metatarsale II",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.95,
    aliases: [],
    overview: "The longest metatarsal. Its base is locked between the cuneiforms.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Because the base sits back in a mortise, this ray moves less than the first or the fifth. Stress injury of the second metatarsal shaft is a classic march fracture.",
      ]},
    ],
    related: ["second-toe","intermediate-cuneiform","metatarsal-1"],
  },
  "metatarsal-3": {
    name: "Third metatarsal",
    latin: "Os metatarsale III",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.95,
    aliases: [],
    overview: "The metatarsal of the third toe, between the second and fourth rays.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It meets the lateral cuneiform. With its neighbors it forms the transverse arch of the forefoot, higher in the middle than at the sides when the foot is unloaded.",
      ]},
    ],
    related: ["third-toe","lateral-cuneiform","metatarsal-2"],
  },
  "metatarsal-4": {
    name: "Fourth metatarsal",
    latin: "Os metatarsale IV",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.95,
    aliases: [],
    overview: "The metatarsal of the fourth toe. Its base meets the cuboid.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is part of the lateral column, with the fifth metatarsal and the cuboid, and shares forefoot load as the heel lifts.",
      ]},
    ],
    related: ["fourth-toe","cuboid","metatarsal-5"],
  },
  "metatarsal-5": {
    name: "Fifth metatarsal",
    latin: "Os metatarsale V",
    systems: ["skeletal"],
    depth: 18,
    plate: 0.95,
    aliases: ["fifth metatarsal"],
    overview: "The lateral metatarsal. A tuberosity at its base is the bump on the outer foot.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Peroneus brevis inserts on that tuberosity. A twisting injury can pull the base off, or break the shaft just beyond it. The bone then runs forward to the little toe.",
      ]},
    ],
    related: ["little-toe","cuboid","metatarsal-4"],
  },
  "scaphoid": {
    name: "Scaphoid",
    latin: "Os scaphoideum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: ["navicular of the hand"],
    overview: "The boat-shaped bone on the thumb side of the proximal carpal row. It is the carpal most often broken by a fall on the outstretched hand.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The long axis runs from a proximal pole, next to the radius, toward a tubercle at the thumb. Blood reaches the proximal pole from the distal end, so a fracture across the waist can leave the proximal piece short of blood. Tenderness in the anatomical snuffbox points to this bone.",
      ]},
    ],
    related: ["lunate","trapezium","radius"],
  },
  "lunate": {
    name: "Lunate",
    latin: "Os lunatum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: [],
    overview: "The crescent-shaped carpal in the middle of the proximal row, between the scaphoid and the triquetrum.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Its distal cup holds the head of the capitate. A lunate that leaves the row usually goes forward, into the carpal tunnel. Like the scaphoid, its blood supply can be interrupted, and the bone can then collapse. That collapse is Kienböck disease.",
      ]},
    ],
    related: ["scaphoid","capitate","triquetrum"],
  },
  "triquetrum": {
    name: "Triquetrum",
    latin: "Os triquetrum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: ["triquetral"],
    overview: "The pyramidal carpal on the ulnar side of the proximal row, under the pisiform.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It meets the lunate on its radial side and the hamate distally. The triangular fibrocartilage of the wrist lies just proximal to it. On the plate it is the ulnar bone of the first carpal row.",
      ]},
    ],
    related: ["lunate","pisiform","hamate"],
  },
  "pisiform": {
    name: "Pisiform",
    latin: "Os pisiforme",
    aspect: "anterior",
    systems: ["skeletal"],
    depth: 6,
    plate: 1,
    aliases: [],
    overview: "A small sesamoid on the front of the triquetrum, inside the tendon of flexor carpi ulnaris.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is a bone of the anterior wrist, so it is drawn on the anterior plate and not on the back of the hand. It is one of the four bony corners of the carpal tunnel, with the tubercle of the scaphoid and the hook of the hamate. The ulnar nerve and artery pass just on its ulnar side.",
      ]},
    ],
    related: ["triquetrum","hamate","ulna"],
  },
  "trapezium": {
    name: "Trapezium",
    latin: "Os trapezium",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: [],
    overview: "The carpal under the thumb. Its distal surface is the saddle that the first metacarpal moves on.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The saddle joint is what lets the thumb oppose. A ridge on the palmar face is the lateral wall of the carpal tunnel and the attachment of the flexor retinaculum. Flexor carpi radialis runs in a groove against it.",
      ]},
    ],
    related: ["scaphoid","metacarpal-1","trapezoid"],
  },
  "trapezoid": {
    name: "Trapezoid",
    latin: "Os trapezoideum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: [],
    overview: "The small wedge of the distal carpal row under the index metacarpal.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is the least mobile unit of the mid-carpus. The index metacarpal is seated firmly on it, which is why the index finger is a stable post for the thumb to work against.",
      ]},
    ],
    related: ["trapezium","capitate","metacarpal-2"],
  },
  "capitate": {
    name: "Capitate",
    latin: "Os capitatum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: [],
    overview: "The largest carpal, and the axis the wrist rotates around. Its round head sits in the cup of the lunate and scaphoid.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The third metacarpal, which often has a styloid process, locks onto its distal face. Because the capitate is central, a line through its head is used as the axis of the hand when abduction and adduction of the wrist are described.",
      ]},
    ],
    related: ["lunate","hamate","metacarpal-3"],
  },
  "hamate": {
    name: "Hamate",
    latin: "Os hamatum",
    systems: ["skeletal"],
    depth: 12,
    plate: 1,
    aliases: ["unciform"],
    overview: "The ulnar bone of the distal carpal row. A hook on its palmar face is a pulley for the ulnar side of the carpal tunnel.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The hook is what you can feel in the hypothenar palm, just distal to the pisiform. The ulnar nerve and artery curve around it. The fourth and fifth metacarpals meet its distal face, and those two rays are the mobile side of the hand.",
      ]},
    ],
    related: ["capitate","triquetrum","metacarpal-5"],
  },
  "metacarpal-1": {
    name: "First metacarpal",
    latin: "Os metacarpale I",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.95,
    aliases: [],
    overview: "The metacarpal of the thumb. It is short, thick, and rotated so that its pad faces the other fingers.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The base is the saddle against the trapezium. Flexion at that joint swings the thumb across the palm. Two phalanges, not three, sit beyond its head. The thenar muscles cloak the shaft.",
      ]},
    ],
    related: ["thumb","trapezium","metacarpal-2"],
  },
  "metacarpal-2": {
    name: "Second metacarpal",
    latin: "Os metacarpale II",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.95,
    aliases: [],
    overview: "The metacarpal of the index finger. It is the firm radial post of the palm.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Its base meets the trapezoid and is braced by the trapezium and the capitate, so this ray barely moves at the carpometacarpal joint. The head is the knuckle of the index finger.",
      ]},
    ],
    related: ["index-finger","trapezoid","metacarpal-3"],
  },
  "metacarpal-3": {
    name: "Third metacarpal",
    latin: "Os metacarpale III",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.95,
    aliases: [],
    overview: "The middle metacarpal. A styloid process on the base locks it to the capitate.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It is the axis bone of the palm. Extensor carpi radialis brevis inserts on the dorsum of the base. The head is the middle knuckle.",
      ]},
    ],
    related: ["middle-finger","capitate","metacarpal-2"],
  },
  "metacarpal-4": {
    name: "Fourth metacarpal",
    latin: "Os metacarpale IV",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.95,
    aliases: [],
    overview: "The metacarpal of the ring finger. Its base meets the hamate and the capitate.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It moves a little more at the carpometacarpal joint than the index or middle rays, which lets the ring finger fold into the palm with the little finger.",
      ]},
    ],
    related: ["ring-finger","hamate","metacarpal-5"],
  },
  "metacarpal-5": {
    name: "Fifth metacarpal",
    latin: "Os metacarpale V",
    systems: ["skeletal"],
    depth: 14,
    plate: 0.95,
    aliases: [],
    overview: "The metacarpal of the little finger, on the ulnar edge of the palm.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Opponens digiti minimi rotates it toward the thumb. The carpometacarpal joint is the most mobile of the finger rays. A fracture of the neck, with the head tilting toward the palm, is the common boxer's fracture.",
      ]},
    ],
    related: ["little-finger","hamate","metacarpal-4"],
  },
  "nasal-cavity": {
    name: "Nasal cavity",
    latin: "Cavitas nasi",
    systems: ["respiratory"],
    depth: 10,
    plate: 0.85,
    aliases: ["nose","nasal passage"],
    overview: "The airway inside the nose. It warms, wets, and filters air on the way to the pharynx, and it holds the olfactory mucosa.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "A septum, cartilage in front and bone behind, divides it into two passages. On each lateral wall, three turbinates — inferior, middle, and superior — stir the air so it meets mucosa. The paranasal sinuses and the nasolacrimal duct open here. The back of the cavity is the choana, which opens into the nasopharynx. The plate shows the cavity in the nasal aperture, with the septum as the midline.",
      ]},
    ],
    related: ["pharynx","skull","larynx"],
  },
  "tongue": {
    name: "Tongue",
    latin: "Lingua",
    aspect: "anterior",
    systems: ["digestive"],
    depth: 6,
    plate: 1,
    aliases: ["lingua","glossus"],
    overview: "A muscular organ in the floor of the mouth. It moves food, shapes speech, and carries most of the taste buds.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Intrinsic muscles change its shape. Extrinsic muscles — genioglossus, hyoglossus, styloglossus, and palatoglossus — move it in the mouth and anchor it to the mandible, hyoid, and styloid process. The anterior two thirds taste by the facial nerve and feel by the trigeminal nerve. The posterior third tastes and feels mainly by the glossopharyngeal nerve. A median sulcus on the dorsum marks the septum inside. The drawing is the body of the tongue seen from the front, above the mandible.",
      ]},
    ],
    related: ["mandible","hyoid","pharynx"],
  },
  "cecum": {
    name: "Cecum",
    latin: "Caecum",
    systems: ["digestive"],
    depth: 22,
    plate: 0.9,
    aliases: ["caecum","blind gut"],
    overview: "The blind pouch that begins the large intestine, in the right iliac fossa. The appendix hangs from it.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The ileum opens into the medial side through the ileocecal valve, which slows reflux back into the small intestine. The cecum itself has no mesentery in the adult; it sits against the abdominal wall. From its upper end the ascending colon climbs toward the liver. On the plate the pouch is the rounded start of the colon, just above the appendix.",
      ]},
    ],
    related: ["appendix","large-intestine","small-intestine"],
  },
  "cisterna-chyli": {
    name: "Cisterna chyli",
    latin: "Cisterna chyli",
    systems: ["lymphatic"],
    depth: 40,
    plate: 1,
    aliases: ["cistern of chyle"],
    overview: "A thin-walled sac in front of the upper lumbar vertebrae. It is the start of the thoracic duct.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Intestinal and lumbar lymph trunks empty into it. After a fatty meal the lymph here, chyle, is milky. The thoracic duct leaves its upper end, passes through the aortic opening of the diaphragm, and climbs to the left venous angle in the neck. The sac is small and variable; some people have a plexus of trunks instead of one chamber.",
      ]},
    ],
    related: ["thoracic-duct","aorta","lymph-nodes"],
  },
  "hypothalamus": {
    name: "Hypothalamus",
    latin: "Hypothalamus",
    systems: ["endocrine","nervous"],
    depth: 30,
    plate: 1,
    aliases: ["hypothalamic"],
    overview: "The floor of the forebrain, just above the pituitary. It ties the nervous system to the endocrine system.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Nuclei here set thirst, hunger, temperature, sleep, and much of the autonomic outflow. Some neurons release hormones into the pituitary portal blood so the anterior pituitary secretes, or not. Others, in the supraoptic and paraventricular nuclei, make antidiuretic hormone and oxytocin, which travel down axons to the posterior pituitary. The plate marks it as the thin region on the underside of the brain, directly above the pituitary stalk.",
      ]},
    ],
    related: ["pituitary","brain","pineal"],
  },
  "carotid": {
    name: "Carotid artery",
    latin: "Arteria carotis",
    systems: ["cardiovascular"],
    depth: 12,
    plate: 1,
    aliases: ["common carotid","carotid"],
    overview: "The paired arteries of the neck. Each common carotid splits into an internal carotid to the brain and an external carotid to the face and scalp.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "The right common carotid leaves the brachiocephalic trunk. The left leaves the aortic arch directly. Both climb beside the trachea and divide at about the upper border of the thyroid cartilage. The carotid sinus at the split measures blood pressure. The carotid body beside it measures oxygen. The internal carotid has no branches in the neck. The external carotid supplies the thyroid, tongue, face, and scalp. On the plate the common carotid is the artery just off the midline of the neck.",
      ]},
    ],
    related: ["jugular","aorta","thyroid"],
  },
  "jugular": {
    name: "Jugular vein",
    latin: "Vena jugularis interna",
    systems: ["cardiovascular"],
    depth: 11,
    plate: 1,
    aliases: ["internal jugular","jugular vein"],
    overview: "The deep vein of the neck. It drains the brain and the face and joins the subclavian vein to make the brachiocephalic vein.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It begins at the jugular foramen as the continuation of the sigmoid sinus and runs down inside the carotid sheath, lateral to the common carotid, with the vagus nerve between them. A valve is usual near its lower end. Superficial jugular veins, external and anterior, are separate subcutaneous vessels and are not drawn as their own lines here. The plate shows the internal jugular beside the carotid.",
      ]},
    ],
    related: ["carotid","vena-cava","brain"],
  },
  "femoral-artery": {
    name: "Femoral artery",
    latin: "Arteria femoralis",
    systems: ["cardiovascular"],
    depth: 14,
    plate: 1,
    aliases: ["femoral"],
    overview: "The main artery of the thigh. It is the continuation of the external iliac artery under the inguinal ligament.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It enters the thigh at the mid-inguinal point, lateral to the femoral vein, and gives the deep artery of the thigh, which supplies most of the thigh muscles. The superficial vessel then passes through the adductor canal and becomes the popliteal artery behind the knee. A pulse is felt where it crosses the hip, against the head of the femur. On the plate it is the artery on the medial side of the thigh.",
      ]},
    ],
    related: ["aorta","femur","sartorius"],
  },
  "masseter": {
    name: "Masseter",
    latin: "Musculus masseter",
    systems: ["muscular"],
    depth: 8,
    plate: 0.72,
    aliases: ["masseter muscle"],
    overview: "The thick muscle on the outside of the ramus of the mandible. It closes the jaw.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It arises from the zygomatic arch and inserts on the lateral ramus and angle of the mandible. The mandibular division of the trigeminal nerve supplies it, along with temporalis and the medial pterygoid, the other jaw closers. The lateral pterygoid helps open the jaw and is not given its own outline. You can feel masseter harden when the teeth clench.",
      ]},
    ],
    related: ["mandible","skull","tongue"],
  },
  "sartorius": {
    name: "Sartorius",
    latin: "Musculus sartorius",
    aspect: "anterior",
    systems: ["muscular"],
    depth: 9,
    plate: 0.7,
    aliases: ["tailor's muscle"],
    overview: "The longest muscle in the body. A strap from the front of the ilium to the medial tibia.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It arises at the anterior superior iliac spine and crosses the thigh to insert on the upper medial tibia, in the pes anserinus, with gracilis and semitendinosus. The femoral nerve supplies it. It flexes, abducts, and laterally rotates the hip, and flexes the knee: the position of sitting cross-legged. On the plate it is the narrow band running from the front of the hip to the inner knee.",
      ]},
    ],
    related: ["femur","tibia","quadriceps"],
  },
  "tibialis-anterior": {
    name: "Tibialis anterior",
    latin: "Musculus tibialis anterior",
    aspect: "anterior",
    systems: ["muscular"],
    depth: 9,
    plate: 0.72,
    aliases: ["tibialis anterior"],
    overview: "The shin muscle. It dorsiflexes the ankle and inverts the foot.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It arises from the lateral side of the tibia and the interosseous membrane and inserts on the medial cuneiform and the base of the first metatarsal. The deep fibular nerve supplies it. Its tendon is the one you see and feel crossing the front of the ankle when the foot is pulled up. Foot drop after a common fibular nerve injury is largely the loss of this muscle.",
      ]},
    ],
    related: ["tibia","navicular","medial-cuneiform"],
  },
  "soleus": {
    name: "Soleus",
    latin: "Musculus soleus",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 14,
    plate: 0.55,
    aliases: ["soleus muscle"],
    overview: "The deep calf muscle, under gastrocnemius. With it, soleus forms the triceps surae that lifts the heel.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It arises from the upper fibula and the soleal line of the tibia, and it joins the gastrocnemius in the Achilles tendon on the calcaneus. The tibial nerve supplies it. It is a slow, postural plantarflexor, important for standing, and its venous plexus is a common site of deep-vein thrombosis. On the posterior plate it is the broader calf belly deep to gastrocnemius.",
      ]},
    ],
    related: ["gastrocnemius","calcaneus","tibia"],
  },
  "gluteus-medius": {
    name: "Gluteus medius",
    latin: "Musculus gluteus medius",
    aspect: "posterior",
    systems: ["muscular"],
    depth: 12,
    plate: 0.7,
    aliases: ["gluteus medius"],
    overview: "The fan on the outer ilium, above gluteus maximus. It keeps the pelvis level when the opposite foot is off the ground.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "It arises from the outer surface of the ilium between the anterior and posterior gluteal lines and inserts on the greater trochanter. The superior gluteal nerve supplies it, and also gluteus minimus and tensor fasciae latae, which are not drawn separately. Loss of the muscle lets the pelvis drop on the unsupported side during walking. That drop is the Trendelenburg sign.",
      ]},
    ],
    related: ["gluteus-maximus","femur","pelvis"],
  },
  "sciatic": {
    name: "Sciatic nerve",
    latin: "Nervus ischiadicus",
    aspect: "posterior",
    systems: ["nervous"],
    depth: 16,
    plate: 1,
    aliases: ["sciatic","ischiadic nerve"],
    overview: "The largest nerve in the body. It leaves the pelvis and runs down the back of the thigh to the knee.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Ventral rami of L4 to S3 form it. It usually exits below piriformis and passes midway between the ischial tuberosity and the greater trochanter, deep to gluteus maximus, then down the midline of the posterior thigh on adductor magnus. Tibial and common fibular divisions travel in one sheath and split, by the knee, into the tibial nerve and the common fibular nerve. Hamstring muscles, and then everything below the knee, depend on it. The plate draws it on the posterior view, from the buttock to the back of the knee.",
      ]},
    ],
    related: ["hamstrings","gluteus-maximus","peripheral-nerves"],
  },
  "bulbourethral": {
    name: "Bulbourethral gland",
    latin: "Glandula bulbourethralis",
    sex: "male",
    systems: ["reproductive"],
    depth: 18,
    plate: 1,
    aliases: ["Cowper gland","bulbourethral"],
    overview: "A pair of pea-sized glands in the male, beside the membranous urethra, below the prostate.",
    sections: [
      { title: "Structure and function", paragraphs: [
        "Each duct runs forward into the spongy urethra. During arousal the glands add a clear fluid that lubricates the urethra and may carry some sperm. They are the homolog of the greater vestibular glands. On the plate they are the two small glands just below the prostate.",
      ]},
    ],
    related: ["prostate","urethra","penis"],
  },
};
