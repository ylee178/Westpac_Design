"use client";

/**
 * Simplified deal ribbon — the slim white row that sits directly
 * under the masthead and above the spine.
 *
 * Replaces the overloaded `DealMetaStrip`. Shows four things only:
 *
 *   1. Deal identity line (id + customer + product · amount · juris · CDD)
 *   2. Ready to Submit number
 *   3. Progress bar with the submit-at threshold marker
 *   4. A single, specific action hint derived from current state
 *
 * Red is only used for a true blocking condition (unresolved
 * legally-mandatory item). Normal early progression is neutral
 * gray / blue / green.
 */
import type { Deal } from "@/lib/types";
import type { DealState } from "@/lib/deal-state";
import { readinessTier, deriveActionHint } from "@/lib/deal-state";
import { productLabel } from "@/data/product-options";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const SUBMIT_THRESHOLD = 90;

interface Props {
  deal: Deal;
  state: DealState;
}

function modeLabel(cdd: Deal["cddMode"]): string {
  return cdd === "reform-cdd" ? "Reform CDD" : "Legacy ACIP";
}

export function DealRibbon({ deal, state }: Props) {
  const { breakdown, redFlags } = state;
  const tier = readinessTier(breakdown.total, redFlags.length > 0);
  const actionHint = deriveActionHint(state);
  const barFill = Math.min(100, Math.max(0, breakdown.total));
  const fillColor = tier.fg;

  return (
    <div
      style={{
        background: "var(--theme-card-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <div className="max-w-[1584px] mx-auto px-6 md:px-8 py-3 flex items-center gap-6 flex-wrap">
        {/* Deal identity line */}
        <div className="min-w-0 flex-1">
          <div
            className="flex items-center gap-2 text-[10px] uppercase font-medium mb-1"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            <span>Deal</span>
            <span style={{ fontFamily: "var(--theme-font-mono)" }}>
              {deal.id}
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span
              className="text-[15px] font-semibold leading-tight"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {deal.customerName}
            </span>
            <span
              className="text-[12px] leading-tight"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {productLabel(deal.product)}
              <Dot />
              <span
                style={{
                  fontFamily: "var(--theme-font-mono)",
                  color: "var(--theme-text-primary)",
                  fontWeight: 500,
                }}
              >
                {currency.format(deal.amount)}
              </span>
              <Dot />
              {deal.jurisdiction}
              <Dot />
              {modeLabel(deal.cddMode)}
            </span>
          </div>
        </div>

        {/* Ready to Submit block */}
        <div
          className="shrink-0 flex items-center gap-4 pl-6"
          style={{ borderLeft: "1px solid var(--theme-border)" }}
        >
          <div className="flex flex-col leading-tight">
            <span
              className="text-[10px] uppercase font-medium"
              style={{
                color: "var(--theme-text-tertiary)",
                letterSpacing: "0.5px",
              }}
            >
              Ready to Submit
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="text-[26px] font-semibold tabular-nums leading-none"
                style={{
                  color: fillColor,
                  fontFamily: "var(--theme-font-mono)",
                  letterSpacing: "-0.5px",
                  transition: "color 320ms ease",
                }}
              >
                {breakdown.total}
                <span
                  className="text-[13px] font-medium ml-0.5"
                  style={{ opacity: 0.7 }}
                >
                  %
                </span>
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: fillColor }}
              >
                {tier.label}
              </span>
            </div>
            <ProgressBar
              percent={barFill}
              fillColor={fillColor}
              threshold={SUBMIT_THRESHOLD}
            />
            {actionHint ? (
              <ActionHint hint={actionHint} isBlocked={redFlags.length > 0} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span
      style={{
        color: "var(--theme-text-tertiary)",
        margin: "0 6px",
      }}
    >
      ·
    </span>
  );
}

function ProgressBar({
  percent,
  fillColor,
  threshold,
}: {
  percent: number;
  fillColor: string;
  threshold: number;
}) {
  return (
    <div
      className="relative mt-1.5"
      style={{
        width: "260px",
        height: "6px",
        background: "var(--theme-border)",
        borderRadius: "3px",
      }}
      aria-hidden="true"
    >
      <div
        className="h-full"
        style={{
          width: `${percent}%`,
          background: fillColor,
          borderRadius: "3px",
          transition: "width 420ms ease, background-color 320ms ease",
        }}
      />
      {/* Submit threshold marker */}
      <div
        style={{
          position: "absolute",
          left: `${threshold}%`,
          top: "-2px",
          bottom: "-2px",
          width: "1.5px",
          background: "var(--theme-text-tertiary)",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${threshold}%`,
          top: "10px",
          transform: "translateX(-50%)",
          fontSize: "8px",
          letterSpacing: "0.5px",
          color: "var(--theme-text-tertiary)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        Submit at {threshold}%
      </div>
    </div>
  );
}

function ActionHint({
  hint,
  isBlocked,
}: {
  hint: string;
  isBlocked: boolean;
}) {
  const color = isBlocked ? "#c62828" : "var(--theme-text-secondary)";
  const Icon = isBlocked ? AlertTriangle : CheckCircle2;
  return (
    <div
      className="mt-5 flex items-center gap-1 text-[10.5px] font-medium leading-tight"
      style={{ color }}
    >
      <Icon size={10} strokeWidth={2.4} />
      {hint}
    </div>
  );
}
