"use client";

/**
 * Deals Dashboard — the banker's landing surface.
 *
 * A bento-grid of the banker's active and recent deals plus two
 * "at-a-glance" summary tiles (queue counts and team SLA). The
 * banker picks a deal to resume, or kicks off a new one via the
 * "New Deal" button in the masthead.
 */
import { useMemo } from "react";
import type { Phase } from "@/lib/types";
import { PHASES, SAMPLE_DEAL } from "@/data/deal-data";
import {
  ArrowUpRight,
  Briefcase,
  Banknote,
  ShieldCheck,
  Wrench,
  Wallet,
  Clock,
  AlertCircle,
  TrendingUp,
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
  accent?: "primary" | "warn" | "ok" | "neutral";
};

const DEALS: DashboardDeal[] = [
  {
    id: SAMPLE_DEAL.id,
    customerName: SAMPLE_DEAL.customerName,
    productLabel: "Bank guarantee · Performance bond",
    productIcon: ShieldCheck,
    amount: SAMPLE_DEAL.amount,
    phase: "identification",
    updatedLabel: "Updated 12m ago",
    readiness: 58,
    redFlag: true,
    accent: "warn",
  },
  {
    id: "BE-2026-00398",
    customerName: "Harbourline Fabrication Pty Ltd",
    productLabel: "Business loan · Working capital",
    productIcon: Banknote,
    amount: 450_000,
    phase: "credit",
    updatedLabel: "Updated 2h ago",
    readiness: 72,
    accent: "primary",
  },
  {
    id: "BE-2026-00377",
    customerName: "Kowari Vineyards",
    productLabel: "Equipment finance · Tractor fleet",
    productIcon: Wrench,
    amount: 210_000,
    phase: "approval",
    updatedLabel: "Updated yesterday",
    readiness: 88,
    accent: "ok",
  },
  {
    id: "BE-2026-00361",
    customerName: "Solvent Creative Group",
    productLabel: "Business overdraft · Seasonal",
    productIcon: Wallet,
    amount: 120_000,
    phase: "settlement",
    updatedLabel: "Updated 3 days ago",
    readiness: 94,
    accent: "neutral",
  },
  {
    id: "BE-2026-00342",
    customerName: "Parkline Logistics",
    productLabel: "Business loan · Fitout",
    productIcon: Banknote,
    amount: 680_000,
    phase: "setup",
    updatedLabel: "Updated 4 days ago",
    readiness: 18,
    accent: "neutral",
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

  const stats = useMemo(() => {
    const active = DEALS.length;
    const redFlags = DEALS.filter((d) => d.redFlag).length;
    const readyToSubmit = DEALS.filter((d) => d.readiness >= 90).length;
    return { active, redFlags, readyToSubmit };
  }, []);

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        {/* Greeting row */}
        <header className="flex items-end justify-between mb-8 gap-6 flex-wrap">
          <div>
            <div
              className="text-[11px] uppercase font-semibold"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.8px",
              }}
            >
              Your workspace
            </div>
            <h1
              className="text-[26px] font-semibold leading-[1.2] mt-1"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Good morning, {firstName}
            </h1>
            <p
              className="text-[13px] mt-1"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {stats.active} active deals · {stats.redFlags} need attention ·{" "}
              {stats.readyToSubmit} ready to submit
            </p>
          </div>
        </header>

        {/* Bento grid */}
        <div className="grid grid-cols-12 auto-rows-[128px] gap-4">
          {/* Big feature tile — most-urgent deal (red flag) */}
          <FeatureDealTile
            deal={DEALS[0]}
            onOpenDeal={onOpenDeal}
            className="col-span-12 lg:col-span-7 row-span-2"
          />

          {/* Summary: pending actions */}
          <StatTile
            className="col-span-6 lg:col-span-5"
            label="Pending actions"
            value="7"
            hint="3 banker · 2 customer · 2 system"
            icon={Clock}
            accent="primary"
          />

          {/* Summary: team SLA */}
          <StatTile
            className="col-span-6 lg:col-span-5"
            label="Avg. time to submit"
            value="4.2d"
            hint="−0.6d vs last month"
            icon={TrendingUp}
            accent="ok"
          />

          {/* Medium deal tiles */}
          {DEALS.slice(1).map((d, i) => (
            <DealTile
              key={d.id}
              deal={d}
              onOpenDeal={onOpenDeal}
              className={`col-span-12 md:col-span-6 ${
                i === 0 ? "lg:col-span-6" : "lg:col-span-6"
              } row-span-2`}
            />
          ))}

          {/* New deal CTA tile */}
          <NewDealTile
            onNewDeal={onNewDeal}
            className="col-span-12 lg:col-span-12 row-span-1"
          />
        </div>
      </div>
    </main>
  );
}

// ——— Tiles ———

