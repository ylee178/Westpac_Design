"use client";

/**
 * D9 — Deal Confidence Score.
 * Meaningful: benchmark at current stage, specific red flag item,
 * actionable hint ("complete 3 banker items to reach ~85%").
 */
import type { ConfidenceBreakdown } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface Props {
  breakdown: ConfidenceBreakdown;
  hasRedFlag?: boolean;
  redFlagLabel?: string;
  redFlagSubtitle?: string;
  bankerActionCount?: number;
  projectedAfterActions?: number;
}

// Benchmark ranges per phase (rough rule-of-thumb for the demo)
const BENCHMARK_LO = 60;
const BENCHMARK_HI = 75;
const SUBMIT_THRESHOLD = 90;

function scoreTone(score: number, hasRedFlag: boolean) {
  if (hasRedFlag) {
    return { fg: "var(--theme-error)", label: "Red flag — review" };
  }
  if (score >= SUBMIT_THRESHOLD) {
    return { fg: "var(--theme-success)", label: "Ready to submit" };
  }
  if (score >= BENCHMARK_LO) {
    return { fg: "var(--theme-primary)", label: "On track" };
  }
  if (score >= 50) {
    return { fg: "var(--theme-text-secondary)", label: "Needs attention" };
  }
  return { fg: "var(--theme-error)", label: "Significant gaps" };
}

export function ConfidenceTooltip({
  breakdown,
  hasRedFlag = false,
  redFlagLabel,
  redFlagSubtitle,
  bankerActionCount = 0,
  projectedAfterActions,
}: Props) {
  const tone = scoreTone(breakdown.total, hasRedFlag);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex flex-col items-start gap-1 pl-4 pr-5 py-2.5 border transition-colors cursor-help text-left"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: hasRedFlag
              ? "var(--theme-error)"
              : "var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            borderLeftWidth: hasRedFlag ? "3px" : "1px",
          }}
        >
          {/* Top line: score + tone label */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col leading-tight">
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
            <div className="flex flex-col justify-center leading-tight py-0.5">
              <span
                className="text-[11px] font-semibold"
                style={{ color: tone.fg }}
              >
                {tone.label}
              </span>
              <span
                className="text-[10px] mt-0.5"
                style={{ color: "var(--theme-text-tertiary)" }}
              >
                Typical at this stage: {BENCHMARK_LO}–{BENCHMARK_HI}% · Submit: {SUBMIT_THRESHOLD}%+
              </span>
            </div>
          </div>

          {/* Red flag specific line */}
          {hasRedFlag && redFlagLabel ? (
            <div
              className="flex items-start gap-1.5 text-[11px] leading-[1.4] mt-1.5 pt-1.5 border-t w-full"
              style={{
                color: "var(--theme-error)",
                borderColor: "var(--theme-border)",
              }}
            >
              <AlertTriangle
                size={11}
                strokeWidth={2.5}
                className="shrink-0 mt-[1px]"
              />
              <span>
                <span className="font-semibold">1 red flag:</span>{" "}
                {redFlagLabel}
                {redFlagSubtitle ? (
                  <span
                    className="font-normal"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {" "}— {redFlagSubtitle}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}

          {/* Action hint */}
          {bankerActionCount > 0 && projectedAfterActions ? (
            <div
              className="flex items-center gap-1.5 text-[11px] leading-[1.4] mt-1"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              <TrendingUp size={11} strokeWidth={2.2} />
              Complete {bankerActionCount} banker item
              {bankerActionCount === 1 ? "" : "s"} to reach ~
              {projectedAfterActions}%
            </div>
          ) : null}
        </button>
      </TooltipTrigger>
      <TooltipContent className="w-[340px] p-0" sideOffset={6}>
        <div className="px-4 py-3 border-b border-[#393939]">
          <div className="text-[10px] uppercase font-medium opacity-60">
            Deal Confidence Score · D9
          </div>
          <div
            className="text-[30px] font-semibold tabular-nums leading-none mt-1"
            style={{ fontFamily: "var(--theme-font-mono)" }}
          >
            {breakdown.total}%
          </div>
          <div className="text-[11px] mt-1.5 leading-snug opacity-80">
            Weighted across four inputs — advisory only, not a hard block. A
            red flag on a legally mandatory item overrides the score.
          </div>
        </div>
        <div className="divide-y divide-[#393939]">
          <Row label="Checklist completion" value={breakdown.checklistCompletion} weight="40%" />
          <Row label="Skip reason quality" value={breakdown.skipQuality} weight="20%" />
          <Row label="Data provenance" value={breakdown.provenanceConfidence} weight="25%" />
          <Row label="Mode alignment" value={breakdown.modeAlignment} weight="15%" />
        </div>
        {hasRedFlag && redFlagLabel ? (
          <div className="px-4 py-2.5 text-[11px] leading-snug border-t border-[#fa4d56] text-[#fa4d56]">
            <strong>Red flag:</strong> {redFlagLabel}. Score cannot be trusted
            for submission until this legally mandatory item is resolved.
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
