"use client";

/**
 * Slim deal ribbon — the white row directly under the masthead.
 * Only job now: show the deal identity line so the banker always
 * knows which deal the main area is about. Readiness + submit
 * moved into the left sidebar so the sidebar is the single
 * overall-navigation surface.
 */
import type { Deal } from "@/lib/types";
import { productLabel } from "@/data/product-options";

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

interface Props {
  deal: Deal;
}

function modeLabel(cdd: Deal["cddMode"]): string {
  return cdd === "reform-cdd" ? "Reform CDD" : "Legacy ACIP";
}

export function DealRibbon({ deal }: Props) {
  return (
    <div
      style={{
        background: "var(--theme-card-bg)",
        borderBottom: "1px solid var(--theme-border)",
      }}
    >
      <div className="max-w-[1584px] mx-auto px-6 md:px-8 py-3 flex items-center gap-6 flex-wrap">
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="text-[15px] font-semibold leading-tight"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {deal.customerName}
            </span>
            <span
              className="text-[12px] leading-tight inline-flex items-center flex-wrap"
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
