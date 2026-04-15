"use client";

/**
 * Main page — Westpac BizEdge deal workspace.
 *
 * Two top-level modes share state:
 *  - V1: Guided progressive checklist (empty → creator → loading →
 *        focused → showAll → complete)
 *  - V2: AI teammate (scripted chat, Phase 3 placeholder for now)
 *
 * Header + progress spine + Ready to Submit score are shared.
 */
import { useMemo, useState } from "react";
import type {
  ChecklistItem as CI,
  Deal,
  OwnerFilter as OF,
  Phase,
} from "@/lib/types";
import { INITIAL_CHECKLIST, PHASES, SAMPLE_DEAL } from "@/data/deal-data";
import { calculateReadiness } from "@/lib/readiness-calc";
import {
  reshapeChecklist,
  itemsForPhase,
} from "@/lib/checklist-reshape";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";

import { DealHeader } from "@/components/deal-header";
import { ProgressSpine } from "@/components/progress-spine";
import { OwnerFilter } from "@/components/owner-filter";
import { ChecklistListRow } from "@/components/checklist-list-row";
import { SkipDialog } from "@/components/skip-dialog";
import { V1EmptyState } from "@/components/v1-empty-state";
import { V1DealContextForm } from "@/components/v1-deal-context-form";
import { V1DynamicLoading } from "@/components/v1-dynamic-loading";
import { V1FocusedCard } from "@/components/v1-focused-card";
import { V1PhaseTransition } from "@/components/v1-phase-transition";
import { V1PhaseReadonly } from "@/components/v1-phase-readonly";
import { V2ChatPanel } from "@/components/v2-chat-panel";
import { ArrowRight, ArrowLeft, LayoutList, ListChecks, Sparkles } from "lucide-react";

