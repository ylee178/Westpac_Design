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
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChecklistItem as CI, Deal, Phase } from "@/lib/types";
import { INITIAL_CHECKLIST, SAMPLE_DEAL } from "@/data/deal-data";
import { computeDealState } from "@/lib/deal-state";
import { useDevMode } from "@/lib/dev-mode-context";
import { useFlowMode } from "@/lib/flow-mode-context";

import { DealMasthead } from "@/components/deal-header";
import { DealRibbon } from "@/components/deal-ribbon";
import { PhaseSidebar } from "@/components/phase-sidebar";
import { SetupProgressSidebar } from "@/components/setup-progress-sidebar";
import { PhasePlaceholder } from "@/components/phase-placeholder";
import { PhaseItemStack } from "@/components/phase-item-stack";
import { PhaseCompleteToast } from "@/components/phase-complete-toast";
import { SubmitSuccess } from "@/components/submit-success";
import { SkipDialog } from "@/components/skip-dialog";
import { DealsDashboard } from "@/components/deals-dashboard";
import { V1EmptyState } from "@/components/v1-empty-state";
import { V1DealContextForm } from "@/components/v1-deal-context-form";
import { V1DynamicLoading } from "@/components/v1-dynamic-loading";
import { V2ChatPanel } from "@/components/v2-chat-panel";

