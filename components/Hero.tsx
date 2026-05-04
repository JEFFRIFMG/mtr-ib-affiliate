"use client";

import { User, FileText } from "lucide-react";

const GroupIcon3 = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="8" r="2.5" /><path d="M1 19c0-2.5 1.8-4 4-4" />
    <circle cx="12" cy="7" r="3" /><path d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="19" cy="8" r="2.5" /><path d="M23 19c0-2.5-1.8-4-4-4" />
  </svg>
);

const PieChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#00e676" strokeWidth="1.5" fill="none" />
    <path d="M12 12 L12 2 A10 10 0 0 1 22 12 Z" fill="#00e676" fillOpacity="0.7" />
    <line x1="12" y1="2" x2="12" y2="12" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="12" x2="22" y2="12" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DollarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const iconCircleClass = "w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center";
const iconCircleStyle = {
  background: "radial-gradient(circle at 40% 40%, rgba(0,230,118,0.28) 0%, rgba(0,230,118,0.10) 100%)",
  border: "1px solid rgba(0,230,118,0.45)",
};

const cards = [
  { stat: "Up to $800",   label: "CPA PER CLIENT",    icon: <User size={28} color="#00e676" strokeWidth={1.5} /> },
  { stat: "Up to $15/lot", label: "REBATE",           icon: <DollarIcon /> },
  { stat: "Up to 50%",   label: "REV SHARE",          icon: <PieChartIcon /> },
  { stat: "10+ brokers", label: "ONE APPLICATION",    icon: <GroupIcon3 /> },
];

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" />
  </svg>
);
const InfinityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
    <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
  </svg>
);

const smallIconCircleStyle = {
  background: "radial-gradient(circle at 40% 40%, rgba(0,230,118,0.28) 0%, rgba(0,230,118,0.10) 100%)",
  border: "1px solid rgba(0,230,118,0.45)",
};

const stats = [
  { stat: "+67%", label: "More than going direct",    desc: "Rev share beats standard offers by avg 67%",       icon: <TrendingUpIcon /> },
  { stat: "+$5",  label: "Extra per lot",             desc: "Where brokers offer $10, MTR partners get $15",    icon: <DollarIcon /> },
  { stat: "1",    label: "Application, all brokers",  desc: "Apply once, unlock the full network",              icon: <FileText size={20} color="#00e676" strokeWidth={1.5} /> },
  { stat: "∞",    label: "Auto deal upgrades",        desc: "Rates improve as your volume grows",               icon: <InfinityIcon /> },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050d0c] text-white min-h-screen flex flex-col">
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.12) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      {/* Glow left */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ left: "-200px", top: "25%", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 65%)" }} />
      {/* Glow right */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ right: "5%", top: "35%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-center flex-1 pt-20 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">

          {/* LEFT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00e676]/30 bg-[#00e676]/5 text-[#00e676] text-[11px] font-semibold tracking-widest uppercase font-gantari">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
              IB &amp; Affiliate Program
            </div>
            <h1 className="font-extrabold leading-[1.05] tracking-tight text-white font-gantari text-[clamp(2.4rem,4.5vw,4.2rem)]">
              Institutional Rates.<br />
              <span className="text-[#00e676]">Available to</span><br />
              <span className="text-[#00e676]">Everyone.</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-md leading-relaxed text-[0.95rem] font-gantari">
              We negotiate the deals brokers reserve for their biggest partners —
              then open them up to you. Pick a broker below and apply in under 2 minutes.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button className="flex items-center gap-2 bg-[#00e676] hover:opacity-90 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all font-gantari">
                View broker deals
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="border border-white/20 px-6 py-3 rounded-xl text-gray-300 hover:border-white/35 text-sm transition-colors font-gantari">
                How it works
              </button>
            </div>
          </div>

          {/* RIGHT — 2x2 grid */}
          <div className="grid grid-cols-2 gap-4" style={{ filter: "drop-shadow(0 0 40px rgba(0,230,118,0.12))" }}>
            {cards.map(({ stat, label, icon }) => (
              <div key={label} className="relative group flex items-center gap-4 rounded-2xl transition-all"
                style={{ padding: "22px 24px", background: "linear-gradient(145deg, #0e2318 0%, #071410 100%)", border: "1px solid rgba(0,230,118,0.2)", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(circle at 25% 50%, rgba(16,185,129,0.08), transparent 70%)" }} />
                <div className={iconCircleClass} style={iconCircleStyle}>{icon}</div>
                <div>
                  <p className="text-white font-bold leading-tight font-gantari text-[1.1rem]">{stat}</p>
                  <p className="text-gray-500 font-semibold tracking-widest mt-1 font-gantari text-[0.62rem]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl"
          style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}>
          {stats.map(({ stat, label, desc, icon }, i) => (
            <div key={stat} className="flex items-start gap-3 p-5"
              style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={smallIconCircleStyle}>
                {icon}
              </div>
              <div>
                <p className="text-[#00e676] font-bold leading-tight font-gantari text-[1.2rem]">{stat}</p>
                <p className="text-white font-semibold mt-0.5 font-gantari text-[0.8rem]">{label}</p>
                <p className="text-gray-500 mt-0.5 leading-relaxed font-gantari text-[0.72rem]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
