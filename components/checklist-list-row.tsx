"use client";

/**
 * Compact clickable row for the master list in the master-detail split.
 * Label + owner + status only. Click to select; selected state gets a
 * subtle maroon left bar + tinted background. Legally mandatory items
 * in pending state carry a subtle red-tinted row background.
 */
import type { ChecklistItem as CI } from "@/lib/types";
import { OwnerBadge } from "@/components/owner-badge";
import { Check, Clock, Lock, MinusCircle, Circle } from "lucide-react";

interface Props {
  item: CI;
  selected: boolean;
  onSelect: (item: CI) => void;
}

export function ChecklistListRow({ item, selected, onSelect }: Props) {
  const StatusIcon =
    item.status === "complete"
      ? Check
      : item.status === "skipped"
        ? MinusCircle
        : item.status === "in-progress"
          ? Clock
          : Circle;

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

  const riskHighlight =
    item.legallyMandatory &&
    item.status !== "complete" &&
    item.status !== "skipped";

  const rowBg = selected
    ? "var(--westpac-primary-soft)"
    : riskHighlight
      ? "var(--theme-error-soft)"
      : "var(--theme-card-bg)";

  return (
    <li
      style={{
        borderBottom: "1px solid var(--theme-border)",
        background: rowBg,
        borderLeft: selected
          ? "3px solid var(--theme-primary)"
          : "3px solid transparent",
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
        className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        {/* Label + mandatory */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[13px] font-medium leading-[1.3] truncate"
              style={{
                color: "var(--theme-text-primary)",
                textDecoration:
                  item.status === "skipped" ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            {item.legallyMandatory ? (
              <Lock
                size={10}
                strokeWidth={2.5}
                style={{ color: "var(--theme-error)" }}
              />
            ) : null}
          </div>
          <div className="mt-0.5">
            <OwnerBadge owner={item.owner} />
          </div>
        </div>

        {/* Status — text+icon, right aligned */}
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap"
          style={{ color: statusColor }}
        >
          <StatusIcon size={11} strokeWidth={2.5} />
          {statusLabel}
        </span>
      </button>
    </li>
  );
}
