import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { slug } = req.query
  const filePath = path.resolve('./database/view', slug)
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'Not found' })

  const code = fs.readFileSync(filePath, 'utf-8')
  res.json({ success: true, code })
}
