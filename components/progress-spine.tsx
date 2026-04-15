"use client";

/**
 * D5 — Progress spine as guided workflow surface.
 * Horizontal phase row. Current phase is visually emphasised (Blue 60 bar).
 * Hover each phase for the phase description.
 */
import type { Phase } from "@/lib/types";
import { PHASES } from "@/data/deal-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";

interface Props {
  currentPhase: Phase;
}

export function ProgressSpine({ currentPhase }: Props) {
  const currentOrder = PHASES.find((p) => p.id === currentPhase)?.order ?? 1;

  return (
    <nav
      aria-label="Deal lifecycle phases"
      className="w-full border-y"
      style={{
        background: "var(--theme-spine-bg)",
        borderColor: "var(--theme-border)",
      }}
    >
      <ol className="flex items-stretch max-w-[1584px] mx-auto">
        {PHASES.map((phase, idx) => {
          const isCurrent = phase.id === currentPhase;
          const isComplete = phase.order < currentOrder;
          const isFuture = phase.order > currentOrder;
          return (
            <li key={phase.id} className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`relative flex items-center gap-3 px-4 py-3.5 h-full cursor-help transition-colors ${
                      isCurrent
                        ? "bg-white"
                        : isComplete
                          ? "hover:brightness-95"
                          : "hover:brightness-95 opacity-70"
                    }`}
                    style={{
                      borderLeft: idx === 0 ? "none" : "1px solid #e0e0e0",
                    }}
                  >
                    {/* Step number or check */}
                    <div
                      className="flex items-center justify-center w-6 h-6 text-[11px] font-medium shrink-0"
                      style={{
                        backgroundColor: isCurrent
                          ? "var(--theme-spine-bar)"
                          : isComplete
                            ? "#24a148"
                            : "var(--theme-card-bg)",
                        color: isCurrent || isComplete ? "#ffffff" : "var(--theme-text-tertiary)",
                        border: isFuture ? "1px solid var(--theme-border-strong)" : "none",
                        borderRadius: "var(--theme-radius)",
                      }}
                    >
                      {isComplete ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        phase.order
                      )}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div
                        className={`text-[13px] tracking-[0.16px] ${
                          isCurrent
                            ? "font-semibold text-[#161616]"
                            : "text-[#525252] font-normal"
                        }`}
                      >
                        {phase.label}
                      </div>
                      <div className="text-[10px] tracking-[0.32px] text-[#6f6f6f] uppercase">
                        Phase {phase.order} of {PHASES.length}
                      </div>
                    </div>

                    {/* Active phase bottom bar — Westpac signature red via theme var */}
                    {isCurrent ? (
                      <div
                        className="absolute left-0 right-0 bottom-0 h-[3px]"
                        style={{ background: "var(--theme-spine-bar)" }}
                      />
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px]" sideOffset={4}>
                  <div className="text-[11px] uppercase tracking-[0.5px] text-[#c6c6c6]">
                    {isCurrent
                      ? "Current phase"
                      : isComplete
                        ? "Complete"
                        : "Upcoming"}
                  </div>
                  <div className="font-semibold text-[13px] mt-0.5">
                    {phase.label}
                  </div>
                  <div className="text-[11px] text-[#c6c6c6] mt-1 leading-snug">
                    {phase.description}
                  </div>
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
