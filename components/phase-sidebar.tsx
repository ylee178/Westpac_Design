"use client";

/**
 * Vertical phase spine + current-phase item list.
 *
 * Always visible on the left so the banker never loses spatial
 * context. D5 in its truest form — the progress spine is a
 * guided-workflow surface, not a one-shot header element that
 * disappears once the work starts.
 *
 * Layout (top to bottom):
 *   DEAL PROGRESS (label)
 *   5 phases as vertical rows:
 *     - ✓ Setup            3/3 complete
 *     - ● Identification   2/5 complete · mini bar
 *         ↳ expanded item list for the current phase
 *     - ○ Credit           0/3
 *     - ○ Approval         0/3
 *     - ○ Settlement       0/2
 */
import type {
  ChecklistItem as CI,
  ItemStatus,
  Owner,
  Phase,
} from "@/lib/types";
import type { DealState, PhaseSnapshot } from "@/lib/deal-state";
import { Check, Circle, Lock, Clock, MinusCircle } from "lucide-react";

interface Props {
  state: DealState;
  /** The phase the main area is currently showing (can be a future
   *  phase if the banker is previewing placeholders). */
  viewingPhase: Phase;
  /** The item that's in the main focused card (or null if showing all / preview). */
  focusedItemId: string | null;
  /** Fired when the banker clicks a phase row. */
  onSelectPhase: (phase: Phase) => void;
  /** Fired when the banker clicks an item inside the current phase. */
  onSelectItem: (item: CI) => void;
}

export function PhaseSidebar({
  state,
  viewingPhase,
  focusedItemId,
  onSelectPhase,
  onSelectItem,
}: Props) {
  return (
    <aside
      className="shrink-0 w-[280px] h-full overflow-y-auto"
      style={{
        background: "var(--theme-card-bg)",
        borderRight: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="px-5 pt-5 pb-3 text-[10px] uppercase font-semibold"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "1px",
        }}
      >
        Deal progress
      </div>

      <nav className="px-3 pb-6">
        {state.phases.map((p) => {
          const isCurrent = p.id === state.currentPhase.id;
          const isViewing = p.id === viewingPhase;
          const isComplete = p.status === "complete";
          const isFuture =
            !isComplete && !isCurrent && p.status === "not-started";
          const isExpanded = isViewing && p.items.length > 0;
          return (
            <PhaseRow
              key={p.id}
              phase={p}
              isCurrent={isCurrent}
              isViewing={isViewing}
              isComplete={isComplete}
              isFuture={isFuture}
              isExpanded={isExpanded}
              focusedItemId={focusedItemId}
              onSelectPhase={() => onSelectPhase(p.id)}
              onSelectItem={onSelectItem}
            />
          );
        })}
      </nav>
    </aside>
  );
}

// ——— Phase row ———

