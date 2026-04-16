/**
 * D9 — Ready to Submit score.
 *
 * 4-input weighted formula:
 *  1. Checklist completion %                (weight 0.50)
 *  2. Skip reason quality                    (weight 0.20)
 *  3. Data provenance confidence             (weight 0.20)
 *  4. Mode indicator alignment               (weight 0.10)
 *
 * Primarily weighted toward completion — "Ready to Submit" is
 * fundamentally "how much is done." Skip quality, provenance, and
 * mode alignment are secondary credit that can only bump the score
 * a modest amount.
 *
 * The score is advisory, not blocking. Red flags (missing legally
 * mandatory items) override the score visually; the number itself
 * still computes so the tooltip breakdown remains meaningful.
 */
import type { ChecklistItem, Deal, ReadinessBreakdown } from "@/lib/types";

const WEIGHT_CHECKLIST = 0.50;
const WEIGHT_SKIP_QUALITY = 0.20;
const WEIGHT_PROVENANCE = 0.20;
const WEIGHT_MODE = 0.10;

export function calculateReadiness(
  items: ChecklistItem[],
  deal: Deal,
): ReadinessBreakdown {
  // Only items that apply to the current deal profile count toward the score.
  const applicable = items.filter((i) => applies(i, deal));

  // ——— Input 1: checklist completion ———
  const done = applicable.filter(
    (i) => i.status === "complete" || i.status === "skipped",
  ).length;
  const checklistCompletion = applicable.length === 0
    ? 0
    : Math.round((done / applicable.length) * 100);

  // ——— Input 2: skip quality ———
  // Skipped items with a picker category (non-"other") = high quality.
  // Skipped items with "other" or no reason = low quality.
  const skipped = applicable.filter((i) => i.status === "skipped");
  let skipQuality: number;
  if (skipped.length === 0) {
    skipQuality = 100; // no skips, full credit
  } else {
    const highQuality = skipped.filter(
      (i) => i.skipReason && i.skipReason.category !== "other",
    ).length;
    skipQuality = Math.round((highQuality / skipped.length) * 100);
  }

  // ——— Input 3: provenance confidence ———
  // Items with auto-fill provenance contribute by their confidence tier.
  // Items without provenance (manual entry) score a neutral 70.
  const applicableWithData = applicable.filter(
    (i) => i.status === "complete" || i.status === "in-progress",
  );
  let provenanceConfidence: number;
  if (applicableWithData.length === 0) {
    provenanceConfidence = 100;
  } else {
    const sum = applicableWithData.reduce((acc, i) => {
      if (!i.provenance) return acc + 100;
      if (i.provenance.confidence === "high") return acc + 100;
      if (i.provenance.confidence === "medium") return acc + 85;
      return acc + 65; // low
    }, 0);
    provenanceConfidence = Math.round(sum / applicableWithData.length);
  }

  // ——— Input 4: mode alignment ———
  // Is the deal on the right CDD framework? For 2026 reform, commercial deals
  // should be on "reform-cdd" unless there's an explicit transition reason.
  const modeAlignment = deal.cddMode === "reform-cdd" ? 100 : 80;

  // ——— Weighted total ———
  const total = Math.round(
    checklistCompletion * WEIGHT_CHECKLIST +
      skipQuality * WEIGHT_SKIP_QUALITY +
      provenanceConfidence * WEIGHT_PROVENANCE +
      modeAlignment * WEIGHT_MODE,
  );

  return {
    checklistCompletion,
    skipQuality,
    provenanceConfidence,
    modeAlignment,
    total,
  };
}

// Helper: does this item apply to the current deal's product × entity profile?
function applies(item: ChecklistItem, deal: Deal): boolean {
  const productOk =
    item.appliesTo.product === null ||
    item.appliesTo.product.includes(deal.product);
  const entityOk =
    item.appliesTo.entity === null ||
    item.appliesTo.entity.includes(deal.entity);
  return productOk && entityOk;
}

/**
 * Tier colours for the Ready to Submit number itself.
 * Only the numeral takes on the tier colour; the surrounding UI stays
 * in the muted burgundy theme.
 */
export function readinessToColor(score: number): {
  fg: string;
  label: string;
} {
  if (score >= 80) {
    return { fg: "#2e7d32", label: "Ready to submit" };   // green
  }
  if (score >= 60) {
    return { fg: "#b45309", label: "On track" };           // amber
  }
  return { fg: "#c62828", label: "Needs attention" };      // soft red
}
