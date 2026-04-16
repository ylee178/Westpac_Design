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
import { useEffect, useRef } from "react";
import { readinessTier, deriveActionHint } from "@/lib/deal-state";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Circle,
  Hourglass,
  Scale,
  Clock,
  MinusCircle,
  Send,
} from "lucide-react";

const SUBMIT_THRESHOLD = 90;

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
  /** Enabled when every phase has tipped to complete. */
  canSubmit: boolean;
  /** Fires when the banker submits the deal from the sidebar card. */
  onSubmit: () => void;
}

export function PhaseSidebar({
  state,
  viewingPhase,
  focusedItemId,
  onSelectPhase,
  onSelectItem,
  canSubmit,
  onSubmit,
}: Props) {
  const viewingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewingRef.current) return;
    const t = setTimeout(() => {
      viewingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
    return () => clearTimeout(t);
  }, [viewingPhase]);

  return (
    <aside
      className="shrink-0 w-[280px] h-full flex flex-col"
      style={{
        background: "var(--theme-card-bg)",
        borderRight: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="px-5 pt-5 pb-3 text-[10px] uppercase font-semibold shrink-0"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "1px",
        }}
      >
        Deal progress
      </div>

      <nav className="px-3 pb-4 flex-1 min-h-0 overflow-y-auto">
        {state.phases.map((p, idx) => {
          const isCurrent = p.id === state.currentPhase.id;
          const isViewing = p.id === viewingPhase;
          const isComplete = p.status === "complete";
          const isFuture =
            !isComplete && !isCurrent && p.status === "not-started";
          const isExpanded = isViewing && p.items.length > 0;
          return (
            <div key={p.id} ref={isViewing ? viewingRef : undefined}>
            <PhaseRow
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
            </div>
          );
        })}
      </nav>

      <ReadyToSubmitCard
        state={state}
        canSubmit={canSubmit}
        onSubmit={onSubmit}
      />
    </aside>
  );
}

// ——— Ready to submit card ———

function ReadyToSubmitCard({
  state,
  canSubmit,
  onSubmit,
}: {
  state: DealState;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  const { breakdown, redFlags } = state;
  const tier = readinessTier(breakdown.total, redFlags.length > 0);
  const actionHint = deriveActionHint(state);
  const barFill = Math.min(100, Math.max(0, breakdown.total));
  const isBlocked = redFlags.length > 0;

  // Color scheme — number is always black; bar + tier label ride the
  // burgundy brand until target, then snap green. Red is reserved for
  // the blocked action hint only.
  const tierColor = canSubmit
    ? "#2e7d32"
    : isBlocked
      ? "#c62828"
      : "var(--theme-primary)";
  const barColor = canSubmit ? "#2e7d32" : "var(--theme-primary)";
  const HintIcon = isBlocked
    ? AlertTriangle
    : canSubmit
      ? CheckCircle2
      : Hourglass;
  const hintColor = isBlocked
    ? "#c62828"
    : canSubmit
      ? "#2e7d32"
      : "var(--theme-text-secondary)";

  return (
    <div
      className="shrink-0 px-4 pt-4 pb-5"
      style={{
        borderTop: "1px solid var(--theme-border)",
        background: "var(--theme-card-bg)",
      }}
    >
      <div
        className="p-3.5"
        style={{
          background: canSubmit
            ? "#f4faf5"
            : "var(--theme-surface-subtle, #fafafa)",
          border: `1px solid ${
            canSubmit ? "#d7ead9" : "var(--theme-border)"
          }`,
          borderRadius: "var(--theme-radius)",
        }}
      >
        <div
          className="text-[9.5px] uppercase font-semibold"
          style={{
            color: "var(--theme-text-tertiary)",
            letterSpacing: "0.6px",
          }}
        >
          Ready to submit
        </div>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span
            className="text-[30px] font-semibold tabular-nums leading-none"
            style={{
              color: "var(--theme-text-primary)",
              fontFamily: "var(--theme-font-mono)",
              letterSpacing: "-0.5px",
            }}
          >
            {breakdown.total}
            <span
              className="text-[14px] font-medium ml-0.5"
              style={{ opacity: 0.55 }}
            >
              %
            </span>
          </span>
        </div>
        <div
          className="text-[11px] font-semibold mt-0.5"
          style={{
            color: tierColor,
            transition: "color 320ms ease",
          }}
        >
          {tier.label}
        </div>

        <ReadinessBar
          percent={barFill}
          fillColor={barColor}
          threshold={SUBMIT_THRESHOLD}
        />

        {actionHint ? (
          <div
            className="mt-5 flex items-center gap-1.5 text-[10.5px] font-medium leading-snug"
            style={{ color: hintColor }}
          >
            <HintIcon size={11} strokeWidth={2.4} className="shrink-0" />
            <span>{actionHint}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={canSubmit ? onSubmit : undefined}
          disabled={!canSubmit}
          className="interactive-primary mt-3 w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[12px] font-semibold text-white cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? "#2e7d32" : "var(--theme-primary)",
            borderRadius: "var(--theme-radius)",
            opacity: canSubmit ? 1 : 0.38,
            transition: "background-color 320ms ease, opacity 320ms ease",
          }}
          title={
            canSubmit
              ? "Submit this deal for credit decisioning"
              : "Complete every phase to enable submission"
          }
        >
          <Send size={13} strokeWidth={2.6} />
          Submit deal
        </button>
      </div>
    </div>
  );
}

function ReadinessBar({
  percent,
  fillColor,
  threshold,
}: {
  percent: number;
  fillColor: string;
  threshold: number;
}) {
  return (
    <div className="mt-2.5 w-full">
      <div
        className="relative"
        style={{
          width: "100%",
          height: "6px",
          background: "var(--theme-border)",
          borderRadius: "3px",
        }}
        aria-hidden="true"
      >
        <div
          className="h-full"
          style={{
            width: `${percent}%`,
            background: fillColor,
            borderRadius: "3px",
            transition: "width 420ms ease, background-color 320ms ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${threshold}%`,
            top: "-2px",
            bottom: "-2px",
            width: "1.5px",
            background: "var(--theme-text-tertiary)",
            opacity: 0.7,
          }}
        />
      </div>
      {/* Target label — anchored to the threshold marker */}
      <div
        className="relative mt-1"
        style={{ height: "12px" }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            left: `${threshold}%`,
            transform: "translateX(-100%)",
            paddingRight: "4px",
            fontSize: "9px",
            letterSpacing: "0.4px",
            color: "var(--theme-text-tertiary)",
            fontWeight: 600,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            lineHeight: "12px",
            fontFamily: "var(--theme-font-mono)",
          }}
        >
          Target {threshold}%
        </div>
      </div>
    </div>
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
              className="text-[8px] uppercase font-semibold"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.5px",
              }}
            >
              Step {phase.order}
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
        className="interactive-row w-full text-left px-2.5 py-1.5 flex items-center gap-2 cursor-pointer"
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
          <Scale
            size={11}
            strokeWidth={2.25}
            aria-label="Legally mandatory"
            style={{ color: "var(--theme-text-tertiary)" }}
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
