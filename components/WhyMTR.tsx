"use client";

const cards = [
  {
    emoji: "🏛️",
    title: "Institutional position",
    desc: "We aggregate volume across our partner network, giving us negotiating power of a large institution — and pass it to you.",
    stat: "Up to 50% rev share vs industry avg 30%",
    statIcon: "📈",
    highlight: true,
  },
  {
    emoji: "⚡",
    title: "One deal, all brokers",
    desc: "Apply once and get access to every broker in our network. No separate contracts, no separate negotiations.",
    stat: "10+ brokers, single onboarding",
    statIcon: "👥",
    highlight: false,
  },
  {
    emoji: "📈",
    title: "Rates that grow with you",
    desc: "As your volume scales, your rates automatically improve. No chasing your account manager.",
    stat: "Tiered upgrades, no manual renewal",
    statIcon: "📊",
    highlight: false,
  },
  {
    emoji: "🎯",
    title: "Matched to your audience",
    desc: "We match you with the broker that fits your traffic — by region, trader type, and average deposit size.",
    stat: "Region + audience optimised",
    statIcon: "👤",
    highlight: false,
  },
];

export default function WhyMTR() {
  return (
    <section className="bg-[#050d0c] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <p className="font-gantari text-xs font-bold text-[#00e676] tracking-[0.12em] uppercase mb-3">
          Why MTR
        </p>
        <h2 className="font-gantari font-extrabold text-white leading-tight mb-3 text-[clamp(1.8rem,3vw,2.8rem)]">
          Built for Partners Who<br />
          <span className="text-[#00e676]">Actually</span> Want to Earn
        </h2>
        <p className="font-gantari text-[0.95rem] text-gray-500 mb-10">
          Not just links and a dashboard. A real commercial relationship.
        </p>

        {/* 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                border: card.highlight ? "1px solid rgba(0,230,118,0.4)" : "1px solid rgba(255,255,255,0.08)",
                background: card.highlight ? "linear-gradient(145deg, #0d2218 0%, #081510 100%)" : "linear-gradient(145deg, #0d1a16 0%, #080f0c 100%)",
                boxShadow: card.highlight ? "0 0 30px rgba(0,230,118,0.07)" : "none",
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: card.highlight ? "linear-gradient(145deg, #1a3d28, #0d2018)" : "linear-gradient(145deg, #1a2e28, #0e1f1a)",
                  border: card.highlight ? "1px solid rgba(0,230,118,0.2)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                {card.emoji}
              </div>
              <p className="font-gantari font-bold text-white text-[1rem]">{card.title}</p>
              <p className="font-gantari text-[0.85rem] text-gray-500 leading-relaxed flex-1">{card.desc}</p>
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0 mt-0.5">{card.statIcon}</span>
                <span className="font-gantari text-[0.82rem] font-semibold text-[#00e676] leading-snug">{card.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div className="border-t border-white/[0.07] pt-7 flex items-center justify-center gap-3">
          <span className="text-lg">📈</span>
          <span className="font-gantari text-[1rem] font-semibold text-white">Start earning with better rates today</span>
          <span className="text-[#00e676] text-xl font-bold">→</span>
        </div>

      </div>
    </section>
  );
}
