import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function ViewCode() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/get?slug=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCode(data.code);
        else setCode("// Gagal memuat kode.");
      });
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Gagal menyalin.");
    }
  };

  return (
    <>
      <Head>
        <title>View Code: {id}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="container">
        <div className="code-box">
          <div className="header">
            <h1>📄 Kode: {id}</h1>
            <button onClick={handleCopy}>
              {copied ? "✅ Disalin!" : "📋 Salin"}
            </button>
          </div>
          <pre>
            <code>{code}</code>
          </pre>
          <div className="footer">
            <a href="/">← Upload kode baru</a>
          </div>
        </div>
        {copied && (
          <div className="alert">
            ✅ Kode berhasil disalin!
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0f0f0f;
          color: #eee;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          font-family: monospace;
        }

        .code-box {
          background: #1e1e1e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 0 20px rgba(0, 188, 212, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .header h1 {
          font-size: 1.2rem;
          color: #00bcd4;
          margin: 0;
        }

        .header button {
          background: #00bcd4;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .header button:hover {
          background: #00acc1;
        }

        pre {
          background: #121212;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.95rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .footer {
          margin-top: 1rem;
          text-align: center;
        }

        .footer a {
          color: #b388ff;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .alert {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #4caf50;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
          animation: fadein 0.4s ease-out;
          font-size: 0.9rem;
        }

        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
  }
    
