"use client";

/**
 * V1 step 3 — "Building your checklist" hand-off.
 *
 * Two presentation phases:
 *
 *   A. LINES — narrow column, vertically centered. Three setup lines
 *      materialize one at a time: each fades in with a spinner +
 *      shimmering label, then resolves to ✓ + solid label.
 *
 *   B. SKELETON — once all three lines are done, the list fades out
 *      and the main area shows a skeleton of the focused workspace
 *      (header + stacked item cards) so the content hand-off feels
 *      like "the real thing is loading in", not a jarring cut.
 *
 * Left sidebar reads `loadingDoneCount` from flow-mode-context and
 * ticks off Setup sub-items in sync with phase A.
 *
 * Timeline (ms):
 *   0     title fades in
 *   400   line 1 appears (spinner + shimmer)
 *   1200  line 1 → ✓  (loadingDoneCount = 1)
 *   1400  line 2 appears
 *   2200  line 2 → ✓  (loadingDoneCount = 2)
 *   2400  line 3 appears
 *   3200  line 3 → ✓  (loadingDoneCount = 3)
 *   3500  lines fade out
 *   3820  skeleton fades in
 *   4700  setStep("focused") — real workspace replaces skeleton
 */
import { useEffect, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { Check } from "lucide-react";
import { productLabel } from "@/data/product-options";
import { Skeleton } from "@/components/skeleton";

const SETUP_LINES = [
  { label: "Linking customer record", source: "Customer master" },
  { label: "Confirming product and entity", source: "BizEdge engine" },
  { label: "Running eligibility checks", source: "Risk engine" },
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

type LineState = "hidden" | "pending" | "done";

export function V1DynamicLoading() {
  const { draft, setStep, setLoadingDoneCount } = useFlowMode();
  const [lineStates, setLineStates] = useState<LineState[]>([
    "hidden",
    "hidden",
    "hidden",
  ]);
  const [linesFadingOut, setLinesFadingOut] = useState(false);
  const [skeletonShown, setSkeletonShown] = useState(false);

  useEffect(() => {
    setLoadingDoneCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const setLine = (i: number, s: LineState) =>
      setLineStates((prev) => {
        const next = [...prev];
        next[i] = s;
        return next;
      });

    const cadence: Array<[number, number, LineState]> = [
      [400, 0, "pending"],
      [1200, 0, "done"],
      [1400, 1, "pending"],
      [2200, 1, "done"],
      [2400, 2, "pending"],
      [3200, 2, "done"],
    ];
    cadence.forEach(([at, idx, s]) =>
      timers.push(
        setTimeout(() => {
          setLine(idx, s);
          if (s === "done") setLoadingDoneCount(idx + 1);
        }, at),
      ),
    );

    timers.push(setTimeout(() => setLinesFadingOut(true), 3500));
    timers.push(setTimeout(() => setSkeletonShown(true), 3820));
    timers.push(
      setTimeout(() => {
        setStep("focused");
        setLoadingDoneCount(0);
      }, 4700),
    );

    return () => timers.forEach(clearTimeout);
  }, [setStep, setLoadingDoneCount]);

  const dealLabel = [
    productLabel(draft.product) || "this deal",
    draft.entity ? entityLabel(draft.entity) : null,
    draft.jurisdiction || null,
  ]
    .filter(Boolean)
    .join(" × ");

  // Phase A — narrow centered column of lines.
  if (!skeletonShown) {
    return (
      <main
        className="flex-1 flex items-center justify-center px-6"
        style={{ background: "var(--theme-page-bg)" }}
      >
        <div
          className="w-full max-w-[460px] flex flex-col items-start text-left"
          style={{
            opacity: linesFadingOut ? 0 : 1,
            transform: linesFadingOut
              ? "translateY(-6px)"
              : "translateY(0)",
            transition:
              "opacity 320ms ease-out, transform 320ms ease-out",
          }}
          aria-hidden={linesFadingOut}
        >
          <div
            className="text-[10px] uppercase font-semibold mb-2"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.6px",
              opacity: 0,
              animation: "fade-in 320ms ease-out both",
            }}
          >
            Building your checklist
          </div>
          <h1
            className="text-[20px] font-semibold leading-[1.3]"
            style={{
              color: "var(--theme-text-primary)",
              opacity: 0,
              animation: "fade-in 360ms ease-out 100ms forwards",
            }}
          >
            {dealLabel}
          </h1>

          <ul className="mt-9 w-full space-y-4">
            {SETUP_LINES.map((line, i) => (
              <SetupLine
                key={line.label}
                state={lineStates[i]}
                label={line.label}
                source={line.source}
              />
            ))}
          </ul>
        </div>
      </main>
    );
  }

  // Phase B — skeleton of the focused workspace. Matches
  // PhaseItemStack's outer layout so the hand-off looks like the
  // real content finishing its paint.
  return (
    <main
      className="flex-1 overflow-y-auto flex flex-col"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <WorkspaceSkeleton />
    </main>
  );
}

function WorkspaceSkeleton() {
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
        {[0, 1, 2].map((i) => (
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
            <Skeleton animation={none} variant="text" width={["65%", "55%", "48%"][i]} height="13px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SetupLine({
  state,
  label,
  source,
}: {
  state: LineState;
  label: string;
  source: string;
}) {
  if (state === "hidden") {
    return <li style={{ height: "22px" }} aria-hidden="true" />;
  }
  const isPending = state === "pending";
  return (
    <li
      className="flex items-center gap-3 text-[13px]"
      style={{ animation: "fade-in 320ms ease-out both" }}
    >
      <StatusIcon state={state} />
      {isPending ? (
        <span className="text-shimmer" style={{ fontWeight: 500 }}>
          {label}
        </span>
      ) : (
        <span
          style={{
            color: "var(--theme-text-primary)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
      {state === "done" ? (
        <span
          className="text-[11px]"
          style={{
            color: "var(--theme-text-tertiary)",
            animation: "fade-in 280ms ease-out both",
          }}
        >
          via {source}
        </span>
      ) : null}
    </li>
  );
}

function StatusIcon({ state }: { state: LineState }) {
  if (state === "done") {
    return (
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 16,
          height: 16,
          background: "#2e7d32",
          borderRadius: "50%",
          animation: "pop-in 260ms ease-out both",
        }}
      >
        <Check size={9} strokeWidth={3.5} color="white" />
      </span>
    );
  }
  // pending — spinner ring
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{ width: 16, height: 16 }}
    >
      <span
        className="animate-spin"
        style={{
          width: 14,
          height: 14,
          border: "1.5px solid var(--theme-border)",
          borderTopColor: "var(--theme-primary)",
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
    </span>
  );
}
