"use client";

/**
 * V1 step 2 — Deal context form.
 * Customer name + amount + description. Feeds into the dynamic
 * loading step which will "build" the checklist against this deal.
 */
import { useFlowMode } from "@/lib/flow-mode-context";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function V1DealContextForm() {
  const { draft, setDraft, setStep } = useFlowMode();

  const canContinue = draft.customerName.trim().length > 0 && draft.amount.trim().length > 0;

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[560px]">
        <button
          type="button"
          onClick={() => setStep("empty")}
          className="inline-flex items-center gap-1.5 text-[12px] mb-4 font-medium"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <ArrowLeft size={12} strokeWidth={2.2} />
          Back
        </button>

        <header className="mb-8">
          <div
            className="text-[10px] uppercase font-semibold mb-2"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Step 2 of 2
          </div>
          <h1
            className="text-[24px] font-semibold leading-[1.25]"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Tell us about the deal
          </h1>
          <p
            className="text-[14px] mt-1.5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Basic details so we can populate the checklist.
          </p>
        </header>

        <div className="space-y-5">
          <Field
            label="Customer name"
            required
            value={draft.customerName}
            onChange={(v) => setDraft({ customerName: v })}
            placeholder="e.g. Meridian Logistics Pty Ltd"
          />
          <Field
            label="Deal amount (AUD)"
            required
            value={draft.amount}
            onChange={(v) => setDraft({ amount: v })}
            placeholder="$"
            mono
          />
          <Field
            label="Brief description (optional)"
            value={draft.description}
            onChange={(v) => setDraft({ description: v })}
            placeholder="e.g. Performance bond for construction contract"
            multiline
          />
        </div>

        <div className="mt-8 flex items-center justify-end">
          <button
            type="button"
            onClick={() => canContinue && setStep("loading")}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 h-11 px-5 text-[13px] font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            Set up deal
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  mono = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  mono?: boolean;
  multiline?: boolean;
}) {
  const commonStyle: React.CSSProperties = {
    background: "var(--theme-card-bg)",
    border: "1px solid var(--theme-border-strong)",
    borderRadius: "var(--theme-radius)",
    color: "var(--theme-text-primary)",
    fontFamily: mono ? "var(--theme-font-mono)" : "inherit",
  };
  return (
    <label className="block">
      <div
        className="text-[11px] font-semibold mb-1.5 flex items-center gap-1"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        {label}
        {required ? (
          <span style={{ color: "var(--theme-error)" }}>*</span>
        ) : null}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 text-[13px] focus:outline-none focus-visible:ring-2"
          style={commonStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 px-3 text-[13px] focus:outline-none focus-visible:ring-2"
          style={commonStyle}
        />
      )}
    </label>
  );
}
