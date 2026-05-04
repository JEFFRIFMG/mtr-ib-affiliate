"use client";

import { useState } from "react";
import { Sun, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Ranking", href: "#" },
  { label: "Comparison", href: "#" },
  { label: "Awards", href: "#" },
  { label: "IB/Affiliate", href: "#", active: true },
  { label: "Blogs", href: "#" },
  { label: "About Us", href: "#" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050d0c]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="text-xl font-bold font-gantari flex items-center">
          <span className="text-white">Trading</span>
          <span className="text-green-mtr">Reviews</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label} className="relative">
              <a
                href={link.href}
                className={`px-4 py-2 text-sm rounded-md transition-colors font-gantari ${
                  link.active ? "text-green-mtr" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </a>
              {link.active && (
                <span
                  className="absolute left-0 right-0 h-0.5 rounded-full bg-green-mtr"
                  style={{ bottom: "-8px", boxShadow: "0 0 8px #00e676" }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            <Sun size={16} />
          </button>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 bg-green-mtr hover:opacity-90 text-black text-sm font-bold px-5 py-2 rounded-lg transition-all font-gantari"
          >
            Get Listed
          </a>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#050d0c] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-3 py-2 text-sm rounded-md font-gantari ${
                link.active ? "text-green-mtr bg-[#00e676]/10" : "text-gray-400"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="mt-3 bg-green-mtr text-black text-sm font-bold px-5 py-2.5 rounded-lg text-center font-gantari"
          >
            Get Listed
          </a>
        </div>
      )}
    </nav>
  );
}
