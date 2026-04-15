"use client";

/**
 * V1 step 3 — Dynamic loading animation with narrative pacing.
 *
 * Runs ~5.8 seconds with clear beat structure so the banker perceives
 * exactly what the system just did:
 *
 *   t=0.0  mount — title block fades in
 *   t=0.2  D1 badge fade in
 *   t=0.5  product-sensitive title line settles
 *   t=1.0  item 1 skeleton row
 *   t=1.4  item 1 resolves to checkmark + source
 *   t=1.8  item 2 skeleton row
 *   t=2.2  item 2 resolves
 *   t=2.6  item 3 skeleton row
 *   t=3.0  item 3 resolves
 *   t=3.5  Ready to Submit ticks up 0 → 12% (animated count)
 *   t=4.0  "Setup complete — 3 items auto-verified" banner slides up
 *   t=5.0  banner cross-fades to narrative bridge
 *   t=5.8  advance to focused step
 *
 * Each beat adds a new visible element, so even the 5.8s window
 * never feels like "waiting" — it feels like work in progress.
 */
import { useEffect, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { ArrowRight, Check, Sparkles } from "lucide-react";
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

type BannerPhase = "none" | "complete" | "bridge";

export function V1DynamicLoading() {
  const { draft, setStep } = useFlowMode();
  const [revealCount, setRevealCount] = useState(0);
  const [bannerPhase, setBannerPhase] = useState<BannerPhase>("none");
  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // t=1.0 / 1.4 — item 1 skeleton then resolve
    timers.push(setTimeout(() => setRevealCount(0.5), 1000));
    timers.push(setTimeout(() => setRevealCount(1), 1400));
    // t=1.8 / 2.2 — item 2
    timers.push(setTimeout(() => setRevealCount(1.5), 1800));
    timers.push(setTimeout(() => setRevealCount(2), 2200));
    // t=2.6 / 3.0 — item 3
    timers.push(setTimeout(() => setRevealCount(2.5), 2600));
    timers.push(setTimeout(() => setRevealCount(3), 3000));

    // t=3.5 — readiness tick-up 0 → 12
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

    // t=4.0 — completion banner
    timers.push(setTimeout(() => setBannerPhase("complete"), 4000));
    // t=5.0 — cross-fade to narrative bridge
    timers.push(setTimeout(() => setBannerPhase("bridge"), 5000));
    // t=5.8 — advance
    timers.push(setTimeout(() => setStep("focused"), 5800));

    return () => timers.forEach(clearTimeout);
  }, [setStep]);

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[720px]">
        {/* Badge — fades in at 0.2s */}
        <div
          className="flex items-center gap-2 mb-2"
          style={{
            opacity: 0,
            animation: "fade-in 320ms ease-out 200ms forwards",
          }}
        >
          <Sparkles
            size={12}
            strokeWidth={2.2}
            style={{ color: "var(--theme-primary)" }}
          />
          <span
            className="text-[10px] uppercase font-semibold"
            style={{
              color: "var(--theme-primary)",
              letterSpacing: "0.5px",
            }}
          >
            D1 · Dynamic checklist build
          </span>
        </div>

        {/* Title — fades in at 0.5s */}
        <h1
          className="text-[22px] font-semibold leading-[1.25]"
          style={{
            color: "var(--theme-text-primary)",
            opacity: 0,
            animation: "fade-in 400ms ease-out 500ms forwards",
          }}
        >
          Building your checklist for{" "}
          <span style={{ color: "var(--theme-primary)" }}>
            {productLabel(draft.product)} × {entityLabel(draft.entity)} ×{" "}
            {draft.jurisdiction}
          </span>
          ...
        </h1>
        <p
          className="text-[13px] mt-1.5"
          style={{
            color: "var(--theme-text-secondary)",
            opacity: 0,
            animation: "fade-in 400ms ease-out 700ms forwards",
          }}
        >
          Auto-verifying Setup phase items from system sources.
        </p>

        {/* Setup items — staggered reveal */}
        <div
          className="mt-6 divide-y"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            overflow: "hidden",
            opacity: 0,
            animation: "fade-in 400ms ease-out 800ms forwards",
          }}
        >
          {SETUP_ITEMS.map((item, i) => {
            // 0 = hidden, 0.5 = skeleton visible, 1 = resolved
            const state = revealCount >= i + 1
              ? "resolved"
              : revealCount >= i + 0.5
                ? "skeleton"
                : "hidden";
            return (
              <SetupItemRow
                key={item.label}
                item={item}
                state={state}
              />
            );
          })}
        </div>

        {/* Readiness tick — only visible once items resolving */}
        {readinessScore > 0 ? (
          <div
            className="mt-4 flex items-center justify-end gap-2 text-[11px]"
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

        {/* Completion / bridge banner — slides up at 4.0s */}
        {bannerPhase !== "none" ? (
          <div
            className="mt-5 overflow-hidden"
            style={{
              opacity: 0,
              animation: "slide-up-in 450ms ease-out forwards",
            }}
          >
            {bannerPhase === "complete" ? (
              <BannerComplete key="complete" />
            ) : (
              <BannerBridge key="bridge" />
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function BannerComplete() {
  return (
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
        className="flex items-center justify-center w-6 h-6 shrink-0 animate-pulse"
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
  );
}

function BannerBridge() {
  return (
    <div
      className="flex items-start gap-3 p-3"
      style={{
        background: "var(--westpac-primary-soft)",
        border: "1px solid var(--westpac-primary-border)",
        borderLeft: "3px solid var(--theme-primary)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <ArrowRight
        size={16}
        strokeWidth={2.5}
        className="shrink-0 mt-0.5"
        style={{ color: "var(--theme-primary)" }}
      />
      <div
        className="text-[13px] leading-[1.5]"
        style={{ color: "var(--theme-text-primary)" }}
      >
        <span className="font-semibold">Moving to Identification</span>
        <span style={{ color: "var(--theme-text-secondary)" }}>
          {" "}— 6 items, 3 need your input. This phase verifies who
          you're dealing with.
        </span>
      </div>
    </div>
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
      className="flex items-center gap-3 px-4 py-3.5"
      style={{
        minHeight: "58px",
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
