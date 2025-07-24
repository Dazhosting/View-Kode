export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'No code provided' });
    }

    // Ambil dari env
    const githubToken = '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';
    const githubUsername = 'Dazhosting';
    const githubRepo = 'View-Kode';
    
    if (!githubToken || !githubUsername || !githubRepo) {
      return res.status(500).json({ success: false, message: 'Missing GitHub configuration in environment variables.' });
    }

    const slug = Math.random().toString(36).substring(2, 10);
    const filename = `${slug}.js`;
    const content = Buffer.from(code).toString('base64');

    const githubApiUrl = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/codes/${filename}`;

    const payload = {
      message: `feat: add new code snippet ${filename}`,
      content,
      branch: 'main'
    };

    const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': githubUsername
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      return res.status(response.status).json({
        success: false,
        message: `Failed to upload to GitHub. ${errorData.message || ''}`,
      });
    }

    const result = await response.json();
    return res.status(201).json({
      success: true,
      slug,
      url: result.content?.html_url || null,
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
      }
