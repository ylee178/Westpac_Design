"use client";

/**
 * V1 step 6 — Phase completion.
 * Shown when the current phase's items are all resolved. Quiet
 * celebration + next-phase placeholder card.
 */
import { Check, Sparkles } from "lucide-react";
import { PHASES } from "@/data/deal-data";
import type { Phase } from "@/lib/types";

interface Props {
  completedPhase: Phase;
  onRestart: () => void;
}

export function V1PhaseTransition({ completedPhase, onRestart }: Props) {
  const meta = PHASES.find((p) => p.id === completedPhase);
  const nextIdx = PHASES.findIndex((p) => p.id === completedPhase) + 1;
  const nextPhase = PHASES[nextIdx];

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[640px]">
        {/* Celebration card */}
        <div
          className="p-6 flex items-start gap-4 mb-5"
          style={{
            background: "#f0f9f2",
            border: "1px solid #bfe4c6",
            borderLeft: "3px solid #2e7d32",
            borderRadius: "var(--theme-radius-lg)",
          }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 shrink-0 animate-pulse"
            style={{ background: "#2e7d32", borderRadius: "50%" }}
          >
            <Check size={18} strokeWidth={3} color="white" />
          </div>
          <div>
            <div
              className="text-[10px] uppercase font-bold"
              style={{ color: "#2e7d32", letterSpacing: "0.5px" }}
            >
              Phase complete
            </div>
            <h2
              className="text-[20px] font-semibold leading-[1.25] mt-0.5"
              style={{ color: "var(--theme-text-primary)" }}
            >
              ✓ {meta?.label} phase complete
            </h2>
            <p
              className="text-[13px] mt-1 leading-[1.5]"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              All items resolved. Ready to Submit updated. The deal is ready
              to move into the next phase.
            </p>
          </div>
        </div>

        {/* Next phase placeholder */}
        {nextPhase ? (
          <div
            className="p-5"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px dashed var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <div
              className="text-[10px] uppercase font-semibold mb-1"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.5px",
              }}
            >
              Next phase
            </div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={14}
                strokeWidth={2.2}
                style={{ color: "var(--theme-primary)" }}
              />
              <h3
                className="text-[15px] font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {nextPhase.label}
              </h3>
            </div>
            <p
              className="text-[12px] mt-1"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              {nextPhase.description} — coming soon in the full build.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 h-10 px-4 text-[12px] font-medium transition-colors"
            style={{
              color: "var(--theme-text-secondary)",
              background: "var(--theme-card-bg)",
              border: "1px solid var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            Start a new deal
          </button>
        </div>
      </div>
    </main>
  );
}
