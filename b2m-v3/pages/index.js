import { useState, memo } from "react";

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

/* ─── COPY ─── */
const T = {
  en: {
    gateTxt: "Your story continues...",
    gateBody: "Discover the world that welcomed you.",
    gateCta: "CONTINUE MY STORY"
  },
  es: {
    gateTxt: "Tu historia continúa...",
    gateBody: "Descubre el mundo que te recibió.",
    gateCta: "CONTINUAR MI HISTORIA"
  }
};

/* ─── APP ─── */
export default function B2M() {
  const [lang, setLang] = useState("en");

  const sampleText = `# El Día Que Llegaste
Llegaste un martes de enero. El mundo no se detuvo, pero algo cambió.`;

  return (
    <>
      <StarField />

      <div className="page">

        {/* STORY FIX (# TITLES) */}
        <div className="narrative">
          {sampleText.split("\n").map((line, i) => {
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

          <p className="gate-title">{T[lang].gateTxt}</p>

          <p className="gate-body">{T[lang].gateBody}</p>

          <button
            className="btn-gold"
            onClick={() => {
              localStorage.setItem("b2m_fake_payment","clicked");
              alert("Test Mode: Payment flow coming soon.");
            }}
          >
            {T[lang].gateCta}
          </button>

          <p className="gate-price">
            $4.99 one-time · Lifetime access
          </p>

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

      </div>
    </>
  );
}
