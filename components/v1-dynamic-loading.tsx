"use client";

/**
 * V1 step 3 — Full-screen "system is building" narrative.
 *
 * This is NOT a generic loading spinner. It's a scripted reveal of
 * D1 (Dynamic Checklist Build): the banker watches the system
 * construct a deal-specific checklist and auto-verify the Setup
 * phase from trusted sources. ~6 seconds, center-takeover, no
 * sidebar or Pac panel — page.tsx hides them for this step.
 *
 * Beat structure (t = seconds):
 *   0.0  D1 badge + title fade in
 *   0.5  status line 1: "Linking customer record..."
 *   1.0  item 1 skeleton
 *   1.4  item 1 ✓
 *   1.5  status line 2: "Confirming product & entity..."
 *   1.8  item 2 skeleton
 *   2.2  item 2 ✓
 *   2.4  status line 3: "Running eligibility checks..."
 *   2.6  item 3 skeleton
 *   3.0  item 3 ✓
 *   3.2  status line 4: "✓ Setup complete"
 *   3.5  Ready to Submit 0 → 12% tick
 *   4.0  Green "Setup complete" banner slide-up
 *   5.6  Everything fade out
 *   6.0  advance to workspace (step → "focused")
 *
 * Changed in redesign:
 *   - Removed burgundy "Moving to Identification" bridge banner
 *     (it read as an alarm after the green banner and was
 *     redundant with the workspace sidebar).
 *   - Added big centered status line that rotates through beats
 *     so the screen feels like "AI is thinking" rather than a
 *     static page.
 */
