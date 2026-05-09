"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const quickNav = [
  { icon: "🏆", title: "Top 100", sub: "Worldwide Brokers" },
  { icon: "🎯", title: "Broker Awards", sub: "& Rankings" },
  { icon: "🎁", title: "Latest Bonuses", sub: "& Promotions" },
  { icon: "📋", title: "In-Depth", sub: "Broker Reviews" },
];

function getScoreData(score: number) {
  if (score >= 9) return { label: "Excellent", stars: 5 };
  if (score >= 8) return { label: "Very Good", stars: 4 };
  if (score >= 7) return { label: "Good", stars: 3 };
  if (score >= 6) return { label: "Average", stars: 2 };
  return { label: "Poor", stars: 1 };
}

function getCurrencyPair(region: string) {
  if (region.includes("United Kingdom")) return "GBP/USD";
  if (region.includes("Australia")) return "AUD/USD";
  if (region.includes("Japan")) return "USD/JPY";
  if (region.includes("Cyprus") || region.includes("Europe")) return "EUR/USD";
  return "EUR/USD";
}

function getTags(licenseTypes: string) {
  const tags: string[] = [];
  if (!licenseTypes) return tags;
  if (licenseTypes.includes("(MM)")) tags.push("MM");
  if (licenseTypes.includes("(STP)")) tags.push("STP");
  if (licenseTypes.includes("ECN")) tags.push("ECN");
  if (licenseTypes.includes("NDD")) tags.push("NDD");
  if (licenseTypes.includes("Options")) tags.push("OPTIONS");
  return tags;
}

