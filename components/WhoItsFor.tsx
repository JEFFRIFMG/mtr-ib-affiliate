"use client";

const cards = [
  { emoji: "📡", title: "Signal providers",   desc: "Turn your followers into recurring rebate income on every lot they trade." },
  { emoji: "🎓", title: "Trading academies",  desc: "Get paid institutional rates when your students sign up through your link." },
  { emoji: "✍️", title: "Content creators",   desc: "YouTube, TikTok, newsletters. Monetise your audience with deals they can't get direct." },
  { emoji: "🤝", title: "New & mid-level IBs", desc: "Don't have the volume for institutional rates yet? With MTR you get them from day one." },
];

export default function WhoItsFor() {
  return (
    <section className="bg-[#050d0c] pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <p className="font-gantari text-xs font-bold text-[#00e676] tracking-[0.12em] uppercase mb-3">
          Who This Is For
        </p>
        <h2 className="font-gantari font-extrabold text-white mb-2 text-[clamp(1.8rem,3vw,2.6rem)]">
          You Don&apos;t Need to Be a <span className="text-[#00e676]">Big Player</span>
        </h2>
        <p className="font-gantari text-[0.95rem] text-gray-500 mb-10">
          Institutional rates from day one — no volume required to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(145deg, #0d1a16 0%, #080f0c 100%)" }}>
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ width: "52px", height: "52px", background: "linear-gradient(145deg, #1a2e28, #0e1f1a)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {card.emoji}
                </div>
                <p className="font-gantari font-bold text-white text-[1rem]">{card.title}</p>
              </div>
              <p className="font-gantari text-[0.85rem] text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
