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
          setCode("// Kode tidak ditemukan");
        }

        const viewRes = await fetch(`/api/view?slug=${id}`);
        const viewData = await viewRes.json();
        setViews(viewData.views || 1);
      } catch (err) {
        setCode("// ❌ Terjadi kesalahan saat memuat kode.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const url = `https://pecelview-kode.vercel.app/view/${id}`;
    navigator.clipboard.writeText(url);
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
          <div className="loading">Memuat kode...</div>
        ) : (
          <>
            <div className="meta">
              <p><strong>Bahasa:</strong> {meta.language}</p>
              <p><strong>Dibuat:</strong> {meta.createdAt ? new Date(meta.createdAt).toLocaleString() : "Tidak diketahui"}</p>
              <p><strong>Views:</strong> {views}</p>
            </div>

            <div className="terminal">
              <div className="bar">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <pre><code>{code}</code></pre>
            </div>

            <button onClick={copyCode} className="copy-btn">Salin Kode</button>
            {copied && <div className="alert">📋 Kode berhasil disalin!</div>}

            <div className="share">
              <button onClick={copyLink}>Salin Link</button>
              <a href={`https://wa.me/?text=Lihat kode ini: https://pecelview-kode.vercel.app/view/${id}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={`https://t.me/share/url?url=https://pecelview-kode.vercel.app/view/${id}`} target="_blank" rel="noopener noreferrer">Telegram</a>
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
          background: #0d0d0d;
          color: #eee;
          font-family: 'Courier New', monospace;
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
        .loading {
          font-size: 16px;
          color: #888;
          padding: 40px 0;
        }
        .meta {
          text-align: left;
          margin-bottom: 20px;
          color: #aaa;
          font-size: 14px;
        }
        .meta p {
          margin: 4px 0;
        }
        .terminal {
          background: #1c1c1c;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          text-align: left;
          overflow-x: auto;
          box-shadow: 0 0 0 1px #333;
        }
        .terminal .bar {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .red { background: #ff5f56; }
        .yellow { background: #ffbd2e; }
        .green { background: #27c93f; }
        pre {
          margin: 0;
          color: #dcdcdc;
          font-size: 14px;
        }
        .copy-btn {
          margin-top: 10px;
          background: #4db8ff;
          border: none;
          padding: 10px 20px;
          color: black;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .copy-btn:hover {
          background: #3da0e6;
        }
        .alert {
          margin-top: 8px;
          font-size: 14px;
          color: #00ff88;
        }
        .share {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .share button, .share a {
          background: #4db8ff;
          color: black;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: bold;
        }
        .share a:hover, .share button:hover {
          background: #3da0e6;
        }
        .qr {
          margin-top: 40px;
        }
        .qr p {
          color: #999;
          margin-bottom: 6px;
        }
      `}</style>
    </>
  );
          }
          
