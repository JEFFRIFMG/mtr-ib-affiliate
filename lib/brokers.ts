export type Broker = {
  rank: number;
  ticker: string;
  name: string;
  type: string;
  regulation: string;
  cpa: string | null;
  rebate: string | null;
  revShare: string | null;
  netDeposit: boolean;
  customHybrid: boolean;
  badge?: "top-cpa" | "top-rebate";
  categories: ("cpa" | "rebate" | "revshare" | "custom")[];
};

export const brokers: Broker[] = [
  { rank: 1,  ticker: "XT", name: "XTB",           type: "STP",          regulation: "EU Regulated", cpa: "Up to $800", rebate: "Up to $13/lot", revShare: null,        netDeposit: false, customHybrid: false, badge: "top-cpa",    categories: ["cpa", "rebate"] },
  { rank: 2,  ticker: "FX", name: "FXCM",          type: "NDD",          regulation: "Tier 1",       cpa: "Up to $700", rebate: "Up to $12/lot", revShare: null,        netDeposit: true,  customHybrid: false,                        categories: ["cpa", "rebate"] },
  { rank: 3,  ticker: "AV", name: "Ava Trades",    type: "Market Maker", regulation: "EU",           cpa: "Up to $600", rebate: "Up to $10/lot", revShare: "Up to 35%", netDeposit: false, customHybrid: false,                        categories: ["cpa", "rebate", "revshare"] },
  { rank: 4,  ticker: "FI", name: "Finalto",       type: "Prime",        regulation: "Tier 1",       cpa: "Up to $550", rebate: null,            revShare: null,        netDeposit: true,  customHybrid: false,                        categories: ["cpa"] },
  { rank: 5,  ticker: "NA", name: "Naga",          type: "STP",          regulation: "EU Regulated", cpa: "Up to $500", rebate: "Up to $11/lot", revShare: "Up to 40%", netDeposit: true,  customHybrid: true,                         categories: ["cpa", "rebate", "revshare", "custom"] },
  { rank: 6,  ticker: "EC", name: "EC Markets",    type: "ECN",          regulation: "Offshore",     cpa: "Up to $450", rebate: "Up to $11/lot", revShare: null,        netDeposit: false, customHybrid: false,                        categories: ["cpa", "rebate"] },
  { rank: 7,  ticker: "GT", name: "GTCFX",         type: "STP",          regulation: "Offshore",     cpa: "Up to $380", rebate: "Up to $10/lot", revShare: null,        netDeposit: false, customHybrid: true,                         categories: ["cpa", "rebate", "custom"] },
  { rank: 8,  ticker: "BU", name: "Bullwaves",     type: "STP",          regulation: "Offshore",     cpa: null,         rebate: "Up to $12/lot", revShare: "Up to 50%", netDeposit: true,  customHybrid: true,                         categories: ["rebate", "revshare", "custom"] },
  { rank: 9,  ticker: "FP", name: "FP Markets",    type: "ECN",          regulation: "ASIC",         cpa: null,         rebate: "Up to $15/lot", revShare: "Up to 45%", netDeposit: false, customHybrid: false, badge: "top-rebate",  categories: ["rebate", "revshare"] },
  { rank: 10, ticker: "VT", name: "VT Markets",    type: "STP",          regulation: "ASIC",         cpa: null,         rebate: "Up to $8/lot",  revShare: "Up to 20%", netDeposit: true,  customHybrid: false,                        categories: ["rebate", "revshare"] },
  { rank: 11, ticker: "IC", name: "IC Markets",    type: "ECN",          regulation: "ASIC",         cpa: "Up to $320", rebate: "Up to $9/lot",  revShare: "Up to 25%", netDeposit: true,  customHybrid: false,                        categories: ["cpa", "rebate", "revshare"] },
  { rank: 12, ticker: "PU", name: "Pepperstone",   type: "ECN",          regulation: "FCA",          cpa: "Up to $300", rebate: "Up to $8/lot",  revShare: null,        netDeposit: true,  customHybrid: true,                         categories: ["cpa", "rebate", "custom"] },
  { rank: 13, ticker: "EX", name: "Exness",        type: "STP",          regulation: "FCA",          cpa: "Up to $280", rebate: "Up to $7/lot",  revShare: "Up to 30%", netDeposit: false, customHybrid: false,                        categories: ["cpa", "rebate", "revshare"] },
  { rank: 14, ticker: "XM", name: "XM Group",      type: "Market Maker", regulation: "EU Regulated", cpa: "Up to $260", rebate: "Up to $6/lot",  revShare: "Up to 20%", netDeposit: true,  customHybrid: false,                        categories: ["cpa", "rebate", "revshare"] },
  { rank: 15, ticker: "OA", name: "OANDA",         type: "Market Maker", regulation: "FCA",          cpa: "Up to $240", rebate: null,            revShare: "Up to 18%", netDeposit: false, customHybrid: true,                         categories: ["cpa", "revshare", "custom"] },
  { rank: 16, ticker: "HF", name: "HFM",           type: "STP",          regulation: "FCA",          cpa: "Up to $220", rebate: "Up to $5/lot",  revShare: null,        netDeposit: true,  customHybrid: false,                        categories: ["cpa", "rebate"] },
  { rank: 17, ticker: "TU", name: "Tickmill",      type: "ECN",          regulation: "FCA",          cpa: "Up to $200", rebate: "Up to $5/lot",  revShare: "Up to 15%", netDeposit: false, customHybrid: true,                         categories: ["cpa", "rebate", "revshare", "custom"] },
  { rank: 18, ticker: "SW", name: "Swissquote",    type: "Prime",        regulation: "FINMA",        cpa: "Up to $180", rebate: null,            revShare: "Up to 12%", netDeposit: true,  customHybrid: false,                        categories: ["cpa", "revshare"] },
  { rank: 19, ticker: "CM", name: "CMC Markets",   type: "Market Maker", regulation: "FCA",          cpa: "Up to $160", rebate: "Up to $4/lot",  revShare: null,        netDeposit: false, customHybrid: false,                        categories: ["cpa", "rebate"] },
  { rank: 20, ticker: "IG", name: "IG Group",      type: "Market Maker", regulation: "FCA",          cpa: "Up to $140", rebate: "Up to $3/lot",  revShare: "Up to 10%", netDeposit: true,  customHybrid: true,                         categories: ["cpa", "rebate", "revshare", "custom"] },
];