export default function Page() {
  // ——— State ———
  const [baseDeal, setBaseDeal] = useState<Deal>(SAMPLE_DEAL);
  const [library, setLibrary] = useState<CI[]>(INITIAL_CHECKLIST);
  const [ownerFilter, setOwnerFilter] = useState<OF>("all");
  const [skipTarget, setSkipTarget] = useState<CI | null>(null);
  const { product: demoProduct, entity: demoEntity, aiPanel } = useDevMode();
  const {
    step,
    setStep,
    draft,
    resetDraft,
    focusedIndex,
    setFocusedIndex,
  } = useFlowMode();
  // V2 AI layer is always "on" when the Pac panel is visible — the
  // readiness score bump uses the AI signal weighting below.
  const isV2 = aiPanel;

  // Dev panel overrides product × entity for D1 reshape demo, AND the
  // empty-state card selector writes the same values so the deal reflects
  // whichever is current.
  const deal: Deal = useMemo(
    () => ({
      ...baseDeal,
      product: demoProduct as Deal["product"],
      entity: demoEntity as Deal["entity"],
      customerName:
        draft.customerName.trim().length > 0
          ? draft.customerName.trim()
          : baseDeal.customerName,
      amount: (() => {
        const parsed = parseInt(draft.amount.replace(/[^0-9]/g, ""), 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : baseDeal.amount;
      })(),
      jurisdiction:
        (draft.jurisdiction as Deal["jurisdiction"]) || baseDeal.jurisdiction,
    }),
    [baseDeal, demoProduct, demoEntity, draft],
  );

  // ——— Derived ———
  const reshaped = useMemo(
    () => reshapeChecklist(library, deal),
    [library, deal],
  );

  const currentPhaseItems = useMemo(
    () => itemsForPhase(reshaped, deal.phase),
    [reshaped, deal.phase],
  );

  // Items for the Setup phase — used by the read-only view when the
  // banker clicks back to the completed Setup tab in the spine.
  const setupPhaseItems = useMemo(
    () => reshaped.filter((i) => i.phase === "setup"),
    [reshaped],
  );

  const visibleItems = useMemo(
    () =>
      ownerFilter === "all"
        ? currentPhaseItems
        : currentPhaseItems.filter((i) => i.owner === ownerFilter),
    [currentPhaseItems, ownerFilter],
  );

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

  const breakdown = useMemo(
    () => calculateReadiness(reshaped, deal),
    [reshaped, deal],
  );

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

  const projectedAfterActions = useMemo(() => {
    if (bankerPending === 0) return breakdown.total;
    const resolved = reshaped.filter(
      (i) => i.status === "complete" || i.status === "skipped",
    ).length;
    const newCompletion = Math.round(
      ((resolved + bankerPending) / reshaped.length) * 100,
    );
    const newTotal = Math.round(
      newCompletion * 0.5 +
        breakdown.skipQuality * 0.2 +
        breakdown.provenanceConfidence * 0.2 +
        breakdown.modeAlignment * 0.1,
    );
    return Math.min(98, newTotal);
  }, [reshaped, bankerPending, breakdown]);

  const v2Breakdown = useMemo(() => {
    if (!isV2) return breakdown;
    const aiSignal = 92;
    const total = Math.round(
      breakdown.checklistCompletion * 0.4 +
        breakdown.skipQuality * 0.15 +
        breakdown.provenanceConfidence * 0.2 +
        breakdown.modeAlignment * 0.1 +
        aiSignal * 0.15,
    );
    return { ...breakdown, total };
  }, [breakdown, isV2]);
  const effectiveBreakdown = isV2 ? v2Breakdown : breakdown;

  // ——— V1 handlers ———
  const identificationItems = useMemo(
    () =>
      reshaped.filter(
        (i) => i.phase === "identification",
      ),
    [reshaped],
  );

  // In focused mode we walk through items that are NOT yet resolved.
  const actionableIdentification = useMemo(
    () =>
      identificationItems.filter(
        (i) => i.status !== "complete" && i.status !== "skipped",
      ),
    [identificationItems],
  );

  const currentFocusedItem =
    actionableIdentification[focusedIndex] ?? null;

  const phaseAllResolved =
    identificationItems.length > 0 &&
    identificationItems.every(
      (i) => i.status === "complete" || i.status === "skipped",
    );

  function handleCompleteItem(item: CI) {
    setLibrary((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: "complete" } : i,
      ),
    );
    // Stay on same index — the list shrinks underneath us so the "next"
    // item slides in automatically. If we're past the end, clamp.
    setFocusedIndex((idx) => Math.max(0, Math.min(idx, actionableIdentification.length - 2)));
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
    setFocusedIndex((idx) => Math.max(0, Math.min(idx, actionableIdentification.length - 2)));
  }

  function handleSkipCancel() {
    setSkipTarget(null);
  }

  function handleRestart() {
    resetDraft();
    setStep("empty");
    setFocusedIndex(0);
    setLibrary(INITIAL_CHECKLIST); // reset completed states
  }

  // Auto-advance to complete state when phase is fully resolved in focused step
  const shouldShowComplete =
    step === "focused" && phaseAllResolved;

  // ——— Unified render: header + spine up top, main area + Pac panel below ———

  const mainContent = (() => {
    if (step === "empty") return <V1EmptyState />;
    if (step === "creator") return <V1DealContextForm />;
    if (step === "loading") return <V1DynamicLoading />;
    if (deal.phase === "setup") {
      return (
        <div className="w-full max-w-[1040px] mx-auto px-6 md:px-8 py-6">
          <V1PhaseReadonly
            phaseLabel="Setup"
            items={setupPhaseItems}
            onReturn={() =>
              setBaseDeal((d) => ({ ...d, phase: "identification" }))
            }
          />
        </div>
      );
    }
    if (shouldShowComplete) {
      return (
        <V1PhaseTransition
          completedPhase="identification"
          onRestart={handleRestart}
        />
      );
    }
    if (step === "showAll") {
      return (
        <div className="w-full max-w-[1040px] mx-auto px-6 md:px-8 py-6">
          <ShowAllView
            visibleItems={visibleItems}
            currentPhaseItems={currentPhaseItems}
            ownerFilter={ownerFilter}
            setOwnerFilter={setOwnerFilter}
            ownerCounts={ownerCounts}
            onReturn={() => setStep("focused")}
            selectedItemId={currentFocusedItem?.id ?? null}
            onSelectItem={(item) => {
              const idx = actionableIdentification.findIndex(
                (i) => i.id === item.id,
              );
              if (idx >= 0) setFocusedIndex(idx);
              setStep("focused");
            }}
            onRequestSkip={handleRequestSkip}
          />
        </div>
      );
    }
    if (currentFocusedItem) {
      return (
        <div className="w-full max-w-[1040px] mx-auto px-6 md:px-8 py-6">
          <FocusedView
            item={currentFocusedItem}
            total={actionableIdentification.length}
            index={focusedIndex}
            onComplete={handleCompleteItem}
            onRequestSkip={handleRequestSkip}
            onShowAll={() => setStep("showAll")}
          />
        </div>
      );
    }
    return (
      <V1PhaseTransition
        completedPhase="identification"
        onRestart={handleRestart}
      />
    );
  })();

  // Header + spine are visible for every step EXCEPT the very-empty
  // "empty" and "creator" states where the banker hasn't committed to
  // a deal yet. Those show MinimalHeader.
  const showFullHeader = step !== "empty" && step !== "creator";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Sticky header + spine group */}
      <div className="shrink-0">
        {showFullHeader ? (
          <>
            <DealHeader
              deal={deal}
              breakdown={effectiveBreakdown}
              hasRedFlag={hasRedFlag}
              redFlagLabel={redFlagItem?.label}
              redFlagSubtitle={redFlagItem?.subtitle}
              bankerActionCount={bankerPending}
              projectedAfterActions={projectedAfterActions}
            />
            <div
              style={{
                background: "#f5f5f5",
                borderBottom: "1px solid var(--theme-border)",
              }}
            >
              <ProgressSpine
                currentPhase={step === "loading" ? "setup" : deal.phase}
                onPhaseChange={(p) =>
                  setBaseDeal((d) => ({ ...d, phase: p }))
                }
              />
            </div>
          </>
        ) : (
          <MinimalHeader />
        )}
      </div>

      {/* Main area + optional Pac panel */}
      <div className="flex-1 flex min-h-0">
        <main
          className="flex-1 min-w-0 overflow-y-auto flex flex-col"
          style={{ background: "var(--theme-page-bg)" }}
        >
          {mainContent}
        </main>

        {aiPanel ? (
          <div className="w-[400px] shrink-0 hidden lg:block h-full">
            <V2ChatPanel
              deal={deal}
              currentFocusedItem={currentFocusedItem}
              readinessScore={effectiveBreakdown.total}
            />
          </div>
        ) : null}
      </div>

      {/* D2 — Skip dialog */}
      <SkipDialog
        open={skipTarget !== null}
        item={skipTarget}
        onCancel={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />
    </div>
  );
}

