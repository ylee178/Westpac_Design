"use client";

/**
 * Deals Dashboard — operational deal queue.
 *
 * Simple layout: greeting + one-line metrics, then a deal list
 * with inline status. "New Deal" button sits at the section header.
 */
import type { Phase } from "@/lib/types";
import { PHASES, SAMPLE_DEAL } from "@/data/deal-data";
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  Briefcase,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Wallet,
  Wrench,
} from "lucide-react";

type DashboardDeal = {
  id: string;
  customerName: string;
  productLabel: string;
  productIcon: typeof Banknote;
  amount: number;
  phase: Phase;
  updatedLabel: string;
  readiness: number;
  redFlag?: boolean;
};

const DEALS: DashboardDeal[] = [
  {
    id: SAMPLE_DEAL.id,
    customerName: SAMPLE_DEAL.customerName,
    productLabel: "Bank guarantee · Performance bond",
    productIcon: ShieldCheck,
    amount: SAMPLE_DEAL.amount,
    phase: "identification",
    updatedLabel: "12m ago",
    readiness: 58,
    redFlag: true,
  },
  {
    id: "BE-2026-00398",
    customerName: "Harbourline Fabrication Pty Ltd",
    productLabel: "Business loan · Working capital",
    productIcon: Banknote,
    amount: 450_000,
    phase: "credit",
    updatedLabel: "2h ago",
    readiness: 72,
  },
  {
    id: "BE-2026-00377",
    customerName: "Kowari Vineyards",
    productLabel: "Equipment finance · Tractor fleet",
    productIcon: Wrench,
    amount: 210_000,
    phase: "approval",
    updatedLabel: "Yesterday",
    readiness: 88,
  },
  {
    id: "BE-2026-00361",
    customerName: "Solvent Creative Group",
    productLabel: "Business overdraft · Seasonal",
    productIcon: Wallet,
    amount: 120_000,
    phase: "settlement",
    updatedLabel: "3 days ago",
    readiness: 94,
  },
  {
    id: "BE-2026-00342",
    customerName: "Parkline Logistics",
    productLabel: "Business loan · Fitout",
    productIcon: Banknote,
    amount: 680_000,
    phase: "setup",
    updatedLabel: "4 days ago",
    readiness: 18,
  },
];

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const PHASE_LABEL: Record<Phase, string> = Object.fromEntries(
  PHASES.map((p) => [p.id, p.label]),
) as Record<Phase, string>;

interface Props {
  bankerName: string;
  onOpenDeal: (dealId: string) => void;
  onNewDeal: () => void;
}

