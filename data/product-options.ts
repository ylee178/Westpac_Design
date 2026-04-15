/**
 * Westpac business-lending product options — verified from
 * westpac.com.au product pages (April 2026). The four products are
 * the actual business-lending products Westpac advertises; "Trust
 * Lending" from earlier drafts was a category mistake (Trust is an
 * entity type, not a product) and is removed.
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

const ALL_ENTITIES: OptionValue[] = [
  { id: "sole-trader", label: "Sole trader" },
  { id: "partnership", label: "Partnership" },
  { id: "trust", label: "Trust" },
  { id: "company", label: "Company (Pty Ltd)" },
];

const ALL_JURISDICTIONS: WestpacJurisdiction[] = ["NSW", "VIC", "QLD", "WA", "SA"];

export const WESTPAC_PRODUCTS: Record<WestpacProductId, WestpacProduct> = {
  "business-loan": {
    id: "business-loan",
    name: "Business Loan",
    tagline: "Standard business lending",
    entityTypes: ALL_ENTITIES,
    amountBuckets: [
      { id: "band-1", label: "$10k – $100k" },
      { id: "band-2", label: "$100k – $500k" },
      { id: "band-3", label: "$500k – $1M" },
      { id: "band-4", label: "$1M – $5M" },
    ],
    amountNote: "Facilities $10,000 – $5,000,000",
    secondary: {
      sectionLabel: "Purpose",
      options: [
        { id: "working-capital", label: "Working capital" },
        { id: "asset-purchase", label: "Asset purchase" },
        { id: "refinancing", label: "Refinancing" },
        { id: "property-acquisition", label: "Property acquisition" },
      ],
    },
    jurisdictions: ALL_JURISDICTIONS,
  },

  "bank-guarantee": {
    id: "bank-guarantee",
    name: "Bank Guarantee",
    tagline: "Performance bonds & financial guarantees",
    entityTypes: ALL_ENTITIES,
    amountBuckets: [
      { id: "band-1", label: "$5k – $50k" },
      { id: "band-2", label: "$50k – $250k" },
      { id: "band-3", label: "$250k – $750k" },
      { id: "band-4", label: "$750k – $1.5M" },
    ],
    amountNote: "Cash-secured fast quote · $5,000 – $1,500,000",
    secondary: {
      sectionLabel: "Purpose",
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
    entityTypes: ALL_ENTITIES,
    amountBuckets: [
      { id: "band-1", label: "$10k – $100k" },
      { id: "band-2", label: "$100k – $500k" },
      { id: "band-3", label: "$500k – $2M" },
      { id: "band-4", label: "$2M – $5M" },
    ],
    amountNote: "SIMPLE+ fast track · term up to 5 years",
    secondary: {
      sectionLabel: "Asset type",
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
    entityTypes: ALL_ENTITIES,
    amountBuckets: [
      { id: "band-1", label: "$5k – $50k" },
      { id: "band-2", label: "$50k – $250k" },
      { id: "band-3", label: "$250k – $750k" },
      { id: "band-4", label: "$750k – $1.5M" },
    ],
    amountNote: "Unsecured to $250k · secured up to $1.5M",
    secondary: {
      sectionLabel: "Loan type",
      options: [
        { id: "secured", label: "Secured" },
        { id: "unsecured", label: "Unsecured" },
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
