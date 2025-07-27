import { useEffect, useState } from 'react';

// SVG Icon Components for better readability
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);


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
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body {
          background: #000; /* Darker background */
          color: #e6edf3;
        }
      `}</style>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-image:
            radial-gradient(at 20% 25%, hsla(212, 90%, 50%, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 20%, hsla(280, 85%, 55%, 0.15) 0px, transparent 50%),
            radial-gradient(at 75% 80%, hsla(340, 90%, 60%, 0.15) 0px, transparent 50%);
          animation: fadeIn 0.8s ease-in-out;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #88c0d0, #81a1c1, #b48ead);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
        }
        
        .subtitle {
            font-size: 1.1rem;
            color: #8b949e;
        }
        
        .dashboard {
            display: flex;
            gap: 1rem;
            margin: 2rem 0;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            text-align: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .stat-card strong {
            display: block;
            font-size: 1.75rem;
            font-weight: 700;
            color: #eceff4;
        }

        .stat-card span {
            font-size: 0.9rem;
            color: #a3aab3;
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            width: 100%;
            max-width: 650px;
            margin-bottom: 2rem;
        }
        
        .search-wrapper, .category-select {
            flex: 1;
            min-width: 250px;
        }

        .search-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .search-wrapper :global(svg) {
            position: absolute;
            left: 14px;
            color: #8b949e;
            pointer-events: none;
        }

        .search-box,
        .category-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 1px solid #30363d;
          border-radius: 10px;
          background: #0d1117;
          color: #e6edf3;
          transition: all 0.2s ease-in-out;
        }
        
        .search-box {
            padding-left: 40px;
        }

        .search-box:focus,
        .category-select:focus {
          outline: none;
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
        }
        
        /* Custom arrow for select */
        .category-select {
            appearance: none;
            background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%238b949e" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 1rem center;
            padding-right: 2.5rem; /* Make space for arrow */
        }
        
        .list {
            width: 100%;
            max-width: 650px;
            display: grid;
            gap: 0.75rem;
        }

        .code-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #30363d;
          background: #161b22;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          overflow: hidden;
          position: relative;
        }
        
        .code-item:hover {
            transform: translateY(-3px) scale(1.01);
            border-color: #58a6ff;
            background: #21262d;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .code-item :global(svg) {
            color: #8b949e;
            flex-shrink: 0;
        }
        
        .code-item .arrow {
            position: absolute;
            right: 1rem;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.2s ease-in-out;
            color: #58a6ff;
        }
        
        .code-item:hover .arrow {
            opacity: 1;
            transform: translateX(0);
        }
        
        .file-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-grow: 1;
            overflow: hidden;
            white-space: nowrap;
        }

        .category-badge {
            background-color: rgba(88, 166, 255, 0.15);
            color: #79c0ff;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .file-name {
            color: #c9d1d9;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        
        .empty {
          text-align: center;
          color: #8b949e;
          margin-top: 2rem;
          background: #161b22;
          padding: 2rem;
          border-radius: 12px;
          border: 1px dashed #30363d;
        }
      `}</style>

      <header className="header">
        <h1>📁 Code Library</h1>
        <p className="subtitle">Telusuri, Saring, dan Temukan Kode Anda.</p>
      </header>
      
      {/* DASHBOARD */}
      <div className="dashboard">
        <div className="stat-card">
            <strong>{codes.length}</strong>
            <span>Total Kode</span>
        </div>
        <div className="stat-card">
            <strong>{categories.length}</strong>
            <span>Kategori Unik</span>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="controls">
        <div className="search-wrapper">
          <SearchIcon/>
          <input
            type="text"
            className="search-box"
            placeholder="Cari berdasarkan nama file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* LIST */}
      <div className="list">
        {filtered.length > 0 ? (
          filtered.map((file) => {
            const [category, ...rest] = file.split('-');
            const fileName = rest.join('-');
            return (
                <div
                key={file}
                className="code-item"
                onClick={() => (window.location.href = `/view/${file}`)}
                >
                    <FileIcon/>
                    <div className="file-info">
                        <span className="category-badge">{category.toUpperCase()}</span>
                        <span className="file-name">{fileName}</span>
                    </div>
                    <div className="arrow">
                      <ArrowRightIcon />
                    </div>
                </div>
            )
          })
        ) : (
          <div className="empty">Oops! Tidak ada kode yang cocok dengan filter Anda.</div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const directory = path.join(process.cwd(), 'codes');
  let files = [];
  try {
    files = fs.readdirSync(directory);
  } catch (error) {
    console.log("Direktori 'codes' tidak ditemukan. Menggunakan list kosong.");
    // Jika direktori tidak ada, biarkan `files` menjadi array kosong
  }
  
  const txtFiles = files
    .filter((file) => file.endsWith('.txt'))
    .map((f) => f.replace('.txt', ''));

  return {
    props: {
      codes: txtFiles,
    },
  };
  }
