/**
 * Pac briefing content — product- and stage-aware context that
 * the V2 side panel surfaces without pushing a new chat message
 * every time the banker clicks something.
 *
 * Two lookups are exported:
 *   - getBriefing(product, step)   → title, subtitle, bullets
 *   - getSuggestions(product, step) → 3 pill-button prompts with
 *                                     pre-baked Pac answers
 *
 * Keeping both in one file means product × stage changes only
 * need a single data edit.
 */
import type { WestpacProductId } from "@/data/product-options";
import type { V1Step } from "@/lib/flow-mode-context";

type FlowStep = V1Step;

export interface BriefingContent {
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface Suggestion {
  question: string;
  answer: string;
}

/** Generic fallback when no product is selected yet. */
const DEFAULT_BRIEFING: BriefingContent = {
  title: "Deal briefing",
  subtitle: "Pick a product to see tailored guidance",
  bullets: [
    "I'm watching alongside you — legally-mandatory items, rare-product risks, AUSTRAC reform moves.",
    "Click a suggested question below, or type anything.",
    "I won't interrupt. I only surface when something is worth knowing.",
  ],
};

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    question: "What's changing with the AUSTRAC reform?",
    answer:
      "AUSTRAC's 2026 reform moves beneficial-ownership verification from advisory to <strong>legally mandatory</strong>. Every lending deal now needs verified BOs before submission — that's the 🔒 lock icon you'll see on checklist items.",
  },
  {
    question: "How is the Ready-to-Submit score calculated?",
    answer:
      "50% checklist completion + 20% skip quality + 20% source provenance + 10% mode alignment. It's a projection, not a decision — the final review still runs in Phase 5.",
  },
  {
    question: "What does Pac actually do?",
    answer:
      "I surface contextual guidance — policy citations, rare-product flags, documentation checks — so you don't have to context-switch to the policy wiki mid-deal.",
  },
];

/** Product-specific briefings. One entry per Westpac product. */
const PRODUCT_BRIEFINGS: Record<WestpacProductId, BriefingContent> = {
  "business-loan": {
    title: "Business Loan",
    subtitle: "Term lending, secured or unsecured",
    bullets: [
      "Terms 1–15 years, typically amortising with monthly repayments.",
      "Security required above A$500k; director personal guarantees are common.",
      "AUSTRAC 2026 reform: beneficial owner verification is legally mandatory.",
    ],
  },
  "bank-guarantee": {
    title: "Bank Guarantee",
    subtitle: "Performance & financial guarantees",
    bullets: [
      "No principal lent — the bank underwrites a contingent obligation.",
      "Fee 0.75–2% p.a. of face value. Cash cover usually required.",
      "Common for construction, property leases, supplier contracts.",
    ],
  },
  "equipment-finance": {
    title: "Equipment Finance",
    subtitle: "Asset-backed business lending",
    bullets: [
      "The equipment itself is the security. Terms 3–7 years aligned to useful life.",
      "Up to 100% LVR on new kit from approved vendors; 80% on used.",
      "PPSR registration happens automatically on settlement.",
    ],
  },
  "business-overdraft": {
    title: "Business Overdraft",
    subtitle: "Revolving working-capital facility",
    bullets: [
      "Existing Westpac customers only — the Setup phase verifies this automatically.",
      "Limits A$5k–A$250k. Secured above A$50k.",
      "Interest on drawn balance only. Annual review baked in.",
    ],
  },
};

/** Product × step suggestions. Step-specific variants override the product default. */
const PRODUCT_SUGGESTIONS: Record<
  WestpacProductId,
  Partial<Record<FlowStep, Suggestion[]>> & { default: Suggestion[] }
