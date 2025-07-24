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
  const [meta, setMeta] = useState({ createdAt: '', language: '' });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/get?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.code);
          setMeta({
            createdAt: data.createdAt || '',
            language: data.language || 'Tidak diketahui'
          });
        } else {
          setCode("// Kode tidak ditemukan");
        }
      });

    fetch(`/api/view?slug=${id}`)
      .then(res => res.json())
      .then(data => {
        setViews(data.views || 1);
      });
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
        <title>View Code - {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="container">
        <h1>Kode: {id}</h1>

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
          <a href={`https://t.me/share/url?url= Scraper Terbaru Pecel Team Nih Rek: https://pecelview-kode.vercel.app/view/${id}`} target="_blank" rel="noopener noreferrer">Bagikan ke Telegram</a>
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
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          background: #000;
          color: #eee;
          font-family: 'Courier New', Courier, monospace;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .container {
          padding: 40px 20px;
          max-width: 800px;
          margin: auto;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #4db8ff;
        }
        .meta {
          margin-bottom: 20px;
          font-size: 14px;
          color: #999;
          text-align: left;
        }
        .meta p {
          margin-bottom: 4px;
        }
        .code-box {
          background: #1a1a1a;
          padding: 20px;
          border-radius: 12px;
          text-align: left;
          overflow-x: auto;
          border: 1px solid #333;
        }
        .code-box pre {
          margin: 0;
          color: #dcdcdc;
          font-size: 14px;
          pointer-events: none;
          user-select: none;
        }
        .copy-btn {
          margin-top: 20px;
          background: #4db8ff;
          border: none;
          color: #000;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s ease;
        }
        .copy-btn:hover {
          background: #3da0e6;
        }
        .alert {
          margin-top: 10px;
          color: #00ff88;
          font-size: 14px;
        }
        .qr {
          margin-top: 40px;
        }
        .qr p {
          margin-bottom: 8px;
          color: #888;
        }
        .share {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .share button, .share a {
          background: #4db8ff;
          color: black;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s ease;
        }
        .share button:hover, .share a:hover {
          background: #3da0e6;
        }
      `}</style>
    </>
  );
    }
  
