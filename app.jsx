const { useState, useMemo, useCallback, useEffect } = React;

// On load, import saved settings from settings.js into localStorage.
// settings.js is the source of truth — it overwrites localStorage on every page load.
// Edits during a session are saved to localStorage. Export to persist them.
(() => {
  if (typeof SAVED_SETTINGS === "object" && SAVED_SETTINGS !== null) {
    for (const [key, val] of Object.entries(SAVED_SETTINGS)) {
      localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
    }
  }
})();

const TAXONOMY = [
  {
    order: "Anseriformes", orderCommon: "Andfuglar",
    families: [{
      family: "Anatidae", familyCommon: "Andfuglar",
      species: [
        { common: "Graylag Goose", sci: "Anser anser", is: "Grágæs", tags: ["landscape","portrait"] },
        { common: "Pink-footed Goose", sci: "Anser brachyrhynchus", is: "Heiðagæs", tags: ["landscape","action"] },
        { common: "Greater White-fronted Goose", sci: "Anser albifrons", is: "Blesgæs", tags: ["landscape"], visitor: true },
        { common: "Barnacle Goose", sci: "Branta leucopsis", is: "Helsingi", tags: ["landscape"] },
        { common: "Brant", sci: "Branta bernicla", is: "Margæs", tags: ["landscape"], visitor: true },
        { common: "Whooper Swan", sci: "Cygnus cygnus", is: "Álft", tags: ["portrait","landscape"] },
        { common: "Gadwall", sci: "Mareca strepera", is: "Gráönd", tags: ["portrait"] },
        { common: "Eurasian Wigeon", sci: "Mareca penelope", is: "Rauðhöfðaönd", tags: ["portrait","landscape"] },
        { common: "Mallard", sci: "Anas platyrhynchos", is: "Stokkönd", tags: ["portrait","landscape"] },
        { common: "Northern Pintail", sci: "Anas acuta", is: "Grafönd", tags: ["portrait"] },
        { common: "Green-winged Teal", sci: "Anas crecca", is: "Urtönd", tags: ["portrait"] },
        { common: "Northern Shoveler", sci: "Spatula clypeata", is: "Skeifuönd", tags: ["portrait"] },
        { common: "Tufted Duck", sci: "Aythya fuligula", is: "Skúfönd", tags: ["portrait"] },
        { common: "Greater Scaup", sci: "Aythya marila", is: "Duggönd", tags: ["portrait","landscape"] },
        { common: "Common Eider", sci: "Somateria mollissima", is: "Æðarfugl", tags: ["portrait","landscape","action"] },
        { common: "King Eider", sci: "Somateria spectabilis", is: "Æðarkóngur", tags: ["portrait"], visitor: true },
        { common: "Harlequin Duck", sci: "Histrionicus histrionicus", is: "Straumönd", tags: ["portrait","action"] },
        { common: "Common Scoter", sci: "Melanitta nigra", is: "Hrafnsönd", tags: ["portrait"] },
        { common: "Long-tailed Duck", sci: "Clangula hyemalis", is: "Hávella", tags: ["portrait","landscape"] },
        { common: "Barrow's Goldeneye", sci: "Bucephala islandica", is: "Húsönd", tags: ["portrait","action"] },
        { common: "Common Merganser", sci: "Mergus merganser", is: "Gulönd", tags: ["portrait"] },
        { common: "Red-breasted Merganser", sci: "Mergus serrator", is: "Toppönd", tags: ["portrait","action"] },
      ],
    }],
  },
  {
    order: "Galliformes", orderCommon: "Hænsnfuglar",
    families: [{ family: "Phasianidae", familyCommon: "Orrar", species: [
      { common: "Rock Ptarmigan", sci: "Lagopus muta", is: "Rjúpa", tags: ["portrait","landscape"] },
    ]}],
  },
  {
    order: "Podicipediformes", orderCommon: "Goðar",
    families: [{ family: "Podicipedidae", familyCommon: "Goðar", species: [
      { common: "Horned Grebe", sci: "Podiceps auritus", is: "Flórgoði", tags: ["portrait","landscape"] },
    ]}],
  },
  {
    order: "Columbiformes", orderCommon: "Dúfur",
    families: [{ family: "Columbidae", familyCommon: "Dúfur", species: [
      { common: "Rock Pigeon", sci: "Columba livia", is: "Bjargdúfa", tags: ["portrait"] },
    ]}],
  },
  {
    order: "Charadriiformes", orderCommon: "Strandfuglar",
    families: [
      { family: "Haematopodidae", familyCommon: "Tjaldar", species: [
        { common: "Eurasian Oystercatcher", sci: "Haematopus ostralegus", is: "Tjaldur", tags: ["portrait","landscape"] },
      ]},
      { family: "Charadriidae", familyCommon: "Lóur", species: [
        { common: "European Golden-Plover", sci: "Pluvialis apricaria", is: "Heiðlóa", tags: ["portrait","landscape"] },
        { common: "Common Ringed Plover", sci: "Charadrius hiaticula", is: "Sandlóa", tags: ["portrait"] },
      ]},
      { family: "Scolopacidae", familyCommon: "Snípur", species: [
        { common: "Whimbrel", sci: "Numenius phaeopus", is: "Spói", tags: ["portrait","landscape"] },
        { common: "Black-tailed Godwit", sci: "Limosa limosa", is: "Jaðrakan", tags: ["portrait","action"] },
        { common: "Bar-tailed Godwit", sci: "Limosa lapponica", is: "Lappajaðrakan", tags: ["portrait"], visitor: true },
        { common: "Ruddy Turnstone", sci: "Arenaria interpres", is: "Tildra", tags: ["portrait"] },
        { common: "Red Knot", sci: "Calidris canutus", is: "Rauðbrystingur", tags: ["landscape"] },
        { common: "Sanderling", sci: "Calidris alba", is: "Sanderla", tags: ["action","landscape"] },
        { common: "Dunlin", sci: "Calidris alpina", is: "Lóuþræll", tags: ["portrait"] },
        { common: "Purple Sandpiper", sci: "Calidris maritima", is: "Sendlingur", tags: ["portrait","landscape"] },
        { common: "Common Snipe", sci: "Gallinago gallinago", is: "Hrossagaukur", tags: ["portrait","action"] },
        { common: "Red-necked Phalarope", sci: "Phalaropus lobatus", is: "Óðinshani", tags: ["portrait","action"] },
        { common: "Red Phalarope", sci: "Phalaropus fulicarius", is: "Þórshani", tags: ["portrait"] },
        { common: "Common Redshank", sci: "Tringa totanus", is: "Stelkur", tags: ["portrait","landscape"] },
      ]},
      { family: "Stercorariidae", familyCommon: "Kjóar og Skúmar", species: [
        { common: "Great Skua", sci: "Stercorarius skua", is: "Skúmur", tags: ["portrait","action"] },
        { common: "Arctic Skua", sci: "Stercorarius parasiticus", is: "Kjói", tags: ["action","landscape"] },
      ]},
      { family: "Alcidae", familyCommon: "Svartfuglar", species: [
        { common: "Dovekie", sci: "Alle alle", is: "Haftyrðill", tags: ["portrait"] },
        { common: "Common Murre", sci: "Uria aalge", is: "Langvía", tags: ["portrait","landscape"] },
        { common: "Thick-billed Murre", sci: "Uria lomvia", is: "Stuttnefja", tags: ["portrait"] },
        { common: "Razorbill", sci: "Alca torda", is: "Álka", tags: ["portrait","landscape"] },
        { common: "Black Guillemot", sci: "Cepphus grylle", is: "Teista", tags: ["portrait","action"] },
        { common: "Atlantic Puffin", sci: "Fratercula arctica", is: "Lundi", tags: ["portrait","action","landscape"] },
      ]},
      { family: "Laridae", familyCommon: "Máfar og Þernur", species: [
        { common: "Black-legged Kittiwake", sci: "Rissa tridactyla", is: "Rita", tags: ["portrait","landscape"] },
        { common: "Black-headed Gull", sci: "Chroicocephalus ridibundus", is: "Hettumáfur", tags: ["portrait"] },
        { common: "Common Gull", sci: "Larus canus", is: "Stormmáfur", tags: ["portrait"] },
        { common: "Herring Gull", sci: "Larus argentatus", is: "Silfurmáfur", tags: ["portrait","landscape"] },
        { common: "Iceland Gull", sci: "Larus glaucoides", is: "Bjartmáfur", tags: ["portrait"], visitor: true },
        { common: "Lesser Black-backed Gull", sci: "Larus fuscus", is: "Sílamáfur", tags: ["portrait","landscape"] },
        { common: "Glaucous Gull", sci: "Larus hyperboreus", is: "Hvítmáfur", tags: ["portrait"], visitor: true },
        { common: "Great Black-backed Gull", sci: "Larus marinus", is: "Svartbakur", tags: ["portrait","landscape"] },
        { common: "Arctic Tern", sci: "Sterna paradisaea", is: "Kría", tags: ["portrait","action"] },
      ]},
    ],
  },
  {
    order: "Gaviiformes", orderCommon: "Brúsar",
    families: [{ family: "Gaviidae", familyCommon: "Brúsar", species: [
      { common: "Red-throated Loon", sci: "Gavia stellata", is: "Lómur", tags: ["portrait","landscape"] },
      { common: "Common Loon", sci: "Gavia immer", is: "Himbrimi", tags: ["portrait","landscape"] },
    ]}],
  },
  {
    order: "Procellariiformes", orderCommon: "Pípunefir",
    families: [
      { family: "Hydrobatidae", familyCommon: "Sæsvölur", species: [
        { common: "European Storm Petrel", sci: "Hydrobates pelagicus", is: "Stormsvala", tags: ["action"] },
        { common: "Leach's Storm Petrel", sci: "Hydrobates leucorhous", is: "Sjósvala", tags: ["action"] },
      ]},
      { family: "Procellariidae", familyCommon: "Fýlingar", species: [
        { common: "Northern Fulmar", sci: "Fulmarus glacialis", is: "Fýll", tags: ["portrait","landscape","action"] },
        { common: "Manx Shearwater", sci: "Puffinus puffinus", is: "Skrofa", tags: ["action"] },
        { common: "Sooty Shearwater", sci: "Ardenna grisea", is: "Gráskrofa", tags: ["action"], visitor: true },
        { common: "Great Shearwater", sci: "Ardenna gravis", is: "Stórskrofa", tags: ["action"], visitor: true },
      ]},
    ],
  },
  {
    order: "Suliformes", orderCommon: "Súlur og Skarfar",
    families: [
      { family: "Sulidae", familyCommon: "Súlur", species: [
        { common: "Northern Gannet", sci: "Morus bassanus", is: "Súla", tags: ["portrait","action","landscape"] },
      ]},
      { family: "Phalacrocoracidae", familyCommon: "Skarfar", species: [
        { common: "Great Cormorant", sci: "Phalacrocorax carbo", is: "Dílaskarfur", tags: ["portrait","landscape"] },
        { common: "European Shag", sci: "Gulosus aristotelis", is: "Toppskarfur", tags: ["portrait"] },
      ]},
    ],
  },
  {
    order: "Accipitriformes", orderCommon: "Haukfuglar",
    families: [{ family: "Accipitridae", familyCommon: "Haukar og Ernir", species: [
      { common: "White-tailed Eagle", sci: "Haliaeetus albicilla", is: "Haförn", tags: ["portrait","action","landscape"] },
    ]}],
  },
  {
    order: "Strigiformes", orderCommon: "Uglur",
    families: [{ family: "Strigidae", familyCommon: "Uglur", species: [
      { common: "Short-eared Owl", sci: "Asio flammeus", is: "Brandugla", tags: ["portrait","action"] },
      { common: "Snowy Owl", sci: "Bubo scandiacus", is: "Snæugla", tags: ["portrait"], visitor: true },
    ]}],
  },
  {
    order: "Falconiformes", orderCommon: "Fálkar",
    families: [{ family: "Falconidae", familyCommon: "Fálkar", species: [
      { common: "Merlin", sci: "Falco columbarius", is: "Smyrill", tags: ["portrait","action"] },
      { common: "Gyrfalcon", sci: "Falco rusticolus", is: "Fálki", tags: ["portrait","action","landscape"] },
    ]}],
  },
  {
    order: "Passeriformes", orderCommon: "Spörfuglar",
    families: [
      { family: "Corvidae", familyCommon: "Hröfnungar", species: [
        { common: "Common Raven", sci: "Corvus corax", is: "Hrafn", tags: ["portrait","action","landscape"] },
      ]},
      { family: "Hirundinidae", familyCommon: "Svölur", species: [
        { common: "Sand Martin", sci: "Riparia riparia", is: "Bakkasvala", tags: ["action"] },
      ]},
      { family: "Phylloscopidae", familyCommon: "Kollar", species: [
        { common: "Goldcrest", sci: "Regulus regulus", is: "Glókollur", tags: ["portrait"] },
      ]},
      { family: "Troglodytidae", familyCommon: "Rindlar", species: [
        { common: "Eurasian Wren", sci: "Troglodytes troglodytes", is: "Músarrindill", tags: ["portrait"] },
      ]},
      { family: "Sturnidae", familyCommon: "Starar", species: [
        { common: "Common Starling", sci: "Sturnus vulgaris", is: "Stari", tags: ["portrait","landscape"] },
      ]},
      { family: "Turdidae", familyCommon: "Þrestir", species: [
        { common: "Redwing", sci: "Turdus iliacus", is: "Skógarþröstur", tags: ["portrait"] },
        { common: "Fieldfare", sci: "Turdus pilaris", is: "Gráþröstur", tags: ["portrait"], visitor: true },
        { common: "Eurasian Blackbird", sci: "Turdus merula", is: "Svartþröstur", tags: ["portrait"], visitor: true },
      ]},
      { family: "Muscicapidae", familyCommon: "Grípar", species: [
        { common: "Northern Wheatear", sci: "Oenanthe oenanthe", is: "Steindepill", tags: ["portrait","landscape"] },
      ]},
      { family: "Motacillidae", familyCommon: "Erlur", species: [
        { common: "White Wagtail", sci: "Motacilla alba", is: "Maríuerla", tags: ["portrait","action"] },
        { common: "Meadow Pipit", sci: "Anthus pratensis", is: "Þúfutittlingur", tags: ["portrait"] },
      ]},
      { family: "Fringillidae", familyCommon: "Finkur", species: [
        { common: "Common Redpoll", sci: "Acanthis flammea", is: "Auðnutittlingur", tags: ["portrait"] },
      ]},
      { family: "Calcariidae", familyCommon: "Tittlingar", species: [
        { common: "Snow Bunting", sci: "Plectrophenax nivalis", is: "Snjótittlingur", tags: ["portrait","landscape"] },
      ]},
      { family: "Sylviidae", familyCommon: "Söngvarar", species: [
        { common: "Blackcap", sci: "Sylvia atricapilla", is: "Hettusöngvari", tags: ["portrait"], visitor: true },
      ]},
    ],
  },
  {
    order: "Pelecaniformes", orderCommon: "Hegrafuglar",
    families: [{ family: "Ardeidae", familyCommon: "Hegrar", species: [
      { common: "Gray Heron", sci: "Ardea cinerea", is: "Gráhegri", tags: ["portrait"], visitor: true },
    ]}],
  },
];