function PhaseRow({
  phase,
  isCurrent,
  isViewing,
  isComplete,
  isFuture,
  isExpanded,
  focusedItemId,
  onSelectPhase,
  onSelectItem,
}: {
  phase: PhaseSnapshot;
  isCurrent: boolean;
  isViewing: boolean;
  isComplete: boolean;
  isFuture: boolean;
  isExpanded: boolean;
  focusedItemId: string | null;
  onSelectPhase: () => void;
  onSelectItem: (item: CI) => void;
}) {
  const headerBg = isViewing
    ? "var(--westpac-primary-soft)"
    : "transparent";
  const headerBorder = isViewing
    ? "1px solid var(--westpac-primary-border)"
    : "1px solid transparent";

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onSelectPhase}
        className="w-full text-left px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-colors"
        style={{
          background: headerBg,
          border: headerBorder,
          borderRadius: "var(--theme-radius)",
        }}
      >
        <PhaseIcon
          isComplete={isComplete}
          isCurrent={isCurrent}
          isFuture={isFuture}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className="text-[9px] uppercase font-semibold tabular-nums"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.6px",
                fontFamily: "var(--theme-font-mono)",
              }}
            >
              {String(phase.order).padStart(2, "0")}
            </span>
            <span
              className="text-[10px] tabular-nums"
              style={{ color: "var(--theme-text-tertiary)" }}
            >
              {phase.total === 0 ? "—" : `${phase.complete}/${phase.total}`}
            </span>
          </div>
          <div
            className="text-[13px] leading-[1.25] mt-0.5"
            style={{
              color: isFuture
                ? "var(--theme-text-tertiary)"
                : "var(--theme-text-primary)",
              fontWeight: isCurrent ? 600 : 500,
            }}
          >
            {phase.label}
          </div>
          {phase.total > 0 ? (
            <MiniBar
              percent={phase.percent}
              isCurrent={isCurrent}
              isComplete={isComplete}
            />
          ) : null}
        </div>
      </button>

      {isExpanded ? (
        <ul className="pl-[38px] pr-3 pt-1 pb-2 space-y-0.5">
          {phase.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              focused={item.id === focusedItemId}
              onClick={() => onSelectItem(item)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

// ——— Phase status icon (left gutter) ———

function PhaseIcon({
  isComplete,
  isCurrent,
  isFuture,
}: {
  isComplete: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}) {
  if (isComplete) {
    return (
      <span
        className="inline-flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
        style={{ background: "#2e7d32", borderRadius: "50%" }}
      >
        <Check size={11} strokeWidth={3} color="white" />
      </span>
    );
  }
  if (isCurrent) {
    return (
      <span
        className="inline-flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
        style={{
          background: "var(--theme-primary)",
          borderRadius: "50%",
        }}
      >
        <span
          className="inline-block w-[6px] h-[6px]"
          style={{
            background: "#ffffff",
            borderRadius: "50%",
            animation: "pulse-dot 2.2s ease-in-out infinite",
          }}
        />
      </span>
    );
  }
  // future / not started
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
      style={{
        background: "transparent",
        border: `1.5px solid ${isFuture ? "#c7c7c7" : "var(--theme-border-strong)"}`,
        borderRadius: "50%",
      }}
    />
  );
}

// ——— Mini progress bar under the phase label ———

function MiniBar({
  percent,
  isCurrent,
  isComplete,
}: {
  percent: number;
  isCurrent: boolean;
  isComplete: boolean;
}) {
  const fill = isComplete
    ? "#2e7d32"
    : isCurrent
      ? "var(--theme-primary)"
      : "var(--theme-border-strong)";
  return (
    <div
      className="mt-1.5 h-[3px] w-full overflow-hidden"
      style={{ background: "var(--theme-border)", borderRadius: "2px" }}
      aria-hidden="true"
    >
      <div
        className="h-full transition-all"
        style={{
          width: `${percent}%`,
          background: fill,
          transition: "width 320ms ease",
        }}
      />
    </div>
  );
}

// ——— Item row inside the expanded current phase ———

function ItemRow({
  item,
  focused,
  onClick,
}: {
  item: CI;
  focused: boolean;
  onClick: () => void;
}) {
  const bg = focused ? "var(--westpac-primary-soft)" : "transparent";
  const color = itemColor(item);
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="interactive-row w-full text-left px-2.5 py-1.5 flex items-start gap-2 cursor-pointer"
        style={{
          background: bg,
          borderRadius: "var(--theme-radius)",
        }}
      >
        <ItemStatusIcon item={item} />
        <div className="flex-1 min-w-0">
          <div
            className="text-[11.5px] leading-[1.35] truncate"
            style={{
              color,
              fontWeight: focused ? 600 : 400,
            }}
          >
            {item.label}
          </div>
        </div>
        {item.legallyMandatory &&
        item.status !== "complete" &&
        item.status !== "skipped" ? (
          <Lock
            size={10}
            strokeWidth={2.5}
            style={{
              color: "var(--theme-text-tertiary)",
              marginTop: "3px",
            }}
          />
        ) : null}
      </button>
    </li>
  );
}

function itemColor(item: CI): string {
  if (item.status === "complete" || item.status === "skipped") {
    return "var(--theme-text-tertiary)";
  }
  return "var(--theme-text-primary)";
}

function ItemStatusIcon({ item }: { item: CI }) {
  const base = {
    width: 12,
    height: 12,
    marginTop: 2,
    flexShrink: 0,
  } as React.CSSProperties;

  if (item.status === "complete") {
    return (
      <span
        style={{
          ...base,
          background: "#2e7d32",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={8} strokeWidth={3.5} color="white" />
      </span>
    );
  }
  if (item.status === "skipped") {
    return (
      <MinusCircle
        size={12}
        strokeWidth={2.2}
        style={{
          ...base,
          color: "var(--theme-text-tertiary)",
        }}
      />
    );
  }
  if (item.status === "in-progress") {
    return (
      <Clock
        size={12}
        strokeWidth={2.4}
        style={{
          ...base,
          color: "var(--theme-primary)",
        }}
      />
    );
  }
  // pending
  return (
    <Circle
      size={12}
      strokeWidth={2}
      style={{
        ...base,
        color: "var(--theme-border-strong)",
      }}
    />
  );
}

// Mute unused import warning for Owner / ItemStatus since they may
// be consumed later if we add owner swatches to item rows.
type _Unused = Owner | ItemStatus;
