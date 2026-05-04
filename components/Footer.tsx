"use client";

export default function Footer() {
  return (
    <footer className="bg-[#050d0c] pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* CTA Banner */}
        <div className="rounded-2xl px-6 sm:px-8 py-8 text-center relative overflow-hidden"
          style={{ border: "1px solid rgba(0,230,118,0.2)", background: "linear-gradient(145deg, #0d2218 0%, #081510 60%, #050d0c 100%)", boxShadow: "0 0 60px rgba(0,230,118,0.07)" }}>

          {/* Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 70%)" }} />

          <h2 className="relative font-gantari font-extrabold text-white mb-4 text-[clamp(1.8rem,3vw,2.6rem)]">
            Ready to Find Your <span className="text-[#00e676]">Best Deal?</span>
          </h2>
          <p className="relative font-gantari text-[0.95rem] text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
            Browse the broker table above, pick the structure that fits your audience,
            and apply in under 2 minutes.
          </p>

          <div className="relative flex flex-wrap gap-3 justify-center">
            <a href="#"
              className="inline-flex items-center gap-2 bg-[#00e676] hover:opacity-90 text-black text-[0.9rem] font-bold px-7 py-3 rounded-xl transition-all font-gantari">
              View broker deals
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
            <a href="#"
              className="inline-flex items-center gap-2 text-[#00e676] text-[0.9rem] font-semibold px-7 py-3 rounded-xl transition-all font-gantari hover:bg-[#00e676]/10"
              style={{ border: "1px solid rgba(0,230,118,0.35)" }}>
              Talk to the team
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <p className="font-gantari text-[0.78rem] text-gray-400">
            © 2025 MyTradingReviews. All rates are indicative and subject to regional eligibility and volume.
          </p>
        </div>

      </div>
    </footer>
  );
}
