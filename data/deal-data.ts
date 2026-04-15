/**
 * Demo deal: Sarah (senior banker) working a Bank Guarantee deal
 * for a mid-market logistics customer in Identification phase.
 *
 * 11 checklist items cover all 9 design decisions:
 *  - D1: items with appliesTo filters (bank-guarantee vs term-loan etc.)
 *  - D2: skip reasons + legally mandatory blockers (item #7 AUSTRAC)
 *  - D3: each item has a KnowledgeCard
 *  - D4: items render with progressive-disclosure (accordion-style)
 *  - D5: phased via `phase` field
 *  - D6: some items have `provenance` from ABN/ASIC/Customer portal
 *  - D7: `owner` = banker | system | customer
 *  - D8: deal.cddMode = "reform-cdd"
 *  - D9: confidence score calculated from the 4-input weighted formula
 */
import type {
  ChecklistItem,
  Deal,
  PhaseMeta,
  SkipReasonOption,
} from "@/lib/types";

// ——— Phase metadata (D5 progress spine) ———
export const PHASES: PhaseMeta[] = [
  {
    id: "setup",
    label: "Setup",
    description: "Customer selected, product + entity captured, deal scaffold created.",
    order: 1,
  },
  {
    id: "identification",
    label: "Identification",
    description: "AUSTRAC-required identity and beneficial-owner verification.",
    order: 2,
  },
  {
    id: "credit",
    label: "Credit",
    description: "Financial assessment, serviceability, risk rating.",
    order: 3,
  },
  {
    id: "approval",
    label: "Approval",
    description: "Credit decisioning, conditions, sign-off.",
    order: 4,
  },
  {
    id: "settlement",
    label: "Settlement",
    description: "Documentation, execution, booking, drawdown.",
    order: 5,
  },
];

// ——— Sarah's deal (senior banker, bank guarantee, rare-product pattern) ———
export const SAMPLE_DEAL: Deal = {
  id: "BE-2026-00412",
  customerName: "Meridian Logistics Pty Ltd",
  abn: "68 134 876 221",
  dealName: "Bank guarantee — performance bond (Q2 2026)",
  product: "bank-guarantee",
  entity: "company",
  jurisdiction: "NSW",
  amount: 850_000,
  currency: "AUD",
  phase: "identification",
  cddMode: "reform-cdd",
  banker: {
    name: "Sarah Nguyen",
    role: "senior-banker",
  },
};

// ——— Skip reason picker options (D2) ———
export const SKIP_REASON_OPTIONS: SkipReasonOption[] = [
  {
    id: "doc-outside",
    label: "Documentation provided outside the platform",
    description: "Customer submitted docs via email or in-branch meeting.",
  },
  {
    id: "policy-override",
    label: "Policy override approved by team lead",
    description: "Credit risk / compliance approved a specific exception.",
  },
  {
    id: "customer-declined",
    label: "Customer declined this step",
    description: "Customer refused, and refusal is recorded in file notes.",
  },
  {
    id: "existing-relationship",
    label: "Existing relationship — previously verified",
    description: "Customer verified within the last 12 months via prior deal.",
  },
  {
    id: "other",
    label: "Other (explain)",
    description: "Reason not captured above — free-text required.",
  },
];

