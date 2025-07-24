import { useState } from 'react';
import { useRouter } from 'next/router';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

function Spinner() {
  return (
    <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5 0 0 5 0 12h4z"></path>
    </svg>
  );
}

export default function Home() {
  const [code, setCode] = useState('// Tulis kode kamu di sini...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleUpload(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (code.trim() === '' || code.trim() === '// Tulis kode kamu di sini...') {
      setError('Kode tidak boleh kosong.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengupload kode.');
      }

      router.push(`/view/${data.slug}`);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4 select-none">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">
            ⚡️ Share Kode Instan
          </h1>
          <p className="text-gray-400 mt-2">Tulis. Upload. Bagikan.</p>
        </div>

        <form onSubmit={handleUpload}>
          <div className="rounded-2xl bg-[#0f0f0f] border border-gray-700 shadow-[0_0_15px_rgba(0,255,255,0.1)] overflow-hidden transition-all duration-200">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.js)}
              padding={20}
              className="font-mono min-h-[300px] text-base outline-none text-white"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                backgroundColor: 'transparent',
              }}
            />
          </div>

          {error && (
            <p className="text-red-500 mt-3 text-sm text-center">{error}</p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-300 w-full md:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Mengunggah...' : '🚀 Upload & Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
    }
      
