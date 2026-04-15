"use client";

/**
 * V2 — Pac AI teammate side panel.
 *
 *   1. Header     — Pac avatar + status
 *   2. Chat area  — empty-state splash, or message thread.
 *                   Messages are of two kinds:
 *                     * reply    — response to a banker question
 *                     * guidance — proactive Pac-initiated nudge,
 *                                  surfaced automatically when a
 *                                  risk / policy / context signal
 *                                  fires against the current deal.
 *                   Guidance messages render with a category label
 *                   and optional help link so they're visually
 *                   distinct from chat replies.
 *   3. Shelf      — common-question pills, swipable
 *   4. Input      — free text
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChecklistItem as CI, Deal } from "@/lib/types";
import { PacAvatar } from "@/components/pac-avatar";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Info,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useFlowMode } from "@/lib/flow-mode-context";
import { getSuggestions, type Suggestion } from "@/data/pac-briefings";
import { productLabel } from "@/data/product-options";

// ——— Message types ———
type Sender = "pac" | "banker";
type MessageKind = "reply" | "guidance";
type GuidanceCategory = "risk" | "policy" | "context" | "alert";

interface TimelineMessage {
  id: string;
  sender: Sender;
  kind: MessageKind;
  category?: GuidanceCategory;
  /** HTML-ish content — string-based for speed */
  content: string;
  /** Optional companion link rendered as a chip below the body */
  link?: { label: string; href: string };
  /** Milliseconds at which the message was created */
  createdAt: number;
}

interface Props {
  deal: Deal;
  currentFocusedItem: CI | null;
  readinessScore: number;
}

// Lending-themed "thinking" verbs for the shimmering status text.
const STATUS_VERBS = [
  "Underwriting",
  "Cross-checking AUSTRAC guidance",
  "Reviewing the deal profile",
  "Reconciling sources",
  "Crystallising a response",
  "Calibrating risk context",
];

const PAC_HUMAN_GAP_MS = 30_000;

// Visual + label metadata per guidance category.
const CATEGORY_META: Record<
  GuidanceCategory,
  {
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    accent: string;
  }
> = {
  risk: { label: "Risk flag", icon: ShieldAlert, accent: "#c62828" },
  policy: { label: "Policy note", icon: BookOpen, accent: "#7a1e3a" },
  context: { label: "Context", icon: Info, accent: "#1f6feb" },
  alert: { label: "Heads-up", icon: AlertTriangle, accent: "#b45309" },
};

// ——— Proactive guidance rules ———
// Each rule is evaluated against the current draft. When a rule's
// predicate becomes true and it hasn't been fired yet in this
// session, Pac automatically surfaces its message into the chat.
interface GuidanceRule {
  id: string;
  category: GuidanceCategory;
  match: (d: {
    product?: string;
    entity?: string;
    amountBucket?: string;
    purpose?: string;
  }) => boolean;
  body: string;
  link?: { label: string; href: string };
}

const GUIDANCE_RULES: GuidanceRule[] = [
  {
    id: "overdraft-existing-customer",
    category: "alert",
    match: (d) => d.product === "business-overdraft",
    body:
      "Business Overdraft is <strong>existing-customer only</strong>. " +
      "Confirm the applicant already banks with Westpac before you lock " +
      "in product — otherwise you'll have to backtrack at Setup.",
    link: { label: "Overdraft eligibility matrix", href: "#" },
  },
  {
    id: "bank-guarantee-wording",
    category: "risk",
    match: (d) => d.product === "bank-guarantee",
    body:
      "Bank Guarantees most often get blocked on <strong>beneficiary " +
      "wording mismatches</strong>. Ask the customer for the " +
      "beneficiary-supplied template on the first Identification item.",
    link: { label: "BG wording examples", href: "#" },
  },
  {
    id: "large-loan-pg",
    category: "policy",
    match: (d) =>
      d.product === "business-loan" &&
      (d.amountBucket === "500k-1m" || d.amountBucket === "over-1m"),
    body:
      "Loans over <strong>A$500k</strong> typically require director " +
      "personal guarantees. This shows up as a Risk-phase gate — " +
      "warn the applicant early.",
    link: { label: "PG requirement matrix", href: "#" },
  },
  {
    id: "trust-entity-kyc",
    category: "context",
    match: (d) => d.entity === "trust",
    body:
      "Trust entities add a <strong>trust deed verification</strong> " +
      "step in KYC. Make sure you have a current deed on file before " +
      "Identification.",
    link: { label: "Trust CDD guide", href: "#" },
  },
  {
    id: "equipment-ppsr",
    category: "context",
    match: (d) => d.product === "equipment-finance",
    body:
      "Equipment Finance is asset-backed — PPSR registration runs " +
      "automatically during Setup. No extra action needed, but keep " +
      "the supplier invoice handy for Identification.",
  },
];

