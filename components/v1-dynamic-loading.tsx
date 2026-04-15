"use client";

/**
 * V1 step 3 — Dynamic loading animation.
 * Full-width loading state. Title names the product × entity ×
 * jurisdiction combination so the banker sees D1 reshape happening.
 * Skeleton shimmer cards appear then resolve into the Setup phase
 * items with provenance badges staggered in. After ~2.5s, a "Setup
 * complete" banner shows and auto-advances to focused step.
 */
import { useEffect, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { Check, Sparkles } from "lucide-react";
import { PHASES, SAMPLE_DEAL } from "@/data/deal-data";

const SETUP_ITEMS = [
  { label: "Link customer record", source: "Customer master · manual" },
  { label: "Confirm product and entity type", source: "BizEdge engine" },
  { label: "Initial eligibility screen", source: "Risk engine · trading history ≥12mo" },
];

function productLabel(id: string): string {
  const map: Record<string, string> = {
    "bank-guarantee": "Bank Guarantee",
    "term-loan": "Term Loan",
    "trust-lending": "Trust Lending",
    overdraft: "Equipment Finance",
  };
  return map[id] ?? id;
}

function entityLabel(id: string): string {
  const map: Record<string, string> = {
    company: "Company",
    trust: "Trust",
    partnership: "Partnership",
    "sole-trader": "Individual",
  };
  return map[id] ?? id;
}

export function V1DynamicLoading() {
  const { draft, setStep } = useFlowMode();
  const [revealCount, setRevealCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    // Stagger-reveal each setup item, 400ms apart
    const timers: ReturnType<typeof setTimeout>[] = [];
    SETUP_ITEMS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setRevealCount(i + 1), 500 + i * 400),
      );
    });
    // Show "Setup complete" banner after the last item
    timers.push(setTimeout(() => setShowComplete(true), 500 + SETUP_ITEMS.length * 400 + 300));
    // Auto-advance to focused step
    timers.push(
      setTimeout(
        () => setStep("focused"),
        500 + SETUP_ITEMS.length * 400 + 1400,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [setStep]);

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[720px]">
        <div className="flex items-center gap-2 mb-2">
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
        <h1
          className="text-[22px] font-semibold leading-[1.25]"
          style={{ color: "var(--theme-text-primary)" }}
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
          style={{ color: "var(--theme-text-secondary)" }}
        >
          Auto-verifying Setup phase items from system sources.
        </p>

        <div
          className="mt-6 divide-y"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            overflow: "hidden",
          }}
        >
          {SETUP_ITEMS.map((item, i) => (
            <SetupItemRow
              key={item.label}
              item={item}
              revealed={i < revealCount}
            />
          ))}
        </div>

        {showComplete ? (
          <div
            className="mt-5 flex items-center gap-3 p-3 animate-fade-in"
            style={{
              background: "#f0f9f2",
              border: "1px solid #bfe4c6",
              borderLeft: "3px solid #2e7d32",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <Check
              size={16}
              strokeWidth={2.5}
              style={{ color: "#2e7d32" }}
            />
            <div
              className="text-[13px] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Setup complete — 3 items auto-verified
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function SetupItemRow({
  item,
  revealed,
}: {
  item: (typeof SETUP_ITEMS)[number];
  revealed: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-all"
      style={{
        opacity: revealed ? 1 : 0.4,
        transform: revealed ? "translateY(0)" : "translateY(4px)",
        transitionDuration: "400ms",
      }}
    >
      {revealed ? (
        <div
          className="flex items-center justify-center w-5 h-5 shrink-0"
          style={{
            background: "#2e7d32",
            borderRadius: "50%",
          }}
        >
          <Check size={11} strokeWidth={3} color="white" />
        </div>
      ) : (
        <div
          className="w-5 h-5 shrink-0 animate-pulse"
          style={{
            background: "var(--theme-border)",
            borderRadius: "50%",
          }}
        />
      )}
      <div className="min-w-0 flex-1">
        {revealed ? (
          <>
            <div
              className="text-[13px] font-medium"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {item.label}
            </div>
            <div
              className="text-[10px] mt-0.5 uppercase font-medium"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.32px",
              }}
            >
              ✓ via {item.source}
            </div>
          </>
        ) : (
          <>
            <div
              className="h-3 w-2/3 animate-pulse"
              style={{
                background: "var(--theme-border)",
                borderRadius: "2px",
              }}
            />
            <div
              className="h-2 w-1/2 mt-1.5 animate-pulse"
              style={{
                background: "var(--theme-border-subtle)",
                borderRadius: "2px",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
