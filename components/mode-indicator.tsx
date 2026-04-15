"use client";

/**
 * D8 — Legacy ACIP vs Reform CDD mode indicator.
 * Quiet treatment: label + value in maroon primary, no pill chrome.
 */
import type { CDDMode } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LABEL: Record<CDDMode, string> = {
  "reform-cdd": "Reform CDD",
  "legacy-acip": "Legacy ACIP (transition)",
};

export function ModeIndicator({ mode }: { mode: CDDMode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="flex flex-col leading-tight text-left cursor-help"
        >
          <span
            className="text-[10px] uppercase font-medium"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.32px",
            }}
          >
            CDD mode
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--theme-primary)" }}
          >
            {LABEL[mode]}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px] p-3 space-y-2">
        <div className="text-[10px] uppercase opacity-60">AUSTRAC framework</div>
        <div className="font-semibold text-[13px]">
          {mode === "reform-cdd"
            ? "Reform CDD framework"
            : "Legacy ACIP (transition)"}
        </div>
        <p className="text-[12px] leading-[1.45] opacity-90">
          {mode === "reform-cdd"
            ? 'This deal runs under AUSTRAC\'s reform CDD framework (commenced 31 March 2026). Evidence must be established on "reasonable grounds"; senior muscle memory from pre-reform rules may be outdated.'
            : "This deal uses the pre-reform ACIP procedure, permitted for initial CDD until 31 March 2029. Ongoing CDD monitoring still runs under the reform framework."}
        </p>
        <p className="text-[11px] pt-1 border-t border-white/10 opacity-60">
          A single deal can span both frameworks (transition trap).
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