export function V2ChatPanel({ deal, currentFocusedItem }: Props) {
  const { step, draft } = useFlowMode();
  const firstName = deal.banker.name.split(" ")[0] || "there";

  const [timeline, setTimeline] = useState<TimelineMessage[]>([]);
  const [freeText, setFreeText] = useState("");
  const [pacTyping, setPacTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firedGuidance = useRef<Set<string>>(new Set());

  // Suggestion pills are DERIVED directly from current product/step.
  const suggestions = getSuggestions(draft.product, step);

  function appendMessage(msg: Omit<TimelineMessage, "id" | "createdAt">) {
    setTimeline((t) => [
      ...t,
      {
        ...msg,
        id: `${msg.sender}-${Date.now()}-${Math.random()}`,
        createdAt: Date.now(),
      },
    ]);
  }

  function pushPacReply(content: string) {
    setPacTyping(true);
    setTimeout(() => {
      appendMessage({ sender: "pac", kind: "reply", content });
      setPacTyping(false);
    }, 2000);
  }

  function pushGuidance(rule: GuidanceRule) {
    setPacTyping(true);
    setTimeout(() => {
      appendMessage({
        sender: "pac",
        kind: "guidance",
        category: rule.category,
        content: rule.body,
        link: rule.link,
      });
      setPacTyping(false);
    }, 1400);
  }

  function pushBanker(content: string) {
    appendMessage({
      sender: "banker",
      kind: "reply",
      content: escapeHtml(content),
    });
  }

  function handlePillTap(s: Suggestion) {
    pushBanker(s.question);
    setTimeout(() => pushPacReply(s.answer), 200);
  }

  function handleSendFreeText(e: React.FormEvent) {
    e.preventDefault();
    const text = freeText.trim();
    if (!text) return;
    pushBanker(text);
    setFreeText("");
    setTimeout(() => {
      pushPacReply(
        `Understood. <em>Demo note — in production I'd parse natural ` +
          `language here. For this interview prototype the pill buttons ` +
          `drive the scripted flow.</em>`,
      );
    }, 300);
  }

  // ——— Auto-push guidance ———
  // Watch the draft and fire any guidance rules whose predicate has
  // just become true. Each rule only fires once per session (tracked
  // via firedGuidance ref) so changing-and-restoring a value doesn't
  // spam the timeline.
  useEffect(() => {
    const d = {
      product: draft.product,
      entity: draft.entity,
      amountBucket: draft.amountBucket,
      purpose: draft.purpose,
    };
    const pending = GUIDANCE_RULES.filter(
      (rule) => !firedGuidance.current.has(rule.id) && rule.match(d),
    );
    if (pending.length === 0) return;
    // Fire them one at a time with a short stagger so they don't all
    // land on the same tick.
    pending.forEach((rule, i) => {
      firedGuidance.current.add(rule.id);
      setTimeout(() => pushGuidance(rule), i * 1800);
    });
  }, [draft.product, draft.entity, draft.amountBucket, draft.purpose]);

  // Auto-scroll chat on new entries.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [timeline, pacTyping]);

  return (
    <aside
      className="flex flex-col min-w-0 w-full h-full"
      style={{
        background: "var(--theme-page-bg)",
        borderLeft: "1px solid var(--theme-border)",
      }}
    >
      {/* ——— Header: Pac status strip ——— */}
      <div
        className="shrink-0 w-full min-w-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: "var(--theme-card-bg)",
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <PacAvatar size={32} state={pacTyping ? "speaking" : "idle"} />
        <div className="min-w-0 flex-1">
          <div
            className="text-[13px] font-semibold leading-tight"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Pac AI
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span
              className="inline-block w-1.5 h-1.5"
              style={{ background: "#2e7d32", borderRadius: "50%" }}
            />
            <span style={{ color: "var(--theme-text-secondary)" }}>
              Active · Westpac AI teammate
            </span>
          </div>
        </div>
      </div>

      {/* ——— Chat thread ——— */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-3 pb-3 space-y-3 min-w-0"
        style={{ background: "var(--theme-page-bg)" }}
      >
        {timeline.length === 0 && !pacTyping ? (
          <EmptyPacGuide firstName={firstName} />
        ) : (
          timeline.map((msg, i) => {
            const prev = timeline[i - 1];
            const sameSpeakerContinuation =
              prev &&
              prev.sender === msg.sender &&
              msg.kind === "reply" &&
              prev.kind === "reply" &&
              msg.createdAt - prev.createdAt < PAC_HUMAN_GAP_MS;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                compactContinuation={sameSpeakerContinuation}
                firstName={firstName}
              />
            );
          })
        )}
        {pacTyping ? <TypingIndicator /> : null}
      </div>

      {/* ——— Common questions — swipable pill shelf ——— */}
      <SuggestionShelf suggestions={suggestions} onTap={handlePillTap} />

      {/* ——— Input ——— */}
      <form
        onSubmit={handleSendFreeText}
        className="shrink-0 p-3 flex items-center gap-2"
        style={{
          borderTop: "1px solid var(--theme-border)",
          background: "var(--theme-card-bg)",
        }}
      >
        <input
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Ask Pac anything about this deal…"
          className="flex-1 h-9 px-3 text-[12px] focus:outline-none focus-visible:ring-2 min-w-0"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border-strong)",
            borderRadius: "var(--theme-radius)",
            color: "var(--theme-text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={!freeText.trim()}
          className="interactive-primary inline-flex items-center justify-center w-9 h-9 text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: "var(--theme-primary)",
            borderRadius: "var(--theme-radius)",
          }}
          aria-label="Send"
        >
          <Send size={13} strokeWidth={2.5} />
        </button>
      </form>
    </aside>
  );
}