import { useEffect, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { Check, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/skeleton";
import { productLabel } from "@/data/product-options";

const SETUP_ITEMS = [
  {
    label: "Link customer record",
    source: "Customer master",
    detail: "Sarah → Meridian Logistics Pty Ltd",
  },
  {
    label: "Confirm product and entity type",
    source: "BizEdge engine",
    detail: "Bank Guarantee · Company (Pty Ltd)",
  },
  {
    label: "Initial eligibility screen",
    source: "Risk engine",
    detail: "Trading ≥12 months · no losses · TCE ≤ $20M",
  },
];

function entityLabel(id: string): string {
  const map: Record<string, string> = {
    company: "Company",
    trust: "Trust",
    partnership: "Partnership",
    "sole-trader": "Sole Trader",
  };
  return map[id] ?? id;
}

type StatusLine = {
  text: string;
  tone: "thinking" | "complete";
};

const STATUS_LINES: { at: number; line: StatusLine }[] = [
  { at: 500, line: { text: "Linking customer record...", tone: "thinking" } },
  {
    at: 1500,
    line: { text: "Confirming product & entity...", tone: "thinking" },
  },
  {
    at: 2400,
    line: { text: "Running eligibility checks...", tone: "thinking" },
  },
  { at: 3200, line: { text: "Setup phase complete", tone: "complete" } },
];

export function V1DynamicLoading() {
  const { draft, setStep } = useFlowMode();
  const [revealCount, setRevealCount] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);
  const [statusIndex, setStatusIndex] = useState(-1);
  const [showBanner, setShowBanner] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Status rotator
    STATUS_LINES.forEach(({ at }, i) => {
      timers.push(setTimeout(() => setStatusIndex(i), at));
    });

    // Item skeleton/resolve cadence
    timers.push(setTimeout(() => setRevealCount(0.5), 1000));
    timers.push(setTimeout(() => setRevealCount(1), 1400));
    timers.push(setTimeout(() => setRevealCount(1.5), 1800));
    timers.push(setTimeout(() => setRevealCount(2), 2200));
    timers.push(setTimeout(() => setRevealCount(2.5), 2600));
    timers.push(setTimeout(() => setRevealCount(3), 3000));

    // Ready to Submit tick 0 → 12
    timers.push(
      setTimeout(() => {
        const start = Date.now();
        const duration = 450;
        const end = 12;
        const frame = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(1, elapsed / duration);
          setReadinessScore(Math.round(end * progress));
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }, 3500),
    );

    // Green completion banner
    timers.push(setTimeout(() => setShowBanner(true), 4000));

    // Fade everything out before handing off
    timers.push(setTimeout(() => setFadingOut(true), 5600));
    // Advance to workspace
    timers.push(setTimeout(() => setStep("focused"), 6000));

    return () => timers.forEach(clearTimeout);
  }, [setStep]);

  const currentStatus =
    statusIndex >= 0 ? STATUS_LINES[statusIndex].line : null;

  return (
    <main
      className="flex-1 flex items-center justify-center py-12 px-6"
      style={{
        background: "var(--theme-page-bg)",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 360ms ease-out",
      }}
    >
      <div className="w-full max-w-[640px] flex flex-col items-center text-center">
        {/* Big pulsing sparkles — "AI thinking" anchor */}
        <div
          className="mb-5"
          style={{
            opacity: 0,
            animation: "fade-in 400ms ease-out 100ms forwards",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14"
            style={{
              background: "var(--westpac-primary-soft)",
              border: "1px solid var(--westpac-primary-border)",
              borderRadius: "50%",
              animation: "pulse-dot 1600ms ease-in-out infinite",
            }}
          >
            <Sparkles
              size={22}
              strokeWidth={2.2}
              style={{ color: "var(--theme-primary)" }}
            />
          </div>
        </div>

        {/* D1 badge */}
        <div
          className="flex items-center gap-1.5 mb-2"
          style={{
            opacity: 0,
            animation: "fade-in 320ms ease-out 220ms forwards",
          }}
        >
          <span
            className="text-[10px] uppercase font-semibold"
            style={{
              color: "var(--theme-primary)",
              letterSpacing: "0.6px",
            }}
          >
            D1 · Dynamic checklist build
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-[22px] font-semibold leading-[1.25]"
          style={{
            color: "var(--theme-text-primary)",
            opacity: 0,
            animation: "fade-in 400ms ease-out 400ms forwards",
          }}
        >
          Building your checklist for{" "}
          <span style={{ color: "var(--theme-primary)" }}>
            {productLabel(draft.product) || "this deal"}
            {draft.entity ? ` × ${entityLabel(draft.entity)}` : ""}
            {draft.jurisdiction ? ` × ${draft.jurisdiction}` : ""}
          </span>
        </h1>

        {/* Big status rotator — the "AI is thinking" line */}
        <div
          className="mt-4 min-h-[22px] flex items-center justify-center"
          aria-live="polite"
        >
          {currentStatus ? (
            <span
              key={statusIndex}
              className="inline-flex items-center gap-2 text-[14px] font-medium"
              style={{
                color:
                  currentStatus.tone === "complete"
                    ? "#2e7d32"
                    : "var(--theme-text-secondary)",
                animation: "fade-in 320ms ease-out both",
              }}
            >
              {currentStatus.tone === "complete" ? (
                <Check size={14} strokeWidth={2.8} />
              ) : (
                <span
                  className="inline-block w-1.5 h-1.5"
                  style={{
                    background: "var(--theme-primary)",
                    borderRadius: "50%",
                    animation: "pulse-dot 1000ms ease-in-out infinite",
                  }}
                />
              )}
              {currentStatus.text}
            </span>
          ) : null}
        </div>

        {/* Setup items — supporting element */}
        <div
          className="mt-6 w-full divide-y text-left"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            overflow: "hidden",
            opacity: 0,
            animation: "fade-in 400ms ease-out 600ms forwards",
          }}
        >
          {SETUP_ITEMS.map((item, i) => {
            const state =
              revealCount >= i + 1
                ? "resolved"
                : revealCount >= i + 0.5
                  ? "skeleton"
                  : "hidden";
            return (
              <SetupItemRow key={item.label} item={item} state={state} />
            );
          })}
        </div>

        {/* Readiness tick */}
        {readinessScore > 0 ? (
          <div
            className="mt-3 flex items-center justify-center gap-2 text-[11px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Ready to Submit:{" "}
            <span
              className="font-semibold tabular-nums"
              style={{
                color: "var(--theme-primary)",
                fontFamily: "var(--theme-font-mono)",
                fontSize: "14px",
              }}
            >
              {readinessScore}%
            </span>
          </div>
        ) : null}

        {/* Green completion banner */}
        {showBanner ? (
          <div
            className="mt-5 w-full"
            style={{
              opacity: 0,
              animation: "slide-up-in 450ms ease-out forwards",
            }}
          >
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: "#f0f9f2",
                border: "1px solid #bfe4c6",
                borderLeft: "3px solid #2e7d32",
                borderRadius: "var(--theme-radius)",
              }}
            >
              <div
                className="flex items-center justify-center w-6 h-6 shrink-0"
                style={{ background: "#2e7d32", borderRadius: "50%" }}
              >
                <Check size={13} strokeWidth={3} color="white" />
              </div>
              <div
                className="text-[13px] font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Setup complete — 3 items auto-verified by system
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

type RowState = "hidden" | "skeleton" | "resolved";

function SetupItemRow({
  item,
  state,
}: {
  item: (typeof SETUP_ITEMS)[number];
  state: RowState;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        minHeight: "54px",
      }}
    >
      {state === "resolved" ? (
        <div
          className="flex items-center justify-center w-6 h-6 shrink-0"
          style={{
            background: "#2e7d32",
            borderRadius: "50%",
            animation: "pop-in 280ms ease-out both",
          }}
        >
          <Check size={12} strokeWidth={3} color="white" />
        </div>
      ) : state === "skeleton" ? (
        <Skeleton variant="circle" width={24} height={24} />
      ) : (
        <div style={{ width: 24, height: 24 }} />
      )}
      <div className="min-w-0 flex-1">
        {state === "resolved" ? (
          <div style={{ animation: "fade-in 280ms ease-out both" }}>
            <div
              className="text-[13px] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {item.label}
            </div>
            <div
              className="text-[11px] mt-0.5"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              ✓ via {item.source}
              <span style={{ color: "var(--theme-text-tertiary)" }}>
                {" · "}
                {item.detail}
              </span>
            </div>
          </div>
        ) : state === "skeleton" ? (
          <div className="flex flex-col gap-1.5">
            <Skeleton variant="text" width="60%" height="14px" />
            <Skeleton variant="text" width="42%" height="10px" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
