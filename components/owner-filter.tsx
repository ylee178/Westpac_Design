"use client";

/**
 * D7 — Three-way ownership filter as inline segmented control.
 * Quiet treatment: thin border, subtle selected state, no bold colors.
 */
import type { OwnerFilter as Filter } from "@/lib/types";
import { User, Cpu, Users, Layers } from "lucide-react";

interface Props {
  value: Filter;
  onChange: (v: Filter) => void;
  counts: Record<Filter, number>;
}

const OPTIONS: { id: Filter; label: string; Icon: typeof User }[] = [
  { id: "all", label: "All", Icon: Layers },
  { id: "banker", label: "Banker", Icon: User },
  { id: "system", label: "System", Icon: Cpu },
  { id: "customer", label: "Customer", Icon: Users },
];

export function OwnerFilter({ value, onChange, counts }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter by task owner"
      className="inline-flex border"
      style={{
        borderColor: "var(--theme-border)",
        background: "var(--theme-card-bg)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      {OPTIONS.map((opt, idx) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className="flex items-center gap-1.5 px-3 h-9 text-[12px] font-medium transition-colors whitespace-nowrap"
            style={{
              background: active ? "var(--theme-primary)" : "transparent",
              color: active
                ? "var(--theme-primary-fg)"
                : "var(--theme-text-secondary)",
              borderLeft:
                idx === 0 ? "none" : "1px solid var(--theme-border)",
            }}
          >
            <opt.Icon size={12} strokeWidth={2.2} />
            {opt.label}
            <span
              className="ml-0.5 tabular-nums"
              style={{
                color: active
                  ? "rgba(255,255,255,0.7)"
                  : "var(--theme-text-tertiary)",
                fontSize: "10px",
              }}
            >
              {counts[opt.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
