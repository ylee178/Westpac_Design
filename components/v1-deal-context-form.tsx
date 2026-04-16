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
import { useEffect, useRef, useState } from "react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { Skeleton } from "@/components/skeleton";
import { validateAmount } from "@/data/product-options";
import { ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";

const EXISTING_CUSTOMERS = [
  "Meridian Logistics Pty Ltd",
  "Harbourline Fabrication Pty Ltd",
  "Kowari Vineyards",
  "Solvent Creative Group",
  "Parkline Logistics",
  "Coastal Marine Services Pty Ltd",
  "Northgate Property Holdings",
  "Apex Civil Contractors",
];

export function V1DealContextForm() {
  const { draft, setDraft, setStep } = useFlowMode();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isExistingOnly = draft.product === "business-overdraft";
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 550);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mounted && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [mounted]);

  const nameError =
    draft.customerName.trim().length > 0 && draft.customerName.trim().length < 3
      ? "Use at least 3 characters."
      : null;
  const amountError =
    draft.amount.trim().length > 0
      ? validateAmount(draft.amount, draft.product)
      : null;
  const canContinue =
    draft.customerName.trim().length >= 3 &&
    draft.amount.trim().length > 0 &&
    amountError === null &&
    nameError === null;

  function handleSubmit() {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    // Short spinner beat so the submit feels committed before the
    // dynamic-loading phase takes over.
    setTimeout(() => {
      setStep("loading");
    }, 900);
  }

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
          className="interactive-subtle inline-flex items-center gap-1.5 text-[12px] mb-4 font-medium cursor-pointer"
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
          {isExistingOnly ? (
            <CustomerSearch
              value={draft.customerName}
              onSelect={(v) => setDraft({ customerName: v })}
              autoFocus={mounted}
            />
          ) : (
            <Field
              label="Customer name"
              required
              value={draft.customerName}
              onChange={(v) => setDraft({ customerName: v })}
              placeholder="e.g. Meridian Logistics Pty Ltd"
              error={nameError}
              inputRef={nameInputRef}
            />
          )}
          <Field
            label="Deal amount (AUD)"
            required
            value={draft.amount}
            // Strip any non-digit/comma so the $ prefix is always
            // visually leading and the user just types the number.
            onChange={(v) => setDraft({ amount: v.replace(/[^0-9,]/g, "") })}
            placeholder="0"
            mono
            prefix="$"
            error={amountError}
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
            onClick={handleSubmit}
            disabled={!canContinue || submitting}
            className="interactive-primary inline-flex items-center gap-2 h-11 px-5 text-[13px] font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
              minWidth: "146px",
              justifyContent: "center",
            }}
          >
            {submitting ? (
              <>
                <Loader2
                  size={14}
                  strokeWidth={2.8}
                  className="animate-spin"
                />
                Setting up…
              </>
            ) : (
              <>
                Set up deal
                <ArrowRight size={13} strokeWidth={2.5} />
              </>
            )}
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
  prefix,
  error,
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  mono?: boolean;
  multiline?: boolean;
  prefix?: string;
  error?: string | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const commonStyle: React.CSSProperties = {
    background: "var(--theme-card-bg)",
    border: error
      ? "1px solid var(--theme-error)"
      : "1px solid var(--theme-border-strong)",
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
      ) : prefix ? (
        <div
          className="w-full h-10 flex items-stretch overflow-hidden focus-within:ring-2"
          style={commonStyle}
        >
          <span
            className="flex items-center justify-center pl-3 pr-1 text-[13px] select-none"
            style={{
              color: "var(--theme-text-primary)",
              fontFamily: mono
                ? "var(--theme-font-mono)"
                : "var(--theme-font-sans)",
              fontWeight: 400,
            }}
          >
            {prefix}
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none pl-1 pr-3 text-[13px]"
            style={{
              color: "var(--theme-text-primary)",
              fontFamily: mono
                ? "var(--theme-font-mono)"
                : "var(--theme-font-sans)",
            }}
          />
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 px-3 text-[13px] focus:outline-none focus-visible:ring-2"
          style={commonStyle}
        />
      )}
      {error ? (
        <div
          className="mt-1.5 text-[11px] font-medium"
          style={{ color: "var(--theme-error)" }}
        >
          {error}
        </div>
      ) : null}
    </label>
  );
}

function CustomerSearch({
  value,
  onSelect,
  autoFocus,
}: {
  value: string;
  onSelect: (v: string) => void;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selected = value.length >= 3;

  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  const filtered = query.length > 0
    ? EXISTING_CUSTOMERS.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase()),
      )
    : EXISTING_CUSTOMERS;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePick(name: string) {
    setQuery(name);
    onSelect(name);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="text-[11px] font-semibold mb-1.5 flex items-center gap-1"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        Customer name
        <span style={{ color: "var(--theme-error)" }}>*</span>
        <span
          className="ml-1 px-1.5 py-[1px] text-[9px] uppercase font-semibold"
          style={{
            background: "rgba(0, 0, 0, 0.07)",
            color: "var(--theme-text-tertiary)",
            borderRadius: "999px",
            letterSpacing: "0.3px",
          }}
        >
          Existing customer
        </span>
      </div>
      <div
        className="w-full h-10 flex items-center gap-2 px-3 focus-within:ring-2"
        style={{
          background: "var(--theme-card-bg)",
          border: `1px solid ${
            selected
              ? "var(--theme-primary)"
              : "var(--theme-border-strong)"
          }`,
          borderRadius: "var(--theme-radius)",
        }}
      >
        <Search
          size={13}
          strokeWidth={2.2}
          style={{ color: "var(--theme-text-tertiary)", flexShrink: 0 }}
        />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (selected && e.target.value !== value) {
              onSelect("");
            }
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search existing customers…"
          className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-[13px]"
          style={{ color: "var(--theme-text-primary)" }}
        />
      </div>
      {open && filtered.length > 0 ? (
        <ul
          className="absolute z-20 mt-1 w-full max-h-[200px] overflow-y-auto py-1"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            boxShadow: "var(--theme-shadow-float)",
          }}
        >
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => handlePick(name)}
                className="w-full text-left px-3 py-2 text-[13px] cursor-pointer"
                style={{ color: "var(--theme-text-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--westpac-primary-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : open && query.length > 0 && filtered.length === 0 ? (
        <div
          className="absolute z-20 mt-1 w-full px-3 py-3 text-[12px]"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
            boxShadow: "var(--theme-shadow-float)",
            color: "var(--theme-text-tertiary)",
          }}
        >
          No matching customer found
        </div>
      ) : null}
    </div>
  );
}
