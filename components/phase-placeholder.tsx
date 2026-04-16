"use client";

/**
 * Phase placeholder view — shown in the main area when the banker
 * clicks a future phase (Credit / Approval / Settlement) in the
 * sidebar. Honest "demo scope" framing: the structure is real,
 * but the items aren't interactive in this build.
 */
import type { PhaseSnapshot } from "@/lib/deal-state";
import type { Phase, Owner } from "@/lib/types";
import { PHASES } from "@/data/deal-data";
import { ArrowLeft, Circle, Cpu, User, Users } from "lucide-react";

interface Props {
  phase: PhaseSnapshot;
  currentPhase: Phase;
  onReturn: () => void;
}

const OWNER_ICON: Record<Owner, typeof User> = {
  banker: User,
  system: Cpu,
  customer: Users,
};

const OWNER_LABEL: Record<Owner, string> = {
  banker: "Banker",
  system: "System",
  customer: "Customer",
};

// Rough effort hint text per item id so the preview has some
// texture. Keyed off the ids added in data/deal-data.ts.
const EFFORT_HINT: Record<string, string> = {
  "credit-01": "~30 min effort",
  "credit-02": "auto-calculated",
  "credit-03": "~15 min effort",
  "approval-01": "auto-generated draft",
  "approval-02": "~20 min effort",
  "approval-03": "sign-off action",
  "settlement-01": "~1 day wait",
  "settlement-02": "auto-booked",
};

export function PhasePlaceholder({ phase, currentPhase, onReturn }: Props) {
  const currentLabel =
    PHASES.find((p) => p.id === currentPhase)?.label ?? "current phase";

  return (
    <div
      className="w-full max-w-[720px] mx-auto px-6 md:px-8 py-8 animate-fade-in"
    >
      <button
        type="button"
        onClick={onReturn}
        className="interactive-link inline-flex items-center gap-1.5 text-[12px] font-medium mb-5 cursor-pointer"
        style={{ color: "var(--theme-primary)" }}
      >
        <ArrowLeft size={12} strokeWidth={2.2} />
        Return to {currentLabel}
      </button>

      <header className="mb-5">
        <span className="brand-pill">Structure preview</span>
        <h2
          className="text-[22px] font-semibold leading-[1.25] mt-2"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {phase.label} phase
        </h2>
        <p
          className="text-[13px] mt-1.5 leading-[1.55]"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          In production, this phase would contain the following items.
          They're shown here as structural preview so the complete deal
          lifecycle is visible end-to-end.
        </p>
      </header>

      <ul
        className="divide-y"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          overflow: "hidden",
        }}
      >
        {phase.items.map((item) => {
          const OwnerIcon = OWNER_ICON[item.owner];
          const effort = EFFORT_HINT[item.id];
          return (
            <li key={item.id} className="px-4 py-3 flex items-start gap-3">
              <Circle
                size={12}
                strokeWidth={2}
                style={{
                  color: "var(--theme-border-strong)",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-semibold leading-[1.3]"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {item.label}
                </div>
                <div
                  className="text-[12px] mt-0.5 leading-[1.5]"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {item.description}
                </div>
                <div
                  className="mt-1.5 flex items-center gap-2 text-[10px] uppercase"
                  style={{
                    color: "var(--theme-text-tertiary)",
                    letterSpacing: "0.5px",
                  }}
                >
                  <OwnerIcon size={10} strokeWidth={2.2} />
                  <span>{OWNER_LABEL[item.owner]}</span>
                  {effort ? (
                    <>
                      <span>·</span>
                      <span>{effort}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className="mt-5 p-4 text-[11.5px] leading-[1.55]"
        style={{
          background: "#f5f5f5",
          borderRadius: "var(--theme-radius-lg)",
          color: "var(--theme-text-secondary)",
        }}
      >
        <strong style={{ color: "var(--theme-text-primary)" }}>
          Demo scope:
        </strong>{" "}
        Setup and Identification are fully interactive. Credit, Approval,
        and Settlement are shown as structural preview to demonstrate the
        complete deal lifecycle without inflating the demo build.
      </div>
    </div>
  );
}
