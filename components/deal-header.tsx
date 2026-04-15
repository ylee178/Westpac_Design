"use client";

/**
 * Deal header — top band of the deal workspace.
 * Displays customer identity, deal amount, confidence score, and mode indicator.
 * Carbon dark masthead aesthetic (Gray 100 background, white text).
 */
import type { ConfidenceBreakdown, Deal } from "@/lib/types";
import { ConfidenceTooltip } from "@/components/confidence-tooltip";
import { ModeIndicator } from "@/components/mode-indicator";
import { WestpacLogo } from "@/components/westpac-logo";
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
    <header
      className="border-b"
      style={{
        background: "var(--theme-header-bg)",
        color: "var(--theme-header-fg)",
        borderColor: "var(--theme-header-subtle)",
      }}
    >
      {/* Top thin bar — Westpac logo + product label + banker */}
      <div
        className="px-6 md:px-8 py-2.5 flex items-center justify-between text-[11px]"
        style={{
          background: "var(--theme-header-subtle)",
          color: "var(--theme-header-muted)",
          letterSpacing: "var(--theme-letter-spacing-small)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Westpac W logo — always visible, always brand red */}
          <WestpacLogo size={28} />
          <div
            className="hidden sm:block w-px h-5"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[13px]"
              style={{ color: "var(--theme-header-fg)", letterSpacing: 0 }}
            >
              BizEdge
            </span>
            <span
              className="hidden md:inline text-[11px]"
              style={{ color: "var(--theme-header-muted)" }}
            >
              Business Lending Origination Platform
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--theme-header-muted)" }}
        >
          <User2 size={12} />
          <span>
            {deal.banker.name}
            <span style={{ color: "var(--theme-text-tertiary)" }}>
              {" "}— {deal.banker.role === "senior-banker" ? "Senior Banker" : "New Banker"}
            </span>
          </span>
        </div>
      </div>

      {/* Main deal header */}
      <div className="px-6 md:px-8 py-5 flex items-start justify-between gap-6 max-w-[1584px] mx-auto">
        <div className="min-w-0 flex-1">
          <div
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.5px]"
            style={{ color: "var(--theme-header-muted)" }}
          >
            <Building2 size={12} />
            Deal {deal.id}
          </div>
          <h1
            className="text-[28px] md:text-[32px] font-light leading-[1.2] mt-1"
            style={{ letterSpacing: 0, color: "var(--theme-header-fg)" }}
          >
            {deal.customerName}
          </h1>
          <div
            className="text-[14px] mt-1"
            style={{
              color: "var(--theme-header-muted)",
              letterSpacing: "var(--theme-letter-spacing)",
            }}
          >
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
      <span
        className="text-[10px] uppercase tracking-[0.5px]"
        style={{ color: "var(--theme-text-tertiary)" }}
      >
        {label}
      </span>
      <span
        className="text-[14px] tabular-nums"
        style={{
          color: "var(--theme-header-fg)",
          fontFamily: mono ? "var(--theme-font-mono)" : "var(--theme-font-sans)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
