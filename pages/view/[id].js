import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";

// Helper components for Icons
const Icon = ({ children, viewBox = "0 0 24 24" }) => (
    <svg width="20" height="20" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const CopyIcon = () => <Icon><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></Icon>;
const DownloadIcon = () => <Icon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></Icon>;
const ExplainIcon = () => <Icon viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="m9 17 1 1 1-1"/></Icon>;
const LinkIcon = () => <Icon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></Icon>;
const WhatsAppIcon = () => <Icon viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></Icon>;
const TelegramIcon = () => <Icon viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></Icon>;

export default function ViewCode() {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState("Memuat kode...");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [views, setViews] = useState(0);
  const [meta, setMeta] = useState({ createdAt: "", language: "text" });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  useEffect(() => {
    if (!id) return;

    fetch(`/api/get?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.code);
          setMeta({
            createdAt: data.createdAt || "",
            language: data.language || "text",
          });
        } else {
          setCode(`// Kode dengan ID "${id}" tidak dapat ditemukan.\n// Mungkin sudah dihapus atau ID salah.`);
        }
      });

    fetch(`/api/view?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setViews(data.views || 1);
      });
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    showToast("✅ Kode berhasil disalin!");
  };

  const copyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showToast("📋 Link berhasil disalin!");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${id}.${meta.language === 'text' ? 'txt' : meta.language}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const explainCode = async () => {
    showToast("🤖 AI sedang menganalisis kode...");
    try {
        const response = await fetch("/api/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        // Mengganti alert dengan tampilan yang lebih baik bisa menjadi peningkatan di masa depan (misal: modal)
        alert("📖 Penjelasan dari AI:\n\n" + data.explanation);
    } catch (error) {
        alert("Gagal mendapatkan penjelasan. Silakan coba lagi.");
    }
  };

  return (
    <>
      <Head>
        <title>{`Kode: ${id}`}</title>
        <meta name="description" content={`Lihat dan kelola kode dengan ID: ${id}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </Head>

      <div className="container">
        
        <header className="page-header">
            <h1>Lihat Kode</h1>
            <p>ID: <span>{id}</span></p>
        </header>

        <div className="meta-bar">
            <span>Bahasa: <strong>{meta.language}</strong></span>
            <span className="divider">|</span>
            <span>Dilihat: <strong>{views}x</strong></span>
            <span className="divider">|</span>
            <span>Dibuat: <strong>{meta.createdAt ? new Date(meta.createdAt).toLocaleString('id-ID') : '-'}</strong></span>
        </div>

        <div className="code-viewer">
            <div className="code-header">
                <span>{`${id}.${meta.language}`}</span>
                <button onClick={copyToClipboard} title="Salin Kode">
                    <CopyIcon /> Salin
                </button>
            </div>
            <div className="code-body">
                <pre><code>{code}</code></pre>
            </div>
        </div>

        <div className="actions-panel">
            <div className="action-group">
                <h3>Alat</h3>
                <div className="buttons">
                    <button onClick={downloadCode}><DownloadIcon /> Download</button>
                    <button onClick={explainCode}><ExplainIcon /> Jelaskan</button>
                </div>
            </div>
            <div className="action-group">
                <h3>Bagikan</h3>
                <div className="buttons">
                     <button onClick={copyLink}><LinkIcon /> Salin Link</button>
                     <a href={`https://wa.me/?text=Lihat kode ini: ${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a>
                     <a href={`https://t.me/share/url?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=Lihat kode ini`} target="_blank" rel="noopener noreferrer"><TelegramIcon /> Telegram</a>
                </div>
            </div>
        </div>
        
        <div className="qr-panel">
            <QRCodeCanvas
                value={typeof window !== 'undefined' ? window.location.href : ''}
                size={120}
                bgColor="#1a1d21"
                fgColor="#c9d1d9"
                level="H"
            />
            <p>Atau scan QR code untuk membuka di perangkat lain.</p>
        </div>

      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>

      <style jsx global>{`
        :root {
            --bg-color: #0d1117;
            --panel-color: #161b22;
            --border-color: #30363d;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --accent-color: #58a6ff;
            --accent-hover: #79c0ff;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
        }
        .container {
            padding: 2rem 1rem;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .page-header {
            text-align: center;
        }
        .page-header h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        .page-header p {
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
        }
        .page-header p span {
            color: var(--accent-color);
            font-weight: 600;
        }
        
        .meta-bar {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem 1rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
            background: var(--panel-color);
            padding: 0.75rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        .meta-bar strong {
            color: var(--text-primary);
            font-weight: 500;
        }
        .meta-bar .divider {
            color: var(--border-color);
        }

        .code-viewer {
            background: var(--panel-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            overflow: hidden;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            background: #1f242c;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.875rem;
        }
        .code-header span {
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-secondary);
        }
        .code-header button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .code-header button:hover {
            background: var(--border-color);
            color: white;
        }

        .code-body {
            overflow-x: auto;
            max-height: 50vh;
        }
        .code-body pre {
            margin: 0;
            padding: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .actions-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        .action-group h3 {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: var(--text-secondary);
        }
        .action-group .buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }
        .action-group button, .action-group a {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: var(--panel-color);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }
        .action-group button:hover, .action-group a:hover {
            background: var(--border-color);
            border-color: var(--accent-color);
            color: white;
        }
        
        .qr-panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background-color: var(--panel-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            text-align: center;
        }
        .qr-panel p {
            max-width: 200px;
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .toast {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2e343d;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: bottom 0.5s ease-in-out;
            z-index: 100;
        }
        .toast.show {
            bottom: 30px;
        }

        /* Custom Scrollbar */
        .code-body::-webkit-scrollbar { width: 10px; }
        .code-body::-webkit-scrollbar-track { background: var(--panel-color); }
        .code-body::-webkit-scrollbar-thumb { background: #454c56; border-radius: 5px; }
        .code-body::-webkit-scrollbar-thumb:hover { background: #5c6572; }
      `}</style>
    </>
  );
  }
