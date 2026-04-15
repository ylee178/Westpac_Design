"use client";

/**
 * Main page — Westpac BizEdge deal workspace (redesigned).
 *
 * 3-zone layout once a deal has been committed:
 *   1. Masthead          — always visible
 *   2. Deal ribbon       — slim header bar with Ready to Submit
 *   3. Body split:
 *        LEFT  · PhaseSidebar  (vertical phase spine + item list)
 *        MAIN  · focused card | all-items list | phase placeholder
 *        RIGHT · V2ChatPanel   (optional, dev-panel toggled)
 *
 * Single source of truth: `computeDealState(library, deal)` derives
 * every value that the ribbon, sidebar, main area, and Pac panel
 * render from. Nothing is hardcoded; readiness and red-flag lists
 * recompute whenever an item changes status.
 */
import { useEffect, useMemo, useState } from "react";
import type { ChecklistItem as CI, Deal, Phase } from "@/lib/types";
import { INITIAL_CHECKLIST, SAMPLE_DEAL } from "@/data/deal-data";
import { computeDealState } from "@/lib/deal-state";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";

import { DealMasthead } from "@/components/deal-header";
import { DealRibbon } from "@/components/deal-ribbon";
import { PhaseSidebar } from "@/components/phase-sidebar";
import { PhasePlaceholder } from "@/components/phase-placeholder";
import { SkipDialog } from "@/components/skip-dialog";
import { V1EmptyState } from "@/components/v1-empty-state";
import { V1DealContextForm } from "@/components/v1-deal-context-form";
import { V1DynamicLoading } from "@/components/v1-dynamic-loading";
import { V1FocusedCard } from "@/components/v1-focused-card";
import { V2ChatPanel } from "@/components/v2-chat-panel";
import {
  ArrowLeft,
  Check,
  LayoutList,
  Sparkles,
} from "lucide-react";

