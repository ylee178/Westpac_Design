"use client";

/**
 * V1 step 4 — Focused single-item card.
 * The core V1 affordance. One item at a time, knowledge ALWAYS visible,
 * clean action buttons. Complete / Skip / Locked handling per item's
 * legallyMandatory flag. Slide-in/out on navigation.
 */
import type { ChecklistItem as CI } from "@/lib/types";
import { OwnerBadge } from "@/components/owner-badge";
import {
  ArrowRight,
  Check,
  Lock,
  SkipForward,
  User,
  Cpu,
  Users,
} from "lucide-react";

interface Props {
  item: CI;
  index: number;
  total: number;
  phaseLabel: string;
  onComplete: (item: CI) => void;
  onRequestSkip: (item: CI) => void;
}

export function V1FocusedCard({
  item,
  index,
  total,
  phaseLabel,
  onComplete,
  onRequestSkip,
}: Props) {
  const OwnerIcon =
    item.owner === "banker" ? User : item.owner === "system" ? Cpu : Users;
  const ownerLabel =
    item.owner === "banker"
      ? "Banker action"
      : item.owner === "system"
        ? "System automated"
        : "Customer-provided";

  return (
    <article
      className="mx-auto max-w-[720px] p-8"
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius-lg)",
      }}
    >
      {/* Header: counter + phase + owner */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div
          className="text-[11px] uppercase font-semibold tabular-nums"
          style={{
            color: "var(--theme-text-tertiary)",
            letterSpacing: "0.5px",
          }}
        >
          Item {index + 1} of {total}
        </div>
        <div
          className="text-[11px] uppercase font-semibold"
          style={{
            color: "var(--theme-primary)",
            letterSpacing: "0.5px",
          }}
        >
          {phaseLabel} phase
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {item.legallyMandatory ? (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold"
            style={{ color: "var(--theme-error)" }}
          >
            <Lock size={11} strokeWidth={2.5} />
            Legally mandatory
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            Optional — skip with reason
          </span>
        )}
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <OwnerIcon size={11} strokeWidth={2.2} />
          {ownerLabel}
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-[22px] font-semibold leading-[1.25]"
        style={{ color: "var(--theme-text-primary)" }}
      >
        {item.label}
      </h2>
      {item.subtitle ? (
        <div
          className="text-[13px] mt-1 font-medium"
          style={{ color: "var(--theme-primary)" }}
        >
          {item.subtitle}
        </div>
      ) : null}

      {/* Description */}
      <p
        className="text-[14px] leading-[1.6] mt-4"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        {item.description}
      </p>

      {/* Knowledge — always visible in guided mode (D3) */}
      <div
        className="mt-6 p-5"
        style={{
          background: "var(--theme-surface-subtle)",
          border: "1px solid var(--theme-border)",
          borderLeftWidth: "3px",
          borderLeftColor: "var(--theme-primary)",
          borderRadius: "var(--theme-radius)",
        }}
      >
        <div
          className="text-[10px] uppercase font-bold mb-3"
          style={{
            color: "var(--theme-primary)",
            letterSpacing: "0.6px",
          }}
        >
          Why this matters
        </div>

        <KnowledgeRow label="What" value={item.knowledge.what} />
        <KnowledgeRow label="Why" value={item.knowledge.why} />
        {item.knowledge.example ? (
          <KnowledgeRow
            label="For this deal"
            value={item.knowledge.example}
            italic
          />
        ) : null}

        {item.knowledge.policyLink ? (
          <div
            className="mt-3 pt-3 text-[12px] border-t"
            style={{
              color: "var(--theme-primary)",
              borderColor: "var(--theme-border-subtle)",
            }}
          >
            → {item.knowledge.policyLink}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => onComplete(item)}
          className="interactive-primary inline-flex items-center gap-2 h-11 px-5 text-[13px] font-semibold text-white cursor-pointer"
          style={{
            background: "var(--theme-primary)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <Check size={14} strokeWidth={2.8} />
          Mark as complete
        </button>

        {item.legallyMandatory ? (
          <div
            className="inline-flex items-center gap-1.5 text-[11px] px-3 h-11"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            <Lock size={11} strokeWidth={2.2} />
            This item is legally mandatory under AUSTRAC reform and cannot
            be skipped.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onRequestSkip(item)}
            className="interactive-pill inline-flex items-center gap-1.5 h-11 px-4 text-[12px] font-medium cursor-pointer"
            style={{
              color: "var(--theme-text-secondary)",
              background: "var(--theme-card-bg)",
              border: "1px solid var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <SkipForward size={12} strokeWidth={2.2} />
            Skip with reason
          </button>
        )}
      </div>
    </article>
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
    <div className="grid grid-cols-[88px_1fr] gap-3 py-2">
      <div
        className="text-[10px] uppercase font-semibold pt-0.5"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div
        className="text-[13px] leading-[1.6]"
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
