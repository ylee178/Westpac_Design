"use client";

/**
 * D9 — Deal Confidence Score.
 * Quiet-but-bold display: prominent mono numerical, subtle color,
 * no pill-chrome. Muted burgundy primary tone. Red flag only when
 * a legally mandatory item is incomplete.
 */
import type { ConfidenceBreakdown } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  breakdown: ConfidenceBreakdown;
  hasRedFlag?: boolean;
}

function scoreTone(score: number, hasRedFlag: boolean) {
  if (hasRedFlag) {
    return { fg: "var(--theme-error)", label: "Red flag — review" };
  }
  if (score >= 85) {
    return { fg: "var(--theme-success)", label: "Ready to submit" };
  }
  if (score >= 70) {
    return { fg: "var(--theme-primary)", label: "On track" };
  }
  if (score >= 50) {
    return { fg: "var(--theme-text-secondary)", label: "Needs attention" };
  }
  return { fg: "var(--theme-error)", label: "Significant gaps" };
}

export function ConfidenceTooltip({ breakdown, hasRedFlag = false }: Props) {
  const tone = scoreTone(breakdown.total, hasRedFlag);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-stretch gap-4 pl-4 pr-5 py-2.5 border transition-colors cursor-help"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <div className="flex flex-col items-start leading-tight py-0.5">
            <span
              className="text-[10px] uppercase font-medium"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.5px",
              }}
            >
              Deal Confidence
            </span>
            <span
              className="text-[30px] font-semibold tabular-nums leading-none mt-0.5"
              style={{
                color: tone.fg,
                fontFamily: "var(--theme-font-mono)",
                letterSpacing: "-0.5px",
              }}
            >
              {breakdown.total}
              <span
                className="text-[14px] font-medium ml-0.5"
                style={{ color: tone.fg, opacity: 0.7 }}
              >
                %
              </span>
            </span>
          </div>
          <div
            className="w-px self-stretch"
            style={{ background: "var(--theme-border)" }}
          />
          <div className="flex flex-col justify-center leading-tight">
            <span
              className="text-[11px] font-medium"
              style={{ color: tone.fg }}
            >
              {tone.label}
            </span>
            <span
              className="text-[10px] mt-0.5"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Hover for breakdown
            </span>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent className="w-[340px] p-0" sideOffset={6}>
        <div className="px-4 py-3 border-b border-[#393939]">
          <div className="text-[10px] uppercase font-medium opacity-60">
            Deal Confidence Score
          </div>
          <div
            className="text-[30px] font-semibold tabular-nums leading-none mt-1"
            style={{ fontFamily: "var(--theme-font-mono)" }}
          >
            {breakdown.total}%
          </div>
          <div className="text-[11px] mt-1.5 leading-snug opacity-80">
            Weighted across four inputs — advisory only, not a hard block.
            A red flag on a legally mandatory item overrides the score.
          </div>
        </div>
        <div className="divide-y divide-[#393939]">
          <Row label="Checklist completion" value={breakdown.checklistCompletion} weight="40%" />
          <Row label="Skip reason quality" value={breakdown.skipQuality} weight="20%" />
          <Row label="Data provenance" value={breakdown.provenanceConfidence} weight="25%" />
          <Row label="Mode alignment" value={breakdown.modeAlignment} weight="15%" />
        </div>
        {hasRedFlag ? (
          <div className="px-4 py-2.5 text-[11px] leading-snug border-t border-[#fa4d56] text-[#fa4d56]">
            <strong>Red flag:</strong> a legally mandatory item is incomplete.
            The score cannot be trusted for submission until the flagged item
            is resolved or the skip is authorised.
          </div>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

function Row({
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
        <div className="font-medium">{label}</div>
        <div className="text-[10px] opacity-60">weight {weight}</div>
      </div>
      <div
        className="tabular-nums text-[14px] font-medium"
        style={{ fontFamily: "var(--theme-font-mono)" }}
      >
        {value}%
      </div>
    </div>
  );
}
