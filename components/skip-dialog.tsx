"use client";

/**
 * D2 — Skip dialog with structured reason picker + "Other" safety valve.
 * Submit button is disabled until the banker makes a deliberate choice.
 * Address D2's known failure mode (lazy free-text reasons → audit noise).
 */
import { useEffect, useRef, useState } from "react";
import type { ChecklistItem } from "@/lib/types";
import { SKIP_REASON_OPTIONS } from "@/data/deal-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  item: ChecklistItem | null;
  onCancel: () => void;
  onConfirm: (payload: { category: string; freeText?: string }) => void;
}

export function SkipDialog({ open, item, onCancel, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const freeTextRef = useRef<HTMLInputElement>(null);

  // Jump focus to the "Brief explanation" field the moment the banker
  // picks "Other" — saves a mandatory click since that field is the
  // only thing keeping Submit disabled in that branch.
  useEffect(() => {
    if (selectedId === "other") {
      // Defer one frame so the input has definitely mounted before we
      // try to focus it.
      const id = requestAnimationFrame(() => {
        freeTextRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [selectedId]);

  // Derived — Submit is enabled only when a category is picked AND, if "Other",
  // free text is non-empty.
  const canSubmit =
    selectedId !== null &&
    (selectedId !== "other" || freeText.trim().length > 0);

  function handleConfirm() {
    if (!selectedId) return;
    const option = SKIP_REASON_OPTIONS.find((o) => o.id === selectedId);
    onConfirm({
      category: option?.label ?? selectedId,
      freeText: selectedId === "other" ? freeText.trim() : undefined,
    });
    // Reset for next open
    setSelectedId(null);
    setFreeText("");
  }

  function handleCancel() {
    setSelectedId(null);
    setFreeText("");
    onCancel();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : handleCancel())}>
      <DialogContent
        showCloseButton={false}
        // Override the Dialog primitive's sm:max-w-sm (384px) and grid
        // gap via inline style so our 560px width + flush-edge layout
        // win regardless of Tailwind specificity order.
        className="p-0 gap-0 block"
        style={{
          background: "var(--theme-card-bg)",
          borderColor: "var(--theme-border-strong)",
          borderRadius: "var(--theme-radius-lg)",
          maxWidth: "560px",
          width: "calc(100% - 2rem)",
        }}
      >
        <DialogHeader
          className="px-6 pt-5 pb-3 relative"
          style={{ borderBottom: "1px solid var(--theme-border)" }}
        >
          <div
            className="text-[10px] uppercase font-medium flex items-center gap-1.5"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            <AlertTriangle size={11} strokeWidth={2} />
            Skip with reason · D2
          </div>
          <DialogTitle
            className="text-[18px] leading-[1.35] mt-1 font-medium"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {item ? item.label : "Skip this step"}
          </DialogTitle>
          <DialogDescription
            className="text-[13px] leading-[1.5] mt-1"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            Select a reason category below. If none match, choose
            "Other" and describe briefly. Logged to the audit trail.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-2.5 max-h-[400px] overflow-y-auto">
          {SKIP_REASON_OPTIONS.map((opt) => {
            const selected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedId(opt.id)}
                className="interactive-card w-full text-left px-4 py-3 border cursor-pointer"
                style={{
                  backgroundColor: selected
                    ? "var(--theme-accent-bg)"
                    : "var(--theme-card-bg)",
                  borderColor: selected
                    ? "var(--theme-primary)"
                    : "var(--theme-border)",
                  borderWidth: selected ? "2px" : "1px",
                  borderRadius: "var(--theme-radius)",
                }}
              >
                <div
                  className="text-[13px] font-semibold leading-[1.3]"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {opt.label}
                </div>
                {opt.description ? (
                  <div
                    className="text-[12px] mt-1 leading-[1.4]"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {opt.description}
                  </div>
                ) : null}
              </button>
            );
          })}

          {selectedId === "other" ? (
            <div className="pt-2">
              <Label
                htmlFor="skip-freetext"
                className="text-[11px] uppercase tracking-[0.5px] font-normal"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                Describe the reason
              </Label>
              <Input
                id="skip-freetext"
                ref={freeTextRef}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Brief explanation (required)"
                className="mt-1 h-10 border-0 border-b-2 focus-visible:ring-0"
                style={{
                  backgroundColor: "var(--theme-surface-subtle)",
                  borderBottomColor: "var(--theme-text-primary)",
                  borderRadius: "var(--theme-radius) var(--theme-radius) 0 0",
                }}
              />
            </div>
          ) : null}
        </div>

        {/* Footer — plain div so the Dialog primitive's -mx-4 -mb-4 doesn't
            collide with our p-0 layout */}
        <div
          className="flex flex-row"
          style={{ borderTop: "1px solid var(--theme-border)" }}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="interactive-subtle flex-1 h-11 text-[13px] font-medium cursor-pointer"
            style={{
              color: "var(--theme-text-primary)",
              background: "var(--theme-card-bg)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="interactive-primary flex-1 h-11 text-[13px] font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canSubmit
                ? "var(--theme-primary)"
                : "var(--theme-border-strong)",
              borderLeft: "1px solid var(--theme-border)",
            }}
          >
            Skip with reason
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
