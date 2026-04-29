import { useState, useEffect, memo } from "react";

// ─── STARS (memoized — never re-renders) ─────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: ((Math.sin(i * 127.1) + 1) / 2) * 100,
  left: ((Math.cos(i * 97.3) + 1) / 2) * 100,
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
  st: `${2.5 + (i % 6)}s`,
  sd: `${(i * 0.29) % 8}s`,
  so: 0.25 + (i % 5) * 0.15,
}));

const StarField = memo(function StarField() {
  return (
    <div className="star-field">
      {STARS.map(s => (
        <div key={s.id} className="star" style={{
          top: `${s.top}%`, left: `${s.left}%`,
          width: s.size, height: s.size,
          "--st": s.st, "--sd": s.sd, "--so": s.so,
        }} />
      ))}
      <div className="orb" style={{ width:320, height:320, background:"#C9A96E", top:-120, left:-100, opacity:.08, "--ot":"15s", "--ox":"30px", "--oy":"20px" }} />
      <div className="orb" style={{ width:240, height:240, background:"#6B4E9E", bottom:80, right:-80, opacity:.07, "--ot":"11s", "--ox":"-20px", "--oy":"-30px" }} />
    </div>
  );
});

// ─── ISOLATED INPUT COMPONENTS ───────────────────────────────────────────────
const CityQuestion = memo(function CityQuestion({ t, onSubmit }) {
  const [val, setVal] = useState("");
  return (
    <div className="q-wrap">
      <p className="q-text">{t.q1}</p>
      <div style={{ width:"100%", maxWidth:320, margin:"0 auto 20px" }}>
        <input type="text" className="input-field" placeholder={t.q1ph} value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit(val)}
          autoFocus
          style={{ fontSize:18, textAlign:"center" }}
        />
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <button className="btn-gold" onClick={() => onSubmit(val)}>{t.q1cta}</button>
        <button className="btn-ghost" onClick={() => onSubmit("")}>{t.q1skip}</button>
      </div>
    </div>
  );
});

const ParentsQuestion = memo(function ParentsQuestion({ t, onSubmit, onSkip }) {
  const [mAge, setMAge] = useState("");
  const [fAge, setFAge] = useState("");
  return (
    <div className="q-wrap">
      <p className="q-text">{t.q3}</p>
      <div style={{ display:"flex", gap:12, maxWidth:320, margin:"0 auto 20px" }}>
        {[[t.q3l[0], mAge, setMAge],[t.q3l[1], fAge, setFAge]].map(([lbl,val,set]) => (
          <div key={lbl} style={{ flex:1 }}>
            <label className="input-label">{lbl}</label>
            <input type="number" className="input-field" placeholder={t.q3ph} value={val}
              onChange={e => set(e.target.value)} min="10" max="80"
              style={{ fontSize:20, textAlign:"center" }} />
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <button className="btn-gold" onClick={() => onSubmit(mAge, fAge)}>{t.q3cta}</button>
        <button className="btn-ghost" onClick={onSkip}>{t.q3skip}</button>
      </div>
    </div>
  );
});

const OpenQuestion = memo(function OpenQuestion({ t, onSubmit }) {
  const [val, setVal] = useState("");
  return (
    <div className="q-wrap">
      <p className="q-text">{t.q4}</p>
      <div style={{ width:"100%", maxWidth:320, margin:"0 auto 20px" }}>
        <textarea className="input-field" rows={3} placeholder={t.q4ph} value={val}
          onChange={e => setVal(e.target.value)}
          style={{ fontSize:16, textAlign:"left", padding:"14px 16px", resize:"none", lineHeight:1.6 }}
        />
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <button className="btn-gold" onClick={() => val.trim() && onSubmit(val)}>{t.q4cta}</button>
      </div>
    </div>
  );
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDays(dob) {
  return Math.floor((Date.now() - new Date(dob + "T12:00:00").getTime()) / 86400000);
}
function getAge(dob) {
  const b = new Date(dob + "T12:00:00"), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}
function fmtDate(dob, lang) {
  return new Date(dob + "T12:00:00").toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });
}
function getGen(y, lang) {
  const g = lang === "es"
    ? [[1946,"La Generación Silenciosa"],[1965,"Baby Boomer"],[1981,"Generación X"],[1997,"Millennial"],[2013,"Generación Z"],[9999,"Generación Alpha"]]
    : [[1946,"The Silent Generation"],[1965,"Baby Boomer"],[1981,"Generation X"],[1997,"Millennial"],[2013,"Generation Z"],[9999,"Generation Alpha"]];
  return g.find(([max]) => y < max)[1];
}

function renderNarrative(text) {
  if (!text) return null;

  return String(text).split("\n").map((line, i) => {
    const clean = line.trim();

    if (!clean) return <br key={i} />;

    if (clean.startsWith("#")) {
      return (
        <h2
          key={i}
          className="narrative-heading"
          style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(30px,6vw,44px)",
            fontWeight:700,
            color:"#E8D6A3",
            lineHeight:1.25,
            margin:"28px 0 16px",
            textAlign:"center"
          }}
        >
          {clean.replace(/^#+/, "").trim()},
        </h2>
      );
    }

    return (
      <p key={i} style={{ marginBottom:18 }}>
        {clean}
      </p>
    );
  });
}

// ─── COPY ─────────────────────────────────────────────────────────────────────
const T = {
  en: {
    logo:"B2M · BACK TO ME",
    tagline:"YOUR STORY IN THE WORLD",
    welcome:["Do you want to see your","story","in the world?"],
    wsub:"Every life has a timeline the world remembers. Yours is no exception.",
    begin:"BEGIN YOUR STORY",
    otag:"CHAPTER I · YOUR ORIGIN",
    otitle:["When did your","story begin?"],
    osub:"The exact moment the world made room for you.",
    dob:"DATE OF BIRTH",
    recon:"RECONSTRUCT MY TIMELINE",
    cbar:"CHAPTER I · THE DAY YOU ARRIVED",
    htitle:["Your day,","in the world."],
    hsub:(a)=>`A story ${a} years in the making`,
    stats:["DAYS LIVED","YEARS","YOUR ERA"],
    ll:["THE WORLD THAT DAY","YOUR PLACE IN TIME","THE MOMENT","YOUR ORIGINS","YOUR ANSWER"],
    loading:"RECONSTRUCTING…",
    q1:"Do you know which city you were born in?",
    q1ph:"City, Country", q1cta:"CONTINUE MY STORY", q1skip:"I don't know",
    q2:"What time of day did you arrive?",
    q2o:["Morning","Afternoon","Evening","Night","I don't know"],
    q3:"How old were your parents when you arrived?",
    q3l:["MOTHER","FATHER"], q3ph:"Age", q3cta:"CONTINUE MY STORY", q3skip:"I didn't know them",
    q4:"Is there something you always wanted to know about the day you arrived?",
    q4ph:"Ask El Cronista anything…", q4cta:"ASK EL CRONISTA",
    ch2head:"A glimpse of what awaits in Chapter II",
    ch2title:"The Cultural World You Were Born Into",
    ch2sub:"Unlock to discover the music, the faces in power, and the headlines that surrounded your arrival.",
    ch2labels:[
    ["🎵","THE #1 SONG THAT WEEK"],
    ["📺","THE MOST WATCHED SHOW"],
    ["🏛️","YOUR COUNTRY'S LEADER"],
    ["📰","THE HEADLINE THAT WEEK"],
    ["💰","WHAT THINGS COST"],
    ],
    gateTxt:"Your story doesn't end here.",
    gateBody:"What you've seen is only the beginning. Discover the full story behind your arrival — the world, the culture, and the moments that shaped your existence.",
    gateCta:"UNLOCK MY FULL STORY",
    gateP:"$4.99 one-time · Lifetime access",
    disclaimer:"This experience is for entertainment and reflection purposes only. Content may be creatively generated and not historically exact.",
    privacy:"We do not store or share your personal data. Your inputs are only used to generate this experience.",
    fakePayMsg:"Your story continues...\n\nFull access will be available very soon.\n\nYour interest has been recorded.",
    ctitle:"YOUR STORY · ALL CHAPTERS",
    chapters:[
      {num:"I",  name:"The Day You Arrived",     desc:"World context · Your origin",              active:true},
      {num:"II", name:"The Era That Shaped You",  desc:"Cultural snapshot · Generational identity",locked:true},
      {num:"III",name:"Your Footprint",           desc:"What changed while you were here",         locked:true},
      {num:"IV", name:"Your Future Self",         desc:"Probabilistic simulation · Next chapter",  locked:true},
      {num:"V",  name:"Your Letter to the World", desc:"The most personal thing you'll ever read", locked:true},
    ],
    stxt:(d,g)=>`"I've lived ${d} days.\nI arrived as a ${g}.\nThe world has never been the same."`,
    scta:"SHARE MY TIMELINE",
    back:"← BACK",
    err:"Please enter your date of birth.",
  },
  es: {
    logo:"B2M · DE VUELTA A MÍ",
    tagline:"TU HISTORIA EN EL MUNDO",
    welcome:["¿Quieres ver tu","historia","en el mundo?"],
    wsub:"Toda vida tiene una línea de tiempo que el mundo recuerda. La tuya no es la excepción.",
    begin:"COMENZAR MI HISTORIA",
    otag:"CAPÍTULO I · TU ORIGEN",
    otitle:["¿Cuándo comenzó","tu historia?"],
    osub:"El momento exacto en que el mundo te hizo un lugar.",
    dob:"FECHA DE NACIMIENTO",
    recon:"RECONSTRUIR MI LÍNEA DE TIEMPO",
    cbar:"CAPÍTULO I · EL DÍA QUE LLEGASTE",
    htitle:["Tu día,","en el mundo."],
    hsub:(a)=>`Una historia de ${a} años en construcción`,
    stats:["DÍAS VIVIDOS","AÑOS","TU ERA"],
    ll:["EL MUNDO ESE DÍA","TU LUGAR EN EL TIEMPO","EL MOMENTO","TUS ORÍGENES","TU RESPUESTA"],
    loading:"RECONSTRUYENDO…",
    q1:"¿Sabes en qué ciudad naciste?",
    q1ph:"Ciudad, País", q1cta:"CONTINUAR MI HISTORIA", q1skip:"No lo sé",
    q2:"¿A qué hora del día llegaste?",
    q2o:["Mañana","Tarde","Noche","Madrugada","No lo sé"],
    q3:"¿Sabes qué edad tenían tus padres cuando llegaste?",
    q3l:["MADRE","PADRE"], q3ph:"Edad", q3cta:"CONTINUAR MI HISTORIA", q3skip:"No los conocí",
    q4:"¿Hay algo que siempre quisiste saber sobre el día que llegaste?",
    q4ph:"Pregúntale a El Cronista lo que quieras…", q4cta:"PREGUNTARLE A EL CRONISTA",
    ch2head:"Un vistazo a lo que te espera en el Capítulo II",
    ch2title:"El Mundo Cultural en el Que Naciste",
    ch2sub:"Desbloquea para descubrir la música, los líderes y los titulares que rodearon tu llegada.",
    gateTxt:"Tu historia no termina aquí.",
    gateBody:"Lo que viste es solo el comienzo. Descubre la historia completa detrás de tu llegada — el mundo, la cultura y los momentos que dieron forma a tu existencia.",
    gateCta:"DESBLOQUEAR MI HISTORIA COMPLETA",
    gateP:"$4.99 pago único · Acceso de por vida",
    disclaimer:"Esta experiencia es solo para fines de entretenimiento y reflexión. Parte del contenido puede ser generado creativamente y no ser históricamente exacto.",
    privacy:"No almacenamos ni compartimos tus datos personales. Tu información se usa solo para generar esta experiencia.",
    fakePayMsg:"Tu historia continúa...\n\nEl acceso completo estará disponible muy pronto.\n\nTu interés ha sido registrado.",
    ctitle:"TU HISTORIA · TODOS LOS CAPÍTULOS",
    chapters:[
      {num:"I",  name:"El Día Que Llegaste",      desc:"Contexto mundial · Tu origen",                   active:true},
      {num:"II", name:"La Era Que Te Formó",       desc:"Cultura · Identidad generacional",               locked:true},
      {num:"III",name:"Tu Huella en el Mundo",     desc:"Lo que cambió mientras estabas aquí",            locked:true},
      {num:"IV", name:"Tu Yo Futuro",              desc:"Simulación probabilística · Tu próximo capítulo", locked:true},
      {num:"V",  name:"Tu Carta al Mundo",         desc:"Lo más personal que jamás leerás",               locked:true},
    ],
    stxt:(d,g)=>`"He vivido ${d} días.\nLlegué como ${g}.\nEl mundo nunca ha sido el mismo."`,
    scta:"COMPARTIR MI LÍNEA DE TIEMPO",
    back:"← VOLVER",
    err:"Por favor ingresa tu fecha de nacimiento.",
  },
};

const CH2_ICONS = [
  { icon:"🎵", key:"song",    labelEn:"THE #1 SONG THAT WEEK",    labelEs:"LA CANCIÓN #1 ESA SEMANA" },
  { icon:"📺", key:"show",    labelEn:"THE MOST WATCHED SHOW",    labelEs:"EL PROGRAMA MÁS VISTO" },
  { icon:"🏛️", key:"leader",  labelEn:"YOUR COUNTRY'S LEADER",    labelEs:"EL LÍDER DE TU PAÍS" },
  { icon:"📰", key:"headline",labelEn:"HEADLINE THAT WEEK",        labelEs:"TITULAR DE ESA SEMANA" },
  { icon:"💰", key:"price",   labelEn:"WHAT THINGS COST",          labelEs:"LO QUE COSTABAN LAS COSAS" },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function B2M() {
  const [lang, setLang]     = useState(null);
  const [screen, setScreen] = useState("welcome");
  const [dob, setDob]       = useState("");
  const [err, setErr]       = useState("");

  const [layers, setLayers]     = useState({});
  const [activeL, setActiveL]   = useState(0);
  const [loading, setLoading]   = useState(false);
  const [gen, setGen]           = useState("");
  const [noParents, setNoParents] = useState(false);
  const [ch2data, setCh2data]   = useState(null);
  const [ch2loading, setCh2loading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showPaidIntro, setShowPaidIntro] = useState(false);
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paidFromStripe = params.get("paid");

  if (paidFromStripe === "true") {
    localStorage.setItem("b2m_paid", "true");
    setShowPaidIntro(true);
    setUnlocked(false);
    return;
  }

  const paid = localStorage.getItem("b2m_paid");

  if (paid === "true") {
    setUnlocked(true);
  }
}, []);

  const today = new Date().toISOString().split("T")[0];
  const t = lang ? T[lang] : T.en;
  const year  = dob ? new Date(dob + "T12:00:00").getFullYear() : 0;
  const g     = dob && lang ? getGen(year, lang) : "";
  const days  = dob ? getDays(dob) : 0;
  const age   = dob ? getAge(dob) : 0;
  const fdate = dob && lang ? fmtDate(dob, lang) : "";

  // City stored at app level for API calls
  const [city, setCity] = useState("");

  async function callAPI(layer, extra = {}) {
    setLoading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob, city: extra.city || city, timeOfDay: extra.timeOfDay, motherAge: extra.motherAge, fatherAge: extra.fatherAge, noParents: extra.noParents, openQuestion: extra.openQuestion, layer, lang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      if (data.generation) setGen(data.generation);
      return data.story || null;
    } catch (e) {
      setErr(e.message || "Error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchCh2Preview(c) {
    setCh2loading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob, city: c || city, layer: "ch2preview", lang }),
      });
      const data = await res.json();
      if (data.preview) setCh2data(data.preview);
    } catch {}
    finally { setCh2loading(false); }
  }

  async function startStory() {
    if (!dob) { setErr(t.err); return; }
    setErr(""); setScreen("story"); setLayers({});
    const story = await callAPI(1);
    if (story) { setLayers({1: story}); setActiveL(1); }
  }

  async function answerCity(cityVal) {
    const c = cityVal.trim() || "";
    setCity(c);
    const story = await callAPI(2, { city: c });
    if (story) { setLayers(p => ({...p, 2: story})); setActiveL(2); }
  }

  async function answerTime(t) {
    const story = await callAPI(3, { timeOfDay: t });
    if (story) { setLayers(p => ({...p, 3: story})); setActiveL(3); }
  }

  async function answerParents(noP, mAge, fAge) {
    setNoParents(noP);
    const story = await callAPI(4, { noParents: noP, motherAge: mAge, fatherAge: fAge });
    if (story) { setLayers(p => ({...p, 4: story})); setActiveL(4); }
  }

  async function answerQuestion(q) {
    const story = await callAPI(5, { openQuestion: q });
    if (story) {
      setLayers(p => ({...p, 5: story}));
      setActiveL(5);
      // Fetch ch2 preview after layer 5
      fetchCh2Preview(city);
    }
  }

  function fakePaywallClick() {
    try {
      localStorage.setItem("b2m_fake_payment", "clicked");
      localStorage.setItem("b2m_fake_payment_time", new Date().toISOString());
      localStorage.setItem("b2m_fake_payment_lang", lang || "en");
    } catch {}

    setFakePaid(true);
    alert(t.fakePayMsg);
  }

  function reset() {
    setLang(null); setScreen("welcome"); setLayers({}); setErr("");
    setActiveL(0); setCity(""); setNoParents(false); setDob("");
    setGen(""); setCh2data(null); setFakePaid(false);
  }

  const genDisplay = gen || g;

  return (
    <>
      <StarField />

      {lang && screen !== "welcome" && (
        <button className="back-btn" onClick={reset}>{t.back}</button>
      )}

      {/* ══ LANGUAGE ══ */}
      {!lang && (
        <div className="page fade-in">
          <div className="logo" style={{ marginBottom:48 }}>B2M</div>
          <p className="eyebrow" style={{ marginBottom:48 }}>LANGUAGE · IDIOMA</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14, width:"100%", maxWidth:280 }}>
            {[{code:"en",label:"English",sub:"Continue in English"},{code:"es",label:"Español",sub:"Continuar en Español"}].map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={{ background:"#12100D", border:"1px solid #252018", color:"#C8B888", fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", padding:"22px 24px", cursor:"pointer", transition:"all .35s", display:"flex", flexDirection:"column", alignItems:"center", gap:4, WebkitTapHighlightColor:"transparent" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#C9A96E";e.currentTarget.style.color="#E2C97E";e.currentTarget.style.background="rgba(201,169,110,.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#252018";e.currentTarget.style.color="#C8B888";e.currentTarget.style.background="#12100D";}}
              >
                <span>{l.label}</span>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".3em", color:"#6B6050", fontStyle:"normal" }}>{l.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ WELCOME ══ */}
      {lang && screen === "welcome" && (
        <div className="page fade-in">
          <div className="logo fu d1">{t.logo}</div>
          <p className="eyebrow fu d1">{t.tagline}</p>
          <h1 className="headline fu d2">
            {t.welcome[0]}<br /><em>{t.welcome[1]}</em> {t.welcome[2]}
          </h1>
          <p className="subtext fu d3">{t.wsub}</p>
          <button className="btn-outline fu d4" onClick={() => setScreen("input")}>
            <span>{t.begin}</span>
          </button>
        </div>
      )}

      {/* ══ INPUT ══ */}
      {lang && screen === "input" && (
        <div className="page">
          <div className="logo fu d1">{t.logo}</div>
          <p className="eyebrow fu d1">{t.otag}</p>
          <h2 className="headline fu d2" style={{ fontSize:"clamp(30px,7vw,46px)" }}>
            {t.otitle[0]}<br />{t.otitle[1]}
          </h2>
          <p className="subtext fu d2">{t.osub}</p>
          <div className="fu d3" style={{ width:"100%", maxWidth:320, marginBottom:32 }}>
            <label className="input-label">{t.dob}</label>
            <input type="date" className="input-field" value={dob} max={today}
              onChange={e => { setDob(e.target.value); setErr(""); }} />
          </div>
          {err && <p style={{ color:"#C97070", fontSize:13, marginBottom:16, fontStyle:"italic" }}>{err}</p>}
          <button className="btn-outline fu d4" onClick={startStory}><span>{t.recon}</span></button>
        </div>
      )}

      {/* ══ STORY ══ */}
      {lang && screen === "story" && (
        <div className="fade-in" style={{ paddingBottom:80 }}>

          {/* Chapter bar */}
          <div className="chapter-bar">
            <span className="chapter-label">{t.cbar}</span>
            <div className="chapter-dots">
              {[1,2,3,4,5].map(n => (
                <div key={n} className={`cdot ${n===activeL?"active":n<activeL?"done":""}`} />
              ))}
            </div>
          </div>

          {/* Hero */}
          <div className="story-hero">
            <div className="hero-glow" />
            <p className="hero-tag">{t.logo} · {fdate.toUpperCase()}</p>
            <h1 className="hero-title">{t.htitle[0]}<br />{t.htitle[1]}</h1>
            <p className="hero-sub">{t.hsub(age)}</p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat"><span className="stat-n">{days.toLocaleString()}</span><span className="stat-l">{t.stats[0]}</span></div>
            <div className="stat"><span className="stat-n">{age}</span><span className="stat-l">{t.stats[1]}</span></div>
            <div className="stat"><span className={`stat-n ${genDisplay.length > 12 ? "sm":""}`}>{genDisplay||"—"}</span><span className="stat-l">{t.stats[2]}</span></div>
          </div>

          {/* Narrative layers */}
          {[1,2,3,4,5].map(n => layers[n] && (
            <div key={n} className="layer-wrap">
              <p className="layer-tag">{t.ll[n-1]}</p>
              <div className="narrative">
                {renderNarrative(layers[n])}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="loader-wrap">
              <div className="orbit" />
              <p className="load-sub">{t.loading}</p>
            </div>
          )}

          {/* Questions */}
          {!loading && layers[1] && !layers[2] && <CityQuestion t={t} onSubmit={answerCity} />}

          {!loading && layers[2] && !layers[3] && (
            <div className="q-wrap">
              <p className="q-text">{t.q2}</p>
              <div className="opt-grid">
                {t.q2o.slice(0,4).map(o => (
                  <button key={o} className="opt-btn" onClick={() => answerTime(o.toLowerCase())}>{o}</button>
                ))}
                <button className="opt-btn full" onClick={() => answerTime("unknown")}>{t.q2o[4]}</button>
              </div>
            </div>
          )}

          {!loading && layers[3] && !layers[4] && (
            <ParentsQuestion t={t}
              onSubmit={(m,f) => answerParents(false, m, f)}
              onSkip={() => answerParents(true, "", "")}
            />
          )}

          {!loading && layers[4] && !layers[5] && <OpenQuestion t={t} onSubmit={answerQuestion} />}

          {/* Chapter II Preview — shows after layer 5 */}
          {layers[5] && !loading && (
            <div className="ch2-preview">
              <div className="ch2-header">
                <p className="ch2-title">{t.ch2head}</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontStyle:"italic", color:"#F0E6CC", lineHeight:1.4, marginBottom:8 }}>
                  {lang === "es" ? "El Mundo Cultural en el Que Naciste" : "The Cultural World You Were Born Into"}
                </p>
                <p style={{ fontSize:13, color:"#6B6050", lineHeight:1.6 }}>
                  {lang === "es"
                    ? "Desbloquea para descubrir la música, los líderes y los titulares que rodearon tu llegada."
                    : "Unlock to discover the music, the faces in power, and the headlines that surrounded your arrival."}
                </p>
              </div>

              <div className="ch2-cards">
                {CH2_ICONS.map((item, i) => {
                  const isLocked = i > 0; // First card visible, rest blurred
                  const value = ch2data ? ch2data[item.key] : null;
                  const label = lang === "es" ? item.labelEs : item.labelEn;
                  return (
                    <div key={item.key} style={{ position:"relative" }}>
                      <div className={`ch2-card ${isLocked && !ch2data ? "locked" : ""}`}>
                        <span className="ch2-card-icon">{item.icon}</span>
                        <div className="ch2-card-info">
                          <p className="ch2-card-label">{label}</p>
                          <p className="ch2-card-value">
                            {ch2loading ? "…" : value || (isLocked ? "████████████" : "…")}
                          </p>
                        </div>
                      </div>
                      {isLocked && !ch2data && (
                        <div className="ch2-lock-overlay"><span>◈</span></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gate — after layer 5 */}
{layers[5] && !loading && (
  <div className="gate">
    <p className="gate-title">{t.gateTxt}</p>
    <p className="gate-body">{t.gateBody}</p>

    <button
      className="btn-gold"
      onClick={() => {
        localStorage.setItem("b2m_paid", "true");
        window.location.href = "https://buy.stripe.com/test_7sY3cxa46cY25qe6m35Ne00";
      }}
      style={{ animation:"goldPulse 3s ease-in-out infinite" }}
    >
      {t.gateCta}
    </button>

    <p className="gate-price">{t.gateP}</p>

    <p style={{
      marginTop:12,
      fontSize:11,
      color:"#6B6050",
      lineHeight:1.5,
      maxWidth:320,
      textAlign:"center"
    }}>
      {t.disclaimer}
    </p>

    <p style={{
      marginTop:6,
      fontSize:10,
      color:"#5A5145",
      lineHeight:1.4,
      maxWidth:300,
      textAlign:"center"
    }}>
      {t.privacy}
    </p>
  </div>
)}
{/* Paid Intro Screen */}
{showPaidIntro && (
  <div className="gate" style={{ marginTop:40 }}>
    <p className="gate-title">
      {lang === "es"
        ? "Capítulo II desbloqueado"
        : "Chapter II unlocked"}
    </p>

    <p className="gate-body">
      {lang === "es"
        ? "Tu historia continúa. El mundo que te recibió está listo para abrirse ante ti."
        : "Your story continues. The world that welcomed you is ready to open before you."}
    </p>

    <button
      className="btn-gold"
      onClick={() => {
        setShowPaidIntro(false);
        setUnlocked(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{ animation:"goldPulse 3s ease-in-out infinite" }}
    >
      {lang === "es"
        ? "ENTRAR AL MUNDO QUE ME RECIBIÓ"
        : "ENTER THE WORLD THAT WELCOMED ME"}
    </button>
  </div>
)}
{/* Chapter II Full — unlocked after payment/test */}
{unlocked && (
  <div className="ch2-preview" style={{ marginTop:40 }}>
    <div className="ch2-header">
      <p className="ch2-title">
        {lang === "es"
          ? "CAPÍTULO II · EL MUNDO QUE TE RECIBIÓ"
          : "CHAPTER II · THE WORLD THAT WELCOMED YOU"}
      </p>

      <p style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:24,
        fontStyle:"italic",
        color:"#F0E6CC",
        lineHeight:1.4,
        marginBottom:8
      }}>
        {lang === "es"
          ? "Mientras tú llegabas, el mundo también estaba contando una historia."
          : "As you arrived, the world was telling its own story."}
      </p>
    </div>

    {[
      {
        icon:"🎵",
        titleEs:"La canción que sonaba",
        titleEn:"The song that was playing",
        textEs:"Mientras llegabas al mundo, una canción dominaba radios, hogares y memorias.",
        textEn:"As you arrived, one song was filling radios, homes, and memories.",
      },
        {
        icon:"📺",
        titleEs:"Lo que la gente veía",
        titleEn:"What people were watching",
        textEs:"En las salas y conversaciones, algo capturaba la atención de millones.",
        textEn:"In living rooms and conversations, something was capturing millions of eyes.",
        value:"Coming soon"
      },
      {
        icon:"🏛️",
        titleEs:"Quién lideraba tu país",
        titleEn:"Who was leading your country",
        textEs:"El país que te recibió tenía una voz, un liderazgo y una dirección.",
        textEn:"The country that welcomed you had a voice, a leadership, and a direction.",
        value:"Coming soon"
      },
      {
        icon:"📰",
        titleEs:"El titular de esos días",
        titleEn:"The headline of those days",
        textEs:"Mientras tu familia vivía tu llegada, el mundo hablaba de otra historia.",
        textEn:"While your family welcomed you, the world was talking about another story.",
        value:"Coming soon"
      },
      {
        icon:"💰",
        titleEs:"Lo que costaba vivir",
        titleEn:"What life used to cost",
        textEs:"El mundo tenía otro precio, otro ritmo y otra forma de vivir.",
        textEn:"The world had another price, another rhythm, and another way of living.",
        value:"Coming soon"
      }
    ].map((item, i) => (
      <div key={i} className="ch2-card" style={{ marginBottom:14 }}>
        <span className="ch2-card-icon">{item.icon}</span>
        <div className="ch2-card-info">
          <p className="ch2-card-label">
            {lang === "es" ? item.titleEs : item.titleEn}
          </p>
          <p style={{ color:"#C8B888", fontSize:14, lineHeight:1.6 }}>
            {lang === "es" ? item.textEs : item.textEn}
          </p>
          <p className="ch2-card-value">{item.value}</p>
        </div>
      </div>
    ))}

    <div className="gate" style={{ marginTop:28 }}>
      <p className="gate-title">
        {lang === "es"
          ? "Ese era el mundo. Y en medio de todo eso… llegaste tú."
          : "That was the world. And in the middle of it… you arrived."}
      </p>
    </div>
  </div>
)}
          {/* Chapters */}
          {layers[1] && (
            <div className="chapters-wrap">
              <p className="chapters-title">{t.ctitle}</p>
              {t.chapters.map((c,i) => (
                <div key={i} className={`ch-card ${c.active?"active":""} ${c.locked?"locked":""}`}>
                  <span className="ch-num">{c.num}</span>
                  <div className="ch-info">
                    <p className="ch-name">{c.name}</p>
                    <p className="ch-desc">{c.desc}</p>
                  </div>
                  {c.locked && <span className="ch-lock">◈</span>}
                </div>
              ))}
            </div>
          )}

          {/* Share */}
          {layers[1] && (
            <div className="share-wrap">
              <div className="share-card">
                <p className="share-logo">{t.logo}</p>
                <p className="share-text">{t.stxt(days.toLocaleString(), genDisplay)}</p>
              </div>
              <button className="btn-ghost" style={{ marginTop:0 }}>{t.scta}</button>
            </div>
          )}

        </div>
      )}
    </>
  );
}
