/**
 * D9 — Deal Confidence Score.
 *
 * 4-input weighted formula (decisions.md § Decision 9):
 *  1. Checklist completion %                (weight 0.40)
 *  2. Skip reason quality                    (weight 0.20)
 *  3. Data provenance confidence             (weight 0.25)
 *  4. Mode indicator alignment               (weight 0.15)
 *
 * Score is advisory, not blocking. Red flags (missing legally mandatory items)
 * override the score visually in the UI; the number itself still computes.
 */
import type { ChecklistItem, ConfidenceBreakdown, Deal } from "@/lib/types";

const WEIGHT_CHECKLIST = 0.40;
const WEIGHT_SKIP_QUALITY = 0.20;
const WEIGHT_PROVENANCE = 0.25;
const WEIGHT_MODE = 0.15;

export function calculateConfidence(
  items: ChecklistItem[],
  deal: Deal,
): ConfidenceBreakdown {
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
  // Skipped items with a picker category (non-"other") and optional free text = high quality.
  // Skipped items with "other" OR no reason = low quality.
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
    provenanceConfidence = 70;
  } else {
    const sum = applicableWithData.reduce((acc, i) => {
      if (!i.provenance) return acc + 70;
      if (i.provenance.confidence === "high") return acc + 100;
      if (i.provenance.confidence === "medium") return acc + 75;
      return acc + 50; // low
    }, 0);
    provenanceConfidence = Math.round(sum / applicableWithData.length);
  }

  // ——— Input 4: mode alignment ———
  // Is the deal on the right CDD framework? For 2026 reform, commercial deals
  // should be on "reform-cdd" unless there's an explicit transition reason.
  // In this prototype the sample deal is correctly classified → 100.
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

export function confidenceToColor(score: number): {
  fg: string;
  bg: string;
  label: string;
} {
  if (score >= 85) {
    return { fg: "#0e6027", bg: "#defbe6", label: "Ready to submit" };
  }
  if (score >= 70) {
    return { fg: "#0043ce", bg: "#edf5ff", label: "On track" };
  }
  if (score >= 50) {
    return { fg: "#8e6a00", bg: "#fcf4d6", label: "Needs attention" };
  }
  return { fg: "#a2191f", bg: "#fff1f1", label: "Significant gaps" };
}
