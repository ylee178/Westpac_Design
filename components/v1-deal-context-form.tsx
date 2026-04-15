"use client";

/**
 * V1 step 2 — Deal context form.
 * Customer name + amount + description. Feeds into the dynamic
 * loading step which will "build" the checklist against this deal.
 *
 * On mount, the form briefly (~550ms) renders as skeletons so the
 * empty→creator navigation has a proper page-transition feel instead
 * of a hard snap. This mirrors the skeleton language used in
 * V1EmptyState's staged reveals and in V1DynamicLoading.
 */
import { useEffect, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { Skeleton } from "@/components/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function V1DealContextForm() {
  const { draft, setDraft, setStep } = useFlowMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 550);
    return () => clearTimeout(t);
  }, []);

  const canContinue = draft.customerName.trim().length > 0 && draft.amount.trim().length > 0;

  if (!mounted) {
    return (
      <main
        className="flex-1 flex items-start justify-center py-12 px-6"
        style={{ background: "var(--theme-page-bg)" }}
      >
        <div className="w-full max-w-[560px]">
          <div className="mb-4">
            <Skeleton variant="text" width="40px" height="14px" />
          </div>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton variant="text" width="70px" height="10px" />
            <Skeleton variant="text" width="260px" height="26px" />
            <Skeleton variant="text" width="320px" height="14px" />
          </div>
          <div className="space-y-5">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton tall />
          </div>
          <div className="mt-8 flex items-center justify-end">
            <Skeleton variant="button" width="140px" height={44} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 flex items-start justify-center py-12 px-6 animate-fade-in"
      style={{ background: "var(--theme-page-bg)" }}
    >
      <div className="w-full max-w-[560px]">
        <button
          type="button"
          onClick={() => setStep("empty")}
          className="inline-flex items-center gap-1.5 text-[12px] mb-4 font-medium cursor-pointer"
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
            className="inline-flex items-center gap-2 h-11 px-5 text-[13px] font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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

function FieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton variant="text" width="90px" height="11px" />
      <Skeleton
        variant="button"
        width="100%"
        height={tall ? 72 : 40}
      />
    </div>
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
