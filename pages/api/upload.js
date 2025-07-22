export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ success: false, message: 'No code provided' })

  const slug = Math.random().toString(36).substring(2, 8)
  const filename = `${slug}.txt`
  const content = Buffer.from(code).toString('base64')

  const githubApi = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/codes/${filename}`

  const response = await fetch(githubApi, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `add code ${filename}`,
      content
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return res.status(500).json({ success: false, message: 'GitHub upload failed', error })
  }

  res.json({ success: true, slug })
}
