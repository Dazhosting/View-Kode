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
        <h1>Kode ID: <span>{id}</span></h1>

        <div className="meta">
          <p><strong>Bahasa:</strong> {meta.language}</p>
          <p><strong>Dibuat:</strong> {meta.createdAt ? new Date(meta.createdAt).toLocaleString() : "Tidak diketahui"}</p>
          <p><strong>Total Dilihat:</strong> {views}</p>
        </div>

        <div className="code-box">
          <pre><code>{code}</code></pre>
        </div>

        <button onClick={copyToClipboard} className="copy-btn">📋 Salin Kode</button>
        {copied && <div className="alert">✅ Kode berhasil disalin!</div>}

        <div className="share">
          <button onClick={copyLink}>🔗 Salin Link</button>
          <a href={`https://wa.me/?text=Lihat kode ini: https://pecelview-kode.vercel.app/view/${id}`} target="_blank" rel="noopener noreferrer">📱 WhatsApp</a>
          <a href={`https://t.me/share/url?url=https://pecelview-kode.vercel.app/view/${id}&text=Lihat kode ini`} target="_blank" rel="noopener noreferrer">📨 Telegram</a>
        </div>

        <div className="qr">
          <p>Scan QR:</p>
          <QRCodeCanvas
            value={`https://pecelview-kode.vercel.app/view/${id}`}
            size={130}
            bgColor="#000"
            fgColor="#00ffff"
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
          background: #0a0a0a;
          color: #f0f0f0;
          font-family: 'Courier New', monospace;
        }
        .container {
          padding: 40px 20px;
          max-width: 900px;
          margin: auto;
          text-align: center;
        }
        h1 {
          font-size: 26px;
          margin-bottom: 20px;
          color: #4db8ff;
        }
        h1 span {
          color: #00ffcc;
        }
        .meta {
          margin-bottom: 20px;
          font-size: 15px;
          color: #ccc;
          text-align: left;
        }
        .meta p {
          margin-bottom: 6px;
        }
        .code-box {
          background: #1e1e1e;
          padding: 20px;
          border-radius: 12px;
          text-align: left;
          overflow-x: auto;
          border: 1px solid #333;
          margin-bottom: 15px;
        }
        .code-box pre {
          margin: 0;
          color: #ffffffcc;
          font-size: 14px;
          line-height: 1.5;
        }
        .copy-btn {
          background: #4db8ff;
          border: none;
          color: #000;
          font-weight: bold;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .copy-btn:hover {
          background: #3da0e6;
        }
        .alert {
          margin-top: 10px;
          color: #00ff88;
          font-size: 14px;
        }
        .share {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .share button,
        .share a {
          background: #4db8ff;
          color: black;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        }
        .share button:hover,
        .share a:hover {
          background: #3da0e6;
        }
        .qr {
          margin-top: 30px;
        }
        .qr p {
          color: #aaa;
          margin-bottom: 6px;
        }
      `}</style>
    </>
  );
    }
    