// ——— Checklist items (11 items across phases, D1 reshape logic included) ———
export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // 1. Verify ABN (system, auto-filled, provenance — D6 demo)
  {
    id: "item-01",
    label: "Verify ABN against ABN Lookup",
    description:
      "Confirm the customer's ABN is active, not cancelled, and matches the trading name on file.",
    owner: "system",
    status: "complete",
    phase: "identification",
    appliesTo: { product: null, entity: null },
    legallyMandatory: true,
    category: "customer-id",
    knowledge: {
      what: "A programmatic check against the ATO's ABN Lookup register.",
      why:
        "AUSTRAC requires verification of business entity identity as part of initial CDD. An inactive or cancelled ABN blocks onboarding.",
      example:
        "ABN 68 134 876 221 → ATO register confirms 'Meridian Logistics Pty Ltd', active, GST-registered since 2009.",
      policyLink: "Westpac Policy § 4.2.1 — Business entity verification",
    },
    provenance: {
      source: "ABN Lookup (ATO)",
      timestamp: "2026-04-14 09:12 AEST",
      confidence: "high",
    },
  },

  // 2. Verify company registration (system, ASIC)
  {
    id: "item-02",
    label: "Verify company registration with ASIC",
    description:
      "Confirm ACN, registered office, directors, and company status via ASIC search.",
    owner: "system",
    status: "complete",
    phase: "identification",
    appliesTo: { product: null, entity: ["company"] },
    legallyMandatory: true,
    category: "entity-verification",
    knowledge: {
      what: "Automated ASIC company extract request.",
      why:
        "For body-corporate customers, AUSTRAC requires verification of registration, registered office, and at least two directors where applicable.",
      example:
        "ASIC extract returns ACN 134 876 221, registered office in Chullora NSW, 2 directors, status 'Registered'.",
      policyLink: "Westpac Policy § 4.2.3 — Body corporate customers",
    },
    provenance: {
      source: "ASIC Company Search",
      timestamp: "2026-04-14 09:14 AEST",
      confidence: "high",
    },
  },

  // 3. Identify beneficial owners (banker) — D2 skip demo candidate (item #8 in demo flow)
  {
    id: "item-03",
    label: "Identify beneficial owners (≥25%)",
    description:
      "Document each natural person who ultimately owns or controls 25% or more of the entity, with verified identity evidence.",
    owner: "banker",
    status: "pending",
    phase: "identification",
    appliesTo: { product: null, entity: ["company", "trust", "partnership"] },
    legallyMandatory: false,
    category: "entity-verification",
    knowledge: {
      what:
        "Recording the natural persons behind the corporate structure — looking through shell companies, trusts, and other layers.",
      why:
        "Under AUSTRAC's reform CDD, banks must establish beneficial ownership on 'reasonable grounds'. Missing a beneficial owner is the most common senior-banker CDD error in commercial lending.",
      example:
        "Meridian Logistics is owned 60% by a family trust (trustee: Chen Family Holdings) and 40% by two directors. Beneficial owners: the three adult beneficiaries of the trust + the two directors.",
      policyLink: "AUSTRAC — Beneficial ownership (reform CDD)",
    },
  },

  // 4. Upload performance guarantee template (banker, BANK GUARANTEE ONLY — D1 demo)
  {
    id: "item-04",
    label: "Upload performance guarantee template",
    description:
      "Attach the signed performance guarantee template (beneficiary named, expiry aligned with underlying contract).",
    owner: "banker",
    status: "pending",
    phase: "identification",
    appliesTo: { product: ["bank-guarantee"], entity: null },
    legallyMandatory: false,
    category: "product-specific",
    knowledge: {
      what:
        "Westpac's standard performance-guarantee paper, signed by an authorised signer, with beneficiary details and expiry date.",
      why:
        "Bank guarantees must name the beneficiary and expiry alignment with the underlying contract. Muscle memory from term loans often misses this step — one of the most common senior-banker skip errors.",
      example:
        "Performance bond for NSW Roads & Maritime, $850K, expiry 31 Dec 2026 matching contract RMS/2024/3381.",
      policyLink: "Westpac Bank Guarantee product guide — Section 3",
    },
  },

  // 5. Record underlying contract details (banker, BANK GUARANTEE ONLY — D1 demo)
  {
    id: "item-05",
    label: "Record underlying contract details",
    description:
      "Contract reference, beneficiary legal name/address, expiry date aligned to guarantee expiry.",
    owner: "banker",
    status: "pending",
    phase: "identification",
    appliesTo: { product: ["bank-guarantee"], entity: null },
    legallyMandatory: false,
    category: "product-specific",
    knowledge: {
      what:
        "Capturing the contract the guarantee supports, so expiry alignment and beneficiary details can be validated downstream.",
      why:
        "Expiry mis-alignment between guarantee and contract is a top rework driver on bank-guarantee deals. Making the banker record it here catches the misalignment before submission.",
    },
  },

  // 6. Register PPSR interest (system, TERM LOAN ONLY — D1 demo)
  {
    id: "item-06",
    label: "Register PPSR security interest",
    description:
      "Register the security interest on the Personal Property Securities Register against the collateral asset.",
    owner: "system",
    status: "pending",
    phase: "identification",
    appliesTo: { product: ["term-loan"], entity: null },
    legallyMandatory: false,
    category: "product-specific",
    knowledge: {
      what:
        "Automated PPSR registration against the collateral asset (vehicle VIN, equipment serial, or general ALLPAAP).",
      why:
        "Term loans secured against specific assets require PPSR registration to protect Westpac's security interest.",
    },
  },

  // 7. Source of funds declaration (banker, LEGALLY MANDATORY — D2 hard block demo)
  {
    id: "item-07",
    label: "Source of funds declaration",
    description:
      "Customer-signed declaration of the source of funds used to service the facility. Mandatory under AUSTRAC reform CDD.",
    owner: "customer",
    status: "pending",
    phase: "identification",
    appliesTo: { product: null, entity: null },
    legallyMandatory: true,
    category: "risk",
    knowledge: {
      what:
        "A signed customer statement explaining where the money to repay this facility comes from (e.g. trading cashflow, existing asset, related-party funding).",
      why:
        "AUSTRAC's 2026 reform CDD requires banks to establish source of funds on 'reasonable grounds' for business lending customers. This step is legally mandatory — it cannot be skipped.",
      example:
        "Meridian Logistics: 'Trading cashflow from logistics operations, AUD 14.2M trailing 12-month turnover (audited FY25).'",
      policyLink: "AUSTRAC reform CDD — Source of funds guidance",
    },
  },

  // 8. Customer signature on T&Cs (customer, customer portal)
  {
    id: "item-08",
    label: "Customer signs product T&Cs",
    description:
      "Customer review and e-signature of product-specific terms and conditions via the BizEdge customer portal.",
    owner: "customer",
    status: "in-progress",
    phase: "identification",
    appliesTo: { product: null, entity: null },
    legallyMandatory: false,
    category: "docs",
    knowledge: {
      what:
        "E-signature request sent to the customer portal; customer reviews and signs on their device.",
      why:
        "Customer-owned task; banker cannot complete this step. D7 three-way ownership filters this out of 'my actions' when the filter is active.",
    },
    provenance: {
      source: "BizEdge customer portal",
      timestamp: "2026-04-14 11:03 AEST",
      confidence: "medium",
    },
  },

  // 9. Risk rating assessment (banker)
  {
    id: "item-09",
    label: "Assess customer risk rating",
    description:
      "Assign a risk rating (standard / enhanced due diligence) based on industry, jurisdiction, and customer profile.",
    owner: "banker",
    status: "pending",
    phase: "identification",
    appliesTo: { product: null, entity: null },
    legallyMandatory: false,
    category: "risk",
    knowledge: {
      what:
        "A banker judgment call on the ML/TF risk of this customer, documented with reasoning on 'reasonable grounds'.",
      why:
        "Under reform CDD, risk rating drives whether standard or enhanced due diligence applies. A wrong rating here cascades into compliance gaps downstream.",
    },
  },

  // 10. Credit memo draft (banker, Credit phase — shows spine progression)
  {
    id: "item-10",
    label: "Draft credit memo",
    description:
      "Summary of financials, serviceability, security, and recommended structure for credit approval.",
    owner: "banker",
    status: "pending",
    phase: "credit",
    appliesTo: { product: null, entity: null },
    legallyMandatory: false,
    category: "docs",
    knowledge: {
      what:
        "The structured narrative the banker writes to justify the credit decision: purpose, borrower history, financials, serviceability, security, conditions.",
      why:
        "Credit memo quality directly impacts approval turnaround. A thin memo triggers follow-up questions and rework.",
    },
  },

  // 11. Financial statements upload (customer)
  {
    id: "item-11",
    label: "Upload latest financial statements",
    description:
      "Customer uploads last 2 years of audited financial statements via the customer portal.",
    owner: "customer",
    status: "pending",
    phase: "credit",
    appliesTo: { product: null, entity: null },
    legallyMandatory: false,
    category: "docs",
    knowledge: {
      what:
        "Audited P&L, balance sheet, and cashflow statements for FY24 and FY25.",
      why:
        "Credit assessment cannot proceed without financials. This is a customer-owned task — banker cannot complete it directly.",
    },
  },
];
