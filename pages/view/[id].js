import { useEffect, useState } from 'react'
import Head from 'next/head'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Bahasa yang didukung Prism
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'

export default function ViewCodePage({ code, id }) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [theme, setTheme] = useState('dark')

  // Deteksi bahasa dari ekstensi file
  const extension = id.split('.').pop()
  const langMap = {
    js: 'javascript',
    html: 'markup',
    css: 'css',
    json: 'json',
    py: 'python',
    java: 'java'
  }
  const detectedLang = langMap[extension] || 'javascript'

  useEffect(() => {
    Prism.highlightAll()
  }, [code, detectedLang])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Copy failed')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      console.error('Failed to copy link')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = id
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white px-4">
        <p className="text-lg">⚠️ Kode tidak ditemukan atau gagal dimuat.</p>
      </div>
    )
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-black'} min-h-screen`}>
      <Head>
        <title>Lihat Kode: {id}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center p-4 max-w-6xl mx-auto gap-2">
        <h1 className="text-lg font-bold">📄 File: <span className="text-blue-500">{id}</span></h1>
        <div className="space-x-2 flex flex-wrap">
          <button onClick={toggleTheme} className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={downloadCode} className="bg-green-600 hover:bg-green-500 text-sm px-3 py-1 rounded text-white">
            ⬇️ Download
          </button>
          <button onClick={copyLink} className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-1 rounded text-white">
            🔗 Salin Tautan
          </button>
          <a href={`/edit/${id}`} className="bg-yellow-600 hover:bg-yellow-500 text-sm px-3 py-1 rounded text-white">
            ✏️ Edit
          </a>
        </div>
      </div>

      {/* Kode */}
      <div className="max-w-6xl mx-auto p-4 relative">
        <div className={`relative border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} rounded-xl shadow-lg`}>
          <pre className={`language-${detectedLang} overflow-x-auto rounded-xl p-6 bg-gray-900 text-white`}>
            <code className={`language-${detectedLang}`}>{code}</code>
          </pre>

          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-md shadow text-white"
          >
            📋 Salin
          </button>

          {/* Toast */}
          {copied && (
            <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out text-sm">
              ✅ Kode berhasil disalin
            </div>
          )}
          {linkCopied && (
            <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out text-sm">
              🔗 Tautan berhasil disalin
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300 underline text-sm">
            &larr; Upload kode baru
          </a>
        </div>
      </div>

      {/* Fade animation */}
      <style jsx global>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const { id } = params
  try {
    const res = await fetch(`https://pecelview-kode.vercel.app/api/get?slug=${id}`)
    const data = await res.json()
    if (!data.success) throw new Error('Fetch failed')

    return {
      props: { code: data.code, id },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Fetch error:', error.message)
    return { props: { code: null, id } }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
      }
      
