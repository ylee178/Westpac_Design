"use client";

/**
 * Phase item stack — vertical list of every item in the current
 * phase, with one item expanded (the "focused" item) and the rest
 * shown as compact status rows.
 *
 * Replaces the old single-item focused mode. After loading ends the
 * stack fades items in one-by-one (staggered) so the banker sees the
 * whole phase's workload taking shape, not just "item 1 of N".
 *
 * Interaction:
 *   - First pending item is auto-focused (expanded) by parent state.
 *   - Click any compact row to focus/expand that item.
 *   - Completing the focused item auto-advances to the next pending,
 *     and the completed item collapses to a muted ✓ row.
 *   - Skipped and complete rows are click-inert (read-only).
 */
import { useEffect, useRef } from "react";
import type { ChecklistItem as CI } from "@/lib/types";
import type { PhaseSnapshot } from "@/lib/deal-state";
import { V1FocusedCard } from "@/components/v1-focused-card";
import { Skeleton } from "@/components/skeleton";
import { Check, Circle, Cpu, Scale, MinusCircle, User, Users } from "lucide-react";

interface Props {
  phase: PhaseSnapshot;
  focusedItemId: string | null;
  onComplete: (item: CI) => void;
  onRequestSkip: (item: CI) => void;
  onRevert: (item: CI) => void;
  onFocusItem: (item: CI) => void;
  /** When this key changes, the stagger animation restarts. Use the
   *  phase id so entering a new phase replays the fade-in. */
  animationKey?: string;
  /** Id of an item currently playing its collapse animation. The
   *  wrapper for this id gets the `is-collapsing` class so the
   *  focused card smoothly shrinks before its state flips. */
  pendingResolveId?: string | null;
}

