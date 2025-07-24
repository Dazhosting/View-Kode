// pages/view/[id].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/get?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.code);
        } else {
          setCode("// Gagal memuat kode.");
        }
      });
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">📄 View Code</h1>
        <div className="relative mb-4">
          <button
            onClick={handleCopy}
            className="absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-all"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
        <pre className="bg-gray-900 rounded-xl p-4 overflow-auto text-sm whitespace-pre-wrap">
          <code>{code}</code>
        </pre>

        {copied && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300 animate-bounce">
            ✅ Kode berhasil disalin!
          </div>
        )}
      </div>
    </div>
  );
}
