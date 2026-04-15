"use client";

/**
 * D9 — Deal Confidence Score display with hover breakdown.
 * Renders the score in the deal header. Hover reveals the 4-input
 * weighted breakdown so bankers can inspect the calculation.
 */
import type { ConfidenceBreakdown } from "@/lib/types";
import { confidenceToColor } from "@/lib/confidence-calc";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp } from "lucide-react";

interface Props {
  breakdown: ConfidenceBreakdown;
  hasRedFlag?: boolean;
}

export function ConfidenceTooltip({ breakdown, hasRedFlag = false }: Props) {
  const color = confidenceToColor(breakdown.total);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="inline-flex items-center gap-3 px-4 py-2.5 border cursor-help transition-colors hover:brightness-95"
          style={{
            backgroundColor: color.bg,
            borderColor: color.fg + "55",
            color: color.fg,
          }}
        >
          <TrendingUp size={18} strokeWidth={2.2} />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-[0.5px] opacity-75">
              Deal confidence
            </span>
            <span
              className="text-[22px] font-light tabular-nums leading-none"
              style={{ fontFamily: "var(--font-plex-mono)" }}
            >
              {breakdown.total}%
            </span>
          </div>
          <div
            className="text-[11px] font-medium tracking-[0.32px] whitespace-nowrap"
            style={{ color: color.fg }}
          >
            {hasRedFlag ? "Override — red flag" : color.label}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent className="w-[340px] p-0" sideOffset={6}>
        <div className="px-4 py-3 border-b border-[#393939]">
          <div className="text-[11px] uppercase tracking-[0.5px] text-[#c6c6c6]">
            Deal Confidence Score
          </div>
          <div
            className="text-[32px] font-light tabular-nums leading-none mt-1"
            style={{ fontFamily: "var(--font-plex-mono)" }}
          >
            {breakdown.total}%
          </div>
          <div className="text-[11px] text-[#c6c6c6] mt-1.5 leading-snug">
            Weighted across four inputs — advisory only, not a hard block.
            Red flags on legally mandatory items override the score regardless.
          </div>
        </div>
        <div className="divide-y divide-[#393939]">
          <BreakdownRow
            label="Checklist completion"
            value={breakdown.checklistCompletion}
            weight="40%"
          />
          <BreakdownRow
            label="Skip reason quality"
            value={breakdown.skipQuality}
            weight="20%"
          />
          <BreakdownRow
            label="Data provenance"
            value={breakdown.provenanceConfidence}
            weight="25%"
          />
          <BreakdownRow
            label="Mode alignment"
            value={breakdown.modeAlignment}
            weight="15%"
          />
        </div>
        {hasRedFlag ? (
          <div
            className="px-4 py-2.5 text-[11px] leading-snug border-t border-[#fa4d56] bg-[#2d1a1c]"
            style={{ color: "#fa4d56" }}
          >
            <strong>Red flag override:</strong> a legally mandatory item is
            incomplete. The score cannot be trusted for submission until the
            flagged item is resolved or the skip is authorised by compliance.
          </div>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function BreakdownRow({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-[12px]">
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-[10px] text-[#c6c6c6] tracking-[0.32px]">
          weight {weight}
        </div>
      </div>
      <div
        className="tabular-nums text-[14px] font-light text-white"
        style={{ fontFamily: "var(--font-plex-mono)" }}
      >
        {value}%
      </div>
    </div>
  );
}
