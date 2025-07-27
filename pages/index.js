import { useEffect, useState } from 'react';

export default function Home({ codes }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(codes || []);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(codes.map(file => file.split('-')[0]))];

  useEffect(() => {
    let result = codes;

    if (search) {
      result = result.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((item) =>
        item.toLowerCase().startsWith(selectedCategory.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, selectedCategory, codes]);

  return (
    <div className="container">
      <style jsx>{`
        .container {
          background: #0d1117;
          color: #c9d1d9;
          min-height: 100vh;
          padding: 2rem 1rem;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #58a6ff;
        }

        .search-box,
        .category-select {
          width: 100%;
          max-width: 400px;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #30363d;
          border-radius: 8px;
          background: #161b22;
          color: #fff;
          margin-bottom: 1rem;
        }

        .dashboard {
          margin: 1rem 0 2rem;
          background: #161b22;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          border: 1px solid #30363d;
          text-align: center;
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

      <h1>📁 View Code Save</h1>

      {/* DASHBOARD */}
      <div className="dashboard">
        <div>📊 Total Kode Tersedia: <strong>{codes.length}</strong></div>
        <div>🧩 Kategori Unik: <strong>{categories.length}</strong></div>
      </div>

      {/* FILTER */}
      <select
        className="category-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">🔎 Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.toUpperCase()}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="search-box"
        placeholder="Cari kode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
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
  const txtFiles = files
    .filter((file) => file.endsWith('.txt'))
    .map((f) => f.replace('.txt', ''));

  return {
    props: {
      codes: txtFiles,
    },
  };
                       }
