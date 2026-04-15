/**
 * Derived deal state — single source of truth for what page.tsx,
 * the sidebar, the header ribbon, and the Pac panel all read.
 *
 * The rule: no component computes its own readiness or red-flag
 * state. Every consumer reads from the result of `computeDealState`,
 * which is derived purely from `(items, deal)`. If the inputs
 * change, every consumer re-renders from the same source.
 */
import type {
  ChecklistItem,
  Deal,
  Phase,
  ReadinessBreakdown,
} from "@/lib/types";
import { calculateReadiness } from "@/lib/readiness-calc";
import { PHASES } from "@/data/deal-data";

export interface PhaseSnapshot {
  id: Phase;
  label: string;
  order: number;
  items: ChecklistItem[];
  complete: number;
  total: number;
  percent: number;
  status: "not-started" | "in-progress" | "complete";
}

export interface RedFlag {
  itemId: string;
  label: string;
  subtitle?: string;
  phase: Phase;
}

export interface DealState {
  deal: Deal;
  /** Items filtered to those that apply to this deal (D1 reshape). */
  applicableItems: ChecklistItem[];
  phases: PhaseSnapshot[];
  currentPhase: PhaseSnapshot;
  /** Items in the current phase, ordered. */
  currentPhaseItems: ChecklistItem[];
  /** The next actionable item the banker should work on. */
  nextActionableItem: ChecklistItem | null;
  /** Unresolved legally-mandatory items across the WHOLE deal. */
  redFlags: RedFlag[];
  /** How many banker-owned items are still pending. */
  bankerPending: number;
  breakdown: ReadinessBreakdown;
}

// ——— Helpers ———

function applies(item: ChecklistItem, deal: Deal): boolean {
  const productOk =
    item.appliesTo.product === null ||
    item.appliesTo.product.includes(deal.product);
  const entityOk =
    item.appliesTo.entity === null ||
    item.appliesTo.entity.includes(deal.entity);
  return productOk && entityOk;
}

function phaseStatus(
  items: ChecklistItem[],
): "not-started" | "in-progress" | "complete" {
  if (items.length === 0) return "not-started";
  const resolved = items.filter(
    (i) => i.status === "complete" || i.status === "skipped",
  ).length;
  if (resolved === 0) return "not-started";
  if (resolved === items.length) return "complete";
  return "in-progress";
}

/**
 * Main entry point. Given the full item library and the deal,
 * compute every derived value the UI needs in one pass.
 */
export function computeDealState(
  items: ChecklistItem[],
  deal: Deal,
): DealState {
  const applicableItems = items.filter((i) => applies(i, deal));

  // Group items by phase using the canonical PHASES order so the
  // sidebar always renders the five phases in lifecycle order.
  const phases: PhaseSnapshot[] = PHASES.map((meta) => {
    const phaseItems = applicableItems.filter((i) => i.phase === meta.id);
    const complete = phaseItems.filter(
      (i) => i.status === "complete" || i.status === "skipped",
    ).length;
    const total = phaseItems.length;
    return {
      id: meta.id,
      label: meta.label,
      order: meta.order,
      items: phaseItems,
      complete,
      total,
      percent: total === 0 ? 0 : Math.round((complete / total) * 100),
      status: phaseStatus(phaseItems),
    };
  });

  // Current phase = the first phase that is not yet complete. If
  // every phase is complete, stay on the last one.
  const firstIncomplete = phases.find((p) => p.status !== "complete");
  const currentPhase = firstIncomplete ?? phases[phases.length - 1];

  const currentPhaseItems = currentPhase.items;

  // Next actionable item in the current phase — first item that is
  // neither complete nor skipped. Prefer banker-owned items first so
  // the banker's own queue is surfaced before customer waits.
  const unresolved = currentPhaseItems.filter(
    (i) => i.status !== "complete" && i.status !== "skipped",
  );
  const bankerFirst = unresolved.find((i) => i.owner === "banker");
  const nextActionableItem = bankerFirst ?? unresolved[0] ?? null;

  // Red flags = unresolved legally-mandatory items across the whole
  // applicable set. Note: once an item is marked complete or skipped,
  // it drops out of this list automatically.
  const redFlags: RedFlag[] = applicableItems
    .filter(
      (i) =>
        i.legallyMandatory &&
        i.status !== "complete" &&
        i.status !== "skipped",
    )
    .map((i) => ({
      itemId: i.id,
      label: i.label,
      subtitle: i.subtitle,
      phase: i.phase,
    }));

  const bankerPending = applicableItems.filter(
    (i) =>
      i.owner === "banker" &&
      i.status !== "complete" &&
      i.status !== "skipped",
  ).length;

  const breakdown = calculateReadiness(applicableItems, deal);

  return {
    deal,
    applicableItems,
    phases,
    currentPhase,
    currentPhaseItems,
    nextActionableItem,
    redFlags,
    bankerPending,
    breakdown,
  };
}

/**
 * Single helper for the "one action hint" in the simplified header.
 * Returns a short, specific string computed from current state —
 * or null if there's nothing particular to nudge the banker on.
 */
export function deriveActionHint(state: DealState): string | null {
  if (state.redFlags.length > 0) {
    const n = state.redFlags.length;
    return `${n} legally mandatory item${n === 1 ? "" : "s"} to resolve before submission.`;
  }
  if (state.bankerPending > 0) {
    const n = state.bankerPending;
    return `${n} banker action${n === 1 ? "" : "s"} pending in this deal.`;
  }
  if (state.breakdown.total >= 90) {
    return "Ready to submit.";
  }
  return null;
}

/**
 * Colour tier for the Ready to Submit number.
 * Notice: RED is only used for true blocking situations
 * (unresolved red flag). Normal early progression stays neutral.
 */
export function readinessTier(
  total: number,
  hasRedFlag: boolean,
): { fg: string; label: string } {
  if (hasRedFlag) {
    return { fg: "#c62828", label: "Needs attention" };
  }
  if (total >= 90) return { fg: "#2e7d32", label: "Ready to submit" };
  if (total >= 80) return { fg: "#2e7d32", label: "Almost there" };
  if (total >= 60) return { fg: "#1f6feb", label: "Good progress" };
  return { fg: "#525252", label: "In progress" };
}
