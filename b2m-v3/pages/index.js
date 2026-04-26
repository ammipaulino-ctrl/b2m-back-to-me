import { useState, memo } from "import { useState, memo } from "react";

/* ─── STARS ─── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: ((Math.sin(i * 127.1) + 1) / 2) * 100,
  left: ((Math.cos(i * 97.3) + 1) / 2) * 100,
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
}));

const StarField = memo(() => (
  <div className="star-field">
    {STARS.map(s => (
      <div key={s.id} className="star" style={{
        top: `${s.top}%`, left: `${s.left}%`,
        width: s.size, height: s.size
      }} />
    ))}
  </div>
));

/* ─── HELPERS ─── */
function getDays(dob) {
  return Math.floor((Date.now() - new Date(dob + "T12:00:00").getTime()) / 86400000);
}
function getAge(dob) {
  const b = new Date(dob + "T12:00:00"), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

/* ─── COPY ─── */
const T = {
  en: {
    title: "Your Story",
    begin: "BEGIN",
    gateTxt: "Your story continues...",
    gateBody: "Discover the world that welcomed you.",
    gateCta: "CONTINUE MY STORY",
    price: "$4.99 one-time · Lifetime access"
  },
  es: {
    title: "Tu Historia",
    begin: "COMENZAR",
    gateTxt: "Tu historia continúa...",
    gateBody: "Descubre el mundo que te recibió.",
    gateCta: "CONTINUAR MI HISTORIA",
    price: "$4.99 pago único · Acceso de por vida"
  }
};

/* ─── APP ─── */
export default function B2M() {

  const [lang, setLang] = useState("en");
  const [dob, setDob] = useState("");
  const [started, setStarted] = useState(false);

  const t = T[lang];

  const sampleStory = `# El Día Que Llegaste
Llegaste un martes de enero. El mundo no se detuvo, pero algo cambió.

# Tu Llegada
No fue solo un nacimiento. Fue el inicio de una historia.`;

  return (
    <>
      <StarField />

      <div className="page">

        {/* LANGUAGE */}
        <div style={{ marginBottom:20 }}>
          <button onClick={() => setLang("en")}>EN</button>
          <button onClick={() => setLang("es")}>ES</button>
        </div>

        {!started && (
          <>
            <h1>{t.title}</h1>

            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />

            <button onClick={() => dob && setStarted(true)}>
              {t.begin}
            </button>
          </>
        )}

        {/* STORY */}
        {started && (
          <>
            <div className="narrative">
              {sampleStory.split("\n").map((line, i) => {
                if (line.startsWith("#")) {
                  return (
                    <h2 key={i} style={{ fontWeight:"bold", marginBottom:10 }}>
                      {line.replace("#","").trim()},
                    </h2>
                  );
                }
                return <p key={i}>{line}</p>;
              })}
            </div>

            {/* PAYWALL */}
            <div className="gate">

              <p className="gate-title">{t.gateTxt}</p>

              <p className="gate-body">{t.gateBody}</p>

              <button
                className="btn-gold"
                onClick={() => {
                  localStorage.setItem("b2m_fake_payment","clicked");
                  alert("Test Mode: Payment simulation successful.");
                }}
              >
                {t.gateCta}
              </button>

              <p className="gate-price">{t.price}</p>

              {/* DISCLAIMER */}
              <p style={{
                marginTop:12,
                fontSize:11,
                color:"#6B6050",
                textAlign:"center"
              }}>
                {lang === "es"
                  ? "Esta experiencia es solo para fines de entretenimiento y reflexión. Parte del contenido puede no ser exacto."
                  : "This experience is for entertainment and reflection purposes only. Content may not be historically exact."}
              </p>

              {/* PRIVACY */}
              <p style={{
                marginTop:6,
                fontSize:10,
                color:"#5A5145",
                textAlign:"center"
              }}>
                {lang === "es"
                  ? "No almacenamos ni compartimos tus datos personales."
                  : "We do not store or share your personal data."}
              </p>

            </div>
          </>
        )}

      </div>
    </>
  );
}
/* ─── STARS ─── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: ((Math.sin(i * 127.1) + 1) / 2) * 100,
  left: ((Math.cos(i * 97.3) + 1) / 2) * 100,
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
}));

const StarField = memo(() => (
  <div className="star-field">
    {STARS.map(s => (
      <div key={s.id} className="star" style={{
        top: `${s.top}%`, left: `${s.left}%`,
        width: s.size, height: s.size
      }} />
    ))}
  </div>
));

/* ─── HELPERS ─── */
function getDays(dob) {
  return Math.floor((Date.now() - new Date(dob + "T12:00:00").getTime()) / 86400000);
}
function getAge(dob) {
  const b = new Date(dob + "T12:00:00"), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

/* ─── COPY ─── */
const T = {
  en: {
    title: "Your Story",
    begin: "BEGIN",
    gateTxt: "Your story continues...",
    gateBody: "Discover the world that welcomed you.",
    gateCta: "CONTINUE MY STORY",
    price: "$4.99 one-time · Lifetime access"
  },
  es: {
    title: "Tu Historia",
    begin: "COMENZAR",
    gateTxt: "Tu historia continúa...",
    gateBody: "Descubre el mundo que te recibió.",
    gateCta: "CONTINUAR MI HISTORIA",
    price: "$4.99 pago único · Acceso de por vida"
  }
};

/* ─── APP ─── */
export default function B2M() {

  const [lang, setLang] = useState("en");
  const [dob, setDob] = useState("");
  const [started, setStarted] = useState(false);

  const t = T[lang];

  const sampleStory = `# El Día Que Llegaste
Llegaste un martes de enero. El mundo no se detuvo, pero algo cambió.

# Tu Llegada
No fue solo un nacimiento. Fue el inicio de una historia.`;

  return (
    <>
      <StarField />

      <div className="page">

        {/* LANGUAGE */}
        <div style={{ marginBottom:20 }}>
          <button onClick={() => setLang("en")}>EN</button>
          <button onClick={() => setLang("es")}>ES</button>
        </div>

        {!started && (
          <>
            <h1>{t.title}</h1>

            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />

            <button onClick={() => dob && setStarted(true)}>
              {t.begin}
            </button>
          </>
        )}

        {/* STORY */}
        {started && (
          <>
            <div className="narrative">
              {sampleStory.split("\n").map((line, i) => {
                if (line.startsWith("#")) {
                  return (
                    <h2 key={i} style={{ fontWeight:"bold", marginBottom:10 }}>
                      {line.replace("#","").trim()},
                    </h2>
                  );
                }
                return <p key={i}>{line}</p>;
              })}
            </div>

            {/* PAYWALL */}
            <div className="gate">

              <p className="gate-title">{t.gateTxt}</p>

              <p className="gate-body">{t.gateBody}</p>

              <button
                className="btn-gold"
                onClick={() => {
                  localStorage.setItem("b2m_fake_payment","clicked");
                  alert("Test Mode: Payment simulation successful.");
                }}
              >
                {t.gateCta}
              </button>

              <p className="gate-price">{t.price}</p>

              {/* DISCLAIMER */}
              <p style={{
                marginTop:12,
                fontSize:11,
                color:"#6B6050",
                textAlign:"center"
              }}>
                {lang === "es"
                  ? "Esta experiencia es solo para fines de entretenimiento y reflexión. Parte del contenido puede no ser exacto."
                  : "This experience is for entertainment and reflection purposes only. Content may not be historically exact."}
              </p>

              {/* PRIVACY */}
              <p style={{
                marginTop:6,
                fontSize:10,
                color:"#5A5145",
                textAlign:"center"
              }}>
                {lang === "es"
                  ? "No almacenamos ni compartimos tus datos personales."
                  : "We do not store or share your personal data."}
              </p>

            </div>
          </>
        )}

      </div>
    </>
  );
}
