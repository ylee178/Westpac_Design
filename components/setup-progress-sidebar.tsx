"use client";

/**
 * Setup-mode sidebar. Rendered during empty / creator / loading
 * steps — before the full deal library is wired up to applicable
 * items. Shows the five phases statically so the banker can see
 * the whole journey ahead, with "Setup" highlighted as the active
 * step (in progress).
 */
import { PHASES } from "@/data/deal-data";

export function SetupProgressSidebar() {
  const activeId = "setup";
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
                      className="text-[9px] uppercase font-semibold tabular-nums"
                      style={{
                        color: "var(--theme-text-tertiary)",
                        letterSpacing: "0.6px",
                        fontFamily: "var(--theme-font-mono)",
                      }}
                    >
                      {String(p.order).padStart(2, "0")}
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
                  <div
                    className="text-[11px] mt-0.5 leading-snug"
                    style={{ color: "var(--theme-text-tertiary)" }}
                  >
                    {isCurrent
                      ? "Capture product, entity, and deal basics."
                      : p.description}
                  </div>
                </div>
              </div>
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
