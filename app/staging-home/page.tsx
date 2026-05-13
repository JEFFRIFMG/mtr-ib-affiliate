"use client";

import { useState, useEffect, useMemo } from "react";

// 1. Tambahkan Interface ini biar TypeScript tau bentuk data dari API
interface Broker {
  id: string;
  name: string;
  status: string;
  regulation_tier: string;
  hq_country: string;
  legal_name?: string;
  regulation?: string;
  score: string | number;
  color?: string;
  eur_usd_spread?: string | number;
  min_deposit?: string | number;
  max_leverage?: string | number;
  website?: string;
  account_type?: string;
  instruments?: string;
  [key: string]: any; // Jaga-jaga kalau ada kolom lain dari GSheet
}

// Definisikan tipe untuk Sort agar strict
type SortType = 'score' | 'thumbs' | 'name';

export default function StagingHomePage() {
  // 2. Pasang tipe <Broker[]> di state
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("legitimate");
  const [sortBy, setSortBy] = useState<SortType>("score");
  const [sortDir, setSortDir] = useState({ score: 'desc', thumbs: 'desc', name: 'asc' });
  
  // 3. Pasang tipe untuk votes
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Menghitung jumlah negara unik dari dataset GSheet
  const uniqueCountriesCount = useMemo(() => {
    const countries = brokers
      .map(b => b.hq_country)
      .filter(country => country && country.trim() !== "" && country !== "—");
    return new Set(countries).size;
  }, [brokers]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/brokers-staging");
        const data = await res.json();
        setBrokers(data);
      } catch (err) {
        console.error("Gagal load data staging:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    try {
      const savedVotes = JSON.parse(localStorage.getItem('bb_votes') || '{}');
      setVotes(savedVotes);
    } catch (e) {}
  }, []);

  // 4. Tambahkan tipe 'string' dan 'number' di parameter fungsi
  const getVC = (id: string) => parseInt(localStorage.getItem('bb_vc_' + id) || '0');
  const setVC = (id: string, n: number) => { try { localStorage.setItem('bb_vc_' + id, n.toString()); } catch (e) {} };

  const handleToggleVote = (id: string) => {
    const newVotes = { ...votes };
    if (newVotes[id]) {
      delete newVotes[id];
      setVC(id, Math.max(0, getVC(id) - 1));
    } else {
      newVotes[id] = 1;
      setVC(id, getVC(id) + 1);
    }
    setVotes(newVotes);
    try { localStorage.setItem('bb_votes', JSON.stringify(newVotes)); } catch (e) {}
  };

  const handleSortClick = (type: SortType) => {
    if (sortBy === type) {
      setSortDir({ ...sortDir, [type]: sortDir[type] === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortBy(type);
    }
  };

  const filteredAndSortedBrokers = useMemo(() => {
    let result = brokers.filter(b => {
      if (filterStatus && b.status !== filterStatus) return false;
      if (filterTier && b.regulation_tier !== filterTier) return false;
      if (filterRegion && b.hq_country !== filterRegion) return false;
      
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const searchString = [b.name, b.legal_name, b.regulation, b.hq_country].join(' ').toLowerCase();
        if (!searchString.includes(q)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'score') {
        const d = (parseFloat(b.score as string) || 0) - (parseFloat(a.score as string) || 0);
        return sortDir.score === 'desc' ? d : -d;
      }
      if (sortBy === 'thumbs') {
        const d = getVC(b.id) - getVC(a.id);
        return sortDir.thumbs === 'desc' ? d : -d;
      }
      const d = (a.name || '').localeCompare(b.name || '');
      return sortDir.name === 'asc' ? d : -d;
    });

    return result;
  }, [brokers, searchTerm, filterTier, filterRegion, filterStatus, sortBy, sortDir, votes]);

  // 5. Tambahkan tipe di helper UI
  const sColor = (s: number) => s >= 8 ? 'high' : s >= 6.5 ? 'mid' : 'low';
  
  const renderAcctTags = (b: Broker) => {
    if (!b.account_type) return null;
    const map: Record<string, string[]> = { 
        'Market Maker': ['MM', 'mm'], 'ECN/STP': ['ECN', 'ecn'], 'STP': ['STP', 'stp'], 
        'STP/ECN': ['STP', 'stp'], 'ECN': ['ECN', 'ecn'], 'NDD': ['NDD', 'ndd'], 
        'RAW ECN': ['RAW', 'ecn'], 'Social Trading': ['Social', 'stp'] 
    };
    return b.account_type.split(/[,\/]/).map((t: string, idx: number) => {
      const cleanT = t.trim();
      const m = map[cleanT];
      if (m) return <span key={idx} className={`acct-tag acct-${m[1]}`}>{m[0]}</span>;
      return <span key={idx} className="acct-tag acct-stp">{cleanT}</span>;
    });
  };

  const renderLicTags = (reg?: string) => {
    if (!reg) return <span className="dbox-value muted">—</span>;
    const tags = reg.split(',').map((l: string) => l.trim()).filter(Boolean).slice(0, 5);
    return tags.map((l: string, idx: number) => <span key={idx} className="lic-tag">{l}</span>);
  };

  return (
    <>
      {/* CSS INI 100% COPAS DARI FILE index.html LU. 
        TIDAK ADA SATUPUN CLASS ATAU WARNA YANG DIGANTI/DIUBAH. 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root{
          --navy:#0D1B2A;--navy2:#152436;--teal:#00B894;--teal-dark:#009E80;
          --text:#1A2332;--text2:#4A5568;--text3:#8A9BAE;
          --border:#E2E8F0;--bg:#F0F4F8;--white:#FFFFFF;
          --red:#E53E3E;--amber:#D69E2E;--green:#38A169;
          --shadow-sm:0 1px 3px rgba(0,0,0,.07);
          --shadow:0 2px 8px rgba(0,0,0,.08);
          --shadow-lg:0 6px 24px rgba(0,0,0,.11);
          --radius:10px;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:14px;line-height:1.5}

        /* ── NAV ── */
        .nav-wrap{background:var(--navy);position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(0,0,0,.25)}
        nav{max-width:1300px;margin:0 auto;padding:0 24px;display:flex;align-items:center;height:60px}
        .nav-logo{display:flex;align-items:center;gap:9px;text-decoration:none;margin-right:28px;flex-shrink:0}
        .nav-logo-icon{width:34px;height:34px;background:var(--teal);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;letter-spacing:-.5px}
        .nav-logo-text{font-size:17px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .nav-logo-text span{color:var(--teal)}
        .nav-links{display:flex;list-style:none;gap:1px;flex:1}
        .nav-links a{color:rgba(255,255,255,.65);text-decoration:none;font-size:13px;font-weight:500;padding:7px 12px;border-radius:6px;transition:all .15s;white-space:nowrap}
        .nav-links a:hover{color:#fff;background:rgba(255,255,255,.08)}
        .nav-links a.active{color:#fff;background:rgba(255,255,255,.1)}
        .btn-listed{background:var(--teal)!important;color:#fff!important;font-weight:600!important;padding:7px 14px!important}
        .btn-listed:hover{background:var(--teal-dark)!important}

        /* ── HERO ── */
        .hero{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 55%,#1B3049 100%);padding:44px 24px 40px;text-align:center;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(0,184,148,.09) 0%,transparent 55%),radial-gradient(ellipse at 75% 40%,rgba(0,102,255,.06) 0%,transparent 55%);pointer-events:none}
        .hero-inner{position:relative;max-width:680px;margin:0 auto}
        .hero-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(0,184,148,.14);border:1px solid rgba(0,184,148,.28);color:var(--teal);font-size:11.5px;font-weight:600;padding:3px 11px;border-radius:20px;margin-bottom:16px;letter-spacing:.3px}
        .hero h1{font-size:clamp(26px,3.8vw,42px);font-weight:700;color:#fff;line-height:1.15;letter-spacing:-.7px;margin-bottom:12px}
        .hero h1 span{color:var(--teal)}
        .hero p{color:rgba(255,255,255,.52);font-size:14.5px;max-width:500px;margin:0 auto 28px;line-height:1.65}
        .hero-stats{display:flex;justify-content:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;overflow:hidden;max-width:420px;margin:0 auto}
        .hero-stat{flex:1;padding:14px 18px;border-right:1px solid rgba(255,255,255,.08)}
        .hero-stat:last-child{border-right:none}
        .hero-stat-num{font-size:22px;font-weight:700;color:#fff;display:block;line-height:1;margin-bottom:3px}
        .hero-stat-num b{color:var(--teal)}
        .hero-stat-label{font-size:10.5px;color:rgba(255,255,255,.38);font-weight:500;text-transform:uppercase;letter-spacing:.5px}

        /* ── FILTERS ── */
        .filters-wrap{background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:60px;z-index:90;box-shadow:var(--shadow-sm)}
        .filters{max-width:1300px;margin:0 auto;padding:12px 24px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .search-wrap{position:relative;flex:1;min-width:200px}
        .search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none}
        .search-wrap input{width:100%;padding:8px 11px 8px 35px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;font-size:13px;color:var(--text);outline:none;background:var(--bg);transition:border-color .15s}
        .search-wrap input::placeholder{color:var(--text3)}
        .search-wrap input:focus{border-color:var(--teal);background:#fff}
        .fsel{padding:8px 28px 8px 10px;border:1.5px solid var(--border);border-radius:7px;font-family:inherit;font-size:12.5px;font-weight:500;color:var(--text);background:var(--bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238A9BAE'/%3E%3C/svg%3E") no-repeat right 9px center;appearance:none;cursor:pointer;outline:none;transition:border-color .15s}
        .fsel:focus{border-color:var(--teal)}
        .sort-group{display:flex;gap:3px}
        .sort-btn{padding:7px 12px;border:1.5px solid var(--border);border-radius:7px;background:var(--bg);font-family:inherit;font-size:12px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .15s;white-space:nowrap}
        .sort-btn:hover{border-color:var(--teal);color:var(--teal)}
        .sort-btn.active{background:var(--navy);border-color:var(--navy);color:#fff}
        .count-label{margin-left:auto;font-size:11.5px;color:var(--text3);font-weight:500;white-space:nowrap}

        /* ── MAIN ── */
        .main{max-width:1300px;margin:20px auto;padding:0 24px}

        /* ── BROKER CARD — compact horizontal ── */
        .broker-card{
          background:var(--white);
          border-radius:var(--radius);
          border:1px solid var(--border);
          margin-bottom:8px;
          display:flex;
          align-items:center;
          overflow:hidden;
          transition:box-shadow .15s,transform .15s;
          min-height:72px;
        }
        .broker-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-1px)}
        .card-accent{width:3px;align-self:stretch;flex-shrink:0}
        .card-rank{width:44px;text-align:center;flex-shrink:0;padding:0 4px}
        .rank-num{font-size:15px;font-weight:700;color:var(--text3);line-height:1}
        .rank-num.gold{color:#C9A227}
        .rank-num.silver{color:#9EB0C5}
        .rank-num.bronze{color:#C87941}
        .card-logo{width:54px;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0 6px}
        .logo-circle{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0}
        .card-identity{width:190px;flex-shrink:0;padding:10px 12px 10px 4px;border-right:1px solid var(--border)}
        .card-name{font-size:14px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:4px}
        .tag-row{display:flex;gap:3px;flex-wrap:wrap}
        .acct-tag{display:inline-block;padding:1px 5px;border-radius:3px;font-size:9.5px;font-weight:700;letter-spacing:.2px;text-transform:uppercase}
        .acct-mm{background:#EBF4FF;color:#2B6CB0}
        .acct-stp{background:#E6FFFA;color:#276749}
        .acct-ecn{background:#FAF5FF;color:#6B46C1}
        .acct-ndd{background:#FFF5F5;color:#C53030}
        .tier-badge{display:inline-block;padding:1px 5px;border-radius:3px;font-size:9.5px;font-weight:700}
        .tier-1{background:#E6FFFA;color:#276749}
        .tier-2{background:#FEFCBF;color:#7B6E0A}
        .tier-3{background:#FFF5F5;color:#C53030}
        .inst-badge{display:inline-block;font-size:9px;background:#F0F4F8;color:var(--text3);border-radius:3px;padding:1px 5px;font-weight:700;text-transform:uppercase}

        .card-boxes{flex:1;display:flex;align-items:center;padding:0 8px;gap:4px;flex-wrap:nowrap;overflow:hidden}
        .dbox{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px;min-width:72px;flex:1;text-align:center;}
        .dbox-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);font-weight:600;margin-bottom:2px;white-space:nowrap}
        .dbox-value{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.1;white-space:nowrap}
        .dbox-value.green{color:var(--green)}
        .dbox-value.teal{color:var(--teal-dark)}
        .dbox-value.muted{color:var(--text3);font-weight:500}
        .dbox-lic{min-width:100px;flex:1.4}
        .lic-tags{display:flex;flex-wrap:wrap;gap:2px;justify-content:center;margin-top:2px}
        .lic-tag{display:inline-block;padding:1px 4px;background:var(--white);border:1px solid var(--border);border-radius:3px;font-size:9px;font-weight:600;color:var(--text2)}

        .card-score{width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 8px;border-left:1px solid var(--border);}
        .score-num{font-size:20px;font-weight:800;line-height:1}
        .score-num.high{color:var(--teal-dark)}
        .score-num.mid{color:var(--amber)}
        .score-num.low{color:var(--red)}
        .score-denom{font-size:10px;color:var(--text3);font-weight:500}
        .score-label{font-size:9px;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);font-weight:600;margin-bottom:3px}

        .card-actions{width:158px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 12px;border-left:1px solid var(--border);}
        .btn-hub{display:block;width:100%;text-align:center;padding:6px 0;border:1.5px solid var(--border);border-radius:6px;color:var(--text2);font-size:11.5px;font-weight:600;text-decoration:none;transition:all .15s}
        .btn-hub:hover{border-color:var(--navy);color:var(--navy)}
        .btn-visit{display:block;width:100%;text-align:center;padding:6px 0;background:var(--teal);border:1.5px solid var(--teal);border-radius:6px;color:#fff;font-size:11.5px;font-weight:600;text-decoration:none;transition:background .15s}
        .btn-visit:hover{background:var(--teal-dark);border-color:var(--teal-dark)}
        .thumb-btn{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border:1.5px solid var(--border);border-radius:12px;background:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:500;color:var(--text3);transition:all .15s}
        .thumb-btn:hover{border-color:var(--teal);color:var(--teal)}
        .thumb-btn.voted{border-color:var(--teal);color:var(--teal);background:rgba(0,184,148,.06)}

        .broker-card.inst{opacity:.45}
        .broker-card.inst:hover{opacity:.7;transform:none}
        .empty{text-align:center;padding:70px 24px;color:var(--text3)}
        .empty p{font-size:15px;font-weight:500}
        .loading-wrap{text-align:center;padding:60px;color:var(--text3);font-size:13.5px;font-weight:500}
        .spinner{width:30px;height:30px;border:3px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 14px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
        .broker-card{animation:fadeUp .18s ease both}

        /* FOOTER */
        footer{background:var(--navy);color:rgba(255,255,255,.4);text-align:center;padding:26px 24px;font-size:12px;line-height:1.7;margin-top:36px}
        footer a{color:rgba(255,255,255,.55);text-decoration:none}
        footer a:hover{color:var(--teal)}
        .footer-links{display:flex;gap:18px;justify-content:center;margin-bottom:10px;flex-wrap:wrap}

        /* Responsive */
        .hamburger{display:none}
        .mobile-menu{display:none}
        @media(max-width:1100px){.dbox:nth-child(n+5){display:none} .card-identity{width:170px}}
        @media(max-width:860px){.dbox:nth-child(n+4){display:none} .card-identity{width:150px} .card-actions{width:130px}}

        /* MOBILE MQ */
        @media(max-width:680px){
          nav{height:54px;padding:0 14px;justify-content:space-between}
          .nav-logo{margin-right:0}
          .nav-logo-icon{width:30px;height:30px;font-size:13px}
          .nav-logo-text{font-size:15px}
          .nav-links{display:none}
          .hamburger{display:flex;flex-direction:column;justify-content:center;gap:4px;width:36px;height:36px;background:none;border:none;cursor:pointer;padding:0;border-radius:6px;transition:background .15s;}
          .hamburger:active{background:rgba(255,255,255,.1)}
          .hamburger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .25s ease}
          .hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg)}
          .hamburger.open span:nth-child(2){opacity:0}
          .hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}

          .mobile-menu{display:none;position:fixed;top:54px;left:0;right:0;background:var(--navy);border-top:1px solid rgba(255,255,255,.08);padding:8px 14px 18px;z-index:99;max-height:calc(100vh - 54px);overflow-y:auto;animation:slideDown .2s ease;}
          .mobile-menu.open{display:block}
          .mobile-menu a{display:block;color:rgba(255,255,255,.78);text-decoration:none;font-size:15px;font-weight:500;padding:14px 4px;border-bottom:1px solid rgba(255,255,255,.07);}
          .mobile-menu a:last-child{border-bottom:none}
          .mobile-menu a.active{color:var(--teal)}
          .mobile-menu a.btn-listed-m{background:var(--teal);color:#fff;text-align:center;border-radius:8px;margin-top:10px;font-weight:700;padding:13px;border:none;}
          @keyframes slideDown{from{transform:translateY(-6px);opacity:0}to{transform:translateY(0);opacity:1}}

          .hero{padding:26px 16px 22px}
          .hero-badge{font-size:10.5px;padding:3px 10px;margin-bottom:12px}
          .hero h1{font-size:24px;line-height:1.2;letter-spacing:-.5px;margin-bottom:9px}
          .hero p{font-size:13.5px;line-height:1.55;margin-bottom:18px;padding:0 4px}
          .hero-stats{max-width:100%;border-radius:9px}
          .hero-stat{padding:11px 6px}
          .hero-stat-num{font-size:17px}
          .hero-stat-label{font-size:9px;letter-spacing:.3px}

          .filters-wrap{top:54px}
          .filters{padding:10px 14px;gap:8px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
          .filters::-webkit-scrollbar{display:none}
          .search-wrap{flex:0 0 auto;min-width:0;width:160px;order:1;}
          .search-wrap input{font-size:13px;padding:8px 11px 8px 31px}
          .search-icon{left:9px}
          .fsel{flex:0 0 auto;font-size:12px;padding:8px 24px 8px 10px;min-width:auto;order:2;}
          .sort-group{flex:0 0 auto;order:3;gap:4px;}
          .sort-btn{font-size:11.5px;padding:7px 10px;flex:0 0 auto;}
          .count-label{display:none}

          .main{padding:0 10px;margin:14px auto 18px}
          .broker-card{display:flex;flex-wrap:wrap;align-items:stretch;min-height:unset;border-radius:11px;margin-bottom:9px;padding:0;overflow:hidden;position:relative;}
          .card-accent{width:3px;flex-shrink:0;align-self:stretch;order:1;}
          .card-rank{order:2;width:auto;padding:11px 2px 11px 8px;display:flex;align-items:center;flex-shrink:0;}
          .rank-num{font-size:13px}
          .card-logo{order:3;width:auto;padding:9px 4px;display:flex;align-items:center;flex-shrink:0;}
          .logo-circle{width:40px;height:40px;font-size:15px;border-radius:9px}
          .card-identity{order:4;flex:1 1 auto;width:auto;min-width:0;border-right:none;padding:11px 6px 11px 4px;display:flex;flex-direction:column;justify-content:center;}
          .card-name{font-size:14px;line-height:1.25;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
          .tag-row{gap:3px;flex-wrap:wrap}
          .acct-tag,.tier-badge{font-size:9px;padding:1.5px 5px}
          .inst-badge{font-size:9px}
          .card-score{order:5;width:auto;padding:11px 12px 11px 6px;border-left:none;border-top:none;display:flex;flex-direction:column;gap:0;align-items:flex-end;justify-content:center;text-align:right;flex-shrink:0;}
          .score-label{font-size:8.5px;margin-bottom:1px;letter-spacing:.4px}
          .score-num{font-size:18px;line-height:1}
          .score-denom{font-size:9.5px}

          .card-boxes{order:6;width:100%;flex:1 0 100%;border-top:1px solid var(--border);padding:9px 10px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;overflow:visible;}
          .dbox:nth-child(n+4),.dbox:nth-child(n+5){display:flex !important}
          .dbox{min-width:0;padding:6px 4px;border-radius:7px;flex:initial;text-align:center;overflow:hidden;}
          .dbox-lic{grid-column:span 3;padding:7px 8px;}
          .dbox-label{font-size:8.5px;letter-spacing:.3px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
          .dbox-value{font-size:12.5px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
          .lic-tags{gap:3px;justify-content:center;flex-wrap:wrap}
          .lic-tag{font-size:9.5px;padding:1.5px 5px}

          .card-actions{order:7;width:100%;flex:1 0 100%;border-left:none;border-top:1px solid var(--border);display:flex;flex-direction:row;padding:9px 10px;gap:7px;align-items:center;}
          .btn-hub,.btn-visit{flex:1;padding:10px 0;font-size:12.5px;font-weight:700;border-radius:8px;white-space:nowrap;}
          .thumb-btn{flex:0 0 auto;padding:9px 11px;border-radius:8px;font-size:11.5px;min-height:36px;white-space:nowrap;}
          .thumb-btn svg{width:13px;height:13px}

          .broker-card.inst{opacity:.55}
          footer{padding:22px 18px 28px;font-size:11.5px}
          .footer-links{gap:14px;margin-bottom:9px;font-size:12.5px}
          footer p{padding:0 4px}
          body{padding-bottom:env(safe-area-inset-bottom)}
        }
        @media(max-width:380px){
          .hero h1{font-size:22px}
          .hero-stat-num{font-size:16px}
          .card-name{font-size:13.5px}
          .score-num{font-size:17px}
          .dbox-value{font-size:12px}
        }
      `}} />

      {/* ── NAV ── */}
      <div className="nav-wrap">
        <nav>
          <a className="nav-logo" href="#">
            <div className="nav-logo-icon">BB</div>
            <span className="nav-logo-text">Broker<span>Broker</span></span>
          </a>
          <ul className="nav-links">
            <li><a href="#" className="active">Ranking</a></li>
            <li><a href="#">Comparison</a></li>
            <li><a href="#">Awards</a></li>
            <li><a href="#">IB/Affiliate</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#" className="btn-listed">Get Listed</a></li>
          </ul>
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
            aria-label="Toggle menu" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#" className="active">Ranking</a>
          <a href="#">Comparison</a>
          <a href="#">Awards</a>
          <a href="#">IB/Affiliate</a>
          <a href="#">Blog</a>
          <a href="#">About Us</a>
          <a href="#" className="btn-listed-m">Get Listed</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge">✦ Updated May 2026</div>
          <h1>Global Broker Rankings <span>2026</span></h1>
          <p>Independent rankings of 590+ regulated brokers worldwide. Compare regulation, spreads, platforms and fees. No paid placements.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num"><b>{brokers.filter(r => r.status === 'legitimate').length || 295}</b></span>
              <span className="hero-stat-label">Retail Brokers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num"><b>{uniqueCountriesCount > 0 ? uniqueCountriesCount : '40'}</b>+</span>
              <span className="hero-stat-label">Countries</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num"><b>100</b>%</span>
              <span className="hero-stat-label">Independent</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="filters-wrap">
        <div className="filters">
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search broker name, regulator…" 
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="fsel" value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="">All Tiers</option>
            <option value="Tier-1">Tier 1 (Top-Tier)</option>
            <option value="Tier-2">Tier 2</option>
            <option value="Tier-3">Tier 3 / Offshore</option>
          </select>
          <select className="fsel" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
            <option value="">All Regions</option>
            <option value="Australia">Australia</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Japan">Japan</option>
            <option value="United States">United States</option>
            <option value="Singapore">Singapore</option>
            <option value="Seychelles">Seychelles</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Malta">Malta</option>
            <option value="South Africa">South Africa</option>
            <option value="United Arab Emirates">UAE</option>
          </select>
          <select className="fsel" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="legitimate">Retail Brokers</option>
            <option value="">All (incl. Institutional)</option>
            <option value="institution">Institutional Only</option>
          </select>
          <div className="sort-group">
            <button className={`sort-btn ${sortBy === 'score' ? 'active' : ''}`} onClick={() => handleSortClick('score')}>★ Score</button>
            <button className={`sort-btn ${sortBy === 'thumbs' ? 'active' : ''}`} onClick={() => handleSortClick('thumbs')}>👍 Popular</button>
            <button className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`} onClick={() => handleSortClick('name')}>A–Z</button>
          </div>
          <div className="count-label">{filteredAndSortedBrokers.length} broker{filteredAndSortedBrokers.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="main">
        <div id="broker-list">
          {loading ? (
            <div className="loading-wrap"><div className="spinner"></div>Loading brokers…</div>
          ) : filteredAndSortedBrokers.length === 0 ? (
            <div className="empty"><p>No brokers match your filters.</p></div>
          ) : (
            filteredAndSortedBrokers.map((b, index) => {
              const rank = index + 1;
              const isInst = b.status === 'institution';
              const score = parseFloat(String(b.score)) || 0;
              const color = b.color || '#0D1B2A';
              const vCount = getVC(b.id);
              const hasVoted = !!votes[b.id];
              const rankClass = rank === 1 && !isInst ? 'gold' : rank === 2 && !isInst ? 'silver' : rank === 3 && !isInst ? 'bronze' : '';
              
              const spread = parseFloat(String(b.eur_usd_spread));
              const dep = parseFloat(String(b.min_deposit));
              const lev = parseInt(String(b.max_leverage));
              const website = (b.website || '').trim();
              const visitHref = website && website !== '--' ? website : '#';

              return (
                <div key={b.id || index} className={`broker-card ${isInst ? 'inst' : ''}`} style={{ animationDelay: `${Math.min(rank * .018, .28)}s` }}>
                  <div className="card-accent" style={{ background: color }}></div>
                  <div className="card-rank"><span className={`rank-num ${rankClass}`}>{isInst ? '—' : rank}</span></div>
                  <div className="card-logo">
                    <div className="logo-circle" style={{ background: color }}>
                      {b.name ? b.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  </div>
                  <div className="card-identity">
                    <div className="card-name">{b.name}</div>
                    <div className="tag-row">
                      {!isInst && renderAcctTags(b)}
                      {isInst ? (
                        <span className="inst-badge">Inst.</span>
                      ) : b.regulation_tier === 'Tier-1' ? (
                        <span className="tier-badge tier-1">T1</span>
                      ) : b.regulation_tier === 'Tier-2' ? (
                        <span className="tier-badge tier-2">T2</span>
                      ) : (
                        <span className="tier-badge tier-3">T3</span>
                      )}
                    </div>
                  </div>
                  <div className="card-boxes">
                    <div className="dbox dbox-lic">
                      <div className="dbox-label">Regulation</div>
                      <div className="lic-tags">
                        {renderLicTags(b.regulation)}
                      </div>
                    </div>
                    <div className="dbox">
                      <div className="dbox-label">EUR/USD</div>
                      {isNaN(spread) || isInst ? <span className="dbox-value muted">—</span> : spread === 0 ? <span className="dbox-value teal">0.0 pips</span> : <span className="dbox-value">{spread.toFixed(1)} pips</span>}
                    </div>
                    <div className="dbox">
                      <div className="dbox-label">Min. Deposit</div>
                      {isNaN(dep) || isInst ? <span className="dbox-value muted">—</span> : dep === 0 ? <span className="dbox-value green">$0</span> : <span className="dbox-value">${dep.toLocaleString()}</span>}
                    </div>
                    <div className="dbox">
                      <div className="dbox-label">Leverage</div>
                      {isNaN(lev) || isInst || lev === 0 ? <span className="dbox-value muted">—</span> : <span className="dbox-value">1:{lev.toLocaleString()}</span>}
                    </div>
                    <div className="dbox">
                      <div className="dbox-label">Instruments</div>
                      <span className="dbox-value">{isInst ? '—' : (b.instruments || '—')}</span>
                    </div>
                    <div className="dbox">
                      <div className="dbox-label">HQ</div>
                      <span className="dbox-value" style={{ fontSize: '11.5px' }}>{b.hq_country || '—'}</span>
                    </div>
                  </div>
                  <div className="card-score">
                    <div className="score-label">Score</div>
                    {isInst ? (
                      <span className="score-num" style={{ fontSize: '13px', color: 'var(--text3)' }}>N/A</span>
                    ) : (
                      <>
                        <span className={`score-num ${sColor(score)}`}>{score.toFixed(1)}</span>
                        <span className="score-denom">/10</span>
                      </>
                    )}
                  </div>
                  <div className="card-actions">
                    <a className="btn-hub" href={`broker/${b.id}/`}>Visit Hub</a>
                    <a className="btn-visit" href={visitHref} target="_blank" rel="noopener noreferrer">Visit Broker ↗</a>
                    <button className={`thumb-btn ${hasVoted ? 'voted' : ''}`} onClick={() => handleToggleVote(b.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      <span className="vc">{vCount > 0 ? vCount : 'Recommend'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-links">
          <a href="#">Ranking</a><a href="#">Comparison</a><a href="#">Awards</a>
          <a href="#">IB/Affiliate</a><a href="#">Blog</a><a href="#">About Us</a>
          <a href="#">Privacy Policy</a><a href="#">Disclaimer</a>
        </div>
        <p>© 2026 BrokerBroker · Powered by MyTradingReviews · Independent broker research</p>
        <p style={{ marginTop: '5px' }}>Scores are editorial opinions, not financial advice. Trading CFDs carries risk. Always verify regulation before depositing funds.</p>
      </footer>
    </>
  );
}