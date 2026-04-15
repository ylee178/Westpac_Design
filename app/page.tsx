"use client";

/**
 * Main page — BizEdge Deal Workspace.
 *
 * This single page composes all 9 design decisions and drives the
 * 11-step interactive demo flow. State lives here; child components
 * are presentation + event handlers only.
 */
import { useMemo, useState } from "react";
import type {
  ChecklistItem as CI,
  Deal,
  EntityType,
  OwnerFilter as OF,
  Phase,
  ProductType,
} from "@/lib/types";
import { INITIAL_CHECKLIST, PHASES, SAMPLE_DEAL } from "@/data/deal-data";
import { calculateConfidence } from "@/lib/confidence-calc";
import {
  reshapeChecklist,
  itemsForPhase,
} from "@/lib/checklist-reshape";
import { useDevMode } from "@/lib/dev-mode-context";

import { DealHeader } from "@/components/deal-header";
import { ProgressSpine } from "@/components/progress-spine";
import { ProductEntitySwitcher } from "@/components/product-entity-switcher";
import { OwnerFilter } from "@/components/owner-filter";
import { ChecklistListRow } from "@/components/checklist-list-row";
import { ChecklistDetail } from "@/components/checklist-detail";
import { SkipDialog } from "@/components/skip-dialog";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export default function Page() {
  // ——— State ———
  const [deal, setDeal] = useState<Deal>(SAMPLE_DEAL);
  const [library, setLibrary] = useState<CI[]>(INITIAL_CHECKLIST);
  const [ownerFilter, setOwnerFilter] = useState<OF>("all");
  const [skipTarget, setSkipTarget] = useState<CI | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { version } = useDevMode();
  const isV2 = version === "v2";

  // ——— Derived (computed during render — no useEffect for this) ———
  // D1: reshape by product × entity
  const reshaped = useMemo(
    () => reshapeChecklist(library, deal),
    [library, deal],
  );

  // D5: items for the current phase only
  const currentPhaseItems = useMemo(
    () => itemsForPhase(reshaped, deal.phase),
    [reshaped, deal.phase],
  );

  // D7: apply owner filter on top of reshaped+phase items
  const visibleItems = useMemo(
    () =>
      ownerFilter === "all"
        ? currentPhaseItems
        : currentPhaseItems.filter((i) => i.owner === ownerFilter),
    [currentPhaseItems, ownerFilter],
  );

  // Owner counts (shown next to filter buttons)
  const ownerCounts = useMemo<Record<OF, number>>(() => {
    const counts: Record<OF, number> = {
      all: currentPhaseItems.length,
      banker: 0,
      system: 0,
      customer: 0,
    };
    for (const i of currentPhaseItems) counts[i.owner] += 1;
    return counts;
  }, [currentPhaseItems]);

  // D9: confidence score — calculated from the full reshaped library, not just phase
  const breakdown = useMemo(
    () => calculateConfidence(reshaped, deal),
    [reshaped, deal],
  );

  // Red flag: the first legally mandatory item that is not complete or skipped.
  // Exposes the specific item label for the confidence indicator.
  const redFlagItem = useMemo(
    () =>
      reshaped.find(
        (i) =>
          i.legallyMandatory &&
          i.status !== "complete" &&
          i.status !== "skipped",
      ) ?? null,
    [reshaped],
  );
  const hasRedFlag = redFlagItem !== null;

  // Count of banker-owned pending items across all phases — used for the
  // "complete N banker items to reach X%" hint.
  const bankerPending = useMemo(
    () =>
      reshaped.filter(
        (i) =>
          i.owner === "banker" &&
          i.status !== "complete" &&
          i.status !== "skipped",
      ).length,
    [reshaped],
  );

  // Projected score after the banker completes all their pending items.
  // Naive model: assume checklist completion rises proportionally.
  const projectedAfterActions = useMemo(() => {
    if (bankerPending === 0) return breakdown.total;
    const resolved = reshaped.filter(
      (i) => i.status === "complete" || i.status === "skipped",
    ).length;
    const newCompletion = Math.round(
      ((resolved + bankerPending) / reshaped.length) * 100,
    );
    const newTotal = Math.round(
      newCompletion * 0.4 +
        breakdown.skipQuality * 0.2 +
        breakdown.provenanceConfidence * 0.25 +
        breakdown.modeAlignment * 0.15,
    );
    return Math.min(98, newTotal);
  }, [reshaped, bankerPending, breakdown]);

  // V2 — AI adds a 5th input to the confidence score.
  // Simple model: AI signal reads deal profile and contributes a flat "high" value
  // when the product × entity combination is a common one, lower when rare.
  // Here we just pick 92 for the demo so V2 visibly bumps the score.
  const v2Breakdown = useMemo(() => {
    if (!isV2) return breakdown;
    const aiSignal = 92;
    // Reweight: checklist 35, skip 15, provenance 22, mode 13, ai 15 → 100
    const total = Math.round(
      breakdown.checklistCompletion * 0.35 +
        breakdown.skipQuality * 0.15 +
        breakdown.provenanceConfidence * 0.22 +
        breakdown.modeAlignment * 0.13 +
        aiSignal * 0.15,
    );
    return { ...breakdown, total };
  }, [breakdown, isV2]);
  const effectiveBreakdown = isV2 ? v2Breakdown : breakdown;

  // Master-detail: selected item derived from id + visible list.
  // Default to the first INCOMPLETE item when selection is stale — the
  // banker should land on something they can act on, not a completed row.
  const selectedItem = useMemo(() => {
    const byId = visibleItems.find((i) => i.id === selectedItemId);
    if (byId) return byId;
    const firstIncomplete = visibleItems.find(
      (i) => i.status !== "complete" && i.status !== "skipped",
    );
    return firstIncomplete ?? visibleItems[0] ?? null;
  }, [visibleItems, selectedItemId]);

  // Phase completion detector — all items in current phase are resolved?
  const currentPhaseComplete = useMemo(
    () =>
      currentPhaseItems.length > 0 &&
      currentPhaseItems.every(
        (i) => i.status === "complete" || i.status === "skipped",
      ),
    [currentPhaseItems],
  );

  // Phase navigation — next/prev phase
  const currentPhaseIdx = PHASES.findIndex((p) => p.id === deal.phase);
  const prevPhase: Phase | null =
    currentPhaseIdx > 0 ? PHASES[currentPhaseIdx - 1].id : null;
  const nextPhase: Phase | null =
    currentPhaseIdx < PHASES.length - 1
      ? PHASES[currentPhaseIdx + 1].id
      : null;
  const nextPhaseLabel = nextPhase
    ? PHASES.find((p) => p.id === nextPhase)?.label
    : null;

  // ——— Handlers ———
  function handleProductChange(product: ProductType) {
    setDeal((d) => ({ ...d, product }));
  }

  function handleEntityChange(entity: EntityType) {
    setDeal((d) => ({ ...d, entity }));
  }

  function handleRequestSkip(item: CI) {
    setSkipTarget(item);
  }

  function handleSkipConfirm(payload: { category: string; freeText?: string }) {
    if (!skipTarget) return;
    setLibrary((prev) =>
      prev.map((i) =>
        i.id === skipTarget.id
          ? { ...i, status: "skipped", skipReason: payload }
          : i,
      ),
    );
    setSkipTarget(null);
  }

  function handleSkipCancel() {
    setSkipTarget(null);
  }

  function handlePhaseChange(phase: Phase) {
    setDeal((d) => ({ ...d, phase }));
  }

  const currentPhaseMeta = PHASES.find((p) => p.id === deal.phase);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — customer, amount, D8 mode, D9 confidence */}
      <DealHeader
        deal={deal}
        breakdown={effectiveBreakdown}
        hasRedFlag={hasRedFlag}
        redFlagLabel={redFlagItem?.label}
        redFlagSubtitle={redFlagItem?.subtitle}
        bankerActionCount={bankerPending}
        projectedAfterActions={projectedAfterActions}
      />

      {/* V2 — AI teammate banner */}
      {isV2 ? (
        <div
          className="border-b"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-border)",
          }}
        >
          <div
            className="max-w-[1584px] mx-auto px-6 md:px-8 py-1.5 flex items-center gap-2 text-[11px]"
            style={{ color: "var(--theme-primary)" }}
          >
            <Sparkles size={11} strokeWidth={2.2} />
            <span className="font-semibold tracking-[0.32px] uppercase">
              V2 · AI teammate active
            </span>
            <span style={{ color: "var(--theme-text-tertiary)" }}>
              · contributing a 5th input to Deal Confidence · surfacing rare
              combinations · drafting skip reason hints
            </span>
          </div>
        </div>
      ) : null}

      {/* D5 — Progress spine (click to jump between phases) */}
      <ProgressSpine currentPhase={deal.phase} onPhaseChange={handlePhaseChange} />

      {/* Main workspace — table-first, quiet */}
      <main
        className="flex-1"
        style={{ background: "var(--theme-page-bg)" }}
      >
        <div className="max-w-[1584px] mx-auto px-6 md:px-8 py-5">
          {/* Inline filter bar — real UI: owner filter only */}
          <div
            className="flex items-end justify-end gap-4 flex-wrap mb-4 pb-4"
            style={{ borderBottom: "1px solid var(--theme-border-subtle)" }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="text-[10px] uppercase font-medium"
                style={{
                  color: "var(--theme-text-tertiary)",
                  letterSpacing: "0.32px",
                }}
              >
                Owner filter
              </span>
              <OwnerFilter
                value={ownerFilter}
                onChange={setOwnerFilter}
                counts={ownerCounts}
              />
            </div>
          </div>

          {/* Phase-complete banner */}
          {currentPhaseComplete && nextPhase ? (
            <div
              className="mb-4 p-3 flex items-center gap-3 flex-wrap"
              style={{
                background: "#f0f9f2",
                border: "1px solid #bfe4c6",
                borderLeft: "3px solid var(--theme-success)",
                borderRadius: "var(--theme-radius)",
              }}
            >
              <Sparkles
                size={14}
                strokeWidth={2.2}
                style={{ color: "var(--theme-success)" }}
              />
              <div className="flex-1 min-w-0 text-[12px]">
                <span
                  className="font-semibold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {currentPhaseMeta?.label} phase complete
                </span>
                <span style={{ color: "var(--theme-text-secondary)" }}>
                  {" "}— Continue to {nextPhaseLabel}:{" "}
                  {itemsForPhase(reshaped, nextPhase).length} items waiting (
                  {
                    itemsForPhase(reshaped, nextPhase).filter(
                      (i) => i.owner === "banker",
                    ).length
                  }{" "}
                  need your action)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePhaseChange(nextPhase)}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-semibold text-white"
                style={{
                  background: "var(--theme-primary)",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                Continue to {nextPhaseLabel}
                <ArrowRight size={12} strokeWidth={2.2} />
              </button>
            </div>
          ) : null}

          {/* Section heading — quiet */}
          <div className="mb-2 flex items-baseline justify-between flex-wrap gap-2">
            <h2
              className="text-[15px] leading-[1.4] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {currentPhaseMeta?.label} phase — checklist
            </h2>
            <div
              className="text-[11px]"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Showing {visibleItems.length} of {currentPhaseItems.length} items
              · reshape: {deal.product} × {deal.entity}
            </div>
          </div>

          {/* Master-detail split — list left, detail right */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-5">
            {/* Master list */}
            <div className="min-w-0">
              {visibleItems.length > 0 ? (
                <div
                  style={{
                    background: "var(--theme-card-bg)",
                    border: "1px solid var(--theme-border)",
                    borderRadius: "var(--theme-radius)",
                    overflow: "hidden",
                  }}
                >
                  <ul>
                    {visibleItems.map((item) => (
                      <ChecklistListRow
                        key={item.id}
                        item={item}
                        selected={selectedItem?.id === item.id}
                        onSelect={(i) => setSelectedItemId(i.id)}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <div
                  className="py-12 text-center text-[12px]"
                  style={{
                    background: "var(--theme-card-bg)",
                    border: "1px solid var(--theme-border)",
                    color: "var(--theme-text-tertiary)",
                    borderRadius: "var(--theme-radius)",
                  }}
                >
                  No items match the current filter. Change Owner filter back
                  to "All".
                </div>
              )}
            </div>

            {/* Detail panel — sticky on lg+ */}
            <div className="min-w-0">
              <ChecklistDetail
                item={selectedItem}
                onRequestSkip={handleRequestSkip}
              />
            </div>
          </div>

          {/* D1 demo controls — visually distinct, clearly not part of real UI */}
          <div
            className="mt-5 p-3 flex items-center gap-3 flex-wrap"
            style={{
              background: "repeating-linear-gradient(45deg, #fafafa, #fafafa 6px, #f4f4f4 6px, #f4f4f4 12px)",
              border: "1px dashed var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <div
              className="text-[10px] uppercase font-semibold tracking-[0.5px] shrink-0"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Demo controls · D1 reshape
            </div>
            <div
              className="text-[11px] shrink-0"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Not part of the real UI — switch product / entity to see the
              checklist reshape
            </div>
            <div className="flex-1 min-w-[200px]" />
            <ProductEntitySwitcher
              product={deal.product}
              entity={deal.entity}
              onProductChange={handleProductChange}
              onEntityChange={handleEntityChange}
            />
          </div>

          {/* Phase navigation — prev / next primary button */}
          <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => prevPhase && handlePhaseChange(prevPhase)}
              disabled={!prevPhase}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--theme-card-bg)",
                borderColor: "var(--theme-border-strong)",
                color: "var(--theme-text-secondary)",
                borderRadius: "var(--theme-radius)",
              }}
            >
              <ArrowLeft size={13} strokeWidth={2.2} />
              {prevPhase
                ? `Previous: ${PHASES.find((p) => p.id === prevPhase)?.label}`
                : "No previous phase"}
            </button>

            <div
              className="text-[11px] text-center flex-1 min-w-0"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Phase {currentPhaseIdx + 1} of {PHASES.length} ·{" "}
              {currentPhaseItems.filter((i) => i.status === "complete" || i.status === "skipped").length}
              /{currentPhaseItems.length} items resolved
            </div>

            <button
              type="button"
              onClick={() => nextPhase && handlePhaseChange(nextPhase)}
              disabled={!nextPhase}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--theme-primary)",
                borderRadius: "var(--theme-radius)",
              }}
            >
              {nextPhase
                ? `Continue to ${nextPhaseLabel}`
                : "Deal complete"}
              <ArrowRight size={13} strokeWidth={2.2} />
            </button>
          </div>

        </div>
      </main>

      {/* D2 — Skip dialog */}
      <SkipDialog
        open={skipTarget !== null}
        item={skipTarget}
        onCancel={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />
      {/* Dev panel is mounted in layout.tsx — outside the filter target */}
    </div>
  );
}
