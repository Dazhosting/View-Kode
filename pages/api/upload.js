// pages/api/save-code.js

export default async function handler(req, res) {
  // 1. Hanya izinkan metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { code } = req.body;

    // 2. Validasi input: pastikan 'code' ada di body request
    if (!code) {
      return res.status(400).json({ success: false, message: 'No code provided' });
    }

    // 3. Ambil konfigurasi dari environment variables
    const githubToken = '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';
    const githubUsername = 'Dazhosting';
    const githubRepo = 'View-Kode';

    if (!githubToken || !githubUsername || !githubRepo) {
      return res.status(500).json({ success: false, message: 'Server configuration error. Missing GitHub credentials.' });
    }

    // 4. Buat nama file acak dan encode konten ke base64
    const slug = Math.random().toString(36).substring(2, 10);
    const filename = `${slug}.js`; // Ganti ekstensi jika perlu, misal .txt, .py, dll.
    const content = Buffer.from(code).toString('base64');
    
    // 5. Definisikan URL API GitHub dan data yang akan dikirim
    const githubApiUrl = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/codes/${filename}`;

    const payload = {
      message: `feat: add new code snippet ${filename}`, // Pesan commit
      content: content, // Konten file dalam format base64
      branch: 'main' // Opsional: tentukan branch, defaultnya adalah branch utama repo
    };

    // 6. Kirim request ke GitHub API
    const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(payload)
    });

    // 7. Periksa respons dari GitHub
    if (!response.ok) {
      const errorData = await response.json();
      // Log error di server untuk debugging
      console.error('GitHub API Error:', errorData); 
      return res.status(response.status).json({
        success: false,
        message: `Failed to upload to GitHub. ${errorData.message || ''}`,
      });
    }
    
    const result = await response.json();

    // 8. Kirim respons sukses ke client
    return res.status(201).json({ 
        success: true, 
        slug: slug,
        url: result.content.html_url // URL file di GitHub
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
}