export default function Page() {
  // ——— State ———
  const [baseDeal, setBaseDeal] = useState<Deal>(SAMPLE_DEAL);
  const [library, setLibrary] = useState<CI[]>(INITIAL_CHECKLIST);
  const [skipTarget, setSkipTarget] = useState<CI | null>(null);
  const [viewingPhase, setViewingPhase] = useState<Phase | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [showAllMode, setShowAllMode] = useState(false);

  const { product: demoProduct, entity: demoEntity, aiPanel, setProduct, setEntity } =
    useDevMode();
  const {
    step,
    setStep,
    draft,
    resetDraft,
    resetSignal,
  } = useFlowMode();

  // Reset everything when the dev panel fires a reset.
  useEffect(() => {
    if (resetSignal === 0) return;
    setLibrary(INITIAL_CHECKLIST);
    setBaseDeal(SAMPLE_DEAL);
    setSkipTarget(null);
    setViewingPhase(null);
    setFocusedItemId(null);
    setShowAllMode(false);
    setStep("empty");
    resetDraft();
    setProduct("bank-guarantee");
    setEntity("company");
  }, [resetSignal, resetDraft, setStep, setProduct, setEntity]);

  // Dev panel + empty-state card selector both write into `baseDeal`
  // through the draft object. Merge them into the effective deal.
  const deal: Deal = useMemo(
    () => ({
      ...baseDeal,
      product: (demoProduct as Deal["product"]) || baseDeal.product,
      entity: (demoEntity as Deal["entity"]) || baseDeal.entity,
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
  const state = useMemo(() => computeDealState(library, deal), [library, deal]);

  // Keep viewingPhase in sync with the real current phase unless the
  // banker has explicitly navigated to a future phase preview.
  useEffect(() => {
    if (step !== "focused") return;
    // First render (or after reset) — land on the current phase.
    if (viewingPhase === null) {
      setViewingPhase(state.currentPhase.id);
      return;
    }
    // If the viewed phase has completed, auto-advance to the new
    // current phase (smooth progression — no dead-end screen).
    const viewing = state.phases.find((p) => p.id === viewingPhase);
    if (viewing && viewing.status === "complete") {
      setViewingPhase(state.currentPhase.id);
    }
  }, [state, viewingPhase, step]);

  // Keep focusedItemId pointing at something real whenever the
  // viewing phase or library changes. Prefer the banker's existing
  // selection if it's still valid.
  useEffect(() => {
    if (step !== "focused" || !viewingPhase) return;
    const phaseSnap = state.phases.find((p) => p.id === viewingPhase);
    if (!phaseSnap) return;
    const currentSelection = phaseSnap.items.find((i) => i.id === focusedItemId);
    const isSelectionActionable =
      currentSelection &&
      currentSelection.status !== "complete" &&
      currentSelection.status !== "skipped";
    if (!isSelectionActionable) {
      const nextActionable = phaseSnap.items.find(
        (i) => i.status !== "complete" && i.status !== "skipped",
      );
      setFocusedItemId(nextActionable?.id ?? null);
    }
  }, [state, viewingPhase, focusedItemId, step]);

  // ——— Handlers ———
  function handleCompleteItem(item: CI) {
    setLibrary((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "complete" } : i)),
    );
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

  function handleSelectPhase(phase: Phase) {
    setViewingPhase(phase);
    setShowAllMode(false);
    // If the selected phase is the current actionable phase, reset
    // focused to its next actionable item; otherwise leave focus
    // alone (placeholder view doesn't use it).
    const phaseSnap = state.phases.find((p) => p.id === phase);
    if (phaseSnap && phase === state.currentPhase.id) {
      const next = phaseSnap.items.find(
        (i) => i.status !== "complete" && i.status !== "skipped",
      );
      setFocusedItemId(next?.id ?? phaseSnap.items[0]?.id ?? null);
    }
  }

  function handleSelectItem(item: CI) {
    setFocusedItemId(item.id);
    setShowAllMode(false);
  }

  // ——— Main area content ———
  const showMasthead = true;
  const showRibbon = step !== "empty" && step !== "creator";

  const mainContent = (() => {
    if (step === "empty") return <V1EmptyState />;
    if (step === "creator") return <V1DealContextForm />;
    if (step === "loading") return <V1DynamicLoading />;

    // focused step — pick one of: placeholder, show-all, or focused card
    if (!viewingPhase) return null;
    const phaseSnap = state.phases.find((p) => p.id === viewingPhase);
    if (!phaseSnap) return null;

    const isPreviewingFuturePhase =
      phaseSnap.id !== state.currentPhase.id &&
      phaseSnap.status === "not-started";

    if (isPreviewingFuturePhase) {
      return (
        <PhasePlaceholder
          phase={phaseSnap}
          currentPhase={state.currentPhase.id}
          onReturn={() => setViewingPhase(state.currentPhase.id)}
        />
      );
    }

    if (showAllMode) {
      return (
        <AllItemsView
          phaseLabel={phaseSnap.label}
          items={phaseSnap.items}
          focusedItemId={focusedItemId}
          onExit={() => setShowAllMode(false)}
          onSelectItem={(item) => {
            setFocusedItemId(item.id);
            setShowAllMode(false);
          }}
        />
      );
    }

    const focusedItem =
      phaseSnap.items.find((i) => i.id === focusedItemId) ?? null;

    // If the current phase has no actionable items left, show an
    // inline completion banner and the next-phase prompt.
    const unresolvedCount = phaseSnap.items.filter(
      (i) => i.status !== "complete" && i.status !== "skipped",
    ).length;
    const isCurrentPhase = phaseSnap.id === state.currentPhase.id;

    if (unresolvedCount === 0 && !isCurrentPhase) {
      // Looking back at a completed earlier phase — just show the
      // items as a read-only list via the all-items view.
      return (
        <AllItemsView
          phaseLabel={phaseSnap.label}
          items={phaseSnap.items}
          focusedItemId={null}
          onExit={() => setViewingPhase(state.currentPhase.id)}
          onSelectItem={() => {}}
          readOnly
        />
      );
    }

    if (!focusedItem) {
      // Nothing to show; sidebar will advance the banker.
      return (
        <div
          className="w-full max-w-[720px] mx-auto px-6 md:px-8 py-12 text-center text-[12px]"
          style={{ color: "var(--theme-text-tertiary)" }}
        >
          Select an item from the sidebar.
        </div>
      );
    }

    const phaseIndex = phaseSnap.items.findIndex((i) => i.id === focusedItem.id);
    const total = phaseSnap.items.length;

    return (
      <div className="w-full max-w-[720px] mx-auto px-6 md:px-8 py-6">
        <PhaseCompletionBanner phaseSnap={phaseSnap} />
        <V1FocusedCard
          item={focusedItem}
          index={phaseIndex < 0 ? 0 : phaseIndex}
          total={total}
          phaseLabel={phaseSnap.label}
          onComplete={handleCompleteItem}
          onRequestSkip={handleRequestSkip}
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <span
            className="text-[12px]"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            Focused mode
          </span>
          <span style={{ color: "var(--theme-text-tertiary)" }}>·</span>
          <button
            type="button"
            onClick={() => setShowAllMode(true)}
            className="interactive-link inline-flex items-center gap-1.5 text-[12px] font-medium cursor-pointer"
            style={{ color: "var(--theme-primary)" }}
          >
            <LayoutList size={12} strokeWidth={2.2} />
            Show all {total} items
          </button>
        </div>
      </div>
    );
  })();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Sticky header group: masthead → ribbon */}
      <div className="shrink-0">
        {showMasthead ? (
          <DealMasthead
            bankerName={deal.banker.name}
            bankerRole={deal.banker.role}
          />
        ) : null}
        {showRibbon ? <DealRibbon deal={deal} state={state} /> : null}
      </div>

      {/* Body: sidebar + main + optional pac panel */}
      <div className="flex-1 flex min-h-0">
        {showRibbon ? (
          <PhaseSidebar
            state={state}
            viewingPhase={viewingPhase ?? state.currentPhase.id}
            focusedItemId={focusedItemId}
            onSelectPhase={handleSelectPhase}
            onSelectItem={handleSelectItem}
          />
        ) : null}

        <main
          className="flex-1 min-w-0 overflow-y-auto flex flex-col"
          style={{ background: "var(--theme-page-bg)" }}
        >
          {mainContent}
        </main>

        {aiPanel && showRibbon ? (
          <div className="w-[360px] shrink-0 hidden lg:block h-full">
            <V2ChatPanel
              deal={deal}
              currentFocusedItem={
                focusedItemId
                  ? state.applicableItems.find((i) => i.id === focusedItemId) ?? null
                  : null
              }
              readinessScore={state.breakdown.total}
            />
          </div>
        ) : null}
      </div>

      <SkipDialog
        open={skipTarget !== null}
        item={skipTarget}
        onCancel={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />
    </div>
  );
}

// ——— Inline phase-completion banner ———
// Shown at the top of the main area when the current phase has
// just tipped to complete. No red, no dedicated celebration screen
// — just a quiet green note confirming the transition. The sidebar
// simultaneously animates the phase checkmark.
function PhaseCompletionBanner({
  phaseSnap,
}: {
  phaseSnap: { id: Phase; label: string; status: string };
}) {
  const [visible, setVisible] = useState(false);
  const [lastShownPhase, setLastShownPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (phaseSnap.status === "complete" && lastShownPhase !== phaseSnap.id) {
      setVisible(true);
      setLastShownPhase(phaseSnap.id);
      const t = setTimeout(() => setVisible(false), 3200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phaseSnap.status, phaseSnap.id, lastShownPhase]);

  if (!visible) return null;
  return (
    <div
      className="mb-4 px-4 py-2.5 flex items-center gap-2.5 animate-fade-in"
      style={{
        background: "#f0f9f2",
        border: "1px solid #bfe4c6",
        borderLeft: "3px solid #2e7d32",
        borderRadius: "var(--theme-radius-lg)",
      }}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 shrink-0"
        style={{ background: "#2e7d32", borderRadius: "50%" }}
      >
        <Check size={11} strokeWidth={3} color="white" />
      </span>
      <div>
        <div
          className="text-[10px] uppercase font-bold leading-none"
          style={{ color: "#2e7d32", letterSpacing: "0.5px" }}
        >
          Phase complete
        </div>
        <div
          className="text-[12px] leading-snug mt-0.5"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {phaseSnap.label} complete. Moving forward.
        </div>
      </div>
    </div>
  );
}

// ——— All-items view ———
// Flat list of every item in the current viewing phase, with owner
// badge and status. Click an item to drop back into focused mode.
function AllItemsView({
  phaseLabel,
  items,
  focusedItemId,
  onExit,
  onSelectItem,
  readOnly = false,
}: {
  phaseLabel: string;
  items: CI[];
  focusedItemId: string | null;
  onExit: () => void;
  onSelectItem: (item: CI) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="w-full max-w-[960px] mx-auto px-6 md:px-8 py-6">
      <button
        type="button"
        onClick={onExit}
        className="interactive-link inline-flex items-center gap-1.5 text-[12px] font-medium mb-4 cursor-pointer"
        style={{ color: "var(--theme-primary)" }}
      >
        <ArrowLeft size={12} strokeWidth={2.2} />
        {readOnly ? "Return to current phase" : "Return to focused mode"}
      </button>

      <div className="mb-4">
        <span className="brand-pill">{phaseLabel} phase</span>
        <h2
          className="text-[18px] font-semibold mt-2"
          style={{ color: "var(--theme-text-primary)" }}
        >
          All items ({items.length})
        </h2>
      </div>

      <div
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          overflow: "hidden",
        }}
      >
        <ul>
          {items.map((item) => (
            <AllItemsRow
              key={item.id}
              item={item}
              selected={item.id === focusedItemId}
              readOnly={readOnly}
              onClick={() => !readOnly && onSelectItem(item)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function AllItemsRow({
  item,
  selected,
  readOnly,
  onClick,
}: {
  item: CI;
  selected: boolean;
  readOnly: boolean;
  onClick: () => void;
}) {
  const isResolved = item.status === "complete" || item.status === "skipped";
  const statusLabel =
    item.status === "complete"
      ? "Complete"
      : item.status === "skipped"
        ? "Skipped"
        : item.status === "in-progress"
          ? "In progress"
          : "Pending";
  const statusColor =
    item.status === "complete"
      ? "#2e7d32"
      : item.status === "in-progress"
        ? "var(--theme-primary)"
        : "var(--theme-text-tertiary)";

  return (
    <li
      style={{
        borderBottom: "1px solid var(--theme-border)",
        background: selected ? "var(--westpac-primary-soft)" : "transparent",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={readOnly}
        className="interactive-row w-full grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left cursor-pointer disabled:cursor-default"
      >
        <div className="min-w-0">
          <div
            className="text-[13px] leading-[1.3]"
            style={{
              color: "var(--theme-text-primary)",
              opacity: isResolved ? 0.7 : 1,
              fontWeight: selected ? 600 : 500,
              textDecoration: item.status === "skipped" ? "line-through" : "none",
            }}
          >
            {item.label}
          </div>
          {item.subtitle && !isResolved ? (
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {item.subtitle}
            </div>
          ) : null}
        </div>
        <span
          className="text-[11px] font-medium whitespace-nowrap"
          style={{ color: statusColor }}
        >
          {statusLabel}
        </span>
      </button>
    </li>
  );
}
