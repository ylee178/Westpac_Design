"use client";

/**
 * D7 — Three-way ownership filter.
 * Segmented control: All / Banker / System / Customer.
 * Filters the checklist to show only items owned by the selected actor.
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
      className="inline-flex border border-[#c6c6c6] bg-white"
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
            className="flex items-center gap-1.5 px-3 h-10 text-[12px] font-medium tracking-[0.16px] transition-colors whitespace-nowrap"
            style={{
              backgroundColor: active ? "#161616" : "#ffffff",
              color: active ? "#ffffff" : "#161616",
              borderLeft: idx === 0 ? "none" : "1px solid #c6c6c6",
            }}
          >
            <opt.Icon size={13} strokeWidth={2.2} />
            {opt.label}
            <span
              className="ml-1 tabular-nums"
              style={{
                color: active ? "#c6c6c6" : "#8d8d8d",
                fontFamily: "var(--font-plex-mono)",
                fontSize: "11px",
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
