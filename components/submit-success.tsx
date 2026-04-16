"use client";

/**
 * Submit success — terminal state of the deal flow. Shown after the
 * banker completes every phase and clicks "Submit deal" in the
 * ribbon. Full-screen takeover (like loading) so the moment lands:
 * sidebar, ribbon, and Pac panel are all hidden by page.tsx for
 * step === "complete".
 */
import type { Deal } from "@/lib/types";
import { productLabel } from "@/data/product-options";
import { Check, FileCheck2, Plus } from "lucide-react";

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

interface Props {
  deal: Deal;
  onStartNew: () => void;
}

export function SubmitSuccess({ deal, onStartNew }: Props) {
  return (
    <main
      className="flex-1 flex items-center justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div
        className="w-full max-w-[560px] flex flex-col items-center text-center"
        style={{
          opacity: 0,
          animation: "fade-in 480ms ease-out 120ms forwards",
        }}
      >
        {/* Success icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 mb-5"
          style={{
            background: "#f0f9f2",
            border: "2px solid #bfe4c6",
            borderRadius: "50%",
            animation: "pop-in 480ms ease-out 180ms both",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-10 h-10"
            style={{ background: "#2e7d32", borderRadius: "50%" }}
          >
            <Check size={20} strokeWidth={3} color="white" />
          </div>
        </div>

        <div
          className="text-[10px] uppercase font-semibold mb-2"
          style={{
            color: "#2e7d32",
            letterSpacing: "0.6px",
          }}
        >
          Deal submitted
        </div>

        <h1
          className="text-[26px] font-semibold leading-[1.2]"
          style={{ color: "var(--theme-text-primary)" }}
        >
          {deal.customerName}
        </h1>
        <p
          className="text-[14px] mt-1.5"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          {productLabel(deal.product)} · {currency.format(deal.amount)} ·{" "}
          {deal.jurisdiction}
        </p>

        {/* Detail receipt */}
        <div
          className="mt-6 w-full text-left"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius-lg)",
          }}
        >
          <ReceiptRow label="Deal ID" value={deal.id} mono />
          <ReceiptRow
            label="Status"
            value="Submitted for credit decisioning"
          />
          <ReceiptRow
            label="Next step"
            value="Credit review will begin within 1 business day"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={onStartNew}
            className="interactive-primary inline-flex items-center gap-2 h-11 px-5 text-[13px] font-semibold text-white cursor-pointer"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <Plus size={14} strokeWidth={2.8} />
            Start a new deal
          </button>
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-medium h-11 px-3"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            <FileCheck2 size={12} strokeWidth={2.2} />
            Submission logged to audit trail
          </div>
        </div>
      </div>
    </main>
  );
}

function ReceiptRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-[110px_1fr] gap-4 px-4 py-3 border-t first:border-t-0 items-baseline"
      style={{ borderColor: "var(--theme-border)" }}
    >
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
        className="text-[13px] leading-[1.45]"
        style={{
          color: "var(--theme-text-primary)",
          fontFamily: mono ? "var(--theme-font-mono)" : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}
