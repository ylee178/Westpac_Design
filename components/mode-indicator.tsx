"use client";

/**
 * D8 — Legacy ACIP vs Reform CDD mode indicator.
 * Persistent header element. Click/hover reveals the AUSTRAC transition context.
 */
import type { CDDMode } from "@/lib/types";
import { Scale } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CONFIG: Record<
  CDDMode,
  { label: string; shortLabel: string; bg: string; fg: string; border: string }
> = {
  "reform-cdd": {
    label: "Reform CDD",
    shortLabel: "Reform CDD",
    bg: "#edf5ff",
    fg: "#0043ce",
    border: "#a6c8ff",
  },
  "legacy-acip": {
    label: "Legacy ACIP (transition)",
    shortLabel: "Legacy ACIP",
    bg: "#fcf4d6",
    fg: "#8e6a00",
    border: "#f1c21b",
  },
};

export function ModeIndicator({ mode }: { mode: CDDMode }) {
  const c = CONFIG[mode];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border text-[12px] font-medium tracking-[0.32px] cursor-help transition-colors hover:brightness-95"
          style={{ backgroundColor: c.bg, color: c.fg, borderColor: c.border }}
        >
          <Scale size={13} strokeWidth={2.2} />
          <span className="text-[10px] uppercase tracking-[0.5px] opacity-70">CDD mode</span>
          <span>{c.label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px] space-y-2 p-3">
        <div className="text-[11px] uppercase tracking-[0.32px] text-[#c6c6c6]">
          AUSTRAC framework
        </div>
        <div className="font-semibold text-[13px]">
          {mode === "reform-cdd" ? "Reform CDD framework" : "Legacy ACIP (transition)"}
        </div>
        <p className="text-[12px] leading-[1.45]">
          {mode === "reform-cdd"
            ? "This deal runs under AUSTRAC's reform CDD framework (commenced 31 March 2026). Evidence must be established on \"reasonable grounds\"; senior muscle memory from pre-reform rules may be outdated."
            : "This deal uses the pre-reform ACIP procedure, permitted for initial CDD until 31 March 2029. Note: ongoing CDD monitoring still runs under the reform framework."}
        </p>
        <p className="text-[11px] text-[#c6c6c6] pt-1 border-t border-[#393939]">
          A single deal can span both frameworks (transition trap). Click to review the framework-selection reasoning.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
