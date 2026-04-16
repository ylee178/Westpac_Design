"use client";

/**
 * Setup-mode sidebar. Rendered during empty / creator / loading
 * steps — before the full deal library is wired up to applicable
 * items. Shows the five phases statically so the banker can see
 * the whole journey ahead, with "Setup" highlighted as the active
 * step (in progress).
 *
 * During the "loading" step specifically, the Setup row expands
 * with three sub-items that tick off in sync with the main area's
 * dynamic build animation (driven by loadingDoneCount in
 * flow-mode-context).
 */
import { Check } from "lucide-react";
import { PHASES } from "@/data/deal-data";
import { useFlowMode } from "@/lib/flow-mode-context";

const SETUP_SUB_ITEMS = [
  "Link customer record",
  "Confirm product and entity",
  "Run eligibility checks",
];

export function SetupProgressSidebar() {
  const { step, loadingDoneCount } = useFlowMode();
  const activeId = "setup";
  const isLoading = step === "loading";

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
        {PHASES.map((p) => {
          const isCurrent = p.id === activeId;
          const showSubItems = isCurrent && isLoading;
          return (
            <div key={p.id} className="mb-1">
              <div
                className="w-full text-left px-3 py-2.5 flex items-start gap-3"
                style={{
                  background: isCurrent
                    ? "var(--westpac-primary-soft)"
                    : "transparent",
                  border: isCurrent
                    ? "1px solid var(--westpac-primary-border)"
                    : "1px solid transparent",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                <PhaseIcon isCurrent={isCurrent} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className="text-[8px] uppercase font-semibold"
                      style={{
                        color: "var(--theme-text-tertiary)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Step {p.order}
                    </span>
                    {isCurrent ? (
                      <span
                        className="text-[9px] uppercase font-semibold"
                        style={{
                          color: "var(--theme-primary)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        In progress
                      </span>
                    ) : null}
                  </div>
                  <div
                    className="text-[13px] leading-[1.25] mt-0.5"
                    style={{
                      color: isCurrent
                        ? "var(--theme-text-primary)"
                        : "var(--theme-text-tertiary)",
                      fontWeight: isCurrent ? 600 : 500,
                    }}
                  >
                    {p.label}
                  </div>
                  {!showSubItems ? (
                    <div
                      className="text-[11px] mt-0.5 leading-snug"
                      style={{ color: "var(--theme-text-tertiary)" }}
                    >
                      {isCurrent
                        ? "Capture product, entity, and deal basics."
                        : p.description}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Loading sub-items — tick off in sync with main area */}
              {showSubItems ? (
                <ul className="mt-1 mb-2 pl-[42px] pr-3 space-y-1.5">
                  {SETUP_SUB_ITEMS.map((label, i) => {
                    const isDone = i < loadingDoneCount;
                    const isPending = i === loadingDoneCount;
                    if (!isDone && !isPending) return null;
                    return (
                      <li
                        key={label}
                        className="flex items-center gap-2 text-[11px]"
                        style={{
                          animation: "fade-in 280ms ease-out both",
                        }}
                      >
                        {isDone ? (
                          <span
                            className="inline-flex items-center justify-center shrink-0"
                            style={{
                              width: 11,
                              height: 11,
                              background: "#2e7d32",
                              borderRadius: "50%",
                              animation: "pop-in 240ms ease-out both",
                            }}
                          >
                            <Check size={7} strokeWidth={3.5} color="white" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center shrink-0"
                            style={{ width: 11, height: 11 }}
                          >
                            <span
                              className="animate-spin"
                              style={{
                                width: 9,
                                height: 9,
                                border: "1.5px solid var(--theme-border)",
                                borderTopColor: "var(--theme-primary)",
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            />
                          </span>
                        )}
                        <span
                          style={{
                            color: isDone
                              ? "var(--theme-text-primary)"
                              : "var(--theme-text-secondary)",
                            fontWeight: isDone ? 500 : 400,
                          }}
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function PhaseIcon({ isCurrent }: { isCurrent: boolean }) {
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
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
      style={{
        background: "transparent",
        border: "1.5px solid #c7c7c7",
        borderRadius: "50%",
      }}
    />
  );
}