// PHOTOS is built from PHOTO_MANIFEST (generated by scan-photos.js)
// In the local version, photos are loaded from the /photos folder.
// PHOTO_MANIFEST is loaded via <script src="photo-manifest.js"> in index.html
const PHOTOS_FROM_MANIFEST = typeof PHOTO_MANIFEST !== 'undefined' ? PHOTO_MANIFEST : {};
const PHOTOS_BUILT = {};
for (const [sci, files] of Object.entries(PHOTOS_FROM_MANIFEST)) {
  PHOTOS_BUILT[sci] = files.map(f => ({
    thumb: f.file,
    full: f.file,
  }));
}
const PHOTOS = PHOTOS_BUILT;

const ORDER_HUE = {
  Anseriformes: 195, Galliformes: 35, Podicipediformes: 155,
  Columbiformes: 280, Charadriiformes: 210, Gaviiformes: 190,
  Procellariiformes: 220, Suliformes: 165, Accipitriformes: 30,
  Strigiformes: 270, Falconiformes: 20, Passeriformes: 140,
};

const TAG_INFO = {
  portrait: { label: "Portrait", color: "#b89970", bg: "#f5efe6" },
  landscape: { label: "Landscape", color: "#6ea87a", bg: "#e8f2eb" },
  action: { label: "Action", color: "#7089a8", bg: "#e8ecf2" },
};

