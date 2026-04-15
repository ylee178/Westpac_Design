"use client";

/**
 * Deal header — top band of the deal workspace.
 * Displays customer identity, deal amount, confidence score, and mode indicator.
 * Carbon dark masthead aesthetic (Gray 100 background, white text).
 */
import type { ConfidenceBreakdown, Deal } from "@/lib/types";
import { ConfidenceTooltip } from "@/components/confidence-tooltip";
import { ModeIndicator } from "@/components/mode-indicator";
import { Building2, User2 } from "lucide-react";

interface Props {
  deal: Deal;
  breakdown: ConfidenceBreakdown;
  hasRedFlag: boolean;
}

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function DealHeader({ deal, breakdown, hasRedFlag }: Props) {
  return (
    <header className="bg-[#161616] text-white border-b border-[#262626]">
      {/* Top thin bar — product label */}
      <div className="bg-[#262626] px-6 md:px-8 py-2 flex items-center justify-between text-[11px] text-[#c6c6c6] tracking-[0.32px]">
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            Westpac <span className="text-[#78a9ff]">BizEdge</span>
          </span>
          <span className="text-[#6f6f6f]">·</span>
          <span>Business Lending Origination Platform</span>
        </div>
        <div className="flex items-center gap-2 text-[#c6c6c6]">
          <User2 size={12} />
          <span>
            {deal.banker.name}
            <span className="text-[#6f6f6f]"> — {deal.banker.role === "senior-banker" ? "Senior Banker" : "New Banker"}</span>
          </span>
        </div>
      </div>

      {/* Main deal header */}
      <div className="px-6 md:px-8 py-5 flex items-start justify-between gap-6 max-w-[1584px] mx-auto">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.5px] text-[#c6c6c6]">
            <Building2 size={12} />
            Deal {deal.id}
          </div>
          <h1
            className="text-[28px] md:text-[32px] font-light leading-[1.2] mt-1 text-white"
            style={{ letterSpacing: 0 }}
          >
            {deal.customerName}
          </h1>
          <div className="text-[14px] text-[#c6c6c6] tracking-[0.16px] mt-1">
            {deal.dealName}
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <MetaItem label="Amount" value={currency.format(deal.amount)} mono />
            <MetaItem label="ABN" value={deal.abn} mono />
            <MetaItem label="Jurisdiction" value={deal.jurisdiction} />
            <div className="mt-0.5">
              <ModeIndicator mode={deal.cddMode} />
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-5">
          <ConfidenceTooltip breakdown={breakdown} hasRedFlag={hasRedFlag} />
        </div>
      </div>
    </header>
  );
}

function MetaItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] uppercase tracking-[0.5px] text-[#6f6f6f]">
        {label}
      </span>
      <span
        className="text-[14px] text-white tabular-nums"
        style={{
          fontFamily: mono ? "var(--font-plex-mono)" : "var(--font-plex-sans)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