> = {
  "business-loan": {
    default: [
      {
        question: "What documents does the customer need to provide?",
        answer:
          "Business financials (2 years), ID for all beneficial owners, ABN/ACN, a written purpose statement, and a cash flow forecast. Each will show up as a checklist item with provenance.",
      },
      {
        question: "When is a personal guarantee required?",
        answer:
          "Loans above <strong>A$500k</strong>, or any loan to a company trading less than 3 years, typically need director PGs. The Risk phase flags this automatically.",
      },
      {
        question: "What are the red flags for this product?",
        answer:
          "Over-structured ownership (5+ layers), director changes in the last 12 months, or a mismatch between ABN trading activity and the stated purpose. I watch these silently and flag in Risk.",
      },
    ],
    focused: [
      {
        question: "Why is this item legally mandatory?",
        answer:
          "AUSTRAC 2026 reform — beneficial ownership and source-of-funds verification are now hard gates for lending above A$100k. No override available.",
      },
      {
        question: "Can the customer provide this digitally?",
        answer:
          "Yes — the customer portal supports document upload with OCR pre-fill. System-owned items auto-verify against Westpac CRM + ASIC.",
      },
      {
        question: "What happens if I skip an optional item?",
        answer:
          "You'll be prompted for a reason. Optional skips reduce the skip-quality axis (20% of your Ready to Submit score) but don't block submission.",
      },
    ],
  },
  "bank-guarantee": {
    default: [
      {
        question: "Does this require full cash cover?",
        answer:
          "Bank Guarantees usually require <strong>100% cash cover</strong> unless the customer already has a BG facility. The Risk phase checks existing facilities automatically.",
      },
      {
        question: "What's the usual term?",
        answer:
          "12 months rolling and renewable. Property leases often match the lease term exactly. The <em>beneficiary wording</em> controls expiry — double-check it in Identification.",
      },
      {
        question: "Which documents are mandatory?",
        answer:
          "Beneficiary details, beneficiary-specified wording, purpose description, and ID verification for all applicant directors. Missing wording is the #1 delay cause.",
      },
    ],
    focused: [
      {
        question: "Why is the beneficiary wording so strict?",
        answer:
          "The wording is the contract — any deviation can void the guarantee at claim time. I'll flag any discrepancy against the beneficiary's template in Identification.",
      },
      {
        question: "Can the customer provide partial cash cover?",
        answer:
          "Only with pre-approved security substitution (e.g. term deposit, cash-equivalent assets). This is a Risk-phase exception — I'll surface the pathway if it applies.",
      },
      {
        question: "What if the beneficiary requires an evergreen clause?",
        answer:
          "Evergreen clauses auto-renew until notice. Westpac requires senior credit sign-off for evergreen BGs above A$1M — I'll flag this in Risk.",
      },
    ],
  },
  "equipment-finance": {
    default: [
      {
        question: "What LVR do we typically accept?",
        answer:
          "Up to <strong>100%</strong> on new equipment from approved vendors; <strong>80%</strong> for used. LVR is one of the Risk-phase gates — I'll check automatically.",
      },
      {
        question: "Do we need a supplier invoice?",
        answer:
          "Yes — supplier invoice and detailed asset description are mandatory in Identification. PPSR registration happens automatically during Setup.",
      },
      {
        question: "How is GST handled?",
        answer:
          "Either financed (increases drawdown) or paid by the customer. Confirm during Setup so the amount and repayment schedule are accurate.",
      },
    ],
  },
  "business-overdraft": {
    default: [
      {
        question: "What are the eligibility requirements?",
        answer:
          "Existing Westpac transaction account, minimum 12 months trading, and satisfactory account conduct. Pac verifies the customer number automatically in Setup.",
      },
      {
        question: "Is security required?",
        answer:
          "For limits above <strong>A$50k</strong>: yes — typically a GSA over business assets or residential security. Flagged in Risk with a clear pathway.",
      },
      {
        question: "How is the annual review handled?",
        answer:
          "Triggered automatically 11 months post-drawdown. Historical conduct, turnover, and satisfactory repayments drive the re-approval decision.",
      },
    ],
  },
};

export function getBriefing(
  product: string | undefined,
  _step: FlowStep,
): BriefingContent {
  if (!product) return DEFAULT_BRIEFING;
  return PRODUCT_BRIEFINGS[product as WestpacProductId] ?? DEFAULT_BRIEFING;
}

export function getSuggestions(
  product: string | undefined,
  step: FlowStep,
): Suggestion[] {
  if (!product) return DEFAULT_SUGGESTIONS;
  const bucket = PRODUCT_SUGGESTIONS[product as WestpacProductId];
  if (!bucket) return DEFAULT_SUGGESTIONS;
  return bucket[step] ?? bucket.default;
}
