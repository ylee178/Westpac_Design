"use client";

/**
 * Phase-complete toast — drops smoothly from above the masthead
 * when a phase flips to complete, holds for 1.2s, then smoothly
 * lifts back up. On exit it calls `onDone`, which page.tsx uses
 * to auto-advance the main area to the next phase.
 *
 * Timeline (driven by the `phase-toast` keyframe):
 *   400ms drop → 1200ms hold → 400ms lift  (total 2000ms)
 */
import { useEffect } from "react";
import type { PhaseSnapshot } from "@/lib/deal-state";
import { Check } from "lucide-react";

const TOAST_DURATION_MS = 1660;

interface Props {
  phase: PhaseSnapshot;
  onDone: () => void;
}

export function PhaseCompleteToast({ phase, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed left-1/2 z-40 flex items-center gap-3 px-4 py-3 shadow-lg pointer-events-none"
      style={{
        top: "70px",
        transform: "translateX(-50%)",
        background: "#f0f9f2",
        border: "1px solid #bfe4c6",
        borderLeft: "3px solid #2e7d32",
        borderRadius: "var(--theme-radius-lg)",
        minWidth: "360px",
        maxWidth: "520px",
        animation: `phase-toast ${TOAST_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
      }}
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-flex items-center justify-center w-7 h-7 shrink-0"
        style={{ background: "#2e7d32", borderRadius: "50%" }}
      >
        <Check size={14} strokeWidth={3} color="white" />
      </span>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase font-bold leading-none"
          style={{ color: "#2e7d32", letterSpacing: "0.6px" }}
        >
          Phase complete
        </div>
        <div
          className="text-[13px] font-semibold leading-snug mt-1"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {phase.label} — {phase.total} item{phase.total === 1 ? "" : "s"}{" "}
          resolved. Moving on.
        </div>
      </div>
    </div>
  );
}