export function DealsDashboard({ bankerName, onOpenDeal, onNewDeal }: Props) {
  const firstName = bankerName.split(" ")[0] ?? bankerName;
  const active = DEALS.length;
  const needAttention = DEALS.filter((d) => d.redFlag).length;
  const readyToSubmit = DEALS.filter((d) => d.readiness >= 90).length;

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="max-w-[960px] mx-auto px-6 md:px-10 py-10">
        {/* Greeting */}
        <header className="mb-6">
          <h1
            className="text-[24px] font-semibold leading-[1.2]"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Good morning, {firstName}
          </h1>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard
            icon={Briefcase}
            label="Active deals"
            value={String(active)}
            hint={`${currency.format(DEALS.reduce((s, d) => s + d.amount, 0))} pipeline`}
          />
          <StatCard
            icon={AlertCircle}
            label="Needs attention"
            value={String(needAttention)}
            hint="Unresolved mandatory items"
            accent="error"
          />
          <StatCard
            icon={CheckCircle2}
            label="Ready to submit"
            value={String(readyToSubmit)}
            hint="All phases complete"
            accent="success"
          />
        </div>

        {/* Section header with New Deal button */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-[10px] uppercase font-semibold"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.8px",
            }}
          >
            Your deals
          </div>
          <button
            type="button"
            onClick={onNewDeal}
            className="interactive-primary inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-semibold text-white cursor-pointer"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <Plus size={13} strokeWidth={2.6} />
            New Deal
          </button>
        </div>

        {/* Deal list */}
        <div
          className="overflow-hidden"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          {DEALS.map((deal, i) => (
            <DealRow
              key={deal.id}
              deal={deal}
              onClick={() => onOpenDeal(deal.id)}
              isLast={i === DEALS.length - 1}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function DealRow({
  deal,
  onClick,
  isLast,
}: {
  deal: DashboardDeal;
  onClick: () => void;
  isLast: boolean;
}) {
  const Icon = deal.productIcon;
  const isReady = deal.readiness >= 90;
  const meterColor = isReady
    ? "#2e7d32"
    : deal.readiness >= 60
      ? "var(--theme-primary)"
      : "var(--theme-text-tertiary)";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--theme-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--theme-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Product icon */}
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 32,
          height: 32,
          background: "var(--westpac-primary-soft)",
          borderRadius: "8px",
        }}
      >
        <Icon
          size={16}
          strokeWidth={1.9}
          style={{ color: "var(--theme-primary)" }}
        />
      </span>

      {/* Customer + product */}
      <div className="min-w-0 flex-1">
        <div
          className="text-[13px] font-semibold leading-tight truncate"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {deal.customerName}
        </div>
        <div
          className="text-[11px] mt-0.5 truncate"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {deal.productLabel}
        </div>
      </div>

      {/* Phase */}
      <div
        className="hidden sm:block shrink-0 text-[11px] font-medium px-2 py-0.5"
        style={{
          color: "var(--theme-text-secondary)",
          background: "var(--theme-surface-subtle)",
          borderRadius: "999px",
        }}
      >
        {PHASE_LABEL[deal.phase]}
      </div>

      {/* Amount */}
      <div
        className="hidden md:block shrink-0 text-[13px] font-semibold tabular-nums text-right"
        style={{
          color: "var(--theme-text-primary)",
          fontFamily: "var(--theme-font-mono)",
          minWidth: "80px",
        }}
      >
        {currency.format(deal.amount)}
      </div>

      {/* Readiness */}
      <div className="shrink-0 flex items-center gap-2" style={{ minWidth: "70px" }}>
        <div
          className="overflow-hidden"
          style={{
            width: 48,
            height: 3,
            background: "var(--theme-border)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: `${deal.readiness}%`,
              height: "100%",
              background: meterColor,
            }}
          />
        </div>
        <span
          className="text-[11px] tabular-nums font-semibold"
          style={{
            color: meterColor,
            fontFamily: "var(--theme-font-mono)",
          }}
        >
          {deal.readiness}
        </span>
      </div>

      {/* Status badge */}
      <div className="shrink-0" style={{ minWidth: "20px" }}>
        {deal.redFlag ? (
          <AlertCircle
            size={14}
            strokeWidth={2.2}
            style={{ color: "var(--theme-error)" }}
          />
        ) : isReady ? (
          <CheckCircle2
            size={14}
            strokeWidth={2.2}
            style={{ color: "#2e7d32" }}
          />
        ) : null}
      </div>

      {/* Updated */}
      <div
        className="hidden lg:block shrink-0 text-[11px] text-right"
        style={{
          color: "var(--theme-text-tertiary)",
          minWidth: "70px",
        }}
      >
        {deal.updatedLabel}
      </div>

      <ArrowUpRight
        size={13}
        strokeWidth={2.2}
        style={{ color: "var(--theme-text-tertiary)" }}
        className="shrink-0"
      />
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
  hint: string;
  accent?: "error" | "success";
}) {
  const valueColor =
    accent === "error"
      ? "var(--theme-error)"
      : accent === "success"
        ? "#2e7d32"
        : "var(--theme-text-primary)";
  const iconColor =
    accent === "error"
      ? "var(--theme-error)"
      : accent === "success"
        ? "#2e7d32"
        : "var(--theme-primary)";

  return (
    <div
      className="p-4 flex items-center gap-3"
      style={{
        background: "var(--theme-surface-subtle)",
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0 self-stretch"
        style={{
          width: 52,
          minHeight: 52,
          background: "#f0f0f0",
          borderRadius: "10px",
        }}
      >
        <Icon size={22} strokeWidth={1.8} style={{ color: iconColor }} />
      </span>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase font-semibold"
          style={{
            color: "var(--theme-text-tertiary)",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </div>
        <div
          className="text-[20px] font-semibold leading-tight tabular-nums"
          style={{ color: valueColor }}
        >
          {value}
        </div>
        <div
          className="text-[10.5px] mt-0.5"
          style={{ color: "var(--theme-text-tertiary)" }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
}
