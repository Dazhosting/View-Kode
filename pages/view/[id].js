// pages/view/[id].js

import { useEffect } from 'react'
import Head from 'next/head'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Import bahasa yang didukung
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

export default function ViewCodePage({ code, id }) {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      alert('Kode berhasil disalin!')
    } catch (err) {
      alert('Gagal menyalin kode.')
    }
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Kode tidak ditemukan atau gagal dimuat.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center p-4 text-white">
      <Head>
        <title>View Code: {id}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="w-full max-w-4xl">
        <div className="relative">
          <pre className="language-javascript rounded-lg shadow-2xl p-6 border border-gray-700 overflow-x-auto">
            <code className="language-javascript">{code}</code>
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-3 rounded-md"
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
  )
}

// Ambil data kode berdasarkan ID dari GitHub
export async function getStaticProps({ params }) {
  const { id } = params

  const GITHUB_USERNAME = process.env.GITHUB_USERNAME
  const GITHUB_REPO = process.env.GITHUB_REPO
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  const filename = `${id}.txt` // Pastikan nama file disimpan sebagai .txt di GitHub

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/codes/${filename}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    )

    if (!res.ok) throw new Error('Failed to fetch')

    const code = await res.text()

    return {
      props: { code, id },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Fetch error:', error.message)
    return {
      props: { code: null, id },
    }
  }
}

// Gunakan fallback blocking agar halaman di-generate saat pertama kali diakses
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
        }
      