/* ── Breadcrumb ─────────────────────────────────────────────── */
function Breadcrumb({ path, onNav }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, marginBottom: 20 }}>
      {path.map((p, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {i > 0 && <span style={{ margin: "0 8px", color: "#d0cbc3", fontSize: 13 }}>›</span>}
          <button onClick={() => onNav(i)} style={{
            background: "none", border: "none", padding: "3px 0",
            cursor: i < path.length - 1 ? "pointer" : "default",
            fontFamily: "inherit", fontSize: "inherit",
            color: i === path.length - 1 ? "#2a2a2a" : "#a09888",
            textDecoration: i < path.length - 1 ? "underline" : "none",
            textDecorationColor: "#ddd", textUnderlineOffset: 3,
          }}>{p}</button>
        </span>
      ))}
    </div>
  );
}

/* ── Mood presets ───────────────────────────────────────────── */
const MOODS = [
  { key: "light", label: "Light", bg: "#f8f7f4", text: "#1a1a1a" },
  { key: "warm", label: "Warm", bg: "#f5f0e6", text: "#2a2218" },
  { key: "cool", label: "Cool", bg: "#eef2f5", text: "#1a2a33" },
  { key: "dark", label: "Dark", bg: "#1a1a1a", text: "#f0ece4" },
  { key: "midnight", label: "Midnight", bg: "#0f1520", text: "#c8d0dc" },
  { key: "forest", label: "Forest", bg: "#1a2418", text: "#d4ddc8" },
  { key: "slate", label: "Slate", bg: "#2a2d30", text: "#d8d4ce" },
  { key: "sand", label: "Sand", bg: "#e8dfd0", text: "#3a3028" },
];

/* ── Default auto-layouts (% based) ───────────────────────── */
function autoLayout(n) {
  if (n === 1) return [{ x: 5, y: 2, w: 90, h: 96 }];
  if (n === 2) return [
    { x: 1, y: 2, w: 48.5, h: 96 },
    { x: 50.5, y: 2, w: 48.5, h: 96 },
  ];
  if (n === 3) return [
    { x: 1, y: 2, w: 58, h: 96 },
    { x: 60, y: 2, w: 39, h: 47 },
    { x: 60, y: 51, w: 39, h: 47 },
  ];
  // 4+: hero top, rest bottom
  const cols = n - 1;
  const cw = (98 - (cols - 1) * 1) / cols;
  return [
    { x: 1, y: 2, w: 98, h: 60 },
    ...Array.from({ length: cols }, (_, i) => ({
      x: 1 + i * (cw + 1), y: 64, w: cw, h: 34,
    })),
  ];
}

