// pages/view/[id].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function ViewCode() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/get?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCode(data.code);
        else setCode("// Gagal memuat kode.");
      });
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Gagal menyalin.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-mono px-4 py-8">
      <Head>
        <title>View Code: {id}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="max-w-4xl mx-auto bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 border border-gray-700 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#00bcd4]">📄 Kode: {id}</h1>
          <button
            onClick={handleCopy}
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-black font-semibold py-2 px-4 rounded-md transition-all text-sm"
          >
            {copied ? "✅ Disalin!" : "📋 Salin"}
          </button>
        </div>

        <pre className="bg-[#121212] rounded-xl p-4 overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>

        <div className="text-center mt-6">
          <a href="/" className="text-[#b388ff] hover:underline text-sm">
            ← Upload kode baru
          </a>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-md text-sm animate-fadeIn">
          ✅ Kode berhasil disalin!
        </div>
      )}
    </div>
  );
    }
              