export default function HomeBrokerList() {
  const [brokers, setBrokers] = useState<any[]>([]);
  
  // STATE BARU BUAT LOGIC LOAD MORE
  const [loading, setLoading] = useState(true); // Buat loading pertama kali buka web
  const [limit, setLimit] = useState(100); // Default nampilin 100 data
  const [hasMore, setHasMore] = useState(true); // Ngecek apa data di database masih sisa
  const [loadingMore, setLoadingMore] = useState(false); // Buat efek loading pas tombol Load More diklik
  const [totalBrokers, setTotalBrokers] = useState(0); // Buat nyimpen total jumlah broker di database

  // STATE BUAT FILTER & SEARCH
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegulator, setFilterRegulator] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  useEffect(() => {
    async function fetchBrokers() {
      if (limit > 100) setLoadingMore(true);

      // 1. Bikin query dasar
      let query = supabase
        .from("brokers")
        .select("*", { count: 'exact' });

      // 2. Tambahin logic pencarian (Kayak Google)
      if (searchQuery) {
        // ilike itu case-insensitive (huruf gede/kecil tetep kebaca)
        query = query.ilike('broker_name', `%${searchQuery}%`); 
      }

      // 3. Tambahin logic filter dropdown
      if (filterRegulator) {
        query = query.ilike('regulators', `%${filterRegulator}%`);
      }
      if (filterType) {
        query = query.ilike('license_types', `%${filterType}%`);
      }
      if (filterPlatform) {
        query = query.ilike('platforms', `%${filterPlatform}%`);
      }

      // 4. Eksekusi query dengan order dan limit
      const { data, error, count } = await query
        .order("wikifx_rating", { ascending: false })
        .range(0, limit - 1);

      if (!error && data) {
        setBrokers(data);
        if (count !== null) setTotalBrokers(count);

        if (count && data.length >= count) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
      
      setLoading(false);
      setLoadingMore(false);
    }
    
    fetchBrokers();
  }, [limit, searchQuery, filterRegulator, filterType, filterPlatform]); // Fetch bakal jalan ulang otomatis tiap state limit-nya nambah

  const handleLoadMore = () => {
    setLimit((prev) => prev + 100);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white text-lg">Loading brokers...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 pt-24 pb-12">

      {/* Hero + Quick Nav */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-12">
        
        <div className="lg:w-auto">
          <h1 className="text-4xl lg:text-[44px] font-bold text-white leading-tight lg:whitespace-nowrap">
            Find The Best Brokers in{" "}
            <span className="text-[#00e676]">2026</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base">
            Compare broker reviews, awards, rankings, and latest bonuses.
          </p>
        </div>
        
        {/* Quick Nav Area */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {quickNav.map((item) => (
            <div 
              key={item.title} 
              className="bg-glass rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#00e676]/50 transition group"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="text-white text-sm font-semibold">{item.title}</div>
                <div className="text-gray-400 text-[11px] leading-tight">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#080f0e] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4 relative z-10">
        {/* Label Kosmetik "Filter Brokers" (Paling Kiri) */}
        <div className="flex items-center gap-2 md:pr-4 md:border-r border-white/10 shrink-0 w-full md:w-auto">
          {/* Icon Funnel (Corong Filter) */}
          <svg 
            className="w-[18px] h-[18px] text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="text-white text-sm font-semibold">Filter Brokers</span>
        </div>

        {/* Search Box (Google Style) */}
        <div className="relative w-full md:flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search broker name..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setLimit(100); // Reset limit tiap kali user nyari biar data ga numpuk
            }}
            className="w-full bg-[#050d0c] border border-white/5 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#00e676]/50 transition-colors placeholder:text-gray-600 text-sm"
          />
        </div>

        {/* Dropdown 1: Regulators */}
        <div className="w-full md:w-[200px]">
          <select 
            value={filterRegulator}
            onChange={(e) => {
              setFilterRegulator(e.target.value);
              setLimit(100);
            }}
            className="w-full bg-[#050d0c] border border-white/5 text-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e676]/50 transition-colors text-sm appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
          >
            <option value="">All Regulations</option>
            <option value="ASIC">ASIC (Australia)</option>
            <option value="FCA">FCA (UK)</option>
            <option value="CYSEC">CySEC (Europe)</option>
            <option value="FSA">FSA (Offshore)</option>
          </select>
        </div>

        {/* Dropdown 2: Broker Types */}
        <div className="w-full md:w-[200px]">
          <select 
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setLimit(100);
            }}
            className="w-full bg-[#050d0c] border border-white/5 text-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e676]/50 transition-colors text-sm appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
          >
            <option value="">All Broker Types</option>
            <option value="ECN">ECN</option>
            <option value="STP">STP</option>
            <option value="MM">Market Maker (MM)</option>
          </select>
        </div>

        {/* Dropdown 3: Platforms */}
        <div className="w-full md:w-[200px]">
          <select 
            value={filterPlatform}
            onChange={(e) => {
              setFilterPlatform(e.target.value);
              setLimit(100);
            }}
            className="w-full bg-[#050d0c] border border-white/5 text-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e676]/50 transition-colors text-sm appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
          >
            <option value="">All Platforms</option>
            <option value="MT4">MetaTrader 4 (MT4)</option>
            <option value="MT5">MetaTrader 5 (MT5)</option>
            <option value="cTrader">cTrader</option>
            <option value="TradingView">TradingView</option>
          </select>
        </div>
        
      </div>

      {/* Broker List */}
      <div className="space-y-4">
        {brokers.map((broker, index) => {
          const score = parseFloat(broker.wikifx_rating) || 0;
          const { label: scoreLabel, stars } = getScoreData(score);
          const currency = getCurrencyPair(broker.registered_region || "");
          const tags = getTags(broker.license_types || "");
          const licenses = broker.regulators ? broker.regulators.split("|").slice(0, 4) : [];
          const instrumentCount = broker.market_instruments ? broker.market_instruments.split("|").length : 0;
          const borderColor = index === 0 ? "#facc15" : index === 1 ? "#9ca3af" : index === 2 ? "#fb923c" : "#1a2e1a";

          return (
            <div
              key={broker.id}
              style={{ borderLeftColor: borderColor }}
              className="border border-[#1a2e1a] border-l-4 rounded-xl flex flex-col xl:flex-row items-stretch bg-[#080f0e] hover:border-[#00e676]/30 transition group overflow-hidden"
            >
              {/* SECTION 1: Rank, Logo, Name (Kiri) */}
              {/* FIX: P-4 di HP, P-5 di Desktop biar ga terlalu sesak */}
              <div className="flex items-center p-4 xl:p-5 gap-3 xl:gap-4 flex-1 min-w-0">
                {/* Rank */}
                <div className="text-center w-[40px] xl:w-[50px] shrink-0 flex flex-col items-center justify-center">
                  <div 
                    className="font-extrabold text-3xl xl:text-4xl tabular-nums drop-shadow-sm" 
                    style={{ color: index < 3 ? borderColor : '#00e676' }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* DIVIDER KUNING KIRI (Desktop Only) */}
                <div className="hidden xl:block w-[1px] bg-white/5 self-stretch -my-1"></div>

                {/* Logo */}
                <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {broker.logo_url ? (
                    <img src={broker.logo_url} alt={broker.broker_name} className="object-contain w-10 h-10 xl:w-12 xl:h-12" />
                  ) : (
                    <span className="text-black font-bold text-lg xl:text-xl">{broker.broker_name?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Name + Licenses */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 xl:gap-2 mb-1">
                    <span className="text-white font-bold text-base xl:text-lg break-words">{broker.broker_name}</span>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[9px] xl:text-[10px] border border-emerald-900 text-emerald-500 px-1.5 py-0.5 rounded font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center mt-1">
                    <span className="hidden sm:inline text-[10px] text-gray-500 uppercase font-bold">Licenses:</span>
                    {licenses.map((lic: string) => (
                      <span key={lic} className="text-[9px] xl:text-[10px] bg-[#0f1f0f] text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                        {lic.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* GARIS PEMBATAS 1 (Desktop: Vertikal, Mobile: Horizontal) */}
              <div className="hidden xl:block w-[1px] bg-white/5 my-4"></div>
              <div className="block xl:hidden w-full h-[1px] bg-white/5"></div>

              {/* SECTION 2: Stats (Tengah) */}
              {/* FIX: w-full di HP, grid-cols-2 di HP, sm:grid-cols-3 di Tablet/Desktop */}
              <div className="w-full xl:w-[480px] shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 p-4 xl:p-5 items-center bg-white/[0.01] xl:bg-transparent">
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">🕐</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">Founded</div>
                    <div className="text-white font-bold text-xs xl:text-sm">{broker.operating_period || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">📈</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">{currency} Spread</div>
                    <div className="text-white font-bold text-xs xl:text-sm">0.0 Pips</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">💰</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">Min. Deposit</div>
                    <div className="text-white font-bold text-xs xl:text-sm">{broker.minimum_deposit || "$0"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">⚡</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">Leverage</div>
                    <div className="text-white font-bold text-xs xl:text-sm">{broker.maximum_leverage_forex || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">🎯</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">Instruments</div>
                    <div className="text-white font-bold text-xs xl:text-sm">{instrumentCount > 0 ? `${instrumentCount * 100}+` : "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 xl:gap-3">
                  <span className="text-emerald-500 text-base xl:text-lg">🎁</span>
                  <div>
                    <div className="text-gray-500 text-[9px] xl:text-[10px] uppercase font-bold">Bonus</div>
                    <div className="text-yellow-600 font-bold text-[10px] xl:text-[11px]">No bonus</div>
                  </div>
                </div>
              </div>

              {/* DIVIDER 2 (Desktop: Vertikal, Mobile: Horizontal) */}
              <div className="hidden xl:block w-[1px] bg-white/5 my-4"></div>
              <div className="block xl:hidden w-full h-[1px] bg-white/5"></div>

              {/* SECTION 3: Score & CTA (Kanan) */}
              {/* FIX: justify-between di HP biar Kiri Score, Kanan Tombol */}
              <div className="flex items-center justify-between xl:justify-start p-4 xl:p-5 gap-4 xl:gap-6 w-full xl:w-auto">
                
                {/* Score Area */}
                <div className="text-center w-[80px] xl:w-[90px] shrink-0">
                  <div className="text-[9px] xl:text-[10px] text-gray-500 font-bold uppercase mb-0.5 xl:mb-1">Score</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[#00e676] text-3xl xl:text-4xl font-bold tabular-nums tracking-tight">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs xl:text-sm">/10</span>
                  </div>
                  <div className="text-gray-400 text-[10px] xl:text-[11px] font-medium truncate">{scoreLabel}</div>
                  <div className="flex justify-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-[8px] xl:text-[10px] ${i < stars ? 'text-yellow-400' : 'text-gray-700'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* DIVIDER HIJAU (Desktop Only) */}
                <div className="hidden xl:block w-[1px] bg-white/5 self-stretch -my-1"></div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 flex-1 xl:min-w-[140px] max-w-[200px] xl:max-w-none">
                  <a href={broker.company_website || "#"} target="_blank" rel="noreferrer"
                    className="bg-[#00e676] text-black text-xs xl:text-[13px] font-bold py-2 xl:py-2.5 rounded-lg hover:bg-[#00c060] transition text-center"
                  >
                    Visit Broker
                  </a>
                  <button className="border border-white/10 text-white text-xs xl:text-[13px] font-medium py-2 xl:py-2.5 rounded-lg hover:bg-white/5 transition">
                    Visit Hub
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Area */}
      <div className="flex flex-col items-center mt-10 gap-3">
        {hasMore && (
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            // Gw tambahin 'group' di className utama buat ngatur warna spinner di dalemnya pas di-hover
            className="text-white border border-[#00e676]/30 bg-transparent hover:bg-[#00e676]/10 px-8 py-3 rounded-2xl font-semibold flex items-center gap-3 disabled:opacity-50 transition-all group mb-2"
          >
            {loadingMore ? (
              <>
                {/* --- ICON 1: Pas lagi Loading beneran (Warna Hijau Muter Kenceng) --- */}
                <svg className="animate-spin h-5 w-5 text-[#00e676]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                {/* --- ICON 2: Pas diem nunggu diklik (Warna Abu-abu, Muter Santai, Jadi Hijau klo di-hover) --- */}
                {/* INI YANG MUTER TERUS SESUAI PERMINTAAN LO BRO */}
                <svg className="animate-spin h-5 w-5 text-slate-500 group-hover:text-[#00e676] transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Load More Brokers
              </>
            )}
          </button>
        )}

        {/* Teks Showing X of Y (Tetep dipertahain) */}
        {totalBrokers > 0 && (
          <p className="text-slate-400 text-sm mt-1">
            Showing {brokers.length} of {totalBrokers} brokers
          </p>
        )}
      </div>

    </section>
  );
}