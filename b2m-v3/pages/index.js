import { useState, memo } from "react";

// ─── STARS ─────────────────────────────────────
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
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            "--st": s.st,
            "--sd": s.sd,
            "--so": s.so,
          }}
        />
      ))}
      <div className="orb" style={{ width:320, height:320, background:"#C9A96E", top:-120, left:-100, opacity:.08 }} />
      <div className="orb" style={{ width:240, height:240, background:"#6B4E9E", bottom:80, right:-80, opacity:.07 }} />
    </div>
  );
});

// ─── HELPERS ───────────────────────────────────
function getDays(dob) {
  return Math.floor((Date.now() - new Date(dob + "T12:00:00").getTime()) / 86400000);
}
function getAge(dob) {
  const b = new Date(dob + "T12:00:00"), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

// ─── TITLES FIX (# → HEADINGS) ─────────────────
function renderNarrative(text) {
  if (!text) return null;
  return String(text).split("\n").map((line, i) => {
    const clean = line.trim();
    if (!clean) return <br key={i} />;
    if (clean.startsWith("#")) {
      return (
        <h2 key={i} style={{
          fontWeight:700,
          fontSize:"clamp(30px,6vw,44px)",
          margin:"28px 0 16px",
          textAlign:"center",
          color:"#E8D6A3"
        }}>
          {clean.replace(/^#+/, "").trim()},
        </h2>
      );
    }
    return <p key={i}>{clean}</p>;
  });
}

// ─── COPY ──────────────────────────────────────
const T = {
  en: {
    logo:"B2M · BACK TO ME",
    tagline:"YOUR STORY IN THE WORLD",
    begin:"BEGIN YOUR STORY",
    dob:"DATE OF BIRTH",
    recon:"RECONSTRUCT MY TIMELINE",
    gateTxt:"Your story does not end here.",
    gateBody:"Discover the world that welcomed you, and what came next.",
    gateCta:"UNLOCK MY STORY",
    gateP:"$4.99 one-time · Lifetime access",
    disclaimer:"This experience is for entertainment and reflection purposes only. Content may not be historically exact.",
    privacy:"We do not store or share your personal data.",
    fakePayMsg:"Your story continues...\n\nFull access will be available very soon.\n\nYour interest has been recorded."
  },
  es: {
    logo:"B2M · DE VUELTA A MÍ",
    tagline:"TU HISTORIA EN EL MUNDO",
    begin:"COMENZAR MI HISTORIA",
    dob:"FECHA DE NACIMIENTO",
    recon:"RECONSTRUIR MI LÍNEA DE TIEMPO",
    gateTxt:"Tu historia no termina aquí.",
    gateBody:"Descubre el mundo que te recibió y lo que vino después.",
    gateCta:"DESBLOQUEAR MI HISTORIA",
    gateP:"$4.99 pago único · Acceso de por vida",
    disclaimer:"Esta experiencia es solo para fines de entretenimiento.",
    privacy:"No almacenamos ni compartimos tus datos.",
    fakePayMsg:"Tu historia continúa...\n\nEl acceso completo estará disponible muy pronto.\n\nTu interés ha sido registrado."
  }
};

// ─── APP ───────────────────────────────────────
export default function B2M() {

  const [lang,setLang]=useState("en");
  const [dob,setDob]=useState("");
  const [started,setStarted]=useState(false);
  const [fakePaid,setFakePaid]=useState(false);

  const t=T[lang];

  const sampleStory=`# El Día Que Llegaste
Llegaste un martes. El mundo no se detuvo, pero algo cambió.

# Tu Historia
Este es solo el comienzo de algo más grande.`;

  return (
    <>
      <StarField />

      <div className="page">

        {/* LANGUAGE */}
        <div style={{marginBottom:20}}>
          <button onClick={()=>setLang("en")}>EN</button>
          <button onClick={()=>setLang("es")}>ES</button>
        </div>

        {!started && (
          <>
            <h1>{t.logo}</h1>

            <input
              type="date"
              value={dob}
              onChange={e=>setDob(e.target.value)}
            />

            <button onClick={()=>dob && setStarted(true)}>
              {t.begin}
            </button>
          </>
        )}

        {started && (
          <>
            <div className="narrative">
              {renderNarrative(sampleStory)}
            </div>

            {/* PAYWALL */}
            <div className="gate">

              <p className="gate-title">{t.gateTxt}</p>

              <p className="gate-body">{t.gateBody}</p>

              <button
                className="btn-gold"
                onClick={()=>{
                  localStorage.setItem("b2m_fake_payment","clicked");
                  setFakePaid(true);
                  alert(t.fakePayMsg);
                }}
              >
                {t.gateCta}
              </button>

              <p className="gate-price">{t.gateP}</p>

              {fakePaid && (
                <p style={{ marginTop:10, fontSize:12, textAlign:"center" }}>
                  ✔ intención registrada
                </p>
              )}

              <p style={{marginTop:12,fontSize:11,textAlign:"center"}}>
                {t.disclaimer}
              </p>

              <p style={{marginTop:6,fontSize:10,textAlign:"center"}}>
                {t.privacy}
              </p>

            </div>
          </>
        )}

      </div>
    </>
  );
}
