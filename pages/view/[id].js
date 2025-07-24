// pages/view/[id].js
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";

export default function ViewCode() {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(0);
  const [meta, setMeta] = useState({ createdAt: "", language: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/get?slug=${id}`);
        const data = await res.json();
        if (data.success) {
          setCode(data.code);
          setMeta({
            createdAt: data.createdAt || "",
            language: data.language || "Tidak diketahui",
          });
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const viewCounter = async () => {
      try {
        const res = await fetch(`/api/view?slug=${id}`);
        const data = await res.json();
        setViews(data.views || 1);
      } catch {
        setViews(1);
      }
    };

    fetchData();
    viewCounter();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const link = `https://pecelview-kode.vercel.app/view/${id}`;
    navigator.clipboard.writeText(link);
    alert("📋 Link berhasil disalin!");
  };

  return (
    <>
      <Head>
        <title>Lihat Kode - {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <h1>Kode: {id}</h1>

        {loading ? (
          <div className="loading">⏳ Memuat kode...</div>
        ) : error ? (
          <div className="error">❌ Terjadi kesalahan saat memuat kode.</div>
        ) : (
          <>
            <div className="meta">
              <p><strong>Bahasa:</strong> {meta.language}</p>
              <p><strong>Dibuat:</strong> {meta.createdAt ? new Date(meta.createdAt).toLocaleString() : "Tidak diketahui"}</p>
              <p><strong>Views:</strong> {views}</p>
            </div>

            <div className="code-box">
              <pre><code>{code}</code></pre>
            </div>

            <button onClick={copyToClipboard} className="copy-btn">Salin Kode</button>
            {copied && <div className="alert">📋 Kode berhasil disalin!</div>}

            <div className="share">
              <button onClick={copyLink}>Salin Link</button>
              <a href={`https://wa.me/?text=Scraper Terbaru Pecel Team Nih Rek: https://pecelview-kode.vercel.app/view/${id}`} target="_blank" rel="noopener noreferrer">Bagikan ke WhatsApp</a>
              <a href={`https://t.me/share/url?url=https://pecelview-kode.vercel.app/view/${id}&text=Scraper Terbaru Pecel Team Nih Rek`} target="_blank" rel="noopener noreferrer">Bagikan ke Telegram</a>
            </div>

            <div className="qr">
              <p>Scan QR untuk buka:</p>
              <QRCodeCanvas
                value={`https://pecelview-kode.vercel.app/view/${id}`}
                size={130}
                bgColor="#1a1a1a"
                fgColor="#ffffff"
                level="H"
              />
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          background: #0d1117;
          color: #c9d1d9;
          font-family: 'Courier New', monospace;
          overflow-x: hidden;
        }
        .container {
          max-width: 800px;
          margin: auto;
          padding: 40px 20px;
          text-align: center;
        }
        h1 {
          font-size: 22px;
          color: #58a6ff;
          margin-bottom: 20px;
        }
        .loading {
          color: #888;
          font-style: italic;
          margin-top: 20px;
        }
        .error {
          color: #ff6b6b;
          margin-top: 20px;
          font-weight: bold;
        }
        .meta {
          text-align: left;
          font-size: 14px;
          margin-bottom: 20px;
          color: #8b949e;
        }
        .meta p {
          margin-bottom: 4px;
        }
        .code-box {
          background: #161b22;
          padding: 20px;
          border: 1px solid #30363d;
          border-radius: 10px;
          text-align: left;
          overflow-x: auto;
          max-height: 500px;
          white-space: pre;
        }
        .code-box code {
          font-size: 14px;
          color: #dcdcdc;
          user-select: text;
        }
        .copy-btn {
          margin-top: 20px;
          background: #238636;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .copy-btn:hover {
          background: #2ea043;
        }
        .alert {
          margin-top: 10px;
          color: #3fb950;
        }
        .share {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .share button, .share a {
          background: #58a6ff;
          color: #000;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 14px;
        }
        .share button:hover, .share a:hover {
          background: #1f6feb;
          color: white;
        }
        .qr {
          margin-top: 40px;
        }
        .qr p {
          color: #8b949e;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
    }
          
