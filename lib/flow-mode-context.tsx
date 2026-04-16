"use client";

/**
 * Flow mode state machine for the prototype.
 *
 * V1 progresses through a linear sequence:
 *   empty → creator → loading → focused → (showAll ⇄ focused) → complete
 *
 * V2 is a single mode (scripted chat) that runs alongside V1's
 * state — toggling V1/V2 in the header does NOT reset flow state,
 * so the same deal can be viewed in either mode at any point.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type V1Step =
  | "dashboard"    // Deals landing page — bento grid of the banker's deals
  | "empty"        // Card selectors for product/entity/jurisdiction
  | "creator"      // Customer + amount + description form
  | "loading"      // Dynamic checklist build animation
  | "focused"      // Single-item focused view
  | "showAll"      // D4 progressive disclosure toggle
  | "complete";    // Phase done / deal end state

export type TopMode = "v1" | "v2";

// Draft data captured during the empty/creator steps, promoted
// into the real deal once the banker clicks "Create Deal".
export interface DealDraft {
  product: string;
  entity: string;
  jurisdiction: string;
  /** Amount bucket id from the product-specific bands */
  amountBucket: string;
  /** Secondary axis — purpose / asset type / loan type, per product */
  purpose: string;
  customerName: string;
  amount: string;
  description: string;
}

interface FlowMode {
  mode: TopMode;
  setMode: (m: TopMode) => void;

  step: V1Step;
  setStep: (s: V1Step) => void;

  draft: DealDraft;
  setDraft: (d: Partial<DealDraft>) => void;
  resetDraft: () => void;

  focusedIndex: number;
  setFocusedIndex: Dispatch<SetStateAction<number>>;

  /** Number of setup lines the dynamic loading screen has confirmed
   *  as done. Shared so the left sidebar can tick off Setup sub-items
   *  in sync with the main area. 0 = none, 3 = all. */
  loadingDoneCount: number;
  setLoadingDoneCount: (n: number) => void;

  /** Incremented when the dev panel "Reset state" button is clicked.
   *  page.tsx watches this and resets the full library + flow step. */
  resetSignal: number;
  requestReset: () => void;
}

const EMPTY_DRAFT: DealDraft = {
  product: "",
  entity: "",
  jurisdiction: "",
  amountBucket: "",
  purpose: "",
  customerName: "",
  amount: "",
  description: "",
};

const FlowModeContext = createContext<FlowMode | null>(null);

export function FlowModeProvider({ children }: { children: ReactNode }) {
  // Always start at "dashboard" on a fresh page load — the banker
  // lands on their deals list before creating anything.
  const [mode, setMode] = useState<TopMode>("v1");
  const [step, setStep] = useState<V1Step>("dashboard");
  const [draftState, setDraftState] = useState<DealDraft>(EMPTY_DRAFT);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loadingDoneCount, setLoadingDoneCount] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  const setDraft = useCallback((patch: Partial<DealDraft>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraftState(EMPTY_DRAFT);
  }, []);

  const requestReset = useCallback(() => {
    setResetSignal((s) => s + 1);
  }, []);

  const value = useMemo<FlowMode>(
    () => ({
      mode,
      setMode,
      step,
      setStep,
      draft: draftState,
      setDraft,
      resetDraft,
      focusedIndex,
      setFocusedIndex,
      loadingDoneCount,
      setLoadingDoneCount,
      resetSignal,
      requestReset,
    }),
    [
      mode,
      step,
      draftState,
      setDraft,
      resetDraft,
      focusedIndex,
      loadingDoneCount,
      resetSignal,
      requestReset,
    ],
  );

  return (
    <FlowModeContext.Provider value={value}>
      {children}
    </FlowModeContext.Provider>
  );
}

export function useFlowMode(): FlowMode {
  const ctx = useContext(FlowModeContext);
  if (!ctx) {
    throw new Error("useFlowMode must be used within FlowModeProvider");
  }
  return ctx;
}
