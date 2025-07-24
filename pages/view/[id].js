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
      setLoading(true);
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
          setCode("// ❌ Kode tidak ditemukan");
        }

        const viewRes = await fetch(`/api/view?slug=${id}`);
        const viewData = await viewRes.json();
        setViews(viewData.views || 1);
      } catch (e) {
        setCode("// ❌ Terjadi kesalahan saat memuat kode");
      }
      setLoading(false);
    };

    fetchData();
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <h1>View Kode: <span>{id}</span></h1>

        {loading ? (
          <div className="loading">⏳ Memuat kode...</div>
        ) : (
          <>
            <div className="meta">
              <p><strong>Bahasa:</strong> {meta.language}</p>
              <p><strong>Dibuat:</strong> {meta.createdAt ? new Date(meta.createdAt).toLocaleString() : "Tidak diketahui"}</p>
              <p><strong>Total Dilihat:</strong> {views}</p>
            </div>

            <div className="terminal-box">
              <div className="terminal-bar">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <pre><code>{code}</code></pre>
            </div>

            <button onClick={copyToClipboard} className="copy-btn">📋 Salin Kode</button>
            {copied && <div className="alert">✅ Kode berhasil disalin!</div>}

            <div className="share">
              <button onClick={copyLink}>🔗 Salin Link</button>
              <a href={`https://wa.me/?text=Lihat kode ini: https://pecelview-kode.vercel.app/view/${id}`} target="_blank">📱 WhatsApp</a>
              <a href={`https://t.me/share/url?url=https://pecelview-kode.vercel.app/view/${id}&text=Lihat kode ini`} target="_blank">📨 Telegram</a>
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
          </>
        )}
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          background: #0e0e0e;
          color: #f0f0f0;
          font-family: monospace;
        }
        .container {
          padding: 30px 20px;
          max-width: 900px;
          margin: auto;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #00ffff;
        }
        h1 span {
          color: #4db8ff;
        }
        .meta {
          margin-bottom: 20px;
          font-size: 14px;
          color: #ccc;
          text-align: left;
        }
        .meta p {
          margin-bottom: 4px;
        }

        .terminal-box {
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #333;
          margin-bottom: 15px;
        }
        .terminal-bar {
          display: flex;
          padding: 8px;
          background: #2b2b2b;
          justify-content: start;
          gap: 6px;
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
          padding: 20px;
          text-align: left;
          overflow-x: auto;
          color: #ffffffcc;
          font-size: 14px;
          background: #1a1a1a;
        }

        .copy-btn {
          background: #00ffcc;
          color: #000;
          border: none;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 8px;
        }
        .copy-btn:hover {
          background: #00e6b3;
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
          justify-content: center;
          flex-wrap: wrap;
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
        .share a:hover,
        .share button:hover {
          background: #3da0e6;
        }

        .qr {
          margin-top: 30px;
        }
        .qr p {
          color: #aaa;
          margin-bottom: 6px;
        }

        .loading {
          margin-top: 50px;
          font-size: 16px;
          color: #00ffff;
        }
      `}</style>
    </>
  );
          }
    
