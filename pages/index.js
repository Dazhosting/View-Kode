import { useEffect, useState } from 'react';

export default function Home({ codes }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(codes || []);

  useEffect(() => {
    if (!search) setFiltered(codes);
    else
      setFiltered(
        codes.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
      );
  }, [search, codes]);

  return (
    <div className="container">
      <style jsx>{`
        .container {
          background: #0d1117;
          color: #c9d1d9;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          font-family: Arial, sans-serif;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #58a6ff;
        }

        .search-box {
          width: 100%;
          max-width: 400px;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #30363d;
          border-radius: 8px;
          background: #161b22;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .list {
          width: 100%;
          max-width: 600px;
          border: 1px solid #30363d;
          border-radius: 10px;
          background: #161b22;
          padding: 1rem;
        }

        .code-item {
          padding: 0.75rem;
          border-bottom: 1px solid #30363d;
          cursor: pointer;
          transition: background 0.2s;
        }

        .code-item:hover {
          background: #21262d;
        }

        .code-item:last-child {
          border-bottom: none;
        }

        .empty {
          text-align: center;
          color: #8b949e;
          margin-top: 1rem;
        }
      `}</style>

      <h1>📁 Kode Tersimpan</h1>

      <input
        type="text"
        className="search-box"
        placeholder="Cari kode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="list">
        {filtered.length > 0 ? (
          filtered.map((file) => (
            <div
              key={file}
              className="code-item"
              onClick={() => (window.location.href = `/view/${file}`)}
            >
              {file}
            </div>
          ))
        ) : (
          <div className="empty">Tidak ada kode ditemukan.</div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const directory = path.join(process.cwd(), 'codes');
  const files = fs.readdirSync(directory);
  const txtFiles = files.filter((file) => file.endsWith('.txt')).map((f) => f.replace('.txt', ''));

  return {
    props: {
      codes: txtFiles,
    },
  };
          }
  