export default function Page() {
  // ——— State ———
  const [baseDeal, setBaseDeal] = useState<Deal>(SAMPLE_DEAL);
  const [library, setLibrary] = useState<CI[]>(INITIAL_CHECKLIST);
  const [skipTarget, setSkipTarget] = useState<CI | null>(null);
  const [viewingPhase, setViewingPhase] = useState<Phase | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  /** Phase whose "just completed" toast is currently playing. */
  const [toastPhaseId, setToastPhaseId] = useState<Phase | null>(null);
  /** Previous phase statuses — used to detect the moment a phase
   *  flips to "complete" so the toast fires exactly once per flip. */
  const prevPhaseStatusRef = useRef<Map<Phase, string>>(new Map());

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
    setToastPhaseId(null);
    prevPhaseStatusRef.current = new Map();
    setStep("dashboard");
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

  // First land — drop the banker on the current phase when they
  // first enter the workspace.
  useEffect(() => {
    if (step !== "focused") return;
    if (viewingPhase === null) {
      setViewingPhase(state.currentPhase.id);
    }
  }, [step, viewingPhase, state.currentPhase.id]);

  // Phase-complete detection: when any phase flips from non-complete
  // to "complete", fire the toast. Tracked via a ref-backed map so
  // the toast fires once per transition and not on re-renders with
  // unchanged state.
  useEffect(() => {
    if (step !== "focused") return;
    const prev = prevPhaseStatusRef.current;
    let justCompleted: Phase | null = null;
    for (const p of state.phases) {
      const previous = prev.get(p.id);
      if (previous && previous !== "complete" && p.status === "complete") {
        justCompleted = p.id;
        break;
      }
    }
    // Always refresh the snapshot, even when no transition fired, so
    // we don't re-detect the same flip on subsequent renders.
    const next = new Map<Phase, string>();
    for (const p of state.phases) next.set(p.id, p.status);
    prevPhaseStatusRef.current = next;

    if (justCompleted && !toastPhaseId) {
      setToastPhaseId(justCompleted);
    }
  }, [state.phases, step, toastPhaseId]);

  function handleToastDone() {
    const justFinished = toastPhaseId;
    setToastPhaseId(null);
    // If the banker was viewing the phase that just completed,
    // auto-advance to the next actionable phase so the main area
    // smoothly moves forward.
    if (justFinished && viewingPhase === justFinished) {
      setViewingPhase(state.currentPhase.id);
    }
  }

  // Keep focusedItemId pointing at something real whenever the
  // viewing phase changes. We only re-pick when the current selection
  // has no match in the visible phase at all — a banker clicking a
  // completed item in the sidebar must stick, so completed-but-valid
  // selections are respected as deliberate edits.
  useEffect(() => {
    if (step !== "focused" || !viewingPhase) return;
    const phaseSnap = state.phases.find((p) => p.id === viewingPhase);
    if (!phaseSnap) return;
    const currentSelection = phaseSnap.items.find((i) => i.id === focusedItemId);
    if (currentSelection) return;
    const nextActionable = phaseSnap.items.find(
      (i) => i.status !== "complete" && i.status !== "skipped",
    );
    setFocusedItemId(nextActionable?.id ?? phaseSnap.items[0]?.id ?? null);
  }, [state, viewingPhase, focusedItemId, step]);

  // ——— Handlers ———
  function handleCompleteItem(item: CI) {
    setLibrary((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "complete" } : i)),
    );
    // Auto-advance focus to the next actionable item in the current
    // phase so the banker isn't left parked on a just-completed card.
    const phaseSnap = state.phases.find((p) => p.id === viewingPhase);
    if (!phaseSnap) return;
    const remaining = phaseSnap.items.find(
      (i) =>
        i.id !== item.id &&
        i.status !== "complete" &&
        i.status !== "skipped",
    );
    if (remaining) setFocusedItemId(remaining.id);
  }

  function handleRevertItem(item: CI) {
    setLibrary((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: "pending", skipReason: undefined }
          : i,
      ),
    );
    // Focus the just-reverted item so the banker can immediately
    // re-work it.
    setFocusedItemId(item.id);
  }

  function handleRequestSkip(item: CI) {
    setSkipTarget(item);
  }

  function handleSubmitDeal() {
    setStep("complete");
  }

  function handleStartNewDeal() {
    setLibrary(INITIAL_CHECKLIST);
    setBaseDeal(SAMPLE_DEAL);
    setSkipTarget(null);
    setViewingPhase(null);
    setFocusedItemId(null);
    setToastPhaseId(null);
    prevPhaseStatusRef.current = new Map();
    resetDraft();
    setStep("dashboard");
  }

  function handleNewDealFromHeader() {
    resetDraft();
    setStep("empty");
  }

  function handleOpenDealFromDashboard(_dealId: string) {
    void _dealId;
    // Prototype: any deal tile drops into the existing scripted
    // Meridian Logistics workspace so the demo has a single
    // end-to-end narrative.
    setStep("focused");
    setViewingPhase(null);
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
  }

  // ——— Main area content ———
  // Dashboard, loading, and complete steps take the full stage (no
  // sidebar/ribbon). Empty + creator steps still render the deal
  // progress sidebar with "Setup" highlighted so the banker can see
  // where they are in the overall journey.
  const isFullTakeoverStep =
    step === "dashboard" || step === "loading" || step === "complete";
  const isSetupStep = step === "empty" || step === "creator";
  const showMasthead = true;
  const showRibbon = !isFullTakeoverStep && !isSetupStep;
  const showSetupSidebar = isSetupStep;
  const showNewDealButton = step === "dashboard";

  // Submit is enabled once every phase has reached status "complete".
  const canSubmit = state.phases.every((p) => p.status === "complete");

  const mainContent = (() => {
    if (step === "dashboard") {
      return (
        <DealsDashboard
          bankerName={deal.banker.name}
          onOpenDeal={handleOpenDealFromDashboard}
          onNewDeal={handleNewDealFromHeader}
        />
      );
    }
    if (step === "empty") return <V1EmptyState />;
    if (step === "creator") return <V1DealContextForm />;
    if (step === "loading") return <V1DynamicLoading />;
    if (step === "complete") {
      return (
        <SubmitSuccess deal={deal} onStartNew={handleStartNewDeal} />
      );
    }

    // focused step — placeholder | completed phase list | item stack
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

    return (
      <PhaseItemStack
        phase={phaseSnap}
        focusedItemId={focusedItemId}
        onComplete={handleCompleteItem}
        onRequestSkip={handleRequestSkip}
        onRevert={handleRevertItem}
        onFocusItem={handleSelectItem}
        animationKey={phaseSnap.id}
      />
    );
  })();

  // Find the phase snapshot the toast should render for.
  const toastPhase = toastPhaseId
    ? state.phases.find((p) => p.id === toastPhaseId) ?? null
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Sticky header group: masthead → ribbon */}
      <div className="shrink-0">
        {showMasthead ? (
          <DealMasthead
            bankerName={deal.banker.name}
            bankerRole={deal.banker.role}
            showNewDeal={showNewDealButton}
            onNewDeal={handleNewDealFromHeader}
          />
        ) : null}
        {showRibbon ? <DealRibbon deal={deal} /> : null}
      </div>

      {/* Phase-complete toast — drops from the masthead, holds, then
          lifts. Non-blocking, fixed-position. */}
      {toastPhase ? (
        <PhaseCompleteToast
          key={toastPhase.id}
          phase={toastPhase}
          onDone={handleToastDone}
        />
      ) : null}

      {/* Body: sidebar + main + optional pac panel */}
      <div className="flex-1 flex min-h-0">
        {showRibbon ? (
          <PhaseSidebar
            state={state}
            viewingPhase={viewingPhase ?? state.currentPhase.id}
            focusedItemId={focusedItemId}
            onSelectPhase={handleSelectPhase}
            onSelectItem={handleSelectItem}
            canSubmit={canSubmit}
            onSubmit={handleSubmitDeal}
          />
        ) : showSetupSidebar ? (
          <SetupProgressSidebar />
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