// ——— Empty chat state ———
// Big Pac + text guide — the chat's idle screen before any message
// has landed in the timeline.
function EmptyPacGuide({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-full py-6 px-2">
      <PacAvatar size={88} state="idle" />
      <div
        className="mt-4 text-[15px] font-semibold"
        style={{ color: "var(--theme-text-primary)" }}
      >
        Hi {firstName}. I'm Pac AI.
      </div>
      <div
        className="mt-1.5 text-[12px] leading-[1.55] max-w-[280px]"
        style={{ color: "var(--theme-text-secondary)" }}
      >
        Pick a product on the left to get started — I'll watch the
        setup and flag anything risky or policy-blocking as you go.
        Or tap a common question below.
      </div>
      <div
        className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        <Sparkles size={10} strokeWidth={2.2} />
        Proactive · policy-aware · quiet by default
      </div>
    </div>
  );
}

/** Hook: mouse drag-to-scroll for a horizontal overflow container. */
function useHorizontalDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    const DRAG_THRESHOLD = 4;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        el.scrollLeft = startScroll - dx;
        e.preventDefault();
      }
    };
    const endDrag = () => {
      isDown = false;
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);
  return ref;
}

// ——— Suggestion shelf ———
function SuggestionShelf({
  suggestions,
  onTap,
}: {
  suggestions: Suggestion[];
  onTap: (s: Suggestion) => void;
}) {
  const pillScrollRef = useHorizontalDragScroll();
  return (
    <div
      className="shrink-0 w-full min-w-0"
      style={{
        background: "#ededed",
        borderTop: "1px solid var(--theme-border)",
      }}
    >
      <div
        className="text-[9px] uppercase font-semibold px-4 pt-2.5 pb-1.5"
        style={{
          color: "var(--theme-text-tertiary)",
          letterSpacing: "0.5px",
        }}
      >
        Common questions
      </div>
      <div
        ref={pillScrollRef}
        className="flex flex-nowrap gap-2 pb-3 overflow-x-scroll min-w-0 w-full suggestion-pill-scroll cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          maxWidth: "100%",
          scrollPaddingLeft: "16px",
          scrollPaddingRight: "16px",
        }}
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onTap(s)}
            className="interactive-pill shrink-0 whitespace-nowrap px-3.5 py-1.5 text-[12px] leading-[1.3] font-medium cursor-pointer"
            style={{
              background: "var(--theme-card-bg)",
              color: "var(--theme-primary)",
              border: "1px solid var(--westpac-primary-border)",
              borderRadius: "999px",
              marginLeft: i === 0 ? 16 : 0,
              marginRight: i === suggestions.length - 1 ? 16 : 0,
            }}
          >
            {s.question}
          </button>
        ))}
      </div>
    </div>
  );
}

