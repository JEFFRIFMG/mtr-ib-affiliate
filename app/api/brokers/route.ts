import { NextResponse } from "next/server";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHLzF5niOyBBNeCYiVqbk3XQLkPjLKAYIA8ACrFkHleKN4d9THILUwZxQQ_vD61Zws7laqD0kqKtUZ/pub?gid=0&single=true&output=csv";

function parseCSV(text: string) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));

  return lines.slice(1).map((line) => {
    // Handle commas inside quoted fields
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
      rank:         parseInt(row.rank) || 0,
      ticker:       row.ticker,
      name:         row.name,
      type:         row.type,
      regulation:   row.regulation,
      cpa:          row.cpa || null,
      rebate:       row.rebate || null,
      revShare:     row.revShare || null,
      netDeposit:   row.netDeposit === "TRUE",
      customHybrid: row.customHybrid === "TRUE",
      badge:        (row.badge as "top-cpa" | "top-rebate") || undefined,
      categories:   row.categories
        ? row.categories.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
    };
  });
}

export async function GET() {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 10 }, // cache 10 seconds
    });

    if (!res.ok) throw new Error("Failed to fetch sheet");

    const text = await res.text();
    const brokers = parseCSV(text);

    return NextResponse.json(brokers);
  } catch (err) {
    console.error("Broker fetch error:", err);
    return NextResponse.json({ error: "Failed to load broker data" }, { status: 500 });
  }
}
