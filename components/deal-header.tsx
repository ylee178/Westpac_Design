"use client";

/**
 * Deal header — two independent pieces so page.tsx can place the
 * progress spine sub-header BETWEEN the masthead and the deal meta
 * strip instead of pushing the spine below all deal info.
 *
 *   <DealMasthead />     — always visible: logo, primary nav,
 *                          Need help, banker name, Sign out, dev
 *                          panel. Persists through every flow step
 *                          including empty / creator.
 *   <DealMetaStrip />    — customer name, amount, ABN, mode,
 *                          readiness. Only rendered once the banker
 *                          has committed to a deal.
 *
 * Both live in this file so the styling stays co-located.
 */
import type { ReadinessBreakdown, Deal } from "@/lib/types";
import { ReadyToSubmitDisplay } from "@/components/readiness-display";
import { ModeIndicator } from "@/components/mode-indicator";
import { WestpacLogo } from "@/components/westpac-logo";
import { DevPanel } from "@/components/dev-panel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HelpCircle,
  LogOut,
  MoreHorizontal,
  Plus,
  UserRound,
} from "lucide-react";

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

interface MastheadProps {
  bankerName: string;
  bankerRole: Deal["banker"]["role"];
  /** Fires the "New Deal" button click. When provided, the button
   *  renders in the masthead (typically on the dashboard landing). */
  onNewDeal?: () => void;
  /** When true, render the primary "New Deal" button. */
  showNewDeal?: boolean;
}

export function DealMasthead({
  bankerName,
  bankerRole,
  onNewDeal,
  showNewDeal = false,
}: MastheadProps) {
  return (
    <div
      className="w-full"
      style={{
        background: "var(--theme-header-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <div className="w-full pl-6 md:pl-8 pr-0 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-7 min-w-0">
          <WestpacLogo size={26} />
          <nav className="hidden md:flex items-center gap-0 h-[56px]">
            {NAV.map((n) => (
              <button
                key={n.label}
                type="button"
                className="h-full px-4 text-[13px] font-medium transition-colors relative cursor-pointer"
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

        <div className="flex items-center self-stretch">
          <div className="flex items-center gap-4 pr-4">
            {showNewDeal && onNewDeal ? (
              <button
                type="button"
                onClick={onNewDeal}
                className="inline-flex items-center gap-1 h-8 px-2.5 text-[12px] font-medium cursor-pointer"
                style={{
                  color: "var(--theme-primary)",
                  background: "var(--westpac-primary-soft)",
                  borderRadius: "var(--theme-radius)",
                  transition: "background-color 160ms ease, color 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--theme-primary)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--westpac-primary-soft)";
                  e.currentTarget.style.color = "var(--theme-primary)";
                }}
              >
                <Plus size={13} strokeWidth={2.4} />
                Create
              </button>
            ) : null}
            <button
              type="button"
              className="interactive-subtle flex items-center gap-1.5 text-[12px] font-medium cursor-pointer px-1"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              <HelpCircle size={13} strokeWidth={2} />
              Need help?
            </button>
            <BankerMenu bankerName={bankerName} bankerRole={bankerRole} />
          </div>
          <DevPanel />
        </div>
      </div>
    </div>
  );
}

interface MetaStripProps {
  deal: Deal;
  breakdown: ReadinessBreakdown;
  hasRedFlag: boolean;
  redFlagLabel?: string;
  redFlagSubtitle?: string;
  bankerActionCount?: number;
  projectedAfterActions?: number;
}

export function DealMetaStrip({
  deal,
  breakdown,
  hasRedFlag,
  redFlagLabel,
  redFlagSubtitle,
  bankerActionCount,
  projectedAfterActions,
}: MetaStripProps) {
  return (
    <div
      style={{
        background: "var(--theme-card-bg)",
        borderBottom: "1px solid var(--theme-border)",
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
            <MetaItem
              label="Amount"
              value={currency.format(deal.amount)}
              mono
              emphasized
            />
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

// ——— Banker menu (three-dot) ———

function BankerMenu({
  bankerName,
  bankerRole,
}: {
  bankerName: string;
  bankerRole: Deal["banker"]["role"];
}) {
  const roleLabel =
    bankerRole === "senior-banker" ? "Senior Banker" : "New Banker";
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="hidden md:flex items-center gap-2 text-[12px]"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        <span
          className="font-medium"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {bankerName}
        </span>
        <span style={{ color: "var(--theme-text-tertiary)" }}>·</span>
        <span>{roleLabel}</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Open menu for ${bankerName}`}
            className="interactive-subtle inline-flex items-center justify-center w-7 h-7 cursor-pointer"
            style={{
              color: "var(--theme-text-secondary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <MoreHorizontal size={15} strokeWidth={2} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-[200px] p-1"
        >
          <BankerMenuItem icon={UserRound} label="Edit profile" />
          <div
            className="my-1 mx-1"
            style={{ borderTop: "1px solid var(--theme-border)" }}
          />
          <BankerMenuItem icon={LogOut} label="Sign out" />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function BankerMenuItem({
  icon: Icon,
  label,
}: {
  icon: typeof LogOut;
  label: string;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-2 px-2.5 py-2 text-[12.5px] font-medium cursor-pointer text-left"
      style={{
        color: "var(--theme-text-primary)",
        borderRadius: "var(--theme-radius)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--westpac-primary-soft)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon
        size={13}
        strokeWidth={2}
        style={{ color: "var(--theme-text-secondary)" }}
      />
      {label}
    </button>
  );
}