/** Minimal header for empty/creator steps — just brand + V1/V2 toggle */
function MinimalHeader() {
  // Lazy: delegate to DealHeader with a placeholder deal — but empty state
  // shouldn't leak deal info. For V1 step 1-2, hide the deal meta strip.
  // Implementing as a stripped-down bar:
  return (
    <header
      className="w-full"
      style={{
        background: "var(--theme-header-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <div className="max-w-[1584px] mx-auto px-6 md:px-8 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block">
            <WestpacWordmark />
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--theme-text-primary)" }}
          >
            BizEdge
          </span>
        </div>
      </div>
    </header>
  );
}

// Inline wordmark to avoid circular import with DealHeader
function WestpacWordmark() {
  return (
    <img
      src="/westpac-logo.png"
      alt="Westpac"
      width={40}
      height={22}
      style={{ height: "22px", width: "40px", objectFit: "contain" }}
    />
  );
}

/** V1 focused single-item view with show-all affordance at bottom */
function FocusedView({
  item,
  total,
  index,
  onComplete,
  onRequestSkip,
  onShowAll,
}: {
  item: CI;
  total: number;
  index: number;
  onComplete: (item: CI) => void;
  onRequestSkip: (item: CI) => void;
  onShowAll: () => void;
}) {
  return (
    <div>
      <V1FocusedCard
        item={item}
        index={index}
        total={total}
        phaseLabel="Identification"
        onComplete={onComplete}
        onRequestSkip={onRequestSkip}
      />

      <div className="mt-6 flex items-center justify-center gap-2">
        <span
          className="text-[12px]"
          style={{ color: "var(--theme-text-tertiary)" }}
        >
          Guided mode
        </span>
        <span style={{ color: "var(--theme-text-tertiary)" }}>·</span>
        <button
          type="button"
          onClick={onShowAll}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium"
          style={{ color: "var(--theme-primary)" }}
        >
          <LayoutList size={12} strokeWidth={2.2} />
          Show all {total} items
          <ArrowRight size={12} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

/** V1 show-all flat list view — D4 progressive disclosure */
function ShowAllView({
  visibleItems,
  currentPhaseItems,
  ownerFilter,
  setOwnerFilter,
  ownerCounts,
  onReturn,
  selectedItemId,
  onSelectItem,
  onRequestSkip,
}: {
  visibleItems: CI[];
  currentPhaseItems: CI[];
  ownerFilter: OF;
  setOwnerFilter: (v: OF) => void;
  ownerCounts: Record<OF, number>;
  onReturn: () => void;
  selectedItemId: string | null;
  onSelectItem: (item: CI) => void;
  onRequestSkip: (item: CI) => void;
}) {
  return (
    <div className="max-w-[960px] mx-auto">
      <button
        type="button"
        onClick={onReturn}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-4"
        style={{ color: "var(--theme-primary)" }}
      >
        <ArrowLeft size={12} strokeWidth={2.2} />
        Return to guided mode
      </button>

      <div className="flex items-end justify-between gap-4 flex-wrap mb-4 pb-4"
        style={{ borderBottom: "1px solid var(--theme-border-subtle)" }}>
        <h2
          className="text-[18px] font-semibold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Identification phase — all items
        </h2>
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
              selected={selectedItemId === item.id}
              onSelect={onSelectItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
