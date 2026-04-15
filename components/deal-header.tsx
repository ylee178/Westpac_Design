"use client";

/**
 * Deal header — white bank-style masthead, Westpac financial tone.
 * Logo left, primary nav tabs, utility nav right. Below the masthead,
 * a compact deal meta strip shows customer, amount, mode, confidence.
 */
import type { ReadinessBreakdown, Deal } from "@/lib/types";
import { ReadyToSubmitDisplay } from "@/components/readiness-display";
import { ModeIndicator } from "@/components/mode-indicator";
import { WestpacLogo } from "@/components/westpac-logo";
import { HelpCircle, LogOut } from "lucide-react";

interface Props {
  deal: Deal;
  breakdown: ReadinessBreakdown;
  hasRedFlag: boolean;
  redFlagLabel?: string;
  redFlagSubtitle?: string;
  bankerActionCount?: number;
  projectedAfterActions?: number;
}

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const NAV = [
  { label: "Deals", active: true },
  { label: "Customers", active: false },
  { label: "Approvals", active: false },
  { label: "Reports", active: false },
];

export function DealHeader({
  deal,
  breakdown,
  hasRedFlag,
  redFlagLabel,
  redFlagSubtitle,
  bankerActionCount,
  projectedAfterActions,
}: Props) {
  return (
    <header
      className="w-full"
      style={{
        background: "var(--theme-header-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      {/* Top masthead — logo + nav + utilities */}
      <div className="max-w-[1584px] mx-auto px-6 md:px-8 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-7 min-w-0">
          {/* Logo — real PNG */}
          <WestpacLogo size={26} />

          {/* Primary nav tabs — active indicated by subtle bottom border */}
          <nav className="hidden md:flex items-center gap-0 h-[56px]">
            {NAV.map((n) => (
              <button
                key={n.label}
                type="button"
                className="h-full px-4 text-[13px] font-medium transition-colors relative"
                style={{
                  color: n.active
                    ? "var(--theme-text-primary)"
                    : "var(--theme-text-secondary)",
                }}
              >
                {n.label}
                {n.active ? (
                  <span
                    className="absolute left-2 right-2 bottom-0 h-[2px]"
                    style={{ background: "var(--theme-primary)" }}
                  />
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        {/* Utility nav right */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] font-medium"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <HelpCircle size={13} strokeWidth={2} />
            Need help?
          </button>
          <div
            className="hidden md:flex items-center gap-2 text-[12px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <span className="font-medium" style={{ color: "var(--theme-text-primary)" }}>
              {deal.banker.name}
            </span>
            <span style={{ color: "var(--theme-text-tertiary)" }}>·</span>
            <span>
              {deal.banker.role === "senior-banker" ? "Senior Banker" : "New Banker"}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 h-8 text-[12px] font-medium border transition-colors hover:brightness-95"
            style={{
              background: "var(--theme-card-bg)",
              color: "var(--theme-text-primary)",
              borderColor: "var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <LogOut size={12} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>

      {/* Deal meta strip — customer, amount, mode, confidence */}
      <div
        className="border-t"
        style={{
          borderColor: "var(--theme-border-subtle)",
          background: "var(--theme-card-bg)",
        }}
      >
        <div className="max-w-[1584px] mx-auto px-6 md:px-8 py-4 flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div
              className="flex items-center gap-2 text-[11px] uppercase font-medium"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "var(--theme-letter-spacing-small)",
              }}
            >
              <span>Deal</span>
              <span style={{ fontFamily: "var(--theme-font-mono)" }}>
                {deal.id}
              </span>
            </div>
            <h1
              className="text-[22px] leading-[1.25] mt-1 font-medium"
              style={{
                color: "var(--theme-primary)",
                letterSpacing: 0,
              }}
            >
              {deal.customerName}
            </h1>
            <div
              className="text-[13px] mt-0.5"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {deal.dealName}
            </div>
            <div className="flex items-center gap-6 mt-3 flex-wrap">
              <MetaItem label="Amount" value={currency.format(deal.amount)} mono emphasized />
              <MetaItem label="ABN" value={deal.abn} mono />
              <MetaItem label="Jurisdiction" value={deal.jurisdiction} />
              <div className="mt-0.5">
                <ModeIndicator mode={deal.cddMode} />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <ReadyToSubmitDisplay
              breakdown={breakdown}
              hasRedFlag={hasRedFlag}
              redFlagLabel={redFlagLabel}
              redFlagSubtitle={redFlagSubtitle}
              bankerActionCount={bankerActionCount}
              projectedAfterActions={projectedAfterActions}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function MetaItem({
  label,
  value,
  mono = false,
  emphasized = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div className="flex flex-col leading-tight">
      <span
        className="text-[10px] uppercase font-medium"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "var(--theme-letter-spacing-small)",
        }}
      >
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{
          color: "var(--theme-text-primary)",
          fontFamily: mono ? "var(--theme-font-mono)" : "var(--theme-font-sans)",
          fontSize: emphasized ? "15px" : "13px",
          fontWeight: emphasized ? 600 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
