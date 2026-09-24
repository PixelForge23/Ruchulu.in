/* =============================================================
   data.js — Firebase + data layer + constants + seed content
   -------------------------------------------------------------
   • If you fill in firebaseConfig below, the app runs in
     "firebase" mode — real Firestore sync across all devices.
   • If firebaseConfig is left as YOUR_* placeholders, the app
     falls back to localStorage mode (works on one browser,
     synced across tabs). This makes the site usable before
     you plug in a backend.
   ============================================================= */

/* ---------- 1. FIREBASE CONFIG ------------------------------
   Replace with YOUR project's config from the Firebase console.
   Console → Project settings → General → Your apps → Config.
   ------------------------------------------------------------ */
export const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

export const isFirebaseConfigured = () =>
  !String(firebaseConfig.apiKey).startsWith('YOUR_');

/* ---------- 2. CONSTANTS & HELPERS -------------------------- */
export const TELUGU_MONTHS = [
  "జనవరి","ఫిబ్రవరి","మార్చి","ఏప్రిల్","మే","జూన్",
  "జూలై","ఆగస్టు","సెప్టెంబర్","అక్టోబర్","నవంబర్","డిసెంబర్"
];

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatTeluguDate = (input) => {
  try {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return String(input ?? '');
    return `${d.getDate()} ${TELUGU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return String(input ?? ''); }
};

export const KNOWN_SLUGS = {
  "ఆంధ్ర స్టైల్ గుత్తి వంకాయ కూర": "andhra-gutti-vankaya",
  "హైదరాబాదీ చికెన్ బిర్యానీ": "hyderabadi-chicken-biryani",
  "పులిహోర": "pulihora-tamarind-rice",
  "బొబ్బట్లు / పూరన్ పోలీ": "bobbatlu-puran-poli",
  "గొంగూర పచ్చడి": "gongura-pachadi",
  "గోంగూర పచ్చడి": "gongura-pachadi",
  "రాగి సంగటి": "ragi-sangati",
  "మామిడికాయ పప్పు": "mamidikaya-pappu",
  "అరిసెలు": "ariselu",
};

export const makeSlug = (title) => {
  if (!title) return 'recipe-' + Date.now();
  if (KNOWN_SLUGS[title]) return KNOWN_SLUGS[title];
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'recipe-' + Date.now();
};

export const makeImage = (bg, emoji, label) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
    <rect width='800' height='600' fill='${bg}'/>
    <circle cx='400' cy='280' r='140' fill='white' opacity='0.9'/>
    <text x='400' y='320' font-size='110' text-anchor='middle' dominant-baseline='middle'>${emoji}</text>
    <rect x='0' y='480' width='800' height='120' fill='rgba(0,0,0,0.55)'/>
    <text x='400' y='540' font-size='22' font-family='sans-serif' font-weight='700' fill='white' text-anchor='middle'>${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/* ---------- 3. DEFAULT SEED CONTENT ------------------------- */
export const DEFAULT_CATEGORIES = [
  { id:"c1",  name:"అన్నం వంటకాలు",       slug:"annam-vantakalu",         icon:"🍚" },
  { id:"c2",  name:"కూరలు",               slug:"kooralu",                 icon:"🍛" },
  { id:"c3",  name:"నాన్-వెజ్",           slug:"non-veg",                 icon:"🥘" },
  { id:"c4",  name:"వెజిటేరియన్",         slug:"vegetarian",              icon:"🥗" },
  { id:"c5",  name:"స్వీట్స్",            slug:"sweets",                  icon:"🍰" },
  { id:"c6",  name:"పానీయాలు",            slug:"paniyalu",                icon:"🥤" },
  { id:"c7",  name:"Snacks",              slug:"snacks",                  icon:"🍿" },
  { id:"c8",  name:"ఆరోగ్యకరమైన ఆహారం",   slug:"arogyakaramaina-aaharam", icon:"🌾" },
  { id:"c9",  name:"Traditional Recipes", slug:"traditional",             icon:"👩‍🍳" },
  { id:"c10", name:"ఇతర వంటకాలు",         slug:"ithara",                  icon:"🍽" },
];

export const IMG = {
  gutti:      makeImage("#FFF0E6","🍆","Gutti Vankaya"),
  biryani:    makeImage("#FFF3CD","🍛","Chicken Biryani"),
  pulihora:   makeImage("#E8F5E9","🍚","Pulihora"),
  bobbatlu:   makeImage("#FFF8E1","🥞","Bobbatlu"),
  gongura:    makeImage("#F1F8E9","🌿","Gongura"),
  ragi:       makeImage("#EFEBE9","🫓","Ragi Sangati"),
  mamidikaya: makeImage("#FFFDE7","🥭","Mamidikaya Pappu"),
  ariselu:    makeImage("#FCE4EC","🍪","Ariselu"),
};

export const DEFAULT_BLOGS = () => [
  {
    id:"b1", title:"ఆంధ్ర స్టైల్ గుత్తి వంకాయ కూర", slug:"andhra-gutti-vankaya",
    shortDescription:"సులభంగా ఇంట్లోనే తయారు చేసుకునే రుచికరమైన వంకాయ కూర. వేడి అన్నంలో నెయ్యితో అద్భుతం!",
    content:"ఆంధ్ర వంటకాల్లో గుత్తి వంకాయకు ప్రత్యేక స్థానం ఉంది. చిన్న వంకాయల్లో కారం, ధనియాల పొడి, వేరుశెనగ పొడితో చేసిన మసాలా నింపి నెమ్మదిగా ఉడికిస్తే వచ్చే రుచి మాటల్లో చెప్పలేం. ఈ వంటకం పండుగల్లో, ప్రత్యేక సందర్భాల్లో తప్పకుండా చేస్తారు. మసాలా సమపాళ్లలో ఉంటే కూర ఘుమఘుమలాడుతుంది.",
    ingredients:["చిన్న వంకాయలు 10","ఉల్లిపాయలు 2","పచ్చిమిర్చి 3","కారం 2 స్పూన్లు","ధనియాల పొడి 1 స్పూన్","వేరుశెనగ పొడి 2 స్పూన్లు","ఉప్పు తగినంత","నూనె 4 స్పూన్లు","కరివేపాకు కొద్దిగా"],
    preparationMethod:[
      "ముందుగా వంకాయలను శుభ్రంగా కడిగి నాలుగు భాగాలుగా చీల్చాలి, తొడిమ వద్ద కలిపి ఉంచాలి.",
      "ఒక గిన్నెలో కారం, ధనియాలు, వేరుశెనగ పొడి, ఉప్పు కలిపి మసాలా సిద్ధం చేయాలి.",
      "వంకాయల్లో ఈ మసాలాను నింపాలి.",
      "బాణలిలో నూనె వేసి ఉల్లిపాయ, పచ్చిమిర్చి, కరివేపాకు వేయించాలి.",
      "నింపిన వంకాయలు వేసి మూతపెట్టి సన్నని మంటపై 15 నిమిషాలు ఉడికించాలి.",
      "మధ్యలో ఒకసారి తిప్పుతూ నెమ్మదిగా మగ్గించాలి.",
    ],
    cookingTips:"వంకాయలు లేతవి ఎంచుకుంటే కూర మరింత రుచిగా ఉంటుంది. వేరుశెనగ పొడి కొంచెం ఎక్కువ వేస్తే కూర చిక్కగా వస్తుంది.",
    featuredImage: IMG.gutti, categoryId:"c2", categoryName:"కూరలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:1245, altText:"ఆంధ్ర స్టైల్ గుత్తి వంకాయ కూర",
  },
  {
    id:"b2", title:"హైదరాబాదీ చికెన్ బిర్యానీ", slug:"hyderabadi-chicken-biryani",
    shortDescription:"హైదరాబాద్ స్పెషల్ దమ్ బిర్యానీ - అసలైన నవాబీ రుచి ఇంట్లోనే!",
    content:"హైదరాబాదీ బిర్యానీ అంటేనే ఒక భావోద్వేగం. దమ్ పద్ధతిలో తయారు చేసే ఈ బిర్యానీకి ప్రపంచవ్యాప్తంగా అభిమానులు ఉన్నారు. బాస్మతి బియ్యం, మసాలాలతో మ్యారినేట్ చేసిన చికెన్, కుంకుమ పువ్వు కలయికతో వచ్చే సువాసన ఇంటినే నింపుతుంది.",
    ingredients:["బాస్మతి బియ్యం 500గ్రా","చికెన్ 750గ్రా","పెరుగు 200గ్రా","ఉల్లిపాయలు 4","అల్లం వెల్లుల్లి పేస్ట్ 2 స్పూన్లు","బిర్యానీ మసాలా 3 స్పూన్లు","కుంకుమ పువ్వు చిటికెడు","నెయ్యి 4 స్పూన్లు"],
    preparationMethod:[
      "చికెన్‌ను పెరుగు, అల్లం వెల్లుల్లి, మసాలాలతో 2 గంటలు మ్యారినేట్ చేయాలి.",
      "బియ్యాన్ని 70% ఉడికించి వడకట్టాలి.",
      "బాణలిలో నెయ్యి వేసి ఉల్లిపాయలు వేయించి బిరిస్తా చేయాలి.",
      "మ్యారినేట్ చికెన్‌ను అడుగున వేసి పైన బియ్యం పరచాలి.",
      "కుంకుమ పాలు, నెయ్యి, బిరిస్తా వేసి దమ్‌పై 30 నిమిషాలు ఉడికించాలి.",
    ],
    cookingTips:"దమ్ కోసం అటా పిండితో మూత సీల్ చేస్తే ఆవిరి బయటకు పోకుండా బిర్యానీ మరింత రుచిగా వస్తుంది.",
    featuredImage: IMG.biryani, categoryId:"c1", categoryName:"అన్నం వంటకాలు",
    authorName:"అడ్మిన్",
    publishDate: new Date(Date.now()-86400000).toISOString().slice(0,10),
    status:"published", createdAt: new Date(Date.now()-86400000).toISOString(),
    views:3421, altText:"హైదరాబాదీ చికెన్ బిర్యానీ",
  },
  {
    id:"b3", title:"పులిహోర", slug:"pulihora-tamarind-rice",
    shortDescription:"పండుగల స్పెషల్ - చింతపండు పులిహోర, దేవుడికి నైవేద్యం కూడా!",
    content:"పులిహోర లేని పండుగను ఊహించలేం. చింతపండు పులుపు, వేరుశెనగ కరకర, కరివేపాకు ఘుమఘుమలతో ఈ అన్నం ఎంతో రుచిగా ఉంటుంది. ప్రయాణాలకు కూడా చాలా అనుకూలం.",
    ingredients:["వండిన అన్నం 2 కప్పులు","చింతపండు గుజ్జు 3 స్పూన్లు","వేరుశెనగలు 2 స్పూన్లు","ఎండుమిర్చి 4","ఆవాలు, జీలకర్ర","పసుపు, ఉప్పు","నూనె 3 స్పూన్లు"],
    preparationMethod:[
      "అన్నాన్ని చల్లార్చి కొంచెం నూనె కలపాలి.",
      "బాణలిలో నూనె వేసి పోపు వేయాలి.",
      "చింతపండు గుజ్జు, పసుపు, ఉప్పు వేసి పులుసు చిక్కబడే వరకు ఉడికించాలి.",
      "ఈ పులుసును అన్నంలో కలిపి బాగా కలపాలి.",
    ],
    cookingTips:"చింతపండు గుజ్జు ముందే తయారు చేసి ఫ్రిజ్‌లో ఉంచుకుంటే పులిహోర త్వరగా అవుతుంది.",
    featuredImage: IMG.pulihora, categoryId:"c1", categoryName:"అన్నం వంటకాలు",
    authorName:"అడ్మిన్", publishDate:"2026-09-24", status:"published",
    createdAt:"2026-09-24T10:00:00Z", views:987, altText:"చింతపండు పులిహోర",
  },
  {
    id:"b4", title:"బొబ్బట్లు / పూరన్ పోలీ", slug:"bobbatlu-puran-poli",
    shortDescription:"తీపి ఇష్టపడే వారికి పండుగ స్పెషల్ - నెయ్యితో బొబ్బట్లు!",
    content:"బొబ్బట్లు తెలుగు వారి సంప్రదాయ తీపి వంటకం. శనగపప్పు, బెల్లం పూర్ణంతో తయారు చేసే ఈ వంటకం ఉగాది, సంక్రాంతికి తప్పనిసరి. నెయ్యి వేసుకుని తింటే ఆ రుచే వేరు.",
    ingredients:["శనగపప్పు 1 కప్పు","బెల్లం 1 కప్పు","మైదా 1 కప్పు","యాలకుల పొడి","నెయ్యి"],
    preparationMethod:[
      "శనగపప్పు ఉడికించి బెల్లంతో కలిపి పూర్ణం చేయాలి.",
      "మైదా పిండి కలిపి చిన్న ముద్దలు చేయాలి.",
      "పూర్ణం నింపి లేతగా వత్తి పెనం మీద కాల్చాలి.",
      "నెయ్యి వేసి రెండు వైపులా కాల్చాలి.",
    ],
    cookingTips:"పూర్ణం మెత్తగా రుబ్బితే బొబ్బట్లు చిరిగిపోకుండా వస్తాయి.",
    featuredImage: IMG.bobbatlu, categoryId:"c5", categoryName:"స్వీట్స్",
    authorName:"అడ్మిన్", publishDate:"2026-09-23", status:"published",
    createdAt:"2026-09-23T09:00:00Z", views:765, altText:"బొబ్బట్లు",
  },
  {
    id:"b5", title:"గోంగూర పచ్చడి", slug:"gongura-pachadi",
    shortDescription:"ఆంధ్రుల అభిమాన పచ్చడి - గోంగూర పులుపు కారం కలయిక!",
    content:"గోంగూర పచ్చడి లేకుండా ఆంధ్ర భోజనం పూర్తి కాదు. పులుపు, కారం సమపాళ్లలో ఉండే ఈ పచ్చడి అన్నంలో కలుపుకుంటే ఆకలి రెట్టింపు అవుతుంది. నిల్వ పచ్చడిగా నెల రోజులు ఉంటుంది.",
    ingredients:["గోంగూర 2 కట్టలు","ఎండుమిర్చి 15","ఆవాలు 1 స్పూన్","మెంతులు","ఉప్పు","నూనె 1/2 కప్పు"],
    preparationMethod:[
      "గోంగూర ఆకులను కడిగి నీడలో ఆరబెట్టాలి.",
      "కొద్దిగా నూనెలో మగ్గించాలి.",
      "ఎండుమిర్చి, ఆవాలు వేయించి పొడి చేయాలి.",
      "గోంగూర, పొడి, ఉప్పు కలిపి రుబ్బాలి.",
      "పోపు పెట్టి కలపాలి.",
    ],
    cookingTips:"గోంగూరలో నీరు ఉండకూడదు, లేకపోతే పచ్చడి త్వరగా పాడవుతుంది.",
    featuredImage: IMG.gongura, categoryId:"c4", categoryName:"వెజిటేరియన్",
    authorName:"అడ్మిన్", publishDate:"2026-09-22", status:"published",
    createdAt:"2026-09-22T08:00:00Z", views:1560, altText:"గోంగూర పచ్చడి",
  },
  {
    id:"b6", title:"రాగి సంగటి", slug:"ragi-sangati",
    shortDescription:"ఆరోగ్యానికి ఆరోగ్యం, రుచికి రుచి - రాయలసీమ స్పెషల్ సంగటి!",
    content:"రాగి సంగటి రాయలసీమ ప్రాంతపు ప్రసిద్ధ ఆహారం. కాల్షియం, ఐరన్ సమృద్ధిగా ఉండే రాగులతో చేసే ఈ వంటకం డయాబెటిక్ వారికి, బరువు తగ్గాలనుకునే వారికి చాలా మంచిది.",
    ingredients:["రాగి పిండి 2 కప్పులు","నీరు 4 కప్పులు","ఉప్పు","అన్నం కొద్దిగా"],
    preparationMethod:[
      "నీటిని మరిగించి ఉప్పు వేయాలి.",
      "రాగి పిండి వేసి ఉండలు కట్టకుండా కలపాలి.",
      "మూతపెట్టి 10 నిమిషాలు ఉడికించాలి.",
      "బాగా కలిపి ముద్దలుగా చేయాలి.",
    ],
    cookingTips:"సంగటి వేడిగా ఉన్నప్పుడే ముద్ద చేయాలి, చల్లారితే గట్టిపడుతుంది.",
    featuredImage: IMG.ragi, categoryId:"c8", categoryName:"ఆరోగ్యకరమైన ఆహారం",
    authorName:"అడ్మిన్", publishDate:"2026-09-21", status:"published",
    createdAt:"2026-09-21T07:00:00Z", views:890, altText:"రాగి సంగటి",
  },
  {
    id:"b7", title:"మామిడికాయ పప్పు", slug:"mamidikaya-pappu",
    shortDescription:"వేసవి స్పెషల్ - మామిడికాయ పులుపుతో కమ్మని పప్పు!",
    content:"మామిడికాయ సీజన్‌లో ఈ పప్పు ప్రతి ఇంట్లో చేస్తారు. పచ్చి మామిడికాయ పులుపు, కందిపప్పు కలయిక అద్భుతంగా ఉంటుంది. వేడి అన్నం, నెయ్యితో తింటే స్వర్గమే.",
    ingredients:["కందిపప్పు 1 కప్పు","పచ్చి మామిడికాయ 1","పచ్చిమిర్చి 3","పసుపు","ఉప్పు","పోపు సామాను"],
    preparationMethod:[
      "కందిపప్పు, మామిడికాయ ముక్కలు, పసుపు వేసి కుక్కర్‌లో ఉడికించాలి.",
      "మెత్తగా రుబ్బి ఉప్పు కలపాలి.",
      "పోపు పెట్టి పచ్చిమిర్చి వేయాలి.",
    ],
    cookingTips:"మామిడికాయ ఎక్కువ పుల్లగా ఉంటే కొద్దిగా బెల్లం వేస్తే రుచి బ్యాలెన్స్ అవుతుంది.",
    featuredImage: IMG.mamidikaya, categoryId:"c2", categoryName:"కూరలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:2100, altText:"మామిడికాయ పప్పు",
  },
  {
    id:"b8", title:"అరిసెలు", slug:"ariselu",
    shortDescription:"సంక్రాంతి స్పెషల్ - నోరూరించే అరిసెలు, బెల్లం తీపితో!",
    content:"అరిసెలు తెలుగు సంప్రదాయ తీపి వంటకాల్లో రారాజు. బియ్యం పిండి, బెల్లం పాకంతో చేసే ఈ వంటకం నెల రోజులు నిల్వ ఉంటుంది. సంక్రాంతికి ప్రతి ఇంట్లో తప్పకుండా చేస్తారు.",
    ingredients:["బియ్యం పిండి 2 కప్పులు","బెల్లం 1.5 కప్పులు","నువ్వులు 2 స్పూన్లు","నూనె వేయించడానికి"],
    preparationMethod:[
      "బెల్లం పాకం పట్టి తీగ పాకం రావాలి.",
      "బియ్యం పిండి, నువ్వులు కలిపి పాకంలో వేయాలి.",
      "చిన్న ఉండలు చేసి అరిసెల ఆకారంలో వత్తాలి.",
      "నూనెలో దోరగా వేయించాలి.",
    ],
    cookingTips:"పాకం సరిగ్గా రావడం చాలా ముఖ్యం, లేకపోతే అరిసెలు గట్టిగా అవుతాయి.",
    featuredImage: IMG.ariselu, categoryId:"c5", categoryName:"స్వీట్స్",
    authorName:"అడ్మిన్", publishDate:"2026-09-20", status:"draft",
    createdAt:"2026-09-20T06:00:00Z", views:430, altText:"అరిసెలు",
  },
];

/* ---------- 4. LOCAL-FALLBACK KEYS -------------------------- */
export const KEYS = {
  blogs:      'telugu_food_blogs',
  categories: 'telugu_food_categories',
  visitors:   'telugu_food_visitors',
  admin:      'telugu_admin_session',
  lastVisit:  'telugu_last_visit',
};

export const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

/* ---------- 5. CROSS-TAB SYNC (local mode) ------------------ */
let _syncChannel = null;
try { _syncChannel = new BroadcastChannel('telugu-food-sync'); } catch {}

function _emitSync(kind) {
  const payload = { kind, at: Date.now() };
  try { _syncChannel?.postMessage(payload); } catch {}
  window.dispatchEvent(new CustomEvent('food-sync', { detail: payload }));
}

/* =============================================================
   6. DataService — single entry point for all data operations
   -------------------------------------------------------------
   All UI code calls DataService.* and never touches Firebase or
   localStorage directly. This makes the app easy to port.
   ============================================================= */
export const DataService = {
  mode: 'local',
  app: null,
  db: null,
  auth: null,
  _firebase: null,

  /* ---------- INIT ---------- */
  async init() {
    if (!isFirebaseConfigured()) {
      console.info('[DataService] Firebase not configured — using local fallback.');
      this.mode = 'local';
      return 'local';
    }
    try {
      const [fbApp, fbFirestore, fbAuth] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
      ]);
      this._firebase = { ...fbApp, ...fbFirestore, ...fbAuth };
      this.app  = fbApp.initializeApp(firebaseConfig);
      this.db   = fbFirestore.getFirestore(this.app);
      this.auth = fbAuth.getAuth(this.app);
      this.mode = 'firebase';
      console.info('[DataService] Firebase mode active.');
      return 'firebase';
    } catch (err) {
      console.error('[DataService] Firebase init failed, falling back to local.', err);
      this.mode = 'local';
      return 'local';
    }
  },

  /* ---------- SEED (first run only) ---------- */
  async seedIfEmpty() {
    if (this.mode === 'firebase') {
      const { collection, getDocs, writeBatch, doc } = this._firebase;
      const blogsSnap = await getDocs(collection(this.db, 'blogs'));
      if (blogsSnap.empty) {
        const batch = writeBatch(this.db);
        DEFAULT_BLOGS().forEach(b => batch.set(doc(this.db, 'blogs', b.id), b));
        await batch.commit();
        console.info('[DataService] Seeded default blogs.');
      }
      const catsSnap = await getDocs(collection(this.db, 'categories'));
      if (catsSnap.empty) {
        const batch = writeBatch(this.db);
        DEFAULT_CATEGORIES.forEach(c => batch.set(doc(this.db, 'categories', c.id), c));
        await batch.commit();
        console.info('[DataService] Seeded default categories.');
      }
      const visitorsRef = doc(this.db, 'settings', 'visitors');
      const { getDoc, setDoc } = this._firebase;
      const vSnap = await getDoc(visitorsRef);
      if (!vSnap.exists()) {
        await setDoc(visitorsRef, { today: 1245, total: 25680, lastVisitDate: todayISO() });
      }
      return;
    }

    // local mode
    if (!localStorage.getItem(KEYS.blogs)) {
      localStorage.setItem(KEYS.blogs, JSON.stringify(DEFAULT_BLOGS()));
    }
    if (!localStorage.getItem(KEYS.categories)) {
      localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(KEYS.visitors)) {
      localStorage.setItem(KEYS.visitors, JSON.stringify({ today: 1245, total: 25680 }));
    }
  },

  /* ---------- BLOGS ---------- */
  subscribeBlogs(callback) {
    if (this.mode === 'firebase') {
      const { collection, onSnapshot } = this._firebase;
      return onSnapshot(
        collection(this.db, 'blogs'),
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err) => console.error('[DataService] blogs subscription error', err),
      );
    }
    // local mode
    const handler = () => callback(this._readLocalBlogs());
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    _syncChannel?.addEventListener('message', handler);
    const iv = setInterval(handler, 10000);
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('food-sync', handler);
      _syncChannel?.removeEventListener('message', handler);
      clearInterval(iv);
    };
  },

  _readLocalBlogs() {
    const raw = localStorage.getItem(KEYS.blogs);
    if (raw) {
      const parsed = safeParse(raw, null);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
    const seed = DEFAULT_BLOGS();
    localStorage.setItem(KEYS.blogs, JSON.stringify(seed));
    return seed;
  },

  async saveBlog(blog) {
    if (this.mode === 'firebase') {
      const { doc, setDoc } = this._firebase;
      await setDoc(doc(this.db, 'blogs', blog.id), blog, { merge: true });
      return blog;
    }
    const list = this._readLocalBlogs();
    const idx = list.findIndex(b => b.id === blog.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...blog };
    else list.unshift(blog);
    localStorage.setItem(KEYS.blogs, JSON.stringify(list));
    _emitSync('blogs');
    return blog;
  },

  async deleteBlog(id) {
    if (this.mode === 'firebase') {
      const { doc, deleteDoc } = this._firebase;
      await deleteDoc(doc(this.db, 'blogs', id));
      return;
    }
    const list = this._readLocalBlogs().filter(b => b.id !== id);
    localStorage.setItem(KEYS.blogs, JSON.stringify(list));
    _emitSync('blogs');
  },

  /* ---------- CATEGORIES ---------- */
  subscribeCategories(callback) {
    if (this.mode === 'firebase') {
      const { collection, onSnapshot } = this._firebase;
      return onSnapshot(
        collection(this.db, 'categories'),
        (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        (err) => console.error('[DataService] categories subscription error', err),
      );
    }
    const handler = () => callback(this._readLocalCategories());
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    _syncChannel?.addEventListener('message', handler);
    const iv = setInterval(handler, 10000);
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('food-sync', handler);
      _syncChannel?.removeEventListener('message', handler);
      clearInterval(iv);
    };
  },

  _readLocalCategories() {
    const raw = localStorage.getItem(KEYS.categories);
    if (raw) {
      const parsed = safeParse(raw, null);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
    localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },

  async saveCategory(cat) {
    if (this.mode === 'firebase') {
      const { doc, setDoc } = this._firebase;
      await setDoc(doc(this.db, 'categories', cat.id), cat);
      return cat;
    }
    const list = this._readLocalCategories();
    const idx = list.findIndex(c => c.id === cat.id);
    if (idx >= 0) list[idx] = cat; else list.push(cat);
    localStorage.setItem(KEYS.categories, JSON.stringify(list));
    _emitSync('categories');
    return cat;
  },

  async deleteCategory(id) {
    if (this.mode === 'firebase') {
      const { doc, deleteDoc } = this._firebase;
      await deleteDoc(doc(this.db, 'categories', id));
      return;
    }
    const list = this._readLocalCategories().filter(c => c.id !== id);
    localStorage.setItem(KEYS.categories, JSON.stringify(list));
    _emitSync('categories');
  },

  /* ---------- VISITORS ---------- */
  subscribeVisitors(callback) {
    if (this.mode === 'firebase') {
      const { doc, onSnapshot } = this._firebase;
      return onSnapshot(
        doc(this.db, 'settings', 'visitors'),
        (snap) => callback(snap.data() || { today: 0, total: 0 }),
        (err) => console.error('[DataService] visitors subscription error', err),
      );
    }
    const handler = () => callback(this._readLocalVisitors());
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('food-sync', handler);
    };
  },

  _readLocalVisitors() {
    const raw = localStorage.getItem(KEYS.visitors);
    const parsed = safeParse(raw, null);
    if (parsed && typeof parsed === 'object') return parsed;
    const seed = { today: 1245, total: 25680 };
    localStorage.setItem(KEYS.visitors, JSON.stringify(seed));
    return seed;
  },

  async bumpVisitorCount() {
    if (this.mode === 'firebase') {
      const { doc, getDoc, setDoc } = this._firebase;
      const ref = doc(this.db, 'settings', 'visitors');
      const snap = await getDoc(ref);
      const cur = snap.data() || { today: 0, total: 0, lastVisitDate: null };
      const today = todayISO();
      if (cur.lastVisitDate === today) return cur;
      const next = { today: (cur.today || 0) + 1, total: (cur.total || 0) + 1, lastVisitDate: today };
      await setDoc(ref, next, { merge: true });
      return next;
    }
    // local
    const cur = this._readLocalVisitors();
    const today = todayISO();
    const last = localStorage.getItem(KEYS.lastVisit);
    if (last === today) return cur;
    const next = { today: (cur.today || 0) + 1, total: (cur.total || 0) + 1 };
    localStorage.setItem(KEYS.visitors, JSON.stringify(next));
    localStorage.setItem(KEYS.lastVisit, today);
    _emitSync('visitors');
    return next;
  },

  /* ---------- AUTH ---------- */
  onAuthChange(callback) {
    if (this.mode === 'firebase') {
      const { onAuthStateChanged } = this._firebase;
      return onAuthStateChanged(this.auth, (user) => callback(!!user, user));
    }
    // local demo
    const handler = () => callback(localStorage.getItem(KEYS.admin) === 'active', null);
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    handler();
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('food-sync', handler);
    };
  },

  async login(email, password) {
    if (this.mode === 'firebase') {
      const { signInWithEmailAndPassword } = this._firebase;
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || e.message };
      }
    }
    // local demo credentials
    const ok = email.trim() === 'admin@ruchulu.com' && password === 'admin123';
    if (ok) { localStorage.setItem(KEYS.admin, 'active'); _emitSync('auth'); }
    return { ok, error: ok ? null : 'invalid-credentials' };
  },

  async logout() {
    if (this.mode === 'firebase') {
      const { signOut } = this._firebase;
      try { await signOut(this.auth); } catch {}
      return;
    }
    localStorage.removeItem(KEYS.admin);
    _emitSync('auth');
  },
};
