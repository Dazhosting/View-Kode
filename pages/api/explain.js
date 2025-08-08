// /pages/api/explain.js
import fetch from "node-fetch";

const apikey_maleyn = [
  'mg-Vmh4rgDCusL1SYdb7JKzliaffDOtRq7x',
  'mg-0Hi4qiYQpduDctTO67qcwkMP8CcTcPtp',
  'mg-qHrClPKfeG1DfU2Hx2ggaO1iKA8vptOk'
];

function getRandomApiKeymaleyn() {
  return apikey_maleyn[Math.floor(Math.random() * apikey_maleyn.length)];
}

async function askAiMulti(question) {
  try {
    const apiKey = getRandomApiKeymaleyn();
    const query = encodeURIComponent(question);
    const url = `https://ai-interface.anisaofc.my.id/api/chat/blackbox/chat?q=${query}&apikey=${apiKey}`;

    const response = await fetch(url);
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
      `Tolong jelaskan kode berikut dalam bahasa Indonesia:\n\n${code}`
    );

    if (!explanation) {
      return res.status(500).json({ error: "Gagal mendapatkan penjelasan dari AI." });
    }

    res.status(200).json({ explanation });
  } catch (error) {
    res.status(500).json({ error: "Gagal menjelaskan kode", detail: error.message });
  }
}
