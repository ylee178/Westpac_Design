"use client";

/**
 * Read-only view for completed phases that the banker has clicked
 * back to via the progress spine. Shows each item with its
 * provenance badge (proving D6 works for system-auto-verified
 * items, not just banker-completed ones).
 */
import type { ChecklistItem as CI } from "@/lib/types";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { ArrowLeft, Check } from "lucide-react";

interface Props {
  phaseLabel: string;
  items: CI[];
  onReturn: () => void;
}

export function V1PhaseReadonly({ phaseLabel, items, onReturn }: Props) {
  return (
    <div className="max-w-[920px] mx-auto">
      <button
        type="button"
        onClick={onReturn}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-4"
        style={{ color: "var(--theme-primary)" }}
      >
        <ArrowLeft size={12} strokeWidth={2.2} />
        Return to current phase
      </button>

      {/* Phase complete banner */}
      <div
        className="mb-5 p-4 flex items-start gap-3"
        style={{
          background: "#f0f9f2",
          border: "1px solid #bfe4c6",
          borderLeft: "3px solid #2e7d32",
          borderRadius: "var(--theme-radius)",
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 shrink-0"
          style={{ background: "#2e7d32", borderRadius: "50%" }}
        >
          <Check size={16} strokeWidth={3} color="white" />
        </div>
        <div>
          <div
            className="text-[10px] uppercase font-bold"
            style={{ color: "#2e7d32", letterSpacing: "0.5px" }}
          >
            Phase complete
          </div>
          <h2
            className="text-[17px] font-semibold leading-[1.25] mt-0.5"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {phaseLabel} · {items.length} items auto-verified
          </h2>
          <p
            className="text-[12px] mt-1 leading-[1.5]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            All items in this phase were resolved by system sources.
            Every row below shows its provenance — where the data came
            from, when it was retrieved, and how confident the system
            is in it.
          </p>
        </div>
      </div>

      {/* Read-only item list */}
      <div
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius)",
          overflow: "hidden",
        }}
      >
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 px-5 py-4"
              style={{
                borderBottom: "1px solid var(--theme-border-subtle)",
                borderLeft: "3px solid var(--theme-text-tertiary)",
              }}
            >
              {/* Status mark */}
              <div
                className="flex items-center justify-center w-5 h-5 shrink-0 mt-0.5"
                style={{ background: "#2e7d32", borderRadius: "50%" }}
              >
                <Check size={10} strokeWidth={3} color="white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {item.label}
                </div>
                <div
                  className="text-[12px] mt-0.5"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {item.description}
                </div>
                {item.provenance ? (
                  <div className="mt-1.5">
                    <ProvenanceBadge provenance={item.provenance} />
                  </div>
                ) : null}
              </div>

              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--theme-success)" }}
              >
                Complete
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
