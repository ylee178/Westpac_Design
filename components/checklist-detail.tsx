"use client";

/**
 * Detail panel for the master-detail split — shows the full picture
 * of the currently selected checklist item. Sticky on the right of
 * the main workspace. All D3+D6+D7 context is visible at once;
 * there's no accordion, no click-to-expand — the detail is the detail.
 */
import type { ChecklistItem as CI } from "@/lib/types";
import { OwnerBadge } from "@/components/owner-badge";
import { ProvenanceBadge } from "@/components/provenance-badge";
import {
  Check,
  Clock,
  Info,
  Lock,
  MinusCircle,
  Circle,
  SkipForward,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlowMode } from "@/lib/flow-mode-context";

interface Props {
  item: CI | null;
  onRequestSkip: (item: CI) => void;
}

export function ChecklistDetail({ item, onRequestSkip }: Props) {
  const { mode } = useFlowMode();
  const isV2 = mode === "v2";

  if (!item) {
    return (
      <aside
        className="sticky top-4 p-6 flex items-center justify-center text-center min-h-[420px]"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius)",
          color: "var(--theme-text-tertiary)",
        }}
      >
        <div>
          <Info
            size={20}
            strokeWidth={1.8}
            className="mx-auto mb-2 opacity-50"
          />
          <div className="text-[12px] font-medium">
            Select an item to see detail
          </div>
        </div>
      </aside>
    );
  }

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

  return (
    <aside
      className="sticky top-4 flex flex-col max-h-[calc(100vh-32px)] overflow-hidden"
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid var(--theme-border)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] uppercase font-medium"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            {item.category.replace("-", " ")}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium"
            style={{ color: statusColor }}
          >
            <StatusIcon size={11} strokeWidth={2.5} />
            {statusLabel}
          </span>
        </div>
        <h3
          className="text-[18px] leading-[1.3] font-semibold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {item.label}
        </h3>
        {item.subtitle ? (
          <div
            className="text-[12px] mt-1 font-medium"
            style={{ color: "var(--theme-primary)" }}
          >
            {item.subtitle}
          </div>
        ) : null}
        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          <OwnerBadge owner={item.owner} />
          {item.legallyMandatory ? (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "var(--theme-error)" }}
            >
              <Lock size={11} strokeWidth={2.5} />
              Legally mandatory
            </span>
          ) : null}
        </div>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Description */}
        <section>
          <SectionLabel>Description</SectionLabel>
          <p
            className="text-[13px] leading-[1.55] mt-1"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {item.description}
          </p>
        </section>

        {/* Skip reason if already skipped */}
        {item.skipReason ? (
          <section>
            <SectionLabel>Skip reason logged</SectionLabel>
            <div
              className="mt-1 p-3 text-[12px]"
              style={{
                background: "var(--theme-row-expanded)",
                border: "1px solid var(--theme-border)",
                borderLeftWidth: "2px",
                borderLeftColor: "var(--theme-text-tertiary)",
                color: "var(--theme-text-primary)",
              }}
            >
              <div className="font-medium skeleton-detail">
                {item.skipReason.category}
              </div>
              {item.skipReason.freeText ? (
                <div
                  className="mt-1 italic skeleton-detail"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  "{item.skipReason.freeText}"
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Provenance */}
        {item.provenance ? (
          <section>
            <SectionLabel>Data source (D6)</SectionLabel>
            <div className="mt-1">
              <ProvenanceBadge provenance={item.provenance} />
            </div>
          </section>
        ) : null}

        {/* V2 AI hint — only when version is v2 */}
        {isV2 && !item.skipReason ? (
          <section>
            <SectionLabel>AI teammate suggestion</SectionLabel>
            <div
              className="mt-1 p-3 text-[12px] leading-[1.55]"
              style={{
                background: "var(--westpac-primary-soft)",
                border: "1px solid var(--westpac-primary-border)",
                borderLeftWidth: "2px",
                borderLeftColor: "var(--theme-primary)",
                color: "var(--theme-text-primary)",
              }}
            >
              <div
                className="text-[10px] uppercase font-semibold mb-1"
                style={{
                  color: "var(--theme-primary)",
                  letterSpacing: "0.32px",
                }}
              >
                Contextual assist
              </div>
              <p className="text-[12px] leading-[1.55]">
                Based on this deal profile (bank guarantee · company),{" "}
                <strong className="font-semibold">
                  {item.category === "entity-verification"
                    ? "trust-structured companies commonly miss beneficial owner verification. Open ASIC extract for directors."
                    : item.category === "product-specific"
                      ? "performance guarantees require beneficiary + expiry alignment with the underlying contract. Template available."
                      : item.category === "risk"
                        ? "prior deals for Meridian flagged foreign-jurisdiction exposure. Suggest enhanced due diligence."
                        : "no specific risk patterns detected. Standard workflow applies."}
                </strong>
              </p>
            </div>
          </section>
        ) : null}

        {/* Knowledge — D3 always shown in detail panel, not gated */}
        <section>
          <SectionLabel>Why this matters (D3)</SectionLabel>
          <div className="mt-2 space-y-3">
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
        </section>
      </div>

      {/* Actions — footer */}
      {item.status !== "complete" && item.status !== "skipped" ? (
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ borderTop: "1px solid var(--theme-border)" }}
        >
          {item.legallyMandatory ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 h-9 px-4 text-[12px] font-medium border cursor-not-allowed"
                  style={{
                    background: "var(--theme-surface-subtle)",
                    color: "var(--theme-text-tertiary)",
                    borderColor: "var(--theme-border)",
                    borderRadius: "var(--theme-radius)",
                  }}
                >
                  <Lock size={12} strokeWidth={2.2} />
                  Cannot skip — legally mandatory
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px]">
                <div className="text-[11px] leading-snug">
                  AUSTRAC reform CDD prohibits skipping this step.
                  Compliance team authorisation required outside the platform.
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => onRequestSkip(item)}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-[12px] font-medium border transition-colors"
              style={{
                background: "var(--theme-card-bg)",
                color: "var(--theme-text-primary)",
                borderColor: "var(--theme-border-strong)",
                borderRadius: "var(--theme-radius)",
              }}
            >
              <SkipForward size={12} strokeWidth={2.2} />
              Skip with reason
            </button>
          )}
        </div>
      ) : null}
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] uppercase font-semibold"
      style={{
        color: "var(--theme-text-tertiary)",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </div>
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
    <div className="grid grid-cols-[56px_1fr] gap-3">
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
        className="text-[13px] leading-[1.55] skeleton-detail"
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