function FeatureDealTile({
  deal,
  onOpenDeal,
  className,
}: {
  deal: DashboardDeal;
  onOpenDeal: (id: string) => void;
  className: string;
}) {
  const Icon = deal.productIcon;
  return (
    <button
      type="button"
      onClick={() => onOpenDeal(deal.id)}
      className={`interactive-card ${className} text-left flex flex-col p-5 cursor-pointer`}
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid var(--theme-border)",
        borderLeft: "3px solid var(--theme-error)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{
              width: 40,
              height: 40,
              background: "var(--westpac-primary-soft)",
              borderRadius: "10px",
            }}
          >
            <Icon
              size={20}
              strokeWidth={1.9}
              style={{ color: "var(--theme-primary)" }}
            />
          </span>
          <div className="min-w-0">
            <div
              className="text-[10px] uppercase font-semibold tabular-nums"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.6px",
                fontFamily: "var(--theme-font-mono)",
              }}
            >
              {deal.id}
            </div>
            <div
              className="text-[17px] font-semibold leading-tight mt-0.5 truncate"
              style={{ color: "var(--theme-primary)" }}
            >
              {deal.customerName}
            </div>
            <div
              className="text-[12px] mt-0.5"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {deal.productLabel}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase shrink-0 px-2 py-1"
          style={{
            color: "var(--theme-error)",
            background: "#fdecec",
            borderRadius: "4px",
            letterSpacing: "0.4px",
          }}
        >
          <AlertCircle size={11} strokeWidth={2.5} />
          Needs attention
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <div
            className="text-[10px] uppercase font-semibold"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Amount
          </div>
          <div
            className="text-[20px] font-semibold tabular-nums leading-tight"
            style={{
              color: "var(--theme-text-primary)",
              fontFamily: "var(--theme-font-mono)",
            }}
          >
            {currency.format(deal.amount)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <ReadinessMeter percent={deal.readiness} />
          <span
            className="text-[11px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {PHASE_LABEL[deal.phase]} · {deal.updatedLabel}
          </span>
        </div>
      </div>
    </button>
  );
}

function DealTile({
  deal,
  onOpenDeal,
  className,
}: {
  deal: DashboardDeal;
  onOpenDeal: (id: string) => void;
  className: string;
}) {
  const Icon = deal.productIcon;
  return (
    <button
      type="button"
      onClick={() => onOpenDeal(deal.id)}
      className={`interactive-card ${className} text-left flex flex-col p-4 cursor-pointer`}
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: 34,
            height: 34,
            background: "var(--westpac-primary-soft)",
            borderRadius: "8px",
          }}
        >
          <Icon
            size={17}
            strokeWidth={1.9}
            style={{ color: "var(--theme-primary)" }}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="text-[10px] uppercase font-semibold tabular-nums"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
              fontFamily: "var(--theme-font-mono)",
            }}
          >
            {deal.id}
          </div>
          <div
            className="text-[14px] font-semibold leading-tight mt-0.5 truncate"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {deal.customerName}
          </div>
          <div
            className="text-[11.5px] mt-0.5 truncate"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {deal.productLabel}
          </div>
        </div>
        <ArrowUpRight
          size={14}
          strokeWidth={2.2}
          style={{ color: "var(--theme-text-tertiary)" }}
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-end justify-between gap-3">
        <div>
          <div
            className="text-[9px] uppercase font-semibold"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Amount
          </div>
          <div
            className="text-[14px] font-semibold tabular-nums leading-tight"
            style={{
              color: "var(--theme-text-primary)",
              fontFamily: "var(--theme-font-mono)",
            }}
          >
            {currency.format(deal.amount)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-0">
          <ReadinessMeter percent={deal.readiness} compact />
          <span
            className="text-[10.5px] truncate max-w-[160px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {PHASE_LABEL[deal.phase]} · {deal.updatedLabel}
          </span>
        </div>
      </div>
    </button>
  );
}

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  className,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Clock;
  accent: "primary" | "ok" | "warn";
  className: string;
}) {
  const color =
    accent === "ok"
      ? "#2e7d32"
      : accent === "warn"
        ? "var(--theme-error)"
        : "var(--theme-primary)";
  return (
    <div
      className={`${className} p-4 flex items-center gap-4`}
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid var(--theme-border)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 40,
          height: 40,
          background: "var(--westpac-primary-soft)",
          borderRadius: "10px",
        }}
      >
        <Icon size={19} strokeWidth={1.9} style={{ color }} />
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
          className="text-[22px] font-semibold leading-tight tabular-nums"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {value}
        </div>
        <div
          className="text-[11px]"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
}

function NewDealTile({
  onNewDeal,
  className,
}: {
  onNewDeal: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onNewDeal}
      className={`${className} interactive-card text-left p-4 flex items-center justify-between gap-4 cursor-pointer`}
      style={{
        background: "var(--westpac-primary-soft)",
        border: "1px dashed var(--theme-primary)",
        borderRadius: "var(--theme-radius)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "var(--theme-primary)",
            borderRadius: "10px",
          }}
        >
          <Briefcase size={17} strokeWidth={2.1} color="#fff" />
        </span>
        <div>
          <div
            className="text-[13px] font-semibold"
            style={{ color: "var(--theme-primary)" }}
          >
            Start a new deal
          </div>
          <div
            className="text-[11.5px]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Pick a product, entity, and amount — we&apos;ll build the checklist.
          </div>
        </div>
      </div>
      <ArrowUpRight
        size={16}
        strokeWidth={2.2}
        style={{ color: "var(--theme-primary)" }}
      />
    </button>
  );
}

// ——— Readiness mini-meter ———

function ReadinessMeter({
  percent,
  compact = false,
}: {
  percent: number;
  compact?: boolean;
}) {
  const fg =
    percent >= 90
      ? "#2e7d32"
      : percent >= 60
        ? "var(--theme-primary)"
        : "var(--theme-text-tertiary)";
  const width = compact ? 96 : 140;
  return (
    <div className="flex items-center gap-2">
      <div
        className="overflow-hidden"
        style={{
          width,
          height: 4,
          background: "var(--theme-border)",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: fg,
          }}
        />
      </div>
      <span
        className="text-[11px] tabular-nums font-semibold"
        style={{
          color: fg,
          fontFamily: "var(--theme-font-mono)",
        }}
      >
        {percent}
      </span>
    </div>
  );
}
