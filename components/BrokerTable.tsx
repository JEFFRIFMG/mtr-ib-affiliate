"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { brokers, type Broker } from "@/lib/brokers";

type Filter = "all" | "cpa" | "rebate" | "revshare" | "custom";
type SortKey = "cpa" | "rebate" | "revshare" | null;
type SortDir = "asc" | "desc";

const filterLabels: { key: Filter; label: string }[] = [
  { key: "all",      label: "All brokers" },
  { key: "cpa",      label: "CPA" },
  { key: "rebate",   label: "Rebate" },
  { key: "revshare", label: "Rev share" },
  { key: "custom",   label: "Custom/Hybrid" },
];

function extractNum(val: string | null): number {
  if (!val) return -1;
  const m = val.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : -1;
}

function YesNo({ val }: { val: boolean }) {
  return (
    <span className={`font-gantari text-[0.78rem] font-semibold px-3.5 py-0.5 rounded-full whitespace-nowrap ${
      val
        ? "text-[#00e676] border border-[#00e676]/50 bg-[#00e676]/7"
        : "text-gray-500 border border-white/12"
    }`}
    style={{ background: val ? "rgba(0,230,118,0.07)" : "transparent", border: val ? "1px solid rgba(0,230,118,0.5)" : "1px solid rgba(255,255,255,0.12)" }}>
      {val ? "Yes" : "No"}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function BrokerTable() {
  const [filter, setFilter]           = useState<Filter>("all");
  const [sortKey, setSortKey]         = useState<SortKey>("cpa");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = brokers.filter(b =>
    filter === "all" ? true : b.categories.includes(filter as Broker["categories"][number])
  );
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return a.rank - b.rank;
    const av = extractNum(sortKey === "cpa" ? a.cpa : sortKey === "rebate" ? a.rebate : a.revShare);
    const bv = extractNum(sortKey === "cpa" ? b.cpa : sortKey === "rebate" ? b.rebate : b.revShare);
    return sortDir === "desc" ? bv - av : av - bv;
  });
  const visible  = sorted.slice(0, visibleCount);
  const hasMore  = visibleCount < sorted.length;

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronsUpDown size={12} className="text-gray-600" />;
    return sortDir === "desc"
      ? <ChevronDown size={12} className="text-[#00e676]" />
      : <ChevronUp   size={12} className="text-[#00e676]" />;
  }

  return (
    <section className="bg-[#050d0c] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="font-gantari font-extrabold text-white mb-2 text-[clamp(1.8rem,3vw,2.4rem)]">
          Pick Your <span className="text-[#00e676]">Best Deal</span>
        </h2>
        <p className="font-gantari text-[0.9rem] text-gray-500 mb-8 leading-relaxed">
          All rates are MTR partner rates — not what you&apos;d get going direct.<br className="hidden sm:block" />
          Filter by commission type or sort any column to find your best match.
        </p>

        {/* Filter + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {filterLabels.map(({ key, label }) => (
              <button key={key} onClick={() => { setFilter(key); setVisibleCount(PAGE_SIZE); }}
                className={`font-gantari text-[0.83rem] font-semibold px-4 py-1.5 rounded-lg transition-all ${
                  filter === key
                    ? "text-[#00e676] border border-[#00e676]"
                    : "text-gray-400 hover:text-white border border-white/12"
                }`}
                style={{ background: filter === key ? "rgba(0,230,118,0.12)" : "transparent", border: filter === key ? "1px solid #00e676" : "1px solid rgba(255,255,255,0.12)" }}>
                {label}
              </button>
            ))}
          </div>
          {/* Sort dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-gantari text-[0.8rem] text-gray-500">Sort by:</span>
            {(["cpa","rebate","revshare"] as SortKey[]).map((k, i) => {
              const labels = ["Highest CPA", "Highest rebate", "Highest rev share"];
              return (
                <button key={k!} onClick={() => handleSort(k)}
                  className="flex items-center gap-1.5 font-gantari text-[0.8rem] font-medium px-3.5 py-1.5 rounded-lg transition-all"
                  style={{
                    border: sortKey === k ? "1px solid rgba(0,230,118,0.5)" : "1px solid rgba(255,255,255,0.12)",
                    background: sortKey === k ? "rgba(0,230,118,0.08)" : "rgba(255,255,255,0.03)",
                    color: sortKey === k ? "#00e676" : "#9ca3af",
                  }}>
                  {labels[i]} <ChevronDown size={13} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Table — scrollable on mobile */}
        <div className="rounded-2xl overflow-hidden overflow-x-auto" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-center w-12">#</th>
                <th className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-left">Broker</th>
                {[
                  { label: "CPA",           k: "cpa"      as SortKey },
                  { label: "Rebate / Lot",  k: "rebate"   as SortKey },
                  { label: "Rev Share",     k: "revshare" as SortKey },
                ].map(({ label, k }) => (
                  <th key={label} onClick={() => handleSort(k)}
                    className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{label} <SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-center whitespace-nowrap">Net Deposit</th>
                <th className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-center whitespace-nowrap">Custom/Hybrid</th>
                <th className="font-gantari text-[0.72rem] font-semibold text-gray-500 tracking-[0.06em] uppercase px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((broker, idx) => (
                <tr key={broker.rank}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: idx < visible.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>

                  {/* # */}
                  <td className="px-4 py-3 text-center w-12">
                    <span className="font-gantari font-semibold text-[0.95rem] text-gray-500">{idx + 1}</span>
                  </td>

                  {/* Broker */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center font-gantari font-bold text-[0.65rem] text-[#00e676] flex-shrink-0"
                        style={{ background: "linear-gradient(145deg, #1a2e28, #0e1f1a)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {broker.ticker}
                      </div>
                      <div>
                        <p className="font-gantari font-bold text-[0.95rem] text-white">{broker.name}</p>
                        <p className="font-gantari text-[0.75rem] text-gray-500">{broker.type} · {broker.regulation}</p>
                      </div>
                    </div>
                  </td>

                  {/* CPA */}
                  <td className="px-4 py-3">
                    {broker.cpa ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gantari font-semibold text-[0.9rem] text-[#00e676]">{broker.cpa}</span>
                        {broker.badge === "top-cpa" && (
                          <span className="font-gantari text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-[#00e676] text-black">Top CPA</span>
                        )}
                      </div>
                    ) : <span className="text-gray-700">—</span>}
                  </td>

                  {/* Rebate */}
                  <td className="px-4 py-3">
                    {broker.rebate ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gantari font-semibold text-[0.9rem] text-[#00e676]">{broker.rebate}</span>
                        {broker.badge === "top-rebate" && (
                          <span className="font-gantari text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">Top rebate</span>
                        )}
                      </div>
                    ) : <span className="text-gray-700">—</span>}
                  </td>

                  {/* Rev Share */}
                  <td className="px-4 py-3">
                    {broker.revShare
                      ? <span className="font-gantari font-semibold text-[0.9rem] text-[#00e676]">{broker.revShare}</span>
                      : <span className="text-gray-700">—</span>}
                  </td>

                  {/* Net Deposit */}
                  <td className="px-4 py-3 text-center"><YesNo val={broker.netDeposit} /></td>

                  {/* Custom/Hybrid */}
                  <td className="px-4 py-3 text-center"><YesNo val={broker.customHybrid} /></td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <a href="#"
                      className="font-gantari text-[0.83rem] font-bold px-5 py-2 rounded-lg text-[#00e676] transition-all hover:bg-[#00e676]/10 whitespace-nowrap inline-block"
                      style={{ border: "1px solid rgba(0,230,118,0.5)" }}>
                      Apply now
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Disclaimer */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="font-gantari text-[0.75rem] text-gray-600">
              * Rates vary by region and volume. Exact terms confirmed on application.
            </p>
          </div>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex flex-col items-center gap-2.5 mt-6">
            <button onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="flex items-center gap-2 font-gantari text-[0.88rem] font-semibold px-12 py-3 rounded-xl text-gray-400 transition-all hover:text-white"
              style={{ border: "1px solid rgba(0,230,118,0.3)", background: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,230,118,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,230,118,0.3)"; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Load More
            </button>
            <p className="font-gantari text-[0.78rem] text-gray-600">
              Showing {visibleCount} of {sorted.length} brokers
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
