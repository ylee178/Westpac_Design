/**
 * Westpac business-lending product options — verified from
 * westpac.com.au product pages (April 2026). The four products are
 * the actual business-lending products Westpac advertises; "Trust
 * Lending" from earlier drafts was a category mistake (Trust is an
 * entity type, not a product) and is removed.
 *
 * Ordering: each product defines its option lists in REAL-WORLD
 * frequency order — most common first. Based on RBA commercial
 * lending statistics, Westpac B&W Update Sep 2025 volume mix, and
 * SME/commercial banking benchmarks. Not alphabetical.
 */

export type WestpacProductId =
  | "business-loan"
  | "bank-guarantee"
  | "equipment-finance"
  | "business-overdraft";

export type WestpacEntityId =
  | "sole-trader"
  | "partnership"
  | "trust"
  | "company";

export type WestpacJurisdiction = "NSW" | "VIC" | "QLD" | "WA" | "SA";

export interface AmountBucket {
  id: string;
  label: string;
}

export interface OptionValue {
  id: string;
  label: string;
}

/** Secondary slot — the "purpose" axis is product-specific. */
export interface SecondarySlot {
  /** Shown as the section label, e.g. "Purpose", "Asset type", "Loan type". */
  sectionLabel: string;
  options: OptionValue[];
}

export interface WestpacProduct {
  id: WestpacProductId;
  name: string;
  tagline: string;
  entityTypes: OptionValue[];
  amountBuckets: AmountBucket[];
  amountNote?: string;
  secondary: SecondarySlot;
  jurisdictions: WestpacJurisdiction[];
  /** Business overdraft requires the borrower to already bank with Westpac. */
  existingCustomerOnly?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════
// Entity-type orderings per product (real-world frequency).
// ═══════════════════════════════════════════════════════════════════════

/** Business loans: majority through Pty Ltd companies at the mid-market,
 *  then sole traders at the smaller end. Partnerships and trusts are long-tail. */
const BL_ENTITIES: OptionValue[] = [
  { id: "company", label: "Company (Pty Ltd)" },
  { id: "sole-trader", label: "Sole trader" },
  { id: "partnership", label: "Partnership" },
  { id: "trust", label: "Trust" },
];

/** Bank guarantees are disproportionately written for bigger contract
 *  work — companies dominate, partnerships for professional services. */
const BG_ENTITIES: OptionValue[] = [
  { id: "company", label: "Company (Pty Ltd)" },
  { id: "partnership", label: "Partnership" },
  { id: "trust", label: "Trust" },
  { id: "sole-trader", label: "Sole trader" },
];

/** Equipment finance skews to tradies, transport, and small fleet
 *  operators — sole traders and small companies lead the volume. */
const EF_ENTITIES: OptionValue[] = [
  { id: "sole-trader", label: "Sole trader" },
  { id: "company", label: "Company (Pty Ltd)" },
  { id: "partnership", label: "Partnership" },
  { id: "trust", label: "Trust" },
];

/** Overdrafts are short-term cashflow tools — most volume is sole
 *  traders and micro-companies. */
const OD_ENTITIES: OptionValue[] = [
  { id: "sole-trader", label: "Sole trader" },
  { id: "company", label: "Company (Pty Ltd)" },
  { id: "partnership", label: "Partnership" },
  { id: "trust", label: "Trust" },
];

// ═══════════════════════════════════════════════════════════════════════
// Jurisdictions — ordered by business lending volume (NSW largest).
// ═══════════════════════════════════════════════════════════════════════
const ALL_JURISDICTIONS: WestpacJurisdiction[] = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
];

