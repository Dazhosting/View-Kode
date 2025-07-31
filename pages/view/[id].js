// pages/view/[id].js
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


//==================================================
// 1. KOMPONEN-KOMPONEN UI (DIPERBARUI & BARU)
//==================================================

// --- Modal/Alert (Tidak berubah, sudah bagus) ---
function CustomAlert({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (event) => event.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Ikon (Tidak berubah) ---
const Icon = ({ children, viewBox = "0 0 24 24" }) => ( <svg width="20" height="20" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg> );
const CopyIcon = () => <Icon><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></Icon>;
const DownloadIcon = () => <Icon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></Icon>;
const ExplainIcon = () => <Icon viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="m9 17 1 1 1-1"/></Icon>;
const LinkIcon = () => <Icon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></Icon>;
const WhatsAppIcon = () => <Icon viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></Icon>;
const TelegramIcon = () => <Icon viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></Icon>;

// --- ✨ [BARU] Tombol Aksi Reusable ---
const ActionButton = ({ icon, text, onClick, href }) => {
    const Tag = href ? 'a' : 'button';
    return (
        <Tag className="action-button" onClick={onClick} href={href} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}>
            {icon}
            <span>{text}</span>
        </Tag>
    );
};

// --- ✨ [DIPERBARUI] Skeleton Loader dengan gaya baru ---
function CodeSkeletonLoader() {
    return (
        <div className="skeleton-panel code-viewer">
            <div className="skeleton-header">
                <div className="skeleton-text" style={{ width: '180px', height: '14px' }}></div>
                <div className="skeleton-button"></div>
            </div>
            <div className="skeleton-body">
                <div className="skeleton-text" style={{width: '80%'}}></div>
                <div className="skeleton-text" style={{width: '95%'}}></div>
                <div className="skeleton-text" style={{width: '70%'}}></div>
                <div className="skeleton-text" style={{width: '85%'}}></div>
                <div className="skeleton-text" style={{width: '60%'}}></div>
                <div className="skeleton-text" style={{width: '90%'}}></div>
            </div>
        </div>
    );
}

//==================================================
// 2. KOMPONEN UTAMA HALAMAN (DIROMBAK TOTAL)
//==================================================
export default function ViewCode() {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [views, setViews] = useState(0);
  const [meta, setMeta] = useState({ createdAt: "", language: "text" });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", message: "" });

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    setIsAlertOpen(true);
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    
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
          setCode(`// Kode dengan ID "${id}" tidak ditemukan.`);
        }
      })
      .catch(() => setCode(`// Gagal memuat kode.`))
      .finally(() => setIsLoading(false));

    fetch(`/api/view?slug=${id}`)
      .then((res) => res.json())
      .then((data) => setViews(data.views || 1));
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    showToast("✅ Kode berhasil disalin!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
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
    showAlert("🤖 Menganalisis Kode...", "AI sedang bekerja untuk memberikan penjelasan. Mohon tunggu sebentar...");
    try {
     const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("📖 Penjelasan dari AI", data.explanation);
    } else {
       showAlert("❌ Terjadi Kesalahan", data.error || "Gagal mendapatkan penjelasan dari AI.");
    }
    } catch (error) {
      showAlert("❌ Terjadi Kesalahan", "Koneksi ke server gagal. Silakan coba lagi nanti.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };


  return (
    <>
      <Head>
        <title>{isLoading ? `Memuat...` : `Kode: ${id}`}</title>
        <meta name="description" content={`Lihat dan kelola kode dengan ID: ${id}`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header className="page-header" variants={itemVariants}>
            <h1>Code Viewer</h1>
            <p>ID: <span>{id || "..."}</span></p>
        </motion.header>

        <div className="main-grid">
            <motion.div className="code-column" variants={itemVariants}>
                {isLoading ? (
                    <CodeSkeletonLoader />
                ) : (
                    <div className="code-viewer panel">
                        <div className="code-header">
                            <span>{id || "file"}.{meta.language}</span>
                            <button onClick={copyToClipboard} title="Salin Kode">
                                <CopyIcon /> Salin
                            </button>
                        </div>
                        <div className="code-body">
                            <SyntaxHighlighter
                                language={meta.language}
                                style={vscDarkPlus}
                                customStyle={{ 
                                    margin: 0, 
                                    padding: '1.25rem',
                                    backgroundColor: 'transparent',
                                    fontSize: '0.9rem',
                                }}
                                codeTagProps={{
                                    style: { fontFamily: '"JetBrains Mono", monospace' }
                                }}
                                showLineNumbers={true}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                )}
            </motion.div>
            
            <motion.div className="sidebar-column" variants={containerVariants}>
                <motion.div className="panel" variants={itemVariants}>
                    <h4>Metadata</h4>
                    <ul className="meta-list">
                        <li><span>Bahasa</span><strong>{meta.language}</strong></li>
                        <li><span>Dilihat</span><strong>{views} kali</strong></li>
                        <li><span>Dibuat</span><strong>{meta.createdAt ? new Date(meta.createdAt).toLocaleString('id-ID') : '-'}</strong></li>
                    </ul>
                </motion.div>

                <motion.div className="panel" variants={itemVariants}>
                    <h4>Alat & Aksi</h4>
                    <div className="button-group">
                        <ActionButton icon={<DownloadIcon />} text="Download File" onClick={downloadCode} />
                        <ActionButton icon={<ExplainIcon />} text="Jelaskan dengan AI" onClick={explainCode} />
                    </div>
                </motion.div>

                <motion.div className="panel" variants={itemVariants}>
                    <h4>Bagikan</h4>
                    <div className="button-group">
                         <ActionButton icon={<LinkIcon />} text="Salin Link" onClick={copyLink} />
                         <ActionButton icon={<WhatsAppIcon />} text="WhatsApp" href={`https://wa.me/?text=Lihat kode ini: ${pageUrl}`} />
                         <ActionButton icon={<TelegramIcon />} text="Telegram" href={`https://t.me/share/url?url=${pageUrl}&text=Lihat kode ini`} />
                    </div>
                </motion.div>
                
                <motion.div className="panel qr-panel" variants={itemVariants}>
                    <QRCodeCanvas value={pageUrl} size={110} bgColor="transparent" fgColor="#e6edf3" level="H" />
                    <p>Scan untuk membuka di perangkat lain.</p>
                </motion.div>
            </motion.div>
        </div>
      </motion.div>
      
      {/* Toast & Alert Components */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className="toast"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <CustomAlert isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title={alertContent.title}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{alertContent.message}</div>
      </CustomAlert>

      {/* ============================================== */}
      {/* ============ STYLES (DIROMBAK TOTAL) ========= */}
      {/* ============================================== */}
      <style jsx global>{`
        @keyframes aurora-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        :root {
            --bg-color: #02040a;
            --panel-bg: rgba(22, 27, 34, 0.6);
            --border-color: rgba(255, 255, 255, 0.1);
            --border-hover: rgba(90, 150, 255, 0.5);
            --text-primary: #e6edf3;
            --text-secondary: #848d97;
            --accent-glow: #388bfd;
            --skeleton-bg: rgba(31, 36, 44, 0.8);
            --skeleton-highlight: rgba(48, 54, 61, 0.8);
        }
        * { box-sizing: border-box; }
        body {
            background-color: var(--bg-color);
            background-image: linear-gradient(125deg, #0d1117, #0d1117 40%, #1a0a2e, #0a1e2e, #0d1117 60%, #0d1117);
            background-size: 400% 400%;
            animation: aurora-bg 20s ease infinite;
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            margin: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* === Overrides untuk SyntaxHighlighter Scrollbar === */
        pre::-webkit-scrollbar { width: 8px; }
        pre::-webkit-scrollbar-track { background: transparent; }
        pre::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
        pre::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
      `}</style>
      <style jsx>{`
        .container {
            padding: 2rem 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .page-header { text-align: center; margin-bottom: 2.5rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.25rem; letter-spacing: -1px; }
        .page-header p { color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; font-size: 1rem; }
        .page-header span { color: var(--accent-glow); font-weight: 500; }
        
        .main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
        }
        .code-column { min-width: 0; }
        .sidebar-column { display: flex; flex-direction: column; gap: 1.5rem; }

        .panel {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.25rem;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: border-color 0.3s ease;
        }
        .panel:hover { border-color: var(--border-hover); }
        .panel h4 {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin: -1.25rem -1.25rem 1rem -1.25rem;
            padding: 0.75rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
        }

        .code-viewer { padding: 0; }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.875rem;
        }
        .code-header span { font-family: 'JetBrains Mono', monospace; color: var(--text-secondary); }
        .code-header button {
            display: flex; align-items: center; gap: 0.5rem;
            background: transparent; border: none; color: var(--text-secondary);
            padding: 6px 10px; border-radius: 6px; cursor: pointer;
            transition: all 0.2s ease;
        }
        .code-header button:hover { background: var(--border-color); color: var(--text-primary); }
        .code-body { max-height: 65vh; overflow: auto; border-radius: 0 0 12px 12px; }

        .meta-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .meta-list li { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
        .meta-list li span { color: var(--text-secondary); }
        .meta-list li strong { font-weight: 500; color: var(--text-primary); }
        
        .button-group { display: flex; flex-direction: column; gap: 0.75rem; }
        :global(.action-button) {
            display: flex; align-items: center; justify-content: flex-start; gap: 0.75rem;
            width: 100%; text-decoration: none; text-align: left;
            background: rgba(255, 255, 255, 0.05); border: 1px solid transparent;
            color: var(--text-primary); padding: 10px 14px; border-radius: 8px;
            cursor: pointer; font-size: 0.9rem; font-weight: 500;
            transition: all 0.2s ease;
        }
        :global(.action-button:hover) {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--border-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .qr-panel { display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
        .qr-panel p { font-size: 0.8rem; color: var(--text-secondary); margin: 0; max-width: 150px; line-height: 1.4; }
        
        .toast {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(to right, #28313B, #485461);
            color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            z-index: 2000;
        }

        /* Skeleton Loader Styles */
        .skeleton-panel { padding: 0; }
        .skeleton-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border-color); }
        .skeleton-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
        @keyframes pulse { 50% { background-color: var(--skeleton-highlight); } }
        .skeleton-text { height: 1em; background-color: var(--skeleton-bg); border-radius: 4px; animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .skeleton-button { width: 80px; height: 28px; border-radius: 6px; background-color: var(--skeleton-bg); animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        /* Modal Styles */
        :global(.modal-overlay) { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        :global(.modal-content) { background: var(--panel-bg); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); width: 90%; max-width: 550px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); }
        :global(.modal-header) { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; }
        :global(.modal-header h3) { margin: 0; font-size: 1.25rem; color: var(--text-primary); }
        :global(.close-button) { background: transparent; border: none; color: var(--text-secondary); font-size: 2rem; line-height: 1; cursor: pointer; padding: 0; transition: color 0.2s ease; }
        :global(.close-button:hover) { color: #fff; }
        :global(.modal-body) { color: var(--text-primary); font-size: 1rem; line-height: 1.6; max-height: 60vh; overflow-y: auto; padding-right: 0.5rem; }
        
        @media (max-width: 900px) {
            .main-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
