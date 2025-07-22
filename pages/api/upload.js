import fs from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'

const dir = path.resolve('./database/view')
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ success: false, message: 'No code' })

  const slug = nanoid(6)
  fs.writeFileSync(path.join(dir, slug), code)

  res.json({ success: true, slug })
}
