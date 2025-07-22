export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, message: 'Slug is required' });
  }

  try {
    const response = await fetch(`https://raw.githubusercontent.com/Dazhosting/View-Kode/main/codes/${slug}.txt`);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'File not found' });
    }

    const text = await response.text();

    return res.status(200).json({ success: true, code: text });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
}
