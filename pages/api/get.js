export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, message: 'Slug is required' });
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/Dazhosting/View-Kode/main/codes/${slug}.txt`;
    const apiUrl = `https://api.github.com/repos/Dazhosting/View-Kode/commits?path=codes/${slug}.txt&page=1&per_page=1`;

    // Fetch file content
    const response = await fetch(rawUrl);
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'File not found' });
    }
    const text = await response.text();

    // Fetch metadata (createdAt)
    let createdAt = '';
    try {
      const metaRes = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'View-Kode-App',
        },
      });
      const commits = await metaRes.json();
      if (commits.length > 0) {
        createdAt = commits[0].commit.author.date;
      }
    } catch (err) {
      createdAt = ''; // fallback
    }

    // Detect language from extension
    const ext = slug.split('.').pop();
    const extToLang = {
      js: 'JavaScript',
      py: 'Python',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      ts: 'TypeScript',
      md: 'Markdown',
      sh: 'Shell',
      cpp: 'C++',
      c: 'C',
      java: 'Java',
      txt: 'Text',
    };
    const language = extToLang[ext] || 'Unknown';

    return res.status(200).json({
      success: true,
      code: text,
      createdAt,
      language,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
      }
