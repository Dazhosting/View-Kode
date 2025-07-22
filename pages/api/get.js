export default async function handler(req, res) {
  const { slug } = req.query
  const filename = `${slug}.txt`

  const githubApi = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/codes/${filename}`

  const response = await fetch(githubApi, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  })

  if (!response.ok) return res.status(404).json({ success: false, message: 'File not found' })

  const data = await response.json()
  const code = Buffer.from(data.content, 'base64').toString()
  res.json({ success: true, code })
}
