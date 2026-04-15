"use client";

/**
 * D6 — Provenance indicator for auto-filled data.
 * Quiet financial-UI treatment: inline text "source: XXX · timestamp",
 * no pill background. Hover reveals full detail.
 */
import type { Provenance } from "@/lib/types";
import { ShieldCheck, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TIER: Record<
  Provenance["confidence"],
  { color: string; label: string }
> = {
  high: { color: "var(--theme-success)", label: "High confidence" },
  medium: {
    color: "var(--theme-text-secondary)",
    label: "Medium confidence",
  },
  low: { color: "var(--theme-error)", label: "Low — review required" },
};

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const tier = TIER[provenance.confidence];
  const Icon = provenance.confidence === "low" ? AlertCircle : ShieldCheck;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium cursor-help"
          style={{ color: "var(--theme-text-tertiary)" }}
        >
          <Icon
            size={11}
            strokeWidth={2.2}
            style={{ color: tier.color }}
          />
          <span>source:</span>
          <span style={{ color: "var(--theme-text-secondary)" }}>
            {provenance.source}
          </span>
          <span style={{ color: "var(--theme-text-tertiary)" }}>·</span>
          <span>{provenance.timestamp}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] p-3 space-y-1">
        <div className="text-[10px] uppercase opacity-60">Data provenance</div>
        <div className="font-semibold text-[13px]">{provenance.source}</div>
        <div className="text-[12px] opacity-80">
          Retrieved: {provenance.timestamp}
        </div>
        <div className="text-[12px] font-medium" style={{ color: tier.color }}>
          {tier.label}
        </div>
        <div className="text-[11px] opacity-60 pt-1 border-t border-white/10">
          Override available — all overrides are logged alongside the
          original source.
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