export function PhaseItemStack({
  phase,
  focusedItemId,
  onComplete,
  onRequestSkip,
  onRevert,
  onFocusItem,
  animationKey,
  pendingResolveId,
}: Props) {
  const items = phase.items;
  const orderPadded = phase.order.toString().padStart(2, "0");
  const focusedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusedItemId || !focusedRef.current) return;
    const t = setTimeout(() => {
      focusedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 460);
    return () => clearTimeout(t);
  }, [focusedItemId]);

  return (
    <div
      key={animationKey}
      className="w-full max-w-[760px] mx-auto px-6 md:px-8 py-6"
    >
      {/* Phase header — big title + subtext + counter */}
      <header
        className="mb-6"
        style={{
          opacity: 0,
          animation: "fade-in 360ms ease-out both",
        }}
      >
        <div
          className="text-[10px] uppercase font-semibold mb-2"
          style={{
            color: "var(--theme-text-tertiary)",
            letterSpacing: "0.6px",
          }}
        >
          Phase {orderPadded} of 05
        </div>
        <h1
          className="text-[28px] font-semibold leading-[1.2]"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {phase.label}
        </h1>
        <p
          className="text-[14px] leading-[1.55] mt-1.5 max-w-[620px]"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {phase.description}
        </p>
        <div
          className="text-[11px] font-semibold mt-3 tabular-nums"
          style={{ color: "var(--theme-text-tertiary)" }}
        >
          {phase.complete} of {phase.total} complete · {phase.percent}%
        </div>
      </header>

      <div className="flex flex-col">
        {items.map((item, i) => {
          const isFocused = item.id === focusedItemId;
          const isClosing = item.id === pendingResolveId;
          return (
            <div
              key={item.id}
              ref={isFocused ? focusedRef : undefined}
              className={`item-collapse ${i > 0 ? "mt-3" : ""} ${
                isClosing ? "is-collapsing" : ""
              }`}
            >
              <div
                style={{
                  opacity: 0,
                  animation: `fade-in 360ms ease-out ${150 + i * 120}ms forwards`,
                }}
              >
                {isFocused ? (
                  <V1FocusedCard
                    item={item}
                    index={i}
                    total={items.length}
                    phaseLabel={phase.label}
                    onComplete={onComplete}
                    onRequestSkip={onRequestSkip}
                    onRevert={onRevert}
                  />
                ) : (
                  <CompactRow
                    item={item}
                    index={i}
                    total={items.length}
                    onFocus={() => onFocusItem(item)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— Compact row ———

function CompactRow({
  item,
  index,
  total,
  onFocus,
}: {
  item: CI;
  index: number;
  total: number;
  onFocus: () => void;
}) {
  const isComplete = item.status === "complete";
  const isSkipped = item.status === "skipped";
  const isResolved = isComplete || isSkipped;

  const OwnerIcon =
    item.owner === "banker" ? User : item.owner === "system" ? Cpu : Users;
  const ownerLabel =
    item.owner === "banker"
      ? "Banker"
      : item.owner === "system"
        ? "System"
        : "Customer";

  const statusLabel = isComplete
    ? "Complete"
    : isSkipped
      ? "Skipped"
      : "Pending";

  const rowBg = isComplete
    ? "#f4faf5"
    : isSkipped
      ? "var(--theme-surface-subtle)"
      : "var(--theme-card-bg)";
  const titleOpacity = isResolved ? 0.7 : 1;
  const titleStrike = isSkipped ? "line-through" : "none";

  return (
    <button
      type="button"
      onClick={onFocus}
      className="interactive-row w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 cursor-pointer"
      style={{
        background: rowBg,
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius-lg)",
        transition: "background-color 220ms ease, border-color 220ms ease",
      }}
    >
      {/* Status glyph */}
      <StatusGlyph status={item.status} />

      {/* Title + meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] uppercase font-semibold tabular-nums"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Item {index + 1} / {total}
          </span>
          {item.legallyMandatory && !isResolved ? (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase"
              style={{
                color: "var(--theme-error)",
                letterSpacing: "0.5px",
              }}
            >
              <Scale size={10} strokeWidth={2.25} aria-label="Legally mandatory" />
              Mandatory
            </span>
          ) : null}
        </div>
        <div
          className="text-[14px] font-semibold leading-tight mt-0.5"
          style={{
            color: "var(--theme-text-primary)",
            opacity: titleOpacity,
            textDecoration: titleStrike,
          }}
        >
          {item.label}
        </div>
        {item.subtitle && !isResolved ? (
          <div
            className="text-[12px] mt-0.5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {item.subtitle}
          </div>
        ) : null}
      </div>

      {/* Owner + status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <OwnerIcon size={11} strokeWidth={2.2} />
          {ownerLabel}
        </span>
        <span
          className="text-[10px] uppercase font-semibold"
          style={{
            color: isComplete
              ? "#2e7d32"
              : isSkipped
                ? "var(--theme-text-tertiary)"
                : "var(--theme-text-tertiary)",
            letterSpacing: "0.5px",
          }}
        >
          {statusLabel}
        </span>
      </div>
    </button>
  );
}

function StatusGlyph({ status }: { status: CI["status"] }) {
  if (status === "complete") {
    return (
      <span
        className="inline-flex items-center justify-center w-6 h-6 shrink-0"
        style={{
          background: "#2e7d32",
          borderRadius: "50%",
          animation: "pop-in 260ms ease-out both",
        }}
      >
        <Check size={12} strokeWidth={3} color="white" />
      </span>
    );
  }
  if (status === "skipped") {
    return (
      <MinusCircle
        size={22}
        strokeWidth={2}
        style={{ color: "var(--theme-text-tertiary)" }}
      />
    );
  }
  return (
    <Circle
      size={22}
      strokeWidth={1.8}
      style={{ color: "var(--theme-text-tertiary)" }}
    />
  );
}

// ——— Phase transition skeleton ———

const SKEL_WIDTHS = ["65%", "55%", "48%", "60%", "52%"];

export function PhaseTransitionSkeleton({ count }: { count: number }) {
  const none = "none" as const;
  return (
    <div
      className="w-full max-w-[760px] mx-auto px-6 md:px-8 py-6"
      style={{
        opacity: 0,
        animation: "fade-in 360ms ease-out both",
      }}
    >
      <header className="mb-6">
        <Skeleton animation={none} variant="text" width="80px" height="10px" />
        <div className="mt-2">
          <Skeleton animation={none} variant="text" width="42%" height="26px" />
        </div>
        <div className="mt-2">
          <Skeleton animation={none} variant="text" width="58%" height="12px" />
        </div>
        <div className="mt-3">
          <Skeleton animation={none} variant="text" width="100px" height="10px" />
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full px-5 py-5"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid var(--theme-border)",
              borderRadius: "var(--theme-radius-lg)",
              opacity: 0,
              animation: `fade-in 360ms ease-out ${80 + i * 90}ms forwards`,
            }}
          >
            <Skeleton
              animation={none}
              variant="text"
              width={SKEL_WIDTHS[i % SKEL_WIDTHS.length]}
              height="13px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
