/* =============================================================
   data.js — Data layer with 3 modes: firebase / cloud / local
   ============================================================= */

/* ---- 1. FIREBASE CONFIG (optional — leave placeholders if not using) ---- */
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

/* ---- 2. CLOUD SYNC (zero setup) ----------------------------------------
   Paste your Sync ID here after clicking "Create New Sync Blob"
   in Admin → Dashboard → Cloud Sync.
   -------------------------------------------------------------------- */
export const CLOUD_SYNC_ID = '';
const CLOUD_BASE = 'https://jsonblob.com/api/jsonBlob';

/* ---- 3. Constants & helpers ---- */
export const TELUGU_MONTHS = ["జనవరి","ఫిబ్రవరి","మార్చి","ఏప్రిల్","మే","జూన్","జూలై","ఆగస్టు","సెప్టెంబర్","అక్టోబర్","నవంబర్","డిసెంబర్"];
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
  "గోంగూర పచ్చడి": "gongura-pachadi",
  "రాగి సంగటి": "ragi-sangati",
  "మామిడికాయ పప్పు": "mamidikaya-pappu",
  "అరిసెలు": "ariselu",
};
export const makeSlug = (title) => {
  if (!title) return 'recipe-' + Date.now();
  if (KNOWN_SLUGS[title]) return KNOWN_SLUGS[title];
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'recipe-' + Date.now();
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

/* ---- 4. Seed content ---- */
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
export const DEFAULT_BLOGS = () => ([
  {
    id:"b1", title:"ఆంధ్ర స్టైల్ గుత్తి వంకాయ కూర", slug:"andhra-gutti-vankaya",
    shortDescription:"సులభంగా ఇంట్లోనే తయారు చేసుకునే రుచికరమైన వంకాయ కూర. వేడి అన్నంలో నెయ్యితో అద్భుతం!",
    content:"ఆంధ్ర వంటకాల్లో గుత్తి వంకాయకు ప్రత్యేక స్థానం ఉంది. చిన్న వంకాయల్లో కారం, ధనియాల పొడి, వేరుశెనగ పొడితో చేసిన మసాలా నింపి నెమ్మదిగా ఉడికిస్తే వచ్చే రుచి మాటల్లో చెప్పలేం.",
    ingredients:["చిన్న వంకాయలు 10","ఉల్లిపాయలు 2","పచ్చిమిర్చి 3","కారం 2 స్పూన్లు","ధనియాల పొడి 1 స్పూన్","వేరుశెనగ పొడి 2 స్పూన్లు","ఉప్పు తగినంత","నూనె 4 స్పూన్లు","కరివేపాకు కొద్దిగా"],
    preparationMethod:["వంకాయలను కడిగి నాలుగు భాగాలుగా చీల్చాలి.","మసాలా సిద్ధం చేయాలి.","వంకాయల్లో మసాలా నింపాలి.","బాణలిలో నూనె వేసి ఉల్లిపాయ, పచ్చిమిర్చి, కరివేపాకు వేయించాలి.","నింపిన వంకాయలు వేసి 15 నిమిషాలు ఉడికించాలి."],
    cookingTips:"వంకాయలు లేతవి ఎంచుకుంటే కూర మరింత రుచిగా ఉంటుంది.",
    featuredImage: IMG.gutti, categoryId:"c2", categoryName:"కూరలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"గుత్తి వంకాయ కూర",
  },
  {
    id:"b2", title:"హైదరాబాదీ చికెన్ బిర్యానీ", slug:"hyderabadi-chicken-biryani",
    shortDescription:"హైదరాబాద్ స్పెషల్ దమ్ బిర్యానీ - అసలైన నవాబీ రుచి!",
    content:"హైదరాబాదీ బిర్యానీ అంటేనే ఒక భావోద్వేగం. బాస్మతి బియ్యం, మసాలాలతో మ్యారినేట్ చేసిన చికెన్, కుంకుమ పువ్వు కలయికతో వచ్చే సువాసన ఇంటినే నింపుతుంది.",
    ingredients:["బాస్మతి బియ్యం 500గ్రా","చికెన్ 750గ్రా","పెరుగు 200గ్రా","ఉల్లిపాయలు 4","అల్లం వెల్లుల్లి పేస్ట్ 2 స్పూన్లు","బిర్యానీ మసాలా 3 స్పూన్లు","కుంకుమ పువ్వు చిటికెడు","నెయ్యి 4 స్పూన్లు"],
    preparationMethod:["చికెన్‌ను మ్యారినేట్ చేయాలి.","బియ్యాన్ని 70% ఉడికించాలి.","బిరిస్తా చేయాలి.","చికెన్ అడుగున, బియ్యం పైన పరచాలి.","దమ్‌పై 30 నిమిషాలు ఉడికించాలి."],
    cookingTips:"దమ్ కోసం అటా పిండితో మూత సీల్ చేయండి.",
    featuredImage: IMG.biryani, categoryId:"c1", categoryName:"అన్నం వంటకాలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"చికెన్ బిర్యానీ",
  },
  {
    id:"b3", title:"పులిహోర", slug:"pulihora-tamarind-rice",
    shortDescription:"పండుగల స్పెషల్ - చింతపండు పులిహోర!",
    content:"పులిహోర లేని పండుగను ఊహించలేం. చింతపండు పులుపు, వేరుశెనగ కరకర, కరివేపాకు ఘుమఘుమలతో ఈ అన్నం ఎంతో రుచిగా ఉంటుంది.",
    ingredients:["వండిన అన్నం 2 కప్పులు","చింతపండు గుజ్జు 3 స్పూన్లు","వేరుశెనగలు 2 స్పూన్లు","ఎండుమిర్చి 4","ఆవాలు, జీలకర్ర","పసుపు, ఉప్పు","నూనె 3 స్పూన్లు"],
    preparationMethod:["అన్నాన్ని చల్లార్చాలి.","పోపు వేయాలి.","చింతపండు గుజ్జు ఉడికించాలి.","అన్నంలో కలపాలి."],
    cookingTips:"చింతపండు గుజ్జు ముందే తయారు చేయండి.",
    featuredImage: IMG.pulihora, categoryId:"c1", categoryName:"అన్నం వంటకాలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"పులిహోర",
  },
  {
    id:"b4", title:"బొబ్బట్లు / పూరన్ పోలీ", slug:"bobbatlu-puran-poli",
    shortDescription:"తీపి ఇష్టపడే వారికి పండుగ స్పెషల్!",
    content:"బొబ్బట్లు తెలుగు వారి సంప్రదాయ తీపి వంటకం. శనగపప్పు, బెల్లం పూర్ణంతో తయారు చేసే ఈ వంటకం ఉగాది, సంక్రాంతికి తప్పనిసరి.",
    ingredients:["శనగపప్పు 1 కప్పు","బెల్లం 1 కప్పు","మైదా 1 కప్పు","యాలకుల పొడి","నెయ్యి"],
    preparationMethod:["పూర్ణం చేయాలి.","పిండి ముద్దలు చేయాలి.","పూర్ణం నింపి వత్తాలి.","పెనం మీద కాల్చాలి."],
    cookingTips:"పూర్ణం మెత్తగా రుబ్బితే బొబ్బట్లు చిరిగిపోకుండా వస్తాయి.",
    featuredImage: IMG.bobbatlu, categoryId:"c5", categoryName:"స్వీట్స్",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"బొబ్బట్లు",
  },
  {
    id:"b5", title:"గోంగూర పచ్చడి", slug:"gongura-pachadi",
    shortDescription:"ఆంధ్రుల అభిమాన పచ్చడి!",
    content:"గోంగూర పచ్చడి లేకుండా ఆంధ్ర భోజనం పూర్తి కాదు. పులుపు, కారం సమపాళ్లలో ఉండే ఈ పచ్చడి నెల రోజులు నిల్వ ఉంటుంది.",
    ingredients:["గోంగూర 2 కట్టలు","ఎండుమిర్చి 15","ఆవాలు 1 స్పూన్","మెంతులు","ఉప్పు","నూనె 1/2 కప్పు"],
    preparationMethod:["గోంగూర ఆరబెట్టాలి.","నూనెలో మగ్గించాలి.","పొడి చేయాలి.","రుబ్బాలి.","పోపు పెట్టాలి."],
    cookingTips:"గోంగూరలో నీరు ఉండకూడదు.",
    featuredImage: IMG.gongura, categoryId:"c4", categoryName:"వెజిటేరియన్",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"గోంగూర పచ్చడి",
  },
  {
    id:"b6", title:"రాగి సంగటి", slug:"ragi-sangati",
    shortDescription:"రాయలసీమ స్పెషల్ - ఆరోగ్యకరమైన ఆహారం!",
    content:"రాగి సంగటి రాయలసీమ ప్రాంతపు ప్రసిద్ధ ఆహారం. డయాబెటిక్ వారికి, బరువు తగ్గాలనుకునే వారికి చాలా మంచిది.",
    ingredients:["రాగి పిండి 2 కప్పులు","నీరు 4 కప్పులు","ఉప్పు","అన్నం కొద్దిగా"],
    preparationMethod:["నీటిని మరిగించాలి.","పిండి కలపాలి.","10 నిమిషాలు ఉడికించాలి.","ముద్దలు చేయాలి."],
    cookingTips:"వేడిగా ఉన్నప్పుడే ముద్ద చేయాలి.",
    featuredImage: IMG.ragi, categoryId:"c8", categoryName:"ఆరోగ్యకరమైన ఆహారం",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"రాగి సంగటి",
  },
  {
    id:"b7", title:"మామిడికాయ పప్పు", slug:"mamidikaya-pappu",
    shortDescription:"వేసవి స్పెషల్ - మామిడికాయ పులుపుతో కమ్మని పప్పు!",
    content:"మామిడికాయ సీజన్‌లో ఈ పప్పు ప్రతి ఇంట్లో చేస్తారు. వేడి అన్నం, నెయ్యితో తింటే స్వర్గమే.",
    ingredients:["కందిపప్పు 1 కప్పు","పచ్చి మామిడికాయ 1","పచ్చిమిర్చి 3","పసుపు","ఉప్పు","పోపు సామాను"],
    preparationMethod:["కుక్కర్‌లో ఉడికించాలి.","మెత్తగా రుబ్బాలి.","పోపు పెట్టాలి."],
    cookingTips:"ఎక్కువ పుల్లగా ఉంటే బెల్లం వేయండి.",
    featuredImage: IMG.mamidikaya, categoryId:"c2", categoryName:"కూరలు",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"published",
    createdAt: new Date().toISOString(), views:0, altText:"మామిడికాయ పప్పు",
  },
  {
    id:"b8", title:"అరిసెలు", slug:"ariselu",
    shortDescription:"సంక్రాంతి స్పెషల్ - నోరూరించే అరిసెలు!",
    content:"అరిసెలు తెలుగు సంప్రదాయ తీపి వంటకాల్లో రారాజు. సంక్రాంతికి ప్రతి ఇంట్లో తప్పకుండా చేస్తారు.",
    ingredients:["బియ్యం పిండి 2 కప్పులు","బెల్లం 1.5 కప్పులు","నువ్వులు 2 స్పూన్లు","నూనె"],
    preparationMethod:["పాకం పట్టాలి.","పిండి కలపాలి.","వత్తాలి.","వేయించాలి."],
    cookingTips:"పాకం సరిగ్గా రావడం ముఖ్యం.",
    featuredImage: IMG.ariselu, categoryId:"c5", categoryName:"స్వీట్స్",
    authorName:"అడ్మిన్", publishDate: todayISO(), status:"draft",
    createdAt: new Date().toISOString(), views:0, altText:"అరిసెలు",
  },
]);

/* ---- 5. Local keys ---- */
export const KEYS = {
  blogs:'telugu_food_blogs', categories:'telugu_food_categories',
  visitors:'telugu_food_visitors', admin:'telugu_admin_session',
  lastVisit:'telugu_last_visit', syncId:'telugu_food_sync_id',
};
export const safeParse = (raw, fb) => { try { return raw ? JSON.parse(raw) : fb; } catch { return fb; } };

let _syncChannel = null;
try { _syncChannel = new BroadcastChannel('telugu-food-sync'); } catch {}
function _emitSync(kind) {
  const payload = { kind, at: Date.now() };
  try { _syncChannel?.postMessage(payload); } catch {}
  window.dispatchEvent(new CustomEvent('food-sync', { detail: payload }));
}

/* ---- 6. DataService ---- */
export const DataService = {
  mode: 'local',
  app:null, db:null, auth:null, _firebase:null,
  _listeners: { blogs:new Set(), categories:new Set(), visitors:new Set() },
  _cloudState: { blogs:[], categories:[], visitors:{today:0,total:0} },
  _cloudPollTimer: null,
  _cloudWriteQueue: Promise.resolve(),

  async init() {
    if (isFirebaseConfigured()) {
      try {
        const [fbApp, fbFs, fbAuth] = await Promise.all([
          import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
          import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
          import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
        ]);
        this._firebase = { ...fbApp, ...fbFs, ...fbAuth };
        this.app  = fbApp.initializeApp(firebaseConfig);
        this.db   = fbFs.getFirestore(this.app);
        this.auth = fbAuth.getAuth(this.app);
        this.mode = 'firebase';
        console.info('%c[DataService] FIREBASE mode active','color:#2D5016;font-weight:bold');
        return 'firebase';
      } catch (err) { console.error('[DataService] Firebase init failed', err); }
    }
    if (CLOUD_SYNC_ID) {
      this.mode = 'cloud';
      console.info('%c[DataService] CLOUD mode active','color:#FF6B35;font-weight:bold');
      await this._cloudPull();
      this._startCloudPolling();
      return 'cloud';
    }
    this.mode = 'local';
    console.info('%c[DataService] LOCAL mode (same-device only)','color:#888;font-weight:bold');
    return 'local';
  },

  async seedIfEmpty() {
    if (this.mode === 'firebase') {
      const { collection, getDocs, writeBatch, doc, getDoc, setDoc } = this._firebase;
      const bSnap = await getDocs(collection(this.db, 'blogs'));
      if (bSnap.empty) {
        const b = writeBatch(this.db);
        DEFAULT_BLOGS().forEach(x => b.set(doc(this.db, 'blogs', x.id), x));
        await b.commit();
      }
      const cSnap = await getDocs(collection(this.db, 'categories'));
      if (cSnap.empty) {
        const b = writeBatch(this.db);
        DEFAULT_CATEGORIES.forEach(x => b.set(doc(this.db, 'categories', x.id), x));
        await b.commit();
      }
      const vRef = doc(this.db, 'settings', 'visitors');
      const vSnap = await getDoc(vRef);
      if (!vSnap.exists()) await setDoc(vRef, { today:0, total:0, lastVisitDate:null });
      return;
    }
    if (this.mode === 'cloud') {
      const cur = await this._cloudPull();
      if (!cur || (!cur.blogs?.length && !cur.categories?.length)) {
        const seed = {
          blogs: DEFAULT_BLOGS(),
          categories: DEFAULT_CATEGORIES,
          visitors: { today:0, total:0, lastVisitDate:null },
        };
        await this._cloudPush(seed);
        this._cloudState = seed;
      }
      return;
    }
    if (!localStorage.getItem(KEYS.blogs)) localStorage.setItem(KEYS.blogs, JSON.stringify(DEFAULT_BLOGS()));
    if (!localStorage.getItem(KEYS.categories)) localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    if (!localStorage.getItem(KEYS.visitors)) localStorage.setItem(KEYS.visitors, JSON.stringify({ today:0, total:0 }));
  },

  /* BLOGS */
  subscribeBlogs(cb) {
    if (this.mode === 'firebase') {
      const { collection, onSnapshot } = this._firebase;
      return onSnapshot(collection(this.db, 'blogs'),
        s => cb(s.docs.map(d => ({ id:d.id, ...d.data() }))),
        e => console.error('[blogs]', e));
    }
    if (this.mode === 'cloud') {
      this._listeners.blogs.add(cb);
      cb(this._cloudState.blogs || []);
      return () => this._listeners.blogs.delete(cb);
    }
    const handler = () => cb(this._readLocalBlogs());
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    _syncChannel?.addEventListener('message', handler);
    const iv = setInterval(handler, 2000);
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
    if (raw) { const p = safeParse(raw, null); if (Array.isArray(p) && p.length) return p; }
    const seed = DEFAULT_BLOGS();
    localStorage.setItem(KEYS.blogs, JSON.stringify(seed));
    return seed;
  },
  async saveBlog(blog) {
    if (this.mode === 'firebase') {
      const { doc, setDoc } = this._firebase;
      await setDoc(doc(this.db, 'blogs', blog.id), blog, { merge: true });
      return;
    }
    if (this.mode === 'cloud') {
      const list = [...(this._cloudState.blogs || [])];
      const i = list.findIndex(b => b.id === blog.id);
      if (i >= 0) list[i] = { ...list[i], ...blog }; else list.unshift(blog);
      this._cloudState.blogs = list;
      this._notify('blogs', list);
      await this._cloudPush(this._cloudState);
      return;
    }
    const list = this._readLocalBlogs();
    const i = list.findIndex(b => b.id === blog.id);
    if (i >= 0) list[i] = { ...list[i], ...blog }; else list.unshift(blog);
    localStorage.setItem(KEYS.blogs, JSON.stringify(list));
    _emitSync('blogs');
  },
  async deleteBlog(id) {
    if (this.mode === 'firebase') {
      const { doc, deleteDoc } = this._firebase;
      await deleteDoc(doc(this.db, 'blogs', id));
      return;
    }
    if (this.mode === 'cloud') {
      const list = (this._cloudState.blogs || []).filter(b => b.id !== id);
      this._cloudState.blogs = list;
      this._notify('blogs', list);
      await this._cloudPush(this._cloudState);
      return;
    }
    const list = this._readLocalBlogs().filter(b => b.id !== id);
    localStorage.setItem(KEYS.blogs, JSON.stringify(list));
    _emitSync('blogs');
  },

  /* CATEGORIES */
  subscribeCategories(cb) {
    if (this.mode === 'firebase') {
      const { collection, onSnapshot } = this._firebase;
      return onSnapshot(collection(this.db, 'categories'),
        s => cb(s.docs.map(d => ({ id:d.id, ...d.data() }))),
        e => console.error('[cats]', e));
    }
    if (this.mode === 'cloud') {
      this._listeners.categories.add(cb);
      cb(this._cloudState.categories || []);
      return () => this._listeners.categories.delete(cb);
    }
    const handler = () => cb(this._readLocalCategories());
    window.addEventListener('storage', handler);
    window.addEventListener('food-sync', handler);
    _syncChannel?.addEventListener('message', handler);
    const iv = setInterval(handler, 2000);
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
    if (raw) { const p = safeParse(raw, null); if (Array.isArray(p) && p.length) return p; }
    localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },
  async saveCategory(cat) {
    if (this.mode === 'firebase') {
      const { doc, setDoc } = this._firebase;
      await setDoc(doc(this.db, 'categories', cat.id), cat);
      return;
    }
    if (this.mode === 'cloud') {
      const list = [...(this._cloudState.categories || [])];
      const i = list.findIndex(c => c.id === cat.id);
      if (i >= 0) list[i] = cat; else list.push(cat);
      this._cloudState.categories = list;
      this._notify('categories', list);
      await this._cloudPush(this._cloudState);
      return;
    }
    const list = this._readLocalCategories();
    const i = list.findIndex(c => c.id === cat.id);
    if (i >= 0) list[i] = cat; else list.push(cat);
    localStorage.setItem(KEYS.categories, JSON.stringify(list));
    _emitSync('categories');
  },
  async deleteCategory(id) {
    if (this.mode === 'firebase') {
      const { doc, deleteDoc } = this._firebase;
      await deleteDoc(doc(this.db, 'categories', id));
      return;
    }
    if (this.mode === 'cloud') {
      const list = (this._cloudState.categories || []).filter(c => c.id !== id);
      this._cloudState.categories = list;
      this._notify('categories', list);
      await this._cloudPush(this._cloudState);
      return;
    }
    const list = this._readLocalCategories().filter(c => c.id !== id);
    localStorage.setItem(KEYS.categories, JSON.stringify(list));
    _emitSync('categories');
  },

  /* VISITORS */
  subscribeVisitors(cb) {
    if (this.mode === 'firebase') {
      const { doc, onSnapshot } = this._firebase;
      return onSnapshot(doc(this.db, 'settings', 'visitors'),
        s => cb(s.data() || { today:0, total:0 }),
        e => console.error('[visitors]', e));
    }
    if (this.mode === 'cloud') {
      this._listeners.visitors.add(cb);
      cb(this._cloudState.visitors || { today:0, total:0 });
      return () => this._listeners.visitors.delete(cb);
    }
    const handler = () => cb(this._readLocalVisitors());
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
    const p = safeParse(raw, null);
    if (p && typeof p === 'object') return p;
    const seed = { today:0, total:0 };
    localStorage.setItem(KEYS.visitors, JSON.stringify(seed));
    return seed;
  },
  async bumpVisitorCount() {
    const today = todayISO();
    if (this.mode === 'firebase') {
      const { doc, getDoc, setDoc } = this._firebase;
      const ref = doc(this.db, 'settings', 'visitors');
      const snap = await getDoc(ref);
      const cur = snap.data() || { today:0, total:0, lastVisitDate:null };
      if (cur.lastVisitDate === today) return cur;
      const next = { today:(cur.today||0)+1, total:(cur.total||0)+1, lastVisitDate:today };
      await setDoc(ref, next, { merge: true });
      return next;
    }
    if (this.mode === 'cloud') {
      const cur = this._cloudState.visitors || { today:0, total:0, lastVisitDate:null };
      if (cur.lastVisitDate === today) return cur;
      const next = { today:(cur.today||0)+1, total:(cur.total||0)+1, lastVisitDate:today };
      this._cloudState.visitors = next;
      this._notify('visitors', next);
      await this._cloudPush(this._cloudState);
      return next;
    }
    const cur = this._readLocalVisitors();
    const last = localStorage.getItem(KEYS.lastVisit);
    if (last === today) return cur;
    const next = { today:(cur.today||0)+1, total:(cur.total||0)+1 };
    localStorage.setItem(KEYS.visitors, JSON.stringify(next));
    localStorage.setItem(KEYS.lastVisit, today);
    _emitSync('visitors');
    return next;
  },

  /* AUTH */
  onAuthChange(cb) {
    if (this.mode === 'firebase') {
      const { onAuthStateChanged } = this._firebase;
      return onAuthStateChanged(this.auth, u => cb(!!u, u));
    }
    const handler = () => cb(localStorage.getItem(KEYS.admin) === 'active', null);
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
        return { ok:true };
      } catch (e) { return { ok:false, error:e.code || e.message }; }
    }
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

  /* CLOUD HELPERS */
  async _cloudPull() {
    try {
      const res = await fetch(`${CLOUD_BASE}/${CLOUD_SYNC_ID}`, {
        headers: { 'Accept':'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      this._cloudState = {
        blogs: data.blogs || [],
        categories: data.categories || [],
        visitors: data.visitors || { today:0, total:0 },
      };
      this._notify('blogs', this._cloudState.blogs);
      this._notify('categories', this._cloudState.categories);
      this._notify('visitors', this._cloudState.visitors);
      return this._cloudState;
    } catch (e) { console.warn('[cloud] pull failed', e); return null; }
  },
  _cloudPush(state) {
    this._cloudWriteQueue = this._cloudWriteQueue.then(async () => {
      try {
        const res = await fetch(`${CLOUD_BASE}/${CLOUD_SYNC_ID}`, {
          method: 'PUT',
          headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
          body: JSON.stringify(state),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return true;
      } catch (e) { console.warn('[cloud] push failed', e); return false; }
    });
    return this._cloudWriteQueue;
  },
  _startCloudPolling() {
    if (this._cloudPollTimer) clearInterval(this._cloudPollTimer);
    this._cloudPollTimer = setInterval(() => { this._cloudPull(); }, 3000);
  },
  _notify(kind, data) {
    const s = this._listeners[kind];
    if (!s) return;
    s.forEach(fn => { try { fn(data); } catch (e) { console.error(e); } });
  },
  async createCloudBlob() {
    try {
      const seed = {
        blogs: this._cloudState.blogs?.length ? this._cloudState.blogs : DEFAULT_BLOGS(),
        categories: this._cloudState.categories?.length ? this._cloudState.categories : DEFAULT_CATEGORIES,
        visitors: this._cloudState.visitors || { today:0, total:0, lastVisitDate:null },
      };
      const res = await fetch(CLOUD_BASE, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(seed),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const loc = res.headers.get('Location') || res.headers.get('location');
      const id = loc ? loc.split('/').pop() : null;
      if (!id) throw new Error('No Location header');
      return { ok:true, id };
    } catch (e) { return { ok:false, error: String(e) }; }
  },
};