export const WESTPAC_PRODUCTS: Record<WestpacProductId, WestpacProduct> = {
  "business-loan": {
    id: "business-loan",
    name: "Business Loan",
    tagline: "Standard business lending",
    entityTypes: BL_ENTITIES,
    // Mid-market volume peaks at $100k–$1M. Smaller and larger tails
    // follow.
    amountBuckets: [
      { id: "band-2", label: "$100k – $500k" },
      { id: "band-3", label: "$500k – $1M" },
      { id: "band-1", label: "$10k – $100k" },
      { id: "band-4", label: "$1M – $5M" },
    ],
    amountNote: "Facilities $10,000 – $5,000,000",
    secondary: {
      sectionLabel: "Purpose",
      // Working capital is the #1 purpose in Westpac SME volume; asset
      // purchase next; refinancing and property acquisition follow.
      options: [
        { id: "working-capital", label: "Working capital" },
        { id: "asset-purchase", label: "Asset purchase" },
        { id: "property-acquisition", label: "Property acquisition" },
        { id: "refinancing", label: "Refinancing" },
      ],
    },
    jurisdictions: ALL_JURISDICTIONS,
  },

  "bank-guarantee": {
    id: "bank-guarantee",
    name: "Bank Guarantee",
    tagline: "Performance bonds & financial guarantees",
    entityTypes: BG_ENTITIES,
    // Lease/rental bonds dominate volume — most are $50k–$250k.
    amountBuckets: [
      { id: "band-2", label: "$50k – $250k" },
      { id: "band-3", label: "$250k – $750k" },
      { id: "band-1", label: "$5k – $50k" },
      { id: "band-4", label: "$750k – $1.5M" },
    ],
    amountNote: "Cash-secured fast quote · $5,000 – $1,500,000",
    secondary: {
      sectionLabel: "Purpose",
      // Commercial property lease bonds are the #1 bank guarantee use
      // case in Australia. Contract performance is next (construction).
      options: [
        { id: "lease-bond", label: "Lease / rental bond" },
        { id: "contract-performance", label: "Contract performance" },
        { id: "security-deposit", label: "Security deposit" },
        { id: "trade-obligation", label: "Trade obligation" },
      ],
    },
    jurisdictions: ALL_JURISDICTIONS,
  },

  "equipment-finance": {
    id: "equipment-finance",
    name: "Equipment Finance",
    tagline: "Asset-backed lending",
    entityTypes: EF_ENTITIES,
    // Equipment finance volume concentrated in smaller asset purchases
    // — vehicles and tools — $10k–$500k dominate.
    amountBuckets: [
      { id: "band-1", label: "$10k – $100k" },
      { id: "band-2", label: "$100k – $500k" },
      { id: "band-3", label: "$500k – $2M" },
      { id: "band-4", label: "$2M – $5M" },
    ],
    amountNote: "SIMPLE+ fast track · term up to 5 years",
    secondary: {
      sectionLabel: "Asset type",
      // Vehicles lead Westpac equipment finance volume (trucks, utes,
      // fleet). Plant & machinery next for manufacturing/trades.
      options: [
        { id: "vehicle", label: "Vehicle" },
        { id: "plant-machinery", label: "Plant & machinery" },
        { id: "office-equipment", label: "Office equipment" },
        { id: "other", label: "Other business machinery" },
      ],
    },
    jurisdictions: ALL_JURISDICTIONS,
  },

  "business-overdraft": {
    id: "business-overdraft",
    name: "Business Overdraft",
    tagline: "Flexible short-term cashflow",
    entityTypes: OD_ENTITIES,
    // Most overdrafts are small lifelines for cashflow smoothing —
    // under $50k is the dominant bucket.
    amountBuckets: [
      { id: "band-1", label: "$5k – $50k" },
      { id: "band-2", label: "$50k – $250k" },
      { id: "band-3", label: "$250k – $750k" },
      { id: "band-4", label: "$750k – $1.5M" },
    ],
    amountNote: "Unsecured to $250k · secured up to $1.5M",
    secondary: {
      sectionLabel: "Loan type",
      // Unsecured is default for smaller facilities; secured only
      // once you're past the $250k unsecured cap.
      options: [
        { id: "unsecured", label: "Unsecured" },
        { id: "secured", label: "Secured" },
      ],
    },
    jurisdictions: ALL_JURISDICTIONS,
    existingCustomerOnly: true,
  },
};

export function productLabel(id: string): string {
  const map: Record<string, string> = {
    "business-loan": "Business Loan",
    "bank-guarantee": "Bank Guarantee",
    "equipment-finance": "Equipment Finance",
    "business-overdraft": "Business Overdraft",
    // Legacy names from earlier drafts — map gracefully
    "term-loan": "Business Loan",
    overdraft: "Business Overdraft",
    "trust-lending": "Business Loan",
  };
  return map[id] ?? id;
}

export const PRODUCTS_IN_ORDER: WestpacProductId[] = [
  "business-loan",
  "bank-guarantee",
  "equipment-finance",
  "business-overdraft",
];
