"use client";

/**
 * D6 — Provenance indicator for auto-filled data.
 * Shows source + timestamp + confidence tier. Hover reveals full detail via Tooltip.
 */
import type { Provenance } from "@/lib/types";
import { ShieldCheck, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TIER_COLOR: Record<Provenance["confidence"], { fg: string; bg: string; label: string }> = {
  high: { fg: "#0e6027", bg: "#defbe6", label: "High confidence" },
  medium: { fg: "#8e6a00", bg: "#fcf4d6", label: "Medium confidence" },
  low: { fg: "#a2191f", bg: "#fff1f1", label: "Low — review required" },
};

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const tier = TIER_COLOR[provenance.confidence];
  const Icon = provenance.confidence === "low" ? AlertCircle : ShieldCheck;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-[3px] border text-[11px] font-medium cursor-help"
          style={{ backgroundColor: tier.bg, color: tier.fg, borderColor: tier.fg + "33" }}
        >
          <Icon size={12} strokeWidth={2.2} />
          <span className="font-normal text-[#525252] tracking-[0.32px]">source:</span>
          <span>{provenance.source}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] space-y-1 p-3">
        <div className="text-[11px] uppercase tracking-[0.32px] text-[#c6c6c6]">
          Data provenance
        </div>
        <div className="font-semibold text-[13px]">{provenance.source}</div>
        <div className="text-[12px] text-[#c6c6c6]">
          Retrieved: {provenance.timestamp}
        </div>
        <div className="text-[12px] font-medium" style={{ color: tier.fg === "#a2191f" ? "#fa4d56" : tier.fg === "#0e6027" ? "#42be65" : "#f1c21b" }}>
          {tier.label}
        </div>
        <div className="text-[11px] text-[#c6c6c6] pt-1 border-t border-[#393939]">
          Override available — all overrides are logged alongside the original source.
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
