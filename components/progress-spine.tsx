"use client";

/**
 * D5 — Progress spine as guided workflow surface.
 * Quiet financial-UI treatment: inline phase tabs, subtle maroon
 * underline on the active phase, muted text otherwise. No big
 * circles, no bold colors — it sits below the deal header like
 * a secondary nav row.
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
          return (
            <li key={phase.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="relative flex items-center gap-2 h-11 px-4 cursor-help"
                    style={{
                      color: isCurrent
                        ? "var(--theme-primary)"
                        : "var(--theme-text-secondary)",
                    }}
                  >
                    <span
                      className="text-[11px] tabular-nums"
                      style={{
                        color: isCurrent
                          ? "var(--theme-primary)"
                          : "var(--theme-text-tertiary)",
                        fontFamily: "var(--theme-font-mono)",
                      }}
                    >
                      {isComplete ? (
                        <Check size={12} strokeWidth={2.5} style={{ color: "var(--theme-success)" }} />
                      ) : (
                        String(phase.order).padStart(2, "0")
                      )}
                    </span>
                    <span
                      className={`text-[13px] ${isCurrent ? "font-semibold" : "font-medium"}`}
                    >
                      {phase.label}
                    </span>

                    {/* Active phase underline — subtle maroon */}
                    {isCurrent ? (
                      <span
                        className="absolute left-3 right-3 bottom-0 h-[2px]"
                        style={{ background: "var(--theme-primary)" }}
                      />
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px]" sideOffset={4}>
                  <div
                    className="text-[10px] uppercase font-medium mb-0.5"
                    style={{
                      color: "var(--theme-text-tertiary)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isCurrent ? "Current" : isComplete ? "Complete" : "Upcoming"}
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
