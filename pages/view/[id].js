// pages/view/[id].js

import { useEffect } from 'react';
import Head from 'next/head';
import prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Tema yang sama dengan halaman utama

// Impor komponen untuk bahasa yang ingin kamu dukung
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
// Tambahkan bahasa lain jika perlu

export default function ViewCodePage({ code, id }) {

  useEffect(() => {
    // Jalankan highlighting setelah komponen di-render di client
    prism.highlightAll();
  }, [code]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      alert('Kode berhasil disalin!');
    } catch (err) {
      alert('Gagal menyalin kode.');
    }
  }

  if (!code) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <p>Kode tidak ditemukan atau gagal dimuat.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center p-4">
      <Head>
        <title>View Code: {id}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="w-full max-w-4xl">
        <div className="relative">
            <pre className="language-js rounded-lg shadow-2xl p-6 border border-gray-700">
                <code className="language-js">{code}</code>
            </pre>
            <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-3 rounded-md transition-colors"
            >
                Copy
            </button>
        </div>
        <div className="mt-4 text-center">
            <a href="/" className="text-blue-400 hover:underline">
                &larr; Upload kode baru
            </a>
        </div>
      </div>
    </div>
  );
}

// Fungsi ini akan mengambil data di sisi server saat build time
export async function getStaticProps(context) {
  const { id } = context.params;
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  // Nama file di repo (misal: abcdef.js)
  const filename = `${id}.js`; 

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/codes/${filename}`, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3.raw' // Minta konten mentah
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch code from GitHub.');
    }

    const code = await res.text();

    return {
      props: { code, id },
      revalidate: 3600, // Regenerasi halaman setiap 1 jam jika ada request baru
    };
  } catch (error) {
    console.error('Error fetching code:', error);
    return { props: { code: null, id } };
  }
}

// Fungsi ini memberitahu Next.js path mana yang harus di-generate saat build
export async function getStaticPaths() {
  // Kita tidak men-generate halaman apapun saat build,
  // halaman akan di-generate saat pertama kali diakses (fallback: 'blocking')
  return {
    paths: [],
    fallback: 'blocking',
  };
                  }
