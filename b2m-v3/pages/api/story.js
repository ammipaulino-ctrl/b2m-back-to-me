export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { dob, city, timeOfDay, motherAge, fatherAge, noParents, openQuestion, layer, lang } = req.body;
  if (!dob) return res.status(400).json({ error: "Missing date of birth" });

  const date = new Date(dob + "T12:00:00");
  const formatted = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const year = date.getFullYear();
  const month = date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { month: "long" });
  const isEs = lang === "es";

  let gen;
  if (isEs) {
    if (year < 1946) gen = "La Generación Silenciosa";
    else if (year < 1965) gen = "Baby Boomer";
    else if (year < 1981) gen = "Generación X";
    else if (year < 1997) gen = "Millennial";
    else if (year < 2013) gen = "Generación Z";
    else gen = "Generación Alpha";
  } else {
    if (year < 1946) gen = "The Silent Generation";
    else if (year < 1965) gen = "Baby Boomer";
    else if (year < 1981) gen = "Generation X";
    else if (year < 1997) gen = "Millennial";
    else if (year < 2013) gen = "Generation Z";
    else gen = "Generation Alpha";
  }

  // Accumulated context string
  let ctx = `Born: ${formatted}. Generation: ${gen}.`;
  if (city) ctx += ` City: ${city}.`;
  if (timeOfDay && timeOfDay !== "unknown") ctx += ` Time of arrival: ${timeOfDay}.`;
  if (noParents) ctx += isEs ? " No conoció a sus padres." : " Did not know their parents.";
  else {
    if (motherAge) ctx += isEs ? ` Madre tenía ${motherAge} años.` : ` Mother was ${motherAge}.`;
    if (fatherAge) ctx += isEs ? ` Padre tenía ${fatherAge} años.` : ` Father was ${fatherAge}.`;
  }
  if (openQuestion) ctx += isEs ? ` Pregunta personal: "${openQuestion}".` : ` Personal question: "${openQuestion}".`;

  const voice = isEs
    ? `Eres El Cronista — narrador cinematográfico e íntimo de B2M. Tu voz es cálida, ligeramente mística y profundamente personal. Hablas en segunda persona ("Llegaste...", "El mundo era..."). Nunca usas listas. Siempre prosa fluida. Haces que cada persona sienta que su existencia fue significativa.`
    : `You are El Cronista — the cinematic, intimate narrator of B2M. Your voice is warm, slightly mystical, and deeply personal. You speak in second person ("You arrived...", "The world was..."). Never use lists. Always flowing prose. You make every person feel their existence was significant.`;

  const prompts = {
    1: isEs
      ? `${voice}\n\nContexto: ${ctx}\n\nEscribe una narrativa vívida (~180 palabras) sobre cómo se sentía el mundo el ${formatted}. Cubre la atmósfera global, el estado cultural, la energía histórica de ese momento exacto en ${year}. Haz que el lector sienta que su llegada fue cósmicamente significativa. Termina con sensación de asombro, no de conclusión. Segunda persona. Prosa pura.`
      : `${voice}\n\nContext: ${ctx}\n\nWrite a vivid narrative (~180 words) about what the world felt like on ${formatted}. Cover the global atmosphere, cultural mood, and historical energy of that exact moment in ${year}. Make the reader feel their arrival was cosmically significant. End with wonder, not conclusion. Second person. Pure prose.`,

    2: isEs
      ? `${voice}\n\nContexto: ${ctx}\n\nEscribe ~150 palabras sobre lo que ocurría específicamente en ${city || "ese lugar"} en ${month} de ${year}. Atmósfera local, textura regional, cómo se sentía la vida cotidiana ahí. Si no hay ciudad, escribe sobre la experiencia humana universal de esa era. Segunda persona. Prosa pura.`
      : `${voice}\n\nContext: ${ctx}\n\nWrite ~150 words about what was happening specifically in ${city || "that place"} in ${month} ${year}. Local atmosphere, regional texture, what daily life felt like there. If city unknown, write about the era's universal human experience. Second person. Pure prose.`,

    3: isEs
      ? `${voice}\n\nContexto: ${ctx}\n\nEscribe ~150 palabras sobre el mundo sensorial del momento del nacimiento. ¿Cómo eran los espacios de parto en ${year}? ¿Qué canción sonaba probablemente? ¿Qué película estaba en cines? ¿Qué costaban las cosas? ¿Qué tecnología existía — y cuál no todavía? Íntimo y específico. Segunda persona. Prosa pura.`
      : `${voice}\n\nContext: ${ctx}\n\nWrite ~150 words about the sensory world of that birth moment. What were birth spaces like in ${year}? What song was likely playing? What film was in theaters? What did things cost? What technology existed — and what didn't yet? Intimate and specific. Second person. Pure prose.`,

    4: noParents
      ? (isEs
        ? `${voice}\n\nContexto: ${ctx}\n\nEscribe ~150 palabras honrando la realidad de no haber conocido a sus padres — con dignidad y poder, no tristeza. "No necesitas esa información para conocer tu historia." Habla de construir tu identidad desde cero. Hazle sentir poderoso. Segunda persona. Prosa pura.`
        : `${voice}\n\nContext: ${ctx}\n\nWrite ~150 words honoring the reality of not knowing their parents — with dignity and power, not sadness. "You don't need that information to know your story." Talk about building your identity from zero. Make them feel powerful. Second person. Pure prose.`)
      : (isEs
        ? `${voice}\n\nContexto: ${ctx}\n\nEscribe ~150 palabras sobre lo que vivían personas de esas edades (${motherAge ? `madre: ${motherAge}` : ""} ${fatherAge ? `padre: ${fatherAge}` : ""}) en ${year}. ¿Qué soñaban? ¿Qué temían? Conecta al lector con su origen humano. Cálido y cinematográfico. Segunda persona. Prosa pura.`
        : `${voice}\n\nContext: ${ctx}\n\nWrite ~150 words about what people of those ages (${motherAge ? `mother: ${motherAge}` : ""} ${fatherAge ? `father: ${fatherAge}` : ""}) were living through in ${year}. What did they dream? Fear? Connect the reader to their human origin. Warm and cinematic. Second person. Pure prose.`),

    5: isEs
      ? `${voice}\n\nContexto: ${ctx}\n\nLa persona preguntó: "${openQuestion}"\n\nResponde directa y personalmente en ~140 palabras. Usa todo lo que sabes sobre su fecha, lugar, era y contexto familiar. Este es el momento más íntimo de la experiencia. Hazle sentir genuinamente escuchado y visto. Segunda persona. Prosa pura.`
      : `${voice}\n\nContext: ${ctx}\n\nThe person asked: "${openQuestion}"\n\nAnswer directly and personally in ~140 words. Use everything you know about their birth date, place, era, and family context. This is the most intimate moment of the experience. Make them feel genuinely heard and seen. Second person. Pure prose.`,

    // Chapter II preview — real data, returned as JSON
    ch2preview: isEs
      ? `Eres un investigador histórico preciso. El usuario nació el ${formatted} en ${city || "lugar desconocido"}.\n\nDevuelve ÚNICAMENTE un objeto JSON válido (sin markdown, sin texto extra) con estos campos exactos:\n{\n  "song": "Canción #1 más probable en las radios esa semana (artista - título)",\n  "show": "Programa de TV más popular de esa época en ese país/región",\n  "leader": "Presidente o líder de gobierno de ${city || "ese país"} en ese momento",\n  "headline": "Un titular de noticias representativo de esa semana en el mundo",\n  "price": "Precio de algo cotidiano ese año (ej: un café, una entrada de cine) en moneda local"\n}\n\nSé específico y preciso. Si no estás seguro de algo, da la respuesta más probable basada en el contexto histórico.`
      : `You are a precise historical researcher. The user was born on ${formatted} in ${city || "unknown location"}.\n\nReturn ONLY a valid JSON object (no markdown, no extra text) with these exact fields:\n{\n  "song": "Most likely #1 song on the radio that week (artist - title)",\n  "show": "Most popular TV show of that era in that country/region",\n  "leader": "President or government leader of ${city || "that country"} at that time",\n  "headline": "One representative news headline from that week in the world",\n  "price": "Price of something everyday that year (e.g. a coffee, movie ticket) in local currency"\n}\n\nBe specific and precise. If unsure, give the most historically probable answer.`,
  };

  const prompt = prompts[layer] || prompts[1];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: layer === "ch2preview" ? 400 : 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Anthropic error:", JSON.stringify(err));
      return res.status(500).json({ error: err?.error?.message || `API error ${response.status}` });
    }

    const data = await response.json();
    const text = (data?.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    if (!text) return res.status(500).json({ error: "Empty response" });

    // For ch2preview, parse JSON
    if (layer === "ch2preview") {
      try {
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        return res.status(200).json({ preview: parsed, generation: gen });
      } catch {
        return res.status(200).json({ preview: null, generation: gen });
      }
    }

    return res.status(200).json({ story: text, generation: gen });
  } catch (e) {
    console.error("Server error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
