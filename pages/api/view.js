import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ success: false });

  const statsPath = path.resolve('public/views.json');
  let views = {};

  if (fs.existsSync(statsPath)) {
    views = JSON.parse(fs.readFileSync(statsPath));
  }

  views[slug] = (views[slug] || 0) + 1;
  fs.writeFileSync(statsPath, JSON.stringify(views, null, 2));

  res.status(200).json({ success: true, views: views[slug] });
}
