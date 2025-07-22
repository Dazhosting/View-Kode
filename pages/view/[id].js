import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

export default function ViewPage() {
  const { id } = useRouter().query
  const [code, setCode] = useState('Loading...')

  useEffect(() => {
    if (id) {
      fetch(`/api/get?slug=${id}`)
        .then(res => res.json())
        .then(data => setCode(data.code || 'Error'))
    }
  }, [id])

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code).value }} />
      </pre>
    </div>
  )
}
