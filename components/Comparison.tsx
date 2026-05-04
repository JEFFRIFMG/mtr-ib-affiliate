"use client";

const rows = [
  { label: "Rev share",        direct: "~30% (if offered)",       mtr: "Up to 50%" },
  { label: "Rebate per lot",   direct: "~$10",                    mtr: "Up to $15" },
  { label: "CPA",              direct: "Standard tiers only",     mtr: "Institutional tier access" },
  { label: "Deal upgrades",    direct: "Manual negotiation",      mtr: "Automatic as volume grows" },
  { label: "Multiple brokers", direct: "Separate agreements",     mtr: "One application" },
  { label: "Support",          direct: "Broker's affiliate team", mtr: "Dedicated MTR partner team" },
];

export default function Comparison() {
  return (
    <section className="bg-[#050d0c] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <p className="font-gantari text-xs font-bold text-[#00e676] tracking-[0.12em] uppercase mb-3">
          The MTR Difference
        </p>
        <h2 className="font-gantari font-extrabold text-white mb-2 text-[clamp(1.8rem,3vw,2.6rem)]">
          MTR vs <span className="text-[#00e676]">Going Direct</span>
        </h2>
        <p className="font-gantari text-[0.95rem] text-gray-500 mb-10">
          Our institutional position means real money in your pocket.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* LEFT */}
          <div className="rounded-2xl p-7 md:p-8" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(145deg, #0d1a16 0%, #080f0c 100%)" }}>
            <p className="font-gantari text-[0.7rem] font-bold text-gray-500 tracking-[0.12em] uppercase mb-6">
              Going Direct to Broker
            </p>
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex justify-between items-center py-3.5">
                  <span className="font-gantari text-[0.9rem] text-gray-300">{row.label}</span>
                  <span className="font-gantari text-[0.9rem] text-gray-500 text-right">{row.direct}</span>
                </div>
                {i < rows.length - 1 && <div className="h-px bg-white/5" />}
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl p-7 md:p-8 relative" style={{ border: "1px solid rgba(0,230,118,0.35)", background: "linear-gradient(145deg, #0d2218 0%, #081510 100%)", boxShadow: "0 0 40px rgba(0,230,118,0.08)" }}>
            {/* Best Value badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#00e676">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-gantari text-[0.72rem] font-bold text-[#00e676] tracking-[0.06em]">BEST VALUE</span>
            </div>

            <p className="font-gantari text-[0.7rem] font-bold text-[#00e676] tracking-[0.12em] uppercase mb-6">
              Through MTR
            </p>
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex justify-between items-center py-3.5">
                  <span className="font-gantari text-[0.9rem] text-gray-300">{row.label}</span>
                  <span className="font-gantari text-[0.9rem] font-bold text-[#00e676] text-right">{row.mtr}</span>
                </div>
                {i < rows.length - 1 && <div className="h-px" style={{ background: "rgba(0,230,118,0.08)" }} />}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
