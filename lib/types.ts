/**
 * Domain types for the Westpac BizEdge deal workspace prototype.
 * Each type is used by one or more of the 9 design decisions (D1–D9).
 */

// ——— Lifecycle phases (D5 progress spine) ———
export type Phase =
  | "setup"
  | "identification"
  | "credit"
  | "approval"
  | "settlement";

export interface PhaseMeta {
  id: Phase;
  label: string;
  description: string;
  order: number;
}

// ——— Deal entity (D1 reshape drivers) ———
export type ProductType =
  | "bank-guarantee"
  | "term-loan"
  | "overdraft"
  | "trust-lending";

export type EntityType =
  | "sole-trader"
  | "company"
  | "trust"
  | "partnership";

export type Jurisdiction = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export type CDDMode = "legacy-acip" | "reform-cdd";

export interface Deal {
  id: string;
  customerName: string;
  abn: string;
  dealName: string;
  product: ProductType;
  entity: EntityType;
  jurisdiction: Jurisdiction;
  amount: number;
  currency: "AUD";
  phase: Phase;
  cddMode: CDDMode;
  banker: {
    name: string;
    role: "new-banker" | "senior-banker";
  };
}

// ——— Checklist items (D1 reshape, D2 skip, D3 knowledge, D4 disclosure,
//      D6 provenance, D7 ownership) ———
export type Owner = "banker" | "system" | "customer";

export type ItemStatus = "pending" | "in-progress" | "complete" | "skipped";

export interface Provenance {
  source: string;              // e.g. "ABN Lookup", "Company search (ASIC)", "Customer portal upload"
  timestamp: string;           // ISO-ish display string
  confidence: "high" | "medium" | "low";
}

export interface KnowledgeCard {
  what: string;                // What this step is
  why: string;                 // Why it's required
  example?: string;            // Concrete example
  policyLink?: string;         // Link label (not a real URL)
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  owner: Owner;
  status: ItemStatus;
  phase: Phase;

  // D1 — which (product × entity × jurisdiction) combos this item applies to.
  // null on any axis means "applies to all values on that axis".
  appliesTo: {
    product: ProductType[] | null;
    entity: EntityType[] | null;
  };

  // D2 — is this a legally mandatory step that cannot be skipped?
  legallyMandatory: boolean;

  // D2 — if skipped, the chosen reason category + optional free-text.
  skipReason?: {
    category: string;
    freeText?: string;
  };

  // D3 — inline expandable knowledge card
  knowledge: KnowledgeCard;

  // D6 — provenance for auto-filled or system-verified data
  provenance?: Provenance;

  // Dependency reference (soft — for visual grouping later, not strict blocking)
  category: "customer-id" | "entity-verification" | "product-specific" | "risk" | "docs";
}

// ——— Filters (D7 three-way ownership) ———
export type OwnerFilter = "all" | "banker" | "system" | "customer";

// ——— Skip reason picker (D2) ———
// Structured picker categories with an "Other" safety valve.
export interface SkipReasonOption {
  id: string;
  label: string;
  description?: string;
}

// ——— Confidence score (D9) ———
export interface ConfidenceBreakdown {
  checklistCompletion: number;  // 0–100
  skipQuality: number;          // 0–100
  provenanceConfidence: number; // 0–100
  modeAlignment: number;        // 0–100
  total: number;                // 0–100
}
