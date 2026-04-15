"use client";

/**
 * D3 + D4 + D6 + D7 — Checklist item with progressive disclosure,
 * inline knowledge card, provenance, and owner badge.
 *
 * The row collapses by default (Carbon-tight). Click the row to expand (D4).
 * Inside the expanded area, an ⓘ toggle reveals the knowledge card (D3).
 * Provenance shows if the item has auto-filled data (D6). Owner badge is
 * always visible (D7).
 */
import { useState } from "react";
import type { ChecklistItem as CI } from "@/lib/types";
import { OwnerBadge } from "@/components/owner-badge";
import { ProvenanceBadge } from "@/components/provenance-badge";
import {
  Check,
  ChevronRight,
  Clock,
  Info,
  Lock,
  SkipForward,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  item: CI;
  onRequestSkip: (item: CI) => void;
}

export function ChecklistItemRow({ item, onRequestSkip }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);

  const StatusIcon =
    item.status === "complete"
      ? Check
      : item.status === "skipped"
        ? MinusCircle
        : item.status === "in-progress"
          ? Clock
          : ChevronRight;

  const statusColor =
    item.status === "complete"
      ? "#24a148"
      : item.status === "skipped"
        ? "#6f6f6f"
        : item.status === "in-progress"
          ? "#0f62fe"
          : "#8d8d8d";

  return (
    <li
      className="border-b border-[#e0e0e0] bg-white transition-colors"
      style={{
        opacity: item.status === "skipped" ? 0.6 : 1,
      }}
    >
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-[#f4f4f4] transition-colors"
      >
        <div
          className="flex items-center justify-center w-6 h-6 shrink-0 mt-0.5"
          style={{ color: statusColor }}
        >
          <StatusIcon size={18} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[14px] font-semibold text-[#161616] tracking-[0.16px] leading-[1.35]"
              style={{
                textDecoration: item.status === "skipped" ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            {item.legallyMandatory ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.5px] text-[#a2191f] bg-[#fff1f1] border border-[#ffd7d9] px-1.5 py-0.5">
                    <Lock size={10} strokeWidth={2.5} />
                    Legally mandatory
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px]">
                  <div className="text-[11px] leading-snug">
                    Cannot be skipped — legally mandatory per AUSTRAC reform CDD.
                    Exceptions require compliance team authorization outside the platform.
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <OwnerBadge owner={item.owner} />
            {item.provenance ? (
              <ProvenanceBadge provenance={item.provenance} />
            ) : null}
            {item.skipReason ? (
              <span className="text-[11px] text-[#525252] tracking-[0.16px] italic">
                Skipped: {item.skipReason.category}
                {item.skipReason.freeText ? ` — "${item.skipReason.freeText}"` : ""}
              </span>
            ) : null}
          </div>
        </div>
        <div
          className="shrink-0 text-[#6f6f6f] transition-transform"
          style={{
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <ChevronRight size={18} />
        </div>
      </button>

      {/* Expanded body — D4 progressive disclosure */}
      {expanded ? (
        <div className="px-5 pb-4 pt-1 ml-9 border-l border-[#e0e0e0]">
          <p className="text-[13px] text-[#525252] leading-[1.55] tracking-[0.16px] max-w-[680px]">
            {item.description}
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {/* D3 — knowledge card toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowKnowledge((v) => !v);
              }}
              className="h-8 rounded-[var(--theme-radius)] text-[12px] px-2 gap-1.5"
              style={{
                color: "var(--theme-accent-fg)",
                backgroundColor: "transparent",
              }}
            >
              <Info size={13} />
              {showKnowledge ? "Hide knowledge" : "Why is this required?"}
            </Button>

            {/* D2 — skip button (hard-lock for legally mandatory) */}
            {item.status !== "complete" && item.status !== "skipped" ? (
              item.legallyMandatory ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-8 rounded-none text-[12px] px-2 gap-1.5 cursor-not-allowed opacity-60"
                      >
                        <Lock size={13} />
                        Cannot skip — legally mandatory
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[260px]">
                    <div className="text-[11px] leading-snug">
                      Cannot skip — legally mandatory per AUSTRAC reform CDD.
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestSkip(item);
                  }}
                  className="h-8 rounded-none text-[12px] text-[#525252] hover:bg-[#e8e8e8] px-2 gap-1.5"
                >
                  <SkipForward size={13} />
                  Skip with reason
                </Button>
              )
            ) : null}
          </div>

          {/* D3 — inline knowledge card, expands inside the row */}
          {showKnowledge ? (
            <div
              className="mt-3 p-4 border-l-2 max-w-[680px]"
              style={{
                background: "var(--theme-surface-subtle)",
                borderLeftColor: "var(--theme-accent-fg)",
                borderRadius: "0 var(--theme-radius) var(--theme-radius) 0",
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.5px] font-semibold mb-2"
                style={{ color: "var(--theme-accent-fg)" }}
              >
                D3 · Inline knowledge
              </div>
              <div className="space-y-2.5 text-[13px] leading-[1.5] text-[#161616] tracking-[0.16px]">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#525252]">
                    What
                  </div>
                  <div>{item.knowledge.what}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#525252]">
                    Why
                  </div>
                  <div>{item.knowledge.why}</div>
                </div>
                {item.knowledge.example ? (
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#525252]">
                      Example
                    </div>
                    <div className="italic">{item.knowledge.example}</div>
                  </div>
                ) : null}
                {item.knowledge.policyLink ? (
                  <div
                    className="text-[12px] border-t pt-2"
                    style={{
                      color: "var(--theme-accent-fg)",
                      borderColor: "var(--theme-border)",
                    }}
                  >
                    → {item.knowledge.policyLink}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
