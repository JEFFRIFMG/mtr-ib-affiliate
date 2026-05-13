import { NextResponse } from "next/server";

const HOMEPAGE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHLzF5niOyBBNeCYiVqbk3XQLkPjLKAYIA8ACrFkHleKN4d9THILUwZxQQ_vD61Zws7laqD0kqKtUZ/pub?gid=784096951&single=true&output=csv";

function parseHomepageCSV(text: string) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));

  return lines.slice(1).map((line) => {
    const cols: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === "," && !inQuotes) { cols.push(current.trim().replace(/\r/g, "")); current = ""; }
      else { current += char; }
    }
    cols.push(current.trim().replace(/\r/g, ""));

    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });

    return {
      rank: parseInt(row.rank) || 0,
      id: row.id,
      name: row.name,
      score: parseFloat(row.score) || 0,
      legal_name: row.legal_name,
      founded: row.founded_approx,
      hq_country: row.hq_country,
      website: row.website,
      affiliate_url: row.affiliate_url,
      regulation: row.regulation,
      regulation_tier: row.regulation_tier,
      platforms: row.platforms?.split(",") || [],
      eur_usd_spread: row.eur_usd_spread,
      min_deposit: row.min_deposit,
      max_leverage: row.max_leverage,
      instruments: row.instruments,
      account_type: row.account_type,
      color: row.color,
      status: row.status,
      description: row.description
    };
  });
}

export async function GET() {
  try {
    const res = await fetch(HOMEPAGE_CSV_URL, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Gagal tarik data");
    const text = await res.text();
    const data = parseHomepageCSV(text);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Error load staging" }, { status: 500 });
  }
}