import { useState } from 'react';
import { useRouter } from 'next/router';

// Import komponen editor dan gaya syntax highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css'; // Tema dark untuk editor

// Icon untuk loading state
function Spinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

    // Validasi sederhana: jangan kirim jika kosong
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

      // Jika sukses, redirect ke halaman view
      router.push(`/view/${data.slug}`);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Share Your Code
          </h1>
          <p className="text-gray-400 mt-2">Bagikan potongan kode secara instan dan elegan.</p>
        </div>

        <form onSubmit={handleUpload}>
          <div className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            {/* Menggunakan komponen Editor, bukan <textarea> biasa */}
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.js)} // Ganti languages.js sesuai kebutuhan
              padding={20}
              className="font-mono text-base min-h-[300px] outline-none"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
              }}
            />
          </div>

          {/* Menampilkan pesan error jika ada */}
          {error && <p className="text-red-400 mt-3 text-sm text-center">{error}</p>}
          
          <div className="mt-6 flex justify-center">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 w-full md:w-auto disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : null}
              {isLoading ? 'Mengunggah...' : 'Upload & Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
    }
