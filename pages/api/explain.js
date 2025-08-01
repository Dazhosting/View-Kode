// /pages/api/explain.js
import fetch from "node-fetch";

async function askAiMulti(question, model = "llama-3.3", systemPrompt = null) {
  try {
    const response = await fetch("https://ai-interface.anisaofc.my.id/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        model: model,
        system_prompt: systemPrompt
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

    const data = await response.json();
    return data.answer || "Tidak ada jawaban dari AI.";
  } catch (err) {
    console.error("Gagal memanggil API:", err.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Kode tidak ditemukan." });
  }

  try {
    const explanation = await askAiMulti(
      `Tolong jelaskan kode berikut dalam bahasa Indonesia:\n\n${code}`,
      "llama-3.3"
    );

    if (!explanation) {
      return res.status(500).json({ error: "Gagal mendapatkan penjelasan dari AI." });
    }

    res.status(200).json({ explanation });
  } catch (error) {
    res.status(500).json({ error: "Gagal menjelaskan kode", detail: error.message });
  }
}
