// pages/index.js
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (Tidak ada perubahan) ---
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const FileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
);
const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const CodeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);


// --- KOMPONEN ANAK (CHILD COMPONENTS) ---
const CodeItem = ({ file }) => {
    const [category, ...rest] = file.split('-');
    const fileName = rest.join('-');

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <motion.div
            layout
            variants={itemVariants}
            className="code-item"
            onClick={() => (window.location.href = `/view/${file}`)}
        >
            <div className="icon-wrapper">
                <FileIcon />
            </div>
            <div className="file-info">
                <span className="category-badge">{category.toUpperCase()}</span>
                <span className="file-name">{fileName}</span>
            </div>
            <div className="arrow">
                <ArrowRightIcon />
            </div>
        </motion.div>
    );
};

const CategoryPill = ({ category, selectedCategory, onClick }) => (
    <button
        className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
        onClick={() => onClick(category)}
    >
        {category ? category.toUpperCase() : 'Semua'}
    </button>
);


// --- KOMPONEN UTAMA (MAIN COMPONENT) ---
export default function Home({ codes }) {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState(codes || []);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const categories = ['Semua', ...new Set(codes.map(file => file.split('-')[0]))];

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let result = codes;
        const normalizedSearch = search.toLowerCase();
        const normalizedCategory = selectedCategory.toLowerCase();

        if (search) {
            result = result.filter((item) => item.toLowerCase().includes(normalizedSearch));
        }

        if (selectedCategory && selectedCategory !== 'Semua') {
            result = result.filter((item) => item.toLowerCase().startsWith(normalizedCategory));
        }

        setFiltered(result);
    }, [search, selectedCategory, codes]);

    const listContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    return (
        <div className="container" style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
        }}>
            
            {/* ================================================================== */}
            {/* ============ SEMUA KODE CSS ADA DI DALAM FILE INI ================ */}
            {/* ================================================================== */}

            <style jsx global>{`
                /* Gaya Global - berlaku untuk seluruh halaman */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                :root {
                  --bg-color: #02040a;
                  --primary-glow: hsla(212, 90%, 50%, 0.3);
                  --secondary-glow: hsla(280, 85%, 55%, 0.2);
                  --text-primary: #e6edf3;
                  --text-secondary: #848d97;
                  --border-color: #21262d;
                  --border-hover: #388bfd;
                  --surface-color: #161b22;
                  --surface-hover: #1f242c;
                  --brand-gradient: linear-gradient(90deg, #58a6ff, #9370db);
                }

                body {
                  background-color: var(--bg-color);
                  color: var(--text-primary);
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
            
            <style jsx>{`
                /* Gaya Lokal - hanya berlaku untuk elemen di dalam komponen Home */
                .container {
                  min-height: 100vh;
                  padding: 3rem 1.5rem;
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  position: relative;
                  overflow: hidden;
                }
                .container::before {
                  content: '';
                  position: absolute;
                  width: 1000px;
                  height: 1000px;
                  top: var(--mouse-y);
                  left: var(--mouse-x);
                  transform: translate(-50%, -50%);
                  background-image: radial-gradient(circle, var(--primary-glow) 0%, var(--secondary-glow) 30%, transparent 70%);
                  opacity: 0.5;
                  transition: transform 0.2s ease-out;
                  pointer-events: none;
                }
                .header {
                  text-align: center;
                  margin-bottom: 2.5rem;
                  animation: fadeIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                h1 {
                  font-size: 3.5rem;
                  font-weight: 900;
                  margin-bottom: 0.5rem;
                  background: var(--brand-gradient);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  letter-spacing: -2px;
                }
                .subtitle {
                    font-size: 1.2rem;
                    color: var(--text-secondary);
                }
                .dashboard {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                    animation: fadeIn 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards;
                    opacity: 0;
                }
                .stat-card {
                    background: rgba(22, 27, 34, 0.5);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.25rem 2rem;
                    text-align: center;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    transition: all 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    border-color: rgba(56, 139, 253, 0.5);
                }
                .stat-card strong {
                    display: block;
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .stat-card span {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .controls {
                    width: 100%;
                    max-width: 700px;
                    margin-bottom: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .search-wrapper {
                    position: relative;
                }
                
                /* Penggunaan :global(selector) untuk menargetkan elemen di dalam 
                  komponen anak (child component) dari dalam style jsx induk.
                */
                .search-wrapper :global(svg) {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                    pointer-events: none;
                }
                .search-box {
                  width: 100%;
                  padding: 14px 16px 14px 50px;
                  font-size: 1rem;
                  border: 1px solid var(--border-color);
                  border-radius: 12px;
                  background: var(--surface-color);
                  color: var(--text-primary);
                  transition: all 0.2s ease-in-out;
                }
                .search-box:focus {
                  outline: none;
                  border-color: var(--border-hover);
                  box-shadow: 0 0 0 4px rgba(56, 139, 253, 0.2);
                }
                .category-filters {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.75rem;
                  justify-content: center;
                }
                :global(.category-pill) {
                  padding: 8px 16px;
                  font-size: 0.9rem;
                  font-weight: 600;
                  border: 1px solid var(--border-color);
                  border-radius: 20px;
                  background-color: transparent;
                  color: var(--text-secondary);
                  cursor: pointer;
                  transition: all 0.2s ease;
                }
                :global(.category-pill:hover) {
                  color: var(--text-primary);
                  border-color: var(--text-secondary);
                }
                :global(.category-pill.active) {
                  color: #fff;
                  background-color: var(--border-hover);
                  border-color: var(--border-hover);
                }
                .list {
                    width: 100%;
                    max-width: 700px;
                    display: grid;
                    gap: 1rem;
                }
                :global(.code-item) {
                  display: flex;
                  align-items: center;
                  gap: 1.25rem;
                  padding: 1.25rem;
                  border-radius: 16px;
                  border: 1px solid var(--border-color);
                  background-color: var(--surface-color);
                  cursor: pointer;
                  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
                  position: relative;
                  overflow: hidden;
                }
                :global(.code-item:hover) {
                    transform: translateY(-4px) scale(1.02);
                    background-color: var(--surface-hover);
                    border-color: var(--border-hover);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
                }
                :global(.code-item .icon-wrapper) {
                    background-color: rgba(56, 139, 253, 0.1);
                    color: rgba(56, 139, 253, 1);
                    border-radius: 10px;
                    width: 44px;
                    height: 44px;
                    display: grid;
                    place-items: center;
                    flex-shrink: 0;
                }
                :global(.code-item .arrow) {
                    position: absolute;
                    right: 1.25rem;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.2s ease-in-out;
                    color: var(--text-secondary);
                }
                :global(.code-item:hover .arrow) {
                    opacity: 1;
                    transform: translateX(0);
                    color: var(--text-primary);
                }
                :global(.file-info) {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    overflow: hidden;
                }
                :global(.category-badge) {
                    background: var(--brand-gradient);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    align-self: flex-start;
                    text-transform: uppercase;
                }
                :global(.file-name) {
                    color: var(--text-primary);
                    font-weight: 500;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .empty-state {
                  text-align: center;
                  color: var(--text-secondary);
                  margin-top: 2rem;
                  background: var(--surface-color);
                  padding: 3rem;
                  border-radius: 16px;
                  border: 2px dashed var(--border-color);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 1rem;
                }
                .empty-state :global(svg) {
                  width: 48px;
                  height: 48px;
                  color: var(--text-secondary);
                }

                @media (max-width: 768px) {
                  h1 { font-size: 2.5rem; }
                  .subtitle { font-size: 1rem; }
                  .dashboard { flex-direction: column; gap: 1rem; }
                }
            `}</style>
            
            {/* ================================================================== */}
            {/* ======================= BAGIAN HTML (JSX) ======================== */}
            {/* ================================================================== */}

            <header className="header">
                <h1>Code Library Pro 🚀</h1>
                <p className="subtitle">Jelajahi, saring, dan temukan aset kodemu dengan mudah.</p>
            </header>
            
            <div className="dashboard">
                <div className="stat-card">
                    <strong>{codes.length}</strong>
                    <span>Total Files</span>
                </div>
                <div className="stat-card">
                    <strong>{categories.length - 1}</strong>
                    <span>Kategori Unik</span>
                </div>
            </div>

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

                <div className="category-filters">
                    {categories.map((cat) => (
                        <CategoryPill 
                            key={cat} 
                            category={cat} 
                            selectedCategory={selectedCategory} 
                            onClick={() => setSelectedCategory(cat === 'Semua' ? '' : cat)}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                className="list"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {filtered.length > 0 ? (
                        filtered.map((file) => <CodeItem key={file} file={file} />)
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="empty-state"
                        >
                            <CodeIcon />
                            <h3>Tidak Ada Hasil</h3>
                            <p>Oops! Sepertinya tidak ada kode yang cocok dengan filter Anda.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}


// --- getStaticProps (Tidak ada perubahan) ---
export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const directory = path.join(process.cwd(), 'codes');
  let files = [];
  
  try {
    if (fs.existsSync(directory)) {
        files = fs.readdirSync(directory);
    } else {
        console.warn("Direktori 'codes' tidak ditemukan. Membuat direktori... Anda bisa menambahkan file .txt di sana.");
        fs.mkdirSync(directory);
    }
  } catch (error) {
    console.error("Gagal membaca direktori 'codes':", error);
  }
  
  const txtFiles = files
    .filter((file) => file.endsWith('.txt'))
    .map((f) => f.replace('.txt', ''));

  return {
    props: {
      codes: txtFiles,
    },
    revalidate: 10,
  };
  }
