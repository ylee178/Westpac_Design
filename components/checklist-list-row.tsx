"use client";

/**
 * Master list row — dense, information-rich.
 * - Owner-coloured left border (banker maroon / system gray / customer amber)
 * - Visual weight distinguishes complete (muted) from incomplete (prominent)
 * - Subtitle slot under the label (e.g. "2 of 3 verified")
 * - Inline icons: ⓘ when knowledge exists, 🔒 when legally mandatory
 * - Provenance shown for completed system items
 */
import type { ChecklistItem as CI, Owner } from "@/lib/types";
import { OwnerBadge } from "@/components/owner-badge";
import { ProvenanceBadge } from "@/components/provenance-badge";
import {
  Check,
  Clock,
  Info,
  Scale,
  MinusCircle,
  Circle,
} from "lucide-react";

interface Props {
  item: CI;
  selected: boolean;
  onSelect: (item: CI) => void;
}

// Owner accent bars are decorative (3:1 not required for non-text),
// but we bump the system gray slightly so it reads as intentional
// rather than disabled.
const OWNER_BAR: Record<Owner, string> = {
  banker: "#7a1e3a",   // maroon
  system: "#6b6b6b",   // gray — same as text-tertiary, WCAG-safe
  customer: "#b45309", // amber
};

export function ChecklistListRow({ item, selected, onSelect }: Props) {
  const isComplete = item.status === "complete";
  const isSkipped = item.status === "skipped";
  const isInProgress = item.status === "in-progress";
  const isResolved = isComplete || isSkipped;

  const StatusIcon = isComplete
    ? Check
    : isSkipped
      ? MinusCircle
      : isInProgress
        ? Clock
        : Circle;

  const statusColor = isComplete
    ? "var(--theme-success)"
    : isSkipped
      ? "var(--theme-text-tertiary)"
      : isInProgress
        ? "var(--theme-primary)"
        : "var(--theme-text-tertiary)";

  const statusLabel = isComplete
    ? "Complete"
    : isSkipped
      ? "Skipped"
      : isInProgress
        ? "In progress"
        : "Pending";

  const hasKnowledge = Boolean(
    item.knowledge &&
      (item.knowledge.what || item.knowledge.why),
  );

  // Red flag: legally mandatory AND not yet resolved
  const riskHighlight =
    item.legallyMandatory && !isResolved;

  const rowBg = selected
    ? "var(--westpac-primary-soft)"
    : riskHighlight
      ? "var(--theme-error-soft)"
      : "var(--theme-card-bg)";

  // Complete items are visually subdued (muted text, lighter weight)
  const labelOpacity = isComplete || isSkipped ? 0.65 : 1;

  return (
    <li
      style={{
        borderBottom: "1px solid var(--theme-border)",
        background: rowBg,
        borderLeft: `3px solid ${OWNER_BAR[item.owner]}`,
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(item)}
        onMouseEnter={(e) => {
          if (!selected && !riskHighlight) {
            e.currentTarget.parentElement!.style.background =
              "var(--theme-row-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected && !riskHighlight) {
            e.currentTarget.parentElement!.style.background =
              "var(--theme-card-bg)";
          }
        }}
        className="w-full grid grid-cols-[1fr_auto] items-start gap-3 px-4 py-3 text-left transition-colors"
      >
        {/* Label column */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`${isResolved ? "text-[13px] font-normal" : "text-[13px] font-semibold"} leading-[1.3]`}
              style={{
                color: "var(--theme-text-primary)",
                opacity: labelOpacity,
                textDecoration: isSkipped ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>

            {/* Scale icon when legally mandatory */}
            {item.legallyMandatory && !isResolved ? (
              <Scale
                size={12}
                strokeWidth={2.25}
                aria-label="Legally mandatory"
                style={{ color: "var(--theme-error)" }}
              />
            ) : null}

            {/* Info icon when knowledge is available */}
            {hasKnowledge && !isResolved ? (
              <Info
                size={11}
                strokeWidth={2.2}
                style={{ color: "var(--theme-text-tertiary)" }}
              />
            ) : null}
          </div>

          {/* Subtitle (e.g. "2 of 3 verified") */}
          {item.subtitle && !isResolved ? (
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {item.subtitle}
            </div>
          ) : null}

          {/* Provenance for completed/in-progress items that were auto-filled */}
          {item.provenance && (isComplete || isInProgress) ? (
            <div className="mt-1">
              <ProvenanceBadge provenance={item.provenance} />
            </div>
          ) : null}

          <div className="flex items-center gap-2 mt-1.5">
            <OwnerBadge owner={item.owner} />
          </div>
        </div>

        {/* Status column — right aligned */}
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap pt-0.5"
          style={{ color: statusColor }}
        >
          <StatusIcon size={11} strokeWidth={2.5} />
          {statusLabel}
        </span>
      </button>
    </li>
  );
}
