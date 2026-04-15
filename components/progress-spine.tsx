"use client";

/**
 * D5 — Progress spine as guided workflow surface.
 * All 5 phase tabs are always visible. Completed phases keep their
 * number label AND gain a green checkmark prefix — the banker should
 * always know where they came from. Future phases show the number
 * muted. Current phase gets the maroon underline + bold label.
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
  onPhaseChange?: (phase: Phase) => void;
}

export function ProgressSpine({ currentPhase, onPhaseChange }: Props) {
  const currentOrder = PHASES.find((p) => p.id === currentPhase)?.order ?? 1;

  return (
    <nav
      aria-label="Deal lifecycle phases"
      className="w-full"
      style={{
        background: "var(--theme-card-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <ol className="flex items-stretch max-w-[1584px] mx-auto px-6 md:px-8">
        {PHASES.map((phase) => {
          const isCurrent = phase.id === currentPhase;
          const isComplete = phase.order < currentOrder;
          const isFuture = phase.order > currentOrder;

          const labelColor = isCurrent
            ? "var(--theme-primary)"
            : isComplete
              ? "var(--theme-text-secondary)"
              : "var(--theme-text-tertiary)";

          const labelWeight = isCurrent ? 600 : isComplete ? 500 : 400;

          return (
            <li key={phase.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onPhaseChange?.(phase.id)}
                    disabled={isFuture}
                    className="relative flex items-center gap-2 h-12 px-4 transition-colors"
                    style={{
                      cursor:
                        isFuture || !onPhaseChange ? "help" : "pointer",
                      opacity: isFuture ? 0.55 : 1,
                    }}
                  >
                    {/* Left status ornament — checkmark for complete, pulse dot for current */}
                    {isComplete ? (
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 shrink-0"
                        style={{
                          background: "#2e7d32",
                          borderRadius: "50%",
                        }}
                      >
                        <Check size={9} strokeWidth={3} color="white" />
                      </span>
                    ) : isCurrent ? (
                      <span
                        className="inline-block w-2 h-2 shrink-0"
                        style={{
                          background: "var(--theme-primary)",
                          borderRadius: "50%",
                          animation: "pac-typing 1.4s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <span
                        className="inline-block w-2 h-2 shrink-0"
                        style={{
                          background: "var(--theme-border-strong)",
                          borderRadius: "50%",
                        }}
                      />
                    )}

                    {/* Number label — always visible */}
                    <span
                      className="text-[11px] tabular-nums"
                      style={{
                        color: "var(--theme-text-tertiary)",
                        fontFamily: "var(--theme-font-mono)",
                      }}
                    >
                      {String(phase.order).padStart(2, "0")}
                    </span>

                    {/* Phase name */}
                    <span
                      className="text-[13px]"
                      style={{
                        color: labelColor,
                        fontWeight: labelWeight,
                      }}
                    >
                      {phase.label}
                    </span>

                    {/* Active phase underline */}
                    {isCurrent ? (
                      <span
                        className="absolute left-3 right-3 bottom-0 h-[2px]"
                        style={{ background: "var(--theme-primary)" }}
                      />
                    ) : null}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px]" sideOffset={4}>
                  <div
                    className="text-[10px] uppercase font-medium mb-0.5"
                    style={{
                      color: "var(--theme-text-tertiary)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isCurrent
                      ? "Current"
                      : isComplete
                        ? "Complete — click to revisit"
                        : "Coming soon"}
                  </div>
                  <div className="font-semibold text-[13px]">{phase.label}</div>
                  <div className="text-[11px] mt-1 leading-snug opacity-80">
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
