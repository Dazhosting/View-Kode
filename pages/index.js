import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [code, setCode] = useState('')
  const router = useRouter()

  async function handleUpload(e) {
    e.preventDefault()
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (data.success) router.push(`/view/${data.slug}`)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4 font-bold">Upload Kode</h1>
      <form onSubmit={handleUpload}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 border rounded font-mono"
          placeholder="Tulis kode kamu di sini..."
        />
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  )
    }
            