// ——— Message rendering ———
function MessageBubble({
  message,
  compactContinuation,
  firstName,
}: {
  message: TimelineMessage;
  compactContinuation: boolean;
  firstName: string;
}) {
  if (message.sender === "banker") {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div
          className="px-3 py-2 max-w-[260px]"
          style={{
            background: "var(--theme-primary)",
            borderRadius: "var(--theme-radius-lg)",
            borderTopRightRadius: "4px",
          }}
        >
          <span
            className="text-[12px] leading-[1.5] block"
            style={{ color: "#ffffff" }}
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        </div>
        <div
          className="flex items-center justify-center w-6 h-6 shrink-0 text-[10px] font-bold text-white"
          style={{
            background: "var(--theme-text-primary)",
            borderRadius: "50%",
          }}
        >
          {firstName[0]?.toUpperCase() ?? "S"}
        </div>
      </div>
    );
  }

  // Pac guidance card — visually distinct from chat replies.
  if (message.kind === "guidance" && message.category) {
    const meta = CATEGORY_META[message.category];
    const CategoryIcon = meta.icon;
    return (
      <div className="flex items-start gap-2">
        <div className="shrink-0 pt-0.5">
          <PacAvatar size={26} state="idle" />
        </div>
        <div
          className="flex-1 min-w-0 shimmer-message-in"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderLeft: `3px solid ${meta.accent}`,
            borderRadius: "var(--theme-radius-lg)",
            borderTopLeftRadius: "4px",
          }}
        >
          <div
            className="flex items-center gap-1.5 px-3 pt-2 text-[9px] uppercase font-bold"
            style={{
              color: meta.accent,
              letterSpacing: "0.5px",
            }}
          >
            <CategoryIcon size={10} strokeWidth={2.4} />
            {meta.label}
          </div>
          <div className="px-3 pb-2 pt-0.5">
            <span
              className="text-[12px] leading-[1.55] block"
              style={{ color: "var(--theme-text-primary)" }}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
            {message.link ? (
              <a
                href={message.link.href}
                onClick={(e) => e.preventDefault()}
                className="interactive-link inline-flex items-center gap-1 mt-2 text-[11px] font-semibold cursor-pointer"
                style={{ color: "var(--theme-primary)" }}
              >
                {message.link.label}
                <ArrowUpRight size={11} strokeWidth={2.4} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Regular Pac reply bubble.
  return (
    <div className="flex items-start gap-2">
      {compactContinuation ? (
        <div className="w-7 shrink-0" aria-hidden="true" />
      ) : (
        <div className="shrink-0 pt-0.5">
          <PacAvatar size={26} state="idle" />
        </div>
      )}
      <div
        className="flex-1 min-w-0 px-3 py-2 shimmer-message-in"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: compactContinuation
            ? "var(--theme-radius-lg)"
            : "4px",
        }}
      >
        <span
          className="text-[12px] leading-[1.55] block"
          style={{ color: "var(--theme-text-primary)" }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    </div>
  );
}

function TypingIndicator() {
  const [verbIdx, setVerbIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setVerbIdx((i) => (i + 1) % STATUS_VERBS.length),
      1600,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 pt-0.5">
        <PacAvatar size={26} state="speaking" />
      </div>
      <div
        className="inline-flex items-center px-3 py-2"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
          borderTopLeftRadius: "4px",
          minHeight: "32px",
        }}
      >
        <span className="shimmer-text text-[12px] tracking-[0.16px]">
          {STATUS_VERBS[verbIdx]}…
        </span>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