/* ── Species full page ──────────────────────────────────────── */
function SpeciesPage({ sp, hue, onBack }) {
  const [editing, setEditing] = useState(false);
  const [cropMode, setCropMode] = useState(false); // true = pan/zoom images, false = move/resize boxes
  const [config, setConfig] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(null); // { idx, startX, startY, origX, origY }
  const [resizing, setResizing] = useState(null); // { idx, startX, startY, origW, origH, corner }
  const [cropping, setCropping] = useState(null); // { idx, startX, startY, origPanX, origPanY }
  const canvasRef = React.useRef(null);

  if (!sp) return null;
  const photos = PHOTOS[sp.sci] || [];
  const n = photos.length;
  const storageKey = `sp:${sp.sci.replace(/ /g, "_")}`;

  // Load config
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setConfig(JSON.parse(raw));
      } catch (e) {}
      setLoaded(true);
    })();
  }, [storageKey]);

  const saveTimerRef = React.useRef(null);
  const saveConfig = useCallback(async (newConfig) => {
    setConfig(newConfig);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try { localStorage.setItem(storageKey, JSON.stringify(newConfig)); }
      catch (e) {}
    }, 300);
  }, [storageKey]);

  const mood = MOODS.find(m => m.key === (config?.mood || "light")) || MOODS[0];
  const photoOrder = config?.order || photos.map((_, i) => i);
  const hiddenSet = new Set(config?.hidden || []);
  const posterIdx = config?.poster ?? null; // original photo index used as poster in grid
  const ordered = photoOrder.map(i => photos[i]).filter(Boolean);
  const visible = ordered.filter((_, i) => !hiddenSet.has(photoOrder[i]));
  const visibleCount = visible.length;
  const positions = config?.positions || autoLayout(visibleCount);
  const crops = config?.crops || {}; // { idx: { panX: 50, panY: 50, scale: 1 } }
  const posRef = React.useRef(positions);
  posRef.current = positions;
  const cropsRef = React.useRef(crops);
  cropsRef.current = crops;
  const configRef = React.useRef(config);
  configRef.current = config;

  const updatePositions = useCallback((newPos) => {
    const c = configRef.current;
    saveConfig({ ...c, positions: newPos });
  }, [saveConfig]);

  const setMood = (m) => saveConfig({ ...configRef.current, mood: m });
  
  const swapPhotos = (a, b) => {
    const cur = configRef.current;
    const curOrder = cur?.order || photos.map((_, i) => i);
    const newOrder = [...curOrder];
    [newOrder[a], newOrder[b]] = [newOrder[b], newOrder[a]];
    saveConfig({ ...cur, order: newOrder });
  };

  const resetLayout = () => {
    saveConfig({ ...configRef.current, positions: autoLayout(visibleCount) });
  };

  const toggleHidden = (origIdx) => {
    const cur = configRef.current;
    const curHidden = new Set(cur?.hidden || []);
    if (curHidden.has(origIdx)) {
      curHidden.delete(origIdx);
    } else {
      curHidden.add(origIdx);
    }
    const newHidden = [...curHidden];
    // Recalculate layout for new visible count
    const newVisibleCount = n - newHidden.length;
    saveConfig({ ...cur, hidden: newHidden, positions: autoLayout(newVisibleCount), crops: {} });
  };

  const setPoster = (origIdx) => {
    saveConfig({ ...configRef.current, poster: origIdx });
  };

  const getCrop = (idx) => {
    const c = cropsRef.current[idx];
    return { panX: c?.panX ?? 50, panY: c?.panY ?? 50, scale: c?.scale ?? 1 };
  };

  const updateCrop = (idx, patch) => {
    const cur = { ...cropsRef.current };
    cur[idx] = { ...getCrop(idx), ...patch };
    saveConfig({ ...configRef.current, crops: cur });
  };

  // Mouse handlers for drag
  const onMouseDown = (e, idx) => {
    if (!editing) return;
    e.preventDefault();
    if (cropMode) {
      // Start crop-panning
      const crop = getCrop(idx);
      setCropping({ idx, startX: e.clientX, startY: e.clientY, origPanX: crop.panX, origPanY: crop.panY });
    } else {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragging({ idx, startX: e.clientX, startY: e.clientY, origX: posRef.current[idx].x, origY: posRef.current[idx].y, rect });
    }
  };

  const onResizeDown = (e, idx, corner) => {
    if (!editing) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const p = posRef.current[idx];
    setResizing({ idx, startX: e.clientX, startY: e.clientY, origW: p.w, origH: p.h, origX: p.x, origY: p.y, corner, rect });
  };

  const onMouseMove = useCallback((e) => {
    if (cropping) {
      const { idx, startX, startY, origPanX, origPanY } = cropping;
      // Move pan: dragging right moves objectPosition left (reveals right side)
      const dx = (e.clientX - startX) * -0.25;
      const dy = (e.clientY - startY) * -0.25;
      const panX = Math.max(0, Math.min(100, origPanX + dx));
      const panY = Math.max(0, Math.min(100, origPanY + dy));
      updateCrop(idx, { panX, panY });
    }
    if (dragging) {
      const { idx, startX, startY, origX, origY, rect } = dragging;
      const dx = ((e.clientX - startX) / rect.width) * 100;
      const dy = ((e.clientY - startY) / rect.height) * 100;
      const cur = [...posRef.current];
      cur[idx] = { ...cur[idx], x: Math.max(0, Math.min(100 - cur[idx].w, origX + dx)), y: Math.max(0, Math.min(100 - cur[idx].h, origY + dy)) };
      saveConfig({ ...configRef.current, positions: cur });
    }
    if (resizing) {
      const { idx, startX, startY, origW, origH, origX, origY, corner, rect } = resizing;
      const dx = ((e.clientX - startX) / rect.width) * 100;
      const dy = ((e.clientY - startY) / rect.height) * 100;
      const cur = [...posRef.current];
      let nx = origX, ny = origY, nw = origW, nh = origH;
      if (corner.includes("r")) nw = Math.max(10, origW + dx);
      if (corner.includes("l")) { nw = Math.max(10, origW - dx); nx = origX + (origW - nw); }
      if (corner.includes("b")) nh = Math.max(8, origH + dy);
      if (corner.includes("t")) { nh = Math.max(8, origH - dy); ny = origY + (origH - nh); }
      cur[idx] = { ...cur[idx], x: Math.max(0, nx), y: Math.max(0, ny), w: Math.min(100, nw), h: Math.min(100, nh) };
      saveConfig({ ...configRef.current, positions: cur });
    }
  }, [cropping, dragging, resizing, saveConfig]);

  const onMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
    setCropping(null);
  }, []);

  // Wheel handler for crop zoom
  const onCropWheel = useCallback((e, idx) => {
    if (!editing || !cropMode) return;
    e.preventDefault();
    const crop = getCrop(idx);
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const scale = Math.max(1, Math.min(4, crop.scale + delta));
    updateCrop(idx, { scale });
  }, [editing, cropMode]);

  // Attach global mouse listeners during drag/resize/crop
  useEffect(() => {
    if (dragging || resizing || cropping) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
    }
  }, [dragging, resizing, cropping, onMouseMove, onMouseUp]);

  if (!loaded) return null;

  const resizeHandle = (idx, corner, cursor, posStyle) => (
    <div onMouseDown={e => onResizeDown(e, idx, corner)}
      style={{
        position: "absolute", ...posStyle,
        width: 12, height: 12, cursor,
        background: `hsl(${hue}, 30%, 55%)`, borderRadius: 2,
        opacity: 0.8, zIndex: 2,
      }} />
  );

  return (
    <div style={{
      height: "100vh", background: mood.bg,
      display: "flex", flexDirection: "column",
      padding: "14px 16px 16px",
      overflow: "hidden",
      transition: "background .3s",
      userSelect: (dragging || resizing || cropping) ? "none" : "auto",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        marginBottom: 10, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: `hsl(${hue}, 22%, 28%)`, border: "none", borderRadius: 16,
          padding: "6px 16px", cursor: "pointer",
          fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
          color: "#f5f0e8",
        }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 22, fontWeight: 600, margin: 0, color: mood.text,
            transition: "color .3s",
          }}>{sp.is}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 1 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: mood.text, opacity: 0.5, fontStyle: "italic" }}>{sp.sci}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: mood.text, opacity: 0.4 }}>{sp.common}</span>
            {sp.visitor && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: mood.text, opacity: 0.5, border: `1px solid ${mood.text}44`, borderRadius: 8, padding: "1px 7px" }}>gestur</span>}
          </div>
        </div>
        <button onClick={() => { if (editing) setCropMode(false); setEditing(!editing); }} style={{
          background: editing ? `hsl(${hue}, 30%, 50%)` : "transparent",
          border: editing ? "none" : `1px solid ${mood.text}33`,
          borderRadius: 16, padding: "5px 14px", cursor: "pointer",
          fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5,
          color: editing ? "#fff" : mood.text,
          opacity: editing ? 1 : 0.5,
        }}>{editing ? "✓ Done" : "✎ Edit"}</button>
      </div>

      {/* Edit toolbar */}
      {editing && (
        <div style={{
          flexShrink: 0, marginBottom: 8,
          display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap",
        }}>
          {/* Mood */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Mood</div>
            <div style={{ display: "flex", gap: 4 }}>
              {MOODS.map(m => (
                <button key={m.key} onClick={() => setMood(m.key)} style={{
                  width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
                  background: m.bg, border: mood.key === m.key ? `2px solid hsl(${hue}, 30%, 55%)` : `1px solid ${m.text}33`,
                }} title={m.label} />
              ))}
            </div>
          </div>

          {/* Photo order & visibility */}
          {n > 1 && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Photos (click to swap, ✕ hide, ★ poster)</div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {ordered.map((p, i) => {
                  const origIdx = photoOrder[i];
                  const isHidden = hiddenSet.has(origIdx);
                  const isPoster = posterIdx === origIdx;
                  return (
                    <div key={i} style={{ position: "relative" }}>
                      <button onClick={() => { if (!isHidden && i < n - 1) swapPhotos(i, i + 1); }}
                        style={{
                          width: 36, height: 24, borderRadius: 3, overflow: "hidden",
                          border: `2px solid ${isHidden ? "#f44" : (isPoster ? "#f5c542" : `${mood.text}22`)}`,
                          padding: 0, cursor: (!isHidden && i < n - 1) ? "pointer" : "default",
                          opacity: isHidden ? 0.3 : 1,
                          filter: isHidden ? "grayscale(1)" : "none",
                        }}>
                        <img src={p.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                      {/* Hide/show button */}
                      <button onClick={() => toggleHidden(origIdx)}
                        title={isHidden ? "Show photo" : "Hide photo"}
                        style={{
                          position: "absolute", top: -6, right: -6,
                          width: 14, height: 14, borderRadius: "50%",
                          background: isHidden ? `hsl(${hue}, 40%, 50%)` : "rgba(200,50,50,0.85)",
                          color: "#fff", border: "none", cursor: "pointer",
                          fontFamily: "'JetBrains Mono',monospace", fontSize: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          lineHeight: 1, padding: 0,
                        }}>{isHidden ? "+" : "×"}</button>
                      {/* Poster button */}
                      <button onClick={() => setPoster(origIdx)}
                        title={isPoster ? "Current poster" : "Set as poster"}
                        style={{
                          position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
                          width: 14, height: 14, borderRadius: "50%",
                          background: isPoster ? "#f5c542" : "rgba(100,100,100,0.6)",
                          color: isPoster ? "#000" : "#fff", border: "none", cursor: "pointer",
                          fontFamily: "sans-serif", fontSize: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          lineHeight: 1, padding: 0,
                        }}>★</button>
                    </div>
                  );
                })}
              </div>
              {hiddenSet.size > 0 && (
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginTop: 3 }}>
                  {hiddenSet.size} hidden · <span onClick={() => saveConfig({ ...configRef.current, hidden: [], positions: autoLayout(n), crops: {} })} style={{ cursor: "pointer", textDecoration: "underline" }}>show all</span>
                </div>
              )}
            </div>
          )}

          {/* Reset */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginBottom: 4 }}>&nbsp;</div>
            <button onClick={resetLayout} style={{
              padding: "3px 10px", borderRadius: 10, cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
              background: `${mood.text}11`, color: mood.text, border: `1px solid ${mood.text}22`,
              opacity: 0.6,
            }}>Reset Layout</button>
          </div>

          {/* Crop mode toggle */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Mode</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setCropMode(false)} style={{
                padding: "3px 10px", borderRadius: 10, cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                background: !cropMode ? `hsl(${hue}, 30%, 50%)` : `${mood.text}11`,
                color: !cropMode ? "#fff" : mood.text,
                border: !cropMode ? "none" : `1px solid ${mood.text}22`,
              }}>↕ Move</button>
              <button onClick={() => setCropMode(true)} style={{
                padding: "3px 10px", borderRadius: 10, cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                background: cropMode ? `hsl(${hue}, 30%, 50%)` : `${mood.text}11`,
                color: cropMode ? "#fff" : mood.text,
                border: cropMode ? "none" : `1px solid ${mood.text}22`,
              }}>✂ Crop</button>
            </div>
          </div>

          {/* Reset crops */}
          {cropMode && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: mood.text, opacity: 0.4, marginBottom: 4 }}>&nbsp;</div>
              <button onClick={() => saveConfig({ ...configRef.current, crops: {} })} style={{
                padding: "3px 10px", borderRadius: 10, cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                background: `${mood.text}11`, color: mood.text, border: `1px solid ${mood.text}22`,
                opacity: 0.6,
              }}>Reset Crops</button>
            </div>
          )}
        </div>
      )}

      {/* Canvas — photos positioned absolutely in % */}
      <div ref={canvasRef} style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {visibleCount === 0 && (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 64, opacity: 0.15 }}>🐦</span>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: mood.text, opacity: 0.5, marginTop: 8 }}>{n === 0 ? "No photos yet" : "All photos hidden"}</div>
            </div>
          </div>
        )}
        {visible.map((p, i) => {
          const pos = positions[i] || { x: 0, y: 0, w: 30, h: 30 };
          const crop = getCrop(i);
          const isCropMode = editing && cropMode;
          return (
            <div key={i}
              onMouseDown={e => onMouseDown(e, i)}
              onWheel={e => onCropWheel(e, i)}
              style={{
                position: "absolute",
                left: `${pos.x}%`, top: `${pos.y}%`,
                width: `${pos.w}%`, height: `${pos.h}%`,
                overflow: "hidden",
                cursor: editing ? (cropMode ? "crosshair" : "move") : "default",
                outline: editing ? `1px dashed ${isCropMode ? `hsl(${hue}, 50%, 60%)` : `${mood.text}33`}` : "none",
                zIndex: (dragging?.idx === i || cropping?.idx === i) ? 10 : 1,
              }}>
              <img src={p.full} alt={sp.is} style={{
                width: "100%", height: "100%",
                objectFit: crop.scale > 1 ? "cover" : "contain",
                objectPosition: `${crop.panX}% ${crop.panY}%`,
                transform: crop.scale > 1 ? `scale(${crop.scale})` : "none",
                transformOrigin: `${crop.panX}% ${crop.panY}%`,
                pointerEvents: "none",
              }} />
              {/* Crop zoom indicator */}
              {isCropMode && crop.scale > 1 && (
                <div style={{
                  position: "absolute", bottom: 4, right: 4,
                  background: "rgba(0,0,0,0.6)", color: "#fff",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                  padding: "1px 6px", borderRadius: 8,
                }}>{crop.scale.toFixed(1)}×</div>
              )}
              {/* Crop hint */}
              {isCropMode && crop.scale === 1 && (
                <div style={{
                  position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 8,
                  padding: "1px 8px", borderRadius: 8, whiteSpace: "nowrap",
                }}>scroll to zoom</div>
              )}
              {/* Resize handles in edit mode (only in move mode) */}
              {editing && !cropMode && <>
                {resizeHandle(i, "rb", "se-resize", { bottom: -2, right: -2 })}
                {resizeHandle(i, "lb", "sw-resize", { bottom: -2, left: -2 })}
                {resizeHandle(i, "rt", "ne-resize", { top: -2, right: -2 })}
                {resizeHandle(i, "lt", "nw-resize", { top: -2, left: -2 })}
                {resizeHandle(i, "r", "e-resize", { top: "50%", right: -2, marginTop: -6 })}
                {resizeHandle(i, "l", "w-resize", { top: "50%", left: -2, marginTop: -6 })}
                {resizeHandle(i, "b", "s-resize", { bottom: -2, left: "50%", marginLeft: -6 })}
                {resizeHandle(i, "t", "n-resize", { top: -2, left: "50%", marginLeft: -6 })}
              </>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
function App() {
  const [orderIdx, setOrderIdx] = useState(null);
  const [famIdx, setFamIdx] = useState(null);
  const [selectedSp, setSelectedSp] = useState(null);
  const [filter, setFilter] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const total = TAXONOMY.reduce((s, o) => s + o.families.reduce((s2, f) => s2 + f.species.length, 0), 0);
  const curOrder = orderIdx !== null ? TAXONOMY[orderIdx] : null;
  const curFam = famIdx !== null && curOrder ? curOrder.families[famIdx] : null;
  const hue = curOrder ? ORDER_HUE[curOrder.order] || 0 : 0;

  // Build genus groups
  const genusGroups = useMemo(() => {
    if (!curFam) return [];
    const sp = filter ? curFam.species.filter(s => s.tags.includes(filter)) : curFam.species;
    const map = new Map();
    sp.forEach(s => {
      const genus = s.sci.split(" ")[0];
      if (!map.has(genus)) map.set(genus, []);
      map.get(genus).push(s);
    });
    return Array.from(map.entries()).map(([genus, species]) => ({ genus, species }));
  }, [curFam, filter]);

  // Breadcrumb
  const crumbs = ["Fuglar"];
  if (curOrder) crumbs.push(curOrder.orderCommon);
  if (curFam) crumbs.push(curFam.familyCommon);

  // Dynamic root node
  const rootLabel = curFam ? curFam.familyCommon
    : curOrder ? curOrder.orderCommon
    : "Fuglar";
  const rootSub = curFam ? `${curFam.family} · ${curFam.species.length} species`
    : curOrder ? `${curOrder.order} · ${curOrder.families.reduce((s,f) => s + f.species.length, 0)} species`
    : `${total} breeding species`;
  const rootHue = curOrder ? ORDER_HUE[curOrder.order] || 0 : -1;

  const goTo = useCallback((level) => {
    if (level === 0) { setOrderIdx(null); setFamIdx(null); }
    else if (level === 1) { setFamIdx(null); }
    setAnimKey(k => k + 1);
  }, []);

  const pickOrder = useCallback(i => {
    setOrderIdx(i);
    if (TAXONOMY[i].families.length === 1) { setFamIdx(0); }
    else { setFamIdx(null); }
    setAnimKey(k => k + 1);
  }, []);

  const pickFam = useCallback(i => { setFamIdx(i); setAnimKey(k => k + 1); }, []);

  // Export all species settings from localStorage as a settings.js file
  const exportSettings = () => {
    const allSettings = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("sp:")) {
        allSettings[key] = localStorage.getItem(key);
      }
    }
    const js = "// Auto-generated by Export Settings in the app.\n// Do not edit manually.\nvar SAVED_SETTINGS = " + JSON.stringify(allSettings, null, 2) + ";\n";
    const blob = new Blob([js], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settings.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import: load a settings.js file and apply to localStorage
  const importSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".js";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          // Extract JSON from the var SAVED_SETTINGS = {...}; line
          const text = ev.target.result;
          const match = text.match(/var SAVED_SETTINGS\s*=\s*(\{[\s\S]*\})\s*;/);
          if (match) {
            const settings = JSON.parse(match[1]);
            for (const [key, val] of Object.entries(settings)) {
              localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
            }
            window.location.reload();
          }
        } catch (err) {
          console.error("Failed to import settings:", err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Levels: 0=orders, 1=families, 2=species (with genus groups)
  const isSpeciesLevel = curFam !== null;

  // Tree items for order/family levels
  let items = [], nodeW = 164, nodeH = 54, cols = 4;
  if (orderIdx === null) {
    items = TAXONOMY.map((o, i) => ({
      key: o.order, label: o.orderCommon, sub: o.order,
      count: o.families.reduce((s, f) => s + f.species.length, 0),
      hue: ORDER_HUE[o.order] || 0, idx: i,
    }));
    nodeW = 164; nodeH = 54; cols = 4;
  } else if (!isSpeciesLevel) {
    items = curOrder.families.map((f, i) => ({
      key: f.family, label: f.familyCommon, sub: f.family,
      count: f.species.length, hue, idx: i,
    }));
    nodeW = 185; nodeH = 50; cols = Math.min(items.length, 3);
  }

  // SVG layout for tree levels
  const ROOT_W = curFam ? 220 : curOrder ? 210 : 170;
  const ROOT_H = 44, ROOT_Y = 8, GAP_Y = 56;
  const CHILD_Y = ROOT_Y + ROOT_H + GAP_Y;
  const gap = 14;

  const rows = !isSpeciesLevel ? Math.ceil(items.length / cols) : 0;
  const gridW = cols * nodeW + (cols - 1) * gap;
  const svgW = Math.max(520, gridW + 80);
  const svgH = !isSpeciesLevel ? CHILD_Y + rows * (nodeH + gap + 16) + 30 : ROOT_H + 28;
  const rootX = svgW / 2;
  const gridLeft = (svgW - gridW) / 2;

  const positioned = !isSpeciesLevel ? items.map((it, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return { ...it, x: gridLeft + c * (nodeW + gap) + nodeW / 2, y: CHILD_Y + r * (nodeH + gap + 16) };
  }) : [];

  // If a species is selected, show full-page species view
  if (selectedSp) {
    return <SpeciesPage sp={selectedSp} hue={hue} onBack={() => setSelectedSp(null)} />;
  }

  return (
    <div style={{
      height: "100vh", background: "#f8f7f4",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "14px 16px 24px",
      overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box}
        @keyframes nodeIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalFade{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:none}}
        .tree-node{animation:nodeIn .4s ease both}
        .sp-card{animation:cardIn .35s ease both}
        .modal-in{animation:modalFade .25s ease both}
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 900, marginBottom: 4 }}>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 22, fontWeight: 600, margin: "0 0 3px", color: "#1a1a1a" }}>
          Breeding Birds of Iceland
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10.5, color: "#b0a89e" }}>{total} species · ✦ = visitor · click to explore</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={exportSettings} title="Download settings.js — drop into project folder and push to GitHub" style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
              padding: "3px 10px", borderRadius: 10, cursor: "pointer",
              background: "#f5f0e8", color: "#8a8070", border: "1px solid #d0cdc8",
            }}>⬇ Export Settings</button>
            <button onClick={importSettings} title="Load a settings.js file" style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
              padding: "3px 10px", borderRadius: 10, cursor: "pointer",
              background: "#f5f0e8", color: "#8a8070", border: "1px solid #d0cdc8",
            }}>⬆ Import</button>
          </div>
        </div>
      </div>

      {/* Breadcrumb + filters */}
      <div style={{ width: "100%", maxWidth: 900, marginTop: 6,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <Breadcrumb path={crumbs} onNav={goTo} />
        {isSpeciesLevel && (
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(TAG_INFO).map(([k, v]) => (
              <button key={k} onClick={() => setFilter(filter === k ? null : k)} style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                padding: "4px 10px", borderRadius: 14,
                border: filter === k ? `1.5px solid ${v.color}` : "1px solid #e0ddd8",
                background: filter === k ? v.bg : "#fff",
                color: filter === k ? v.color : "#aaa",
                cursor: "pointer", transition: "all .2s",
              }}>{v.label}</button>
            ))}
          </div>
        )}
      </div>

      <div key={animKey} style={{
        width: "100%", maxWidth: 900,
        flex: !isSpeciesLevel ? 1 : undefined,
        display: "flex", flexDirection: "column",
      }}>
        {/* Root pill — always shown */}
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 6px" }}>
          <button
            onClick={() => { if (curFam) goTo(1); else if (curOrder) goTo(0); }}
            className="tree-node"
            style={{
              background: rootHue >= 0 ? `hsl(${rootHue}, 22%, 28%)` : "#1a1a1a",
              border: "none", borderRadius: 24, padding: "10px 28px",
              cursor: orderIdx !== null ? "pointer" : "default",
              textAlign: "center",
            }}>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 15, fontWeight: 700, color: "#f5f0e8" }}>{rootLabel}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9, color: rootHue >= 0 ? `hsl(${rootHue}, 14%, 60%)` : "#807868",
              marginTop: 1 }}>{rootSub}</div>
          </button>
        </div>

        {/* Tree nodes for order/family levels — fills remaining space */}
        {!isSpeciesLevel && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: "1fr",
            gap: 10, marginTop: 12,
            flex: 1,
          }}>
            {items.map((p, i) => (
              <button key={p.key} className="tree-node"
                style={{
                  animationDelay: `${0.06 + i * 0.035}s`,
                  background: "#fff", border: "1px solid #e2dfda",
                  borderRadius: 12, padding: "16px 18px",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  gap: 6,
                  transition: "border-color .2s, box-shadow .2s",
                  minHeight: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `hsl(${p.hue || hue}, 20%, 72%)`; e.currentTarget.style.boxShadow = "0 3px 16px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2dfda"; e.currentTarget.style.boxShadow = "none"; }}
                onClick={() => orderIdx === null ? pickOrder(p.idx) : pickFam(p.idx)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                    background: `hsl(${p.hue || hue}, 28%, 65%)`,
                  }} />
                  <div style={{ fontFamily: "'Playfair Display',Georgia,serif",
                    fontSize: 18, fontWeight: 500, color: "#2a2a2a" }}>
                    {p.label}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingLeft: 20 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9.5, color: "#bbb", fontStyle: "italic" }}>
                    {p.sub}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9.5, color: "#d0cbc3" }}>{p.count} sp.</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Species view — genus groups flow inline, shrink-wrapped */}
        {isSpeciesLevel && (() => {
          const totalSp = genusGroups.reduce((s, g) => s + g.species.length, 0);
          // Scale card size: fewer species = bigger cards
          const CARD_W = totalSp <= 2 ? 280 : totalSp <= 4 ? 240 : totalSp <= 8 ? 210 : totalSp <= 15 ? 185 : 160;
          return (
          <div style={{
            marginTop: 20,
            display: "flex", flexWrap: "wrap", gap: 12,
            alignItems: "flex-start", justifyContent: "center",
          }}>
            {genusGroups.map((g, gi) => {
              const count = g.species.length;
              // Balanced rows: find the most even split (max 5 per row)
              let perRow;
              if (count <= 5) perRow = count;
              else if (count % 4 === 0) perRow = 4;
              else if (count % 3 === 0) perRow = 3;
              else if (count % 5 === 0) perRow = 5;
              else if (count <= 8) perRow = Math.ceil(count / 2);
              else perRow = Math.ceil(count / Math.ceil(count / 4));
              const innerW = perRow * CARD_W;
              return (
                <div key={g.genus} className="sp-card"
                  style={{
                    animationDelay: `${0.04 + gi * 0.05}s`,
                    border: `1px solid hsl(${hue}, 12%, 85%)`,
                    borderRadius: 10, overflow: "hidden",
                    background: "#fff",
                    flex: "0 0 auto",
                    width: innerW + 2,
                  }}>
                  {/* Genus header */}
                  <div style={{
                    padding: "4px 12px",
                    background: `hsl(${hue}, 14%, 96%)`,
                    borderBottom: `1px solid hsl(${hue}, 12%, 90%)`,
                    display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6,
                  }}>
                    <span style={{
                      fontFamily: "'Playfair Display',Georgia,serif",
                      fontSize: 11, fontWeight: 500, fontStyle: "italic",
                      color: `hsl(${hue}, 20%, 38%)`,
                    }}>{g.genus}</span>
                  </div>

                  {/* Species cards — flex wrap */}
                  <div style={{
                    display: "flex", flexWrap: "wrap",
                  }}>
                    {g.species.map((sp, si) => {
                      const bg1 = `hsl(${hue}, 18%, 88%)`;
                      const bg2 = `hsl(${(hue + 25) % 360}, 12%, 82%)`;
                      const photos = PHOTOS[sp.sci] || [];
                      // Check for saved poster preference
                      let thumb = photos.length > 0 ? photos[0].thumb : null;
                      try {
                        const raw = localStorage.getItem(`sp:${sp.sci.replace(/ /g, "_")}`);
                        if (raw) {
                          const cfg = JSON.parse(raw);
                          if (cfg.poster != null && photos[cfg.poster]) {
                            thumb = photos[cfg.poster].thumb;
                          }
                        }
                      } catch(e) {}
                      const hasPhoto = !!thumb;
                      return (
                        <button key={sp.sci}
                          className="sp-card"
                          style={{
                            animationDelay: `${0.08 + gi * 0.05 + si * 0.025}s`,
                            background: "#000", border: "none",
                            padding: 0, cursor: "pointer", textAlign: "left",
                            display: "block",
                            width: CARD_W,
                            flexShrink: 0,
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() => setSelectedSp(sp)}>
                          {/* Image fills entire card */}
                          <div style={{
                            width: "100%", aspectRatio: "3/2.5",
                            background: hasPhoto ? "#000" : `linear-gradient(135deg, ${bg1}, ${bg2})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {hasPhoto ? (
                              <img src={thumb} alt={sp.is} style={{
                                width: "100%", height: "100%",
                                objectFit: "cover",
                              }} />
                            ) : (
                              <span style={{ fontSize: 36, opacity: 0.1 }}>🐦</span>
                            )}
                          </div>
                          {/* Text overlay at bottom */}
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            padding: "20px 8px 7px",
                            background: hasPhoto
                              ? "linear-gradient(transparent, rgba(0,0,0,0.7))"
                              : "linear-gradient(transparent, rgba(0,0,0,0.15))",
                          }}>
                            <div style={{
                              fontFamily: "'Playfair Display',Georgia,serif",
                              fontSize: totalSp <= 4 ? 15 : 12, fontWeight: 500,
                              color: hasPhoto ? "#fff" : "#2a2a2a",
                              lineHeight: 1.3, textShadow: hasPhoto ? "0 1px 3px rgba(0,0,0,0.5)" : "none",
                            }}>{sp.is}{sp.visitor ? " ✦" : ""}</div>
                            <div style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: totalSp <= 4 ? 10 : 8, color: hasPhoto ? "rgba(255,255,255,0.7)" : "#b0a89e",
                              fontStyle: "italic", marginTop: 1,
                            }}>{sp.common}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>

    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
