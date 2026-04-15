"use client";

/**
 * D3 + D4 + D6 + D7 — Checklist item rendered as a dense table row.
 *
 * Quiet financial-UI treatment:
 *  - tight vertical padding, table-like 1px bottom border
 *  - subtle hover (#fafafa) instead of visible button styling
 *  - text-only status indicators (no loud pills)
 *  - legally mandatory items carry a subtle red-tinted row background
 *    (Confidence: bold · Risk: subtle highlight — per brand tone)
 *  - expanded body sits in a soft grey zone (#f9f9f9), not a card
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

  // Text-only status colors (no pills)
  const statusColor =
    item.status === "complete"
      ? "var(--theme-success)"
      : item.status === "skipped"
        ? "var(--theme-text-tertiary)"
        : item.status === "in-progress"
          ? "var(--theme-primary)"
          : "var(--theme-text-tertiary)";

  const statusLabel =
    item.status === "complete"
      ? "Complete"
      : item.status === "skipped"
        ? "Skipped"
        : item.status === "in-progress"
          ? "In progress"
          : "Pending";

  // Subtle red row bg when legally mandatory AND not yet resolved.
  const riskHighlight =
    item.legallyMandatory &&
    item.status !== "complete" &&
    item.status !== "skipped";

  return (
    <li
      className="group"
      style={{
        borderBottom: "1px solid var(--theme-border)",
        background: riskHighlight
          ? "var(--theme-error-soft)"
          : "var(--theme-card-bg)",
      }}
    >
      {/* Row header — table-like, tight */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        onMouseEnter={(e) => {
          if (!riskHighlight) {
            e.currentTarget.parentElement!.style.background =
              "var(--theme-row-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!riskHighlight) {
            e.currentTarget.parentElement!.style.background =
              "var(--theme-card-bg)";
          }
        }}
        className="w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-6 md:px-8 py-3 text-left transition-colors"
      >
        {/* 1. Expand affordance — minimal chevron */}
        <div
          className="shrink-0 transition-transform"
          style={{
            color: "var(--theme-text-tertiary)",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <ChevronRight size={14} strokeWidth={2.2} />
        </div>

        {/* 2. Label + provenance + skip reason inline */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[14px] font-medium"
              style={{
                color: "var(--theme-text-primary)",
                textDecoration:
                  item.status === "skipped" ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            {item.legallyMandatory ? (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-medium"
                style={{ color: "var(--theme-error)" }}
                title="Legally mandatory per AUSTRAC reform CDD"
              >
                <Lock size={10} strokeWidth={2.5} />
                Mandatory
              </span>
            ) : null}
          </div>
          {item.skipReason ? (
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              Skipped — {item.skipReason.category}
              {item.skipReason.freeText
                ? ` · "${item.skipReason.freeText}"`
                : ""}
            </div>
          ) : item.provenance ? (
            <div className="mt-0.5">
              <ProvenanceBadge provenance={item.provenance} />
            </div>
          ) : null}
        </div>

        {/* 3. Owner — subtle text, not pill */}
        <OwnerBadge owner={item.owner} />

        {/* 4. Phase indicator (mono-ish small text) */}
        <span
          className="text-[10px] uppercase font-medium tabular-nums hidden md:inline"
          style={{
            color: "var(--theme-text-tertiary)",
            letterSpacing: "0.32px",
          }}
        >
          {item.category.replace("-", " ")}
        </span>

        {/* 5. Status — text-only, right-aligned */}
        <span
          className="inline-flex items-center gap-1 text-[12px] font-medium justify-end min-w-[92px]"
          style={{ color: statusColor }}
        >
          <StatusIcon size={12} strokeWidth={2.5} />
          {statusLabel}
        </span>
      </button>

      {/* Expanded body — soft grey zone, not a card */}
      {expanded ? (
        <div
          className="px-6 md:px-8 pl-14 md:pl-16 py-4"
          style={{
            background: "var(--theme-row-expanded)",
            borderTop: "1px solid var(--theme-border-subtle)",
          }}
        >
          <p
            className="text-[13px] leading-[1.55] max-w-[760px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {item.description}
          </p>

          {/* Action row */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowKnowledge((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 h-7 px-0 text-[12px] font-medium transition-colors"
              style={{ color: "var(--theme-primary)" }}
            >
              <Info size={12} strokeWidth={2.2} />
              {showKnowledge ? "Hide details" : "Why is this required?"}
            </button>

            {item.status !== "complete" && item.status !== "skipped" ? (
              item.legallyMandatory ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="inline-flex items-center gap-1.5 h-7 px-0 text-[12px] font-medium cursor-not-allowed"
                      style={{ color: "var(--theme-text-tertiary)" }}
                    >
                      <Lock size={12} strokeWidth={2.2} />
                      Cannot skip
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[260px]">
                    <div className="text-[11px] leading-snug">
                      Cannot skip — legally mandatory per AUSTRAC reform CDD.
                      Compliance team authorisation required.
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestSkip(item);
                  }}
                  className="inline-flex items-center gap-1.5 h-7 px-0 text-[12px] font-medium transition-colors"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  <SkipForward size={12} strokeWidth={2.2} />
                  Skip with reason
                </button>
              )
            ) : null}
          </div>

          {/* Inline knowledge card — quiet panel, not a colorful card */}
          {showKnowledge ? (
            <div
              className="mt-4 p-4 max-w-[760px]"
              style={{
                background: "var(--theme-card-bg)",
                border: "1px solid var(--theme-border)",
                borderLeftWidth: "2px",
                borderLeftColor: "var(--theme-primary)",
                borderRadius:
                  "0 var(--theme-radius) var(--theme-radius) 0",
              }}
            >
              <div className="grid grid-cols-1 gap-3">
                <KnowledgeRow label="What" value={item.knowledge.what} />
                <KnowledgeRow label="Why" value={item.knowledge.why} />
                {item.knowledge.example ? (
                  <KnowledgeRow
                    label="Example"
                    value={item.knowledge.example}
                    italic
                  />
                ) : null}
                {item.knowledge.policyLink ? (
                  <div
                    className="text-[12px] pt-2 border-t"
                    style={{
                      color: "var(--theme-primary)",
                      borderColor: "var(--theme-border-subtle)",
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

function KnowledgeRow({
  label,
  value,
  italic = false,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3">
      <div
        className="text-[10px] uppercase font-medium pt-0.5"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.32px",
        }}
      >
        {label}
      </div>
      <div
        className="text-[13px] leading-[1.5]"
        style={{
          color: "var(--theme-text-primary)",
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {value}
      </div>
    </div>
  );
}
