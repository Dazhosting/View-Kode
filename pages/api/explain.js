// /pages/api/explain.js
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: "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"
});

async function ChatAiQwen(messages) {
  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: "qwen/qwen3-32b",
    temperature: 0.6,
    max_completion_tokens: 2048,
    top_p: 0.95,
    stream: true,
    reasoning_effort: "default",
    stop: null
  });

  let result = '';
  for await (const chunk of chatCompletion) {
    const content = chunk.choices?.[0]?.delta?.content || '';
    result += content;
  }

  return result;
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
    const explanation = await ChatAiQwen([
      {
        role: "user",
        content: `Tolong jelaskan kode berikut dalam bahasa Indonesia:\n\n${code}`
      }
    ]);

    res.status(200).json({ explanation });
  } catch (error) {
    res.status(500).json({ error: "Gagal menjelaskan kode", detail: error.message });
  }
}
