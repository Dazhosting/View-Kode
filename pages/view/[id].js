// pages/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ViewKode() {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  const fetchCode = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/get?slug=${id}`);
      const data = await res.json();

      if (!data.success) {
        setError('❌ Terjadi kesalahan saat memuat kode.');
      } else {
        setCode(data.code);
        await fetch(`/api/views?id=${id}`); // hitung view
        const viewRes = await fetch(`/api/viewcount?id=${id}`);
        const viewData = await viewRes.json();
        setViews(viewData.count || 1);
      }
    } catch (e) {
      setError('❌ Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCode();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('✅ Kode disalin!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('✅ Link disalin!');
  };

  return (
    <div>
      <style jsx>{`
        body {
          font-family: monospace;
        }
        .container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
        }
        .title {
          font-weight: bold;
          font-size: 1.2rem;
          margin-bottom: 10px;
        }
        .code-box {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 15px;
          border-radius: 10px;
          overflow-x: auto;
          font-family: monospace;
          white-space: pre;
        }
        .buttons {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .btn {
          background: #222;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn:hover {
          background: #444;
        }
        .link-share {
          margin-top: 10px;
        }
        .link-share a {
          margin-right: 15px;
          color: blue;
        }
        .qr {
          margin-top: 25px;
        }
      `}</style>

      <div className="container">
        <div className="title">Views: {views}</div>

        {loading ? (
          <div>⏳ Memuat kode...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="code-box">{code}</div>
        )}

        {!loading && !error && (
          <>
            <div className="buttons">
              <button className="btn" onClick={handleCopy}>Salin Kode</button>
              <button className="btn" onClick={handleCopyLink}>Salin Link</button>
            </div>

            <div className="link-share">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
              >
                Bagikan ke WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
              >
                Bagikan ke Telegram
              </a>
            </div>

            <div className="qr">
              <p>Scan QR untuk buka:</p>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} alt="QR" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
