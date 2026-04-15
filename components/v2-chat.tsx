"use client";

/**
 * V2 — AI Teammate chat interface.
 * Scripted scene engine with Pac avatar, typing indicator, pills.
 * No API calls. Free-text input falls back to a canned generic reply.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChecklistItem as CI, Deal, ReadinessBreakdown } from "@/lib/types";
import { PacAvatar } from "@/components/pac-avatar";
import { PHASES } from "@/data/deal-data";
import {
  FALLBACK_MESSAGE,
  SCENES,
  type ScriptedMessage,
  type SceneId,
} from "@/data/pac-scenes";
import { Send, Sparkles } from "lucide-react";
import { readinessToColor } from "@/lib/readiness-calc";

interface Props {
  deal: Deal;
  breakdown: ReadinessBreakdown;
  library: CI[];
  onCompleteItem: (id: string) => void;
  onSkipItem: (id: string, category: string) => void;
}

// A message in the rendered timeline — real messages plus ephemeral
// typing indicators.
type TimelineEntry =
  | { kind: "message"; message: ScriptedMessage }
  | { kind: "typing"; id: string };

export function V2Chat({
  deal,
  breakdown,
  library,
  onCompleteItem,
  onSkipItem,
}: Props) {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [playingScene, setPlayingScene] = useState<SceneId | null>("opening");
  const [awaitingAction, setAwaitingAction] = useState(false);
  const [freeText, setFreeText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Play a scene: push typing indicator then message after delay, repeat.
  useEffect(() => {
    if (!playingScene) return;
    const scene = SCENES[playingScene];
    if (!scene) return;

    let cancelled = false;
    setAwaitingAction(false);

    async function playScene() {
      for (let i = 0; i < scene.length; i++) {
        if (cancelled) return;
        const msg = scene[i];

        // Only pac messages show a typing indicator
        if (msg.sender === "pac" && msg.typingDelay > 0) {
          const typingId = `typing-${playingScene}-${i}`;
          setTimeline((prev) => [
            ...prev,
            { kind: "typing", id: typingId },
          ]);
          await wait(msg.typingDelay);
          if (cancelled) return;
          setTimeline((prev) =>
            prev
              .filter((e) => !(e.kind === "typing" && e.id === typingId))
              .concat({ kind: "message", message: msg }),
          );
        } else {
          // System / banker messages appear with their declared delay.
          if (msg.typingDelay > 0) await wait(msg.typingDelay);
          if (cancelled) return;
          setTimeline((prev) => [
            ...prev,
            { kind: "message", message: msg },
          ]);
        }

        // Apply side effects
        if (msg.sideEffect) {
          if (msg.sideEffect.type === "complete") {
            onCompleteItem(msg.sideEffect.itemId);
          } else if (msg.sideEffect.type === "skip") {
            onSkipItem(msg.sideEffect.itemId, msg.sideEffect.category);
          }
        }
      }

      // After the scene's last message plays, await an action if one exists.
      const last = scene[scene.length - 1];
      if (last.actions && last.actions.length > 0) {
        setAwaitingAction(true);
      }
      setPlayingScene(null);
    }

    playScene();
    return () => {
      cancelled = true;
    };
  }, [playingScene, onCompleteItem, onSkipItem]);

  // Auto-scroll to bottom when new entries appear
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [timeline]);

  function handlePillClick(next: SceneId) {
    if (playingScene !== null) return;
    setAwaitingAction(false);
    setPlayingScene(next);
  }

  function handleSendFreeText(e: React.FormEvent) {
    e.preventDefault();
    const text = freeText.trim();
    if (!text || playingScene !== null) return;
    // Add banker message + fallback pac reply
    setTimeline((prev) => [
      ...prev,
      {
        kind: "message",
        message: {
          id: `banker-${Date.now()}`,
          sender: "banker",
          content: escapeHtml(text),
          typingDelay: 0,
        },
      },
    ]);
    setFreeText("");
    // Fallback reply after a short typing indicator
    const typingId = `typing-fb-${Date.now()}`;
    setTimeline((prev) => [...prev, { kind: "typing", id: typingId }]);
    setTimeout(() => {
      setTimeline((prev) =>
        prev
          .filter((e) => !(e.kind === "typing" && e.id === typingId))
          .concat({ kind: "message", message: FALLBACK_MESSAGE }),
      );
    }, 1000);
  }

  // Deal summary on the right
  const tone = readinessToColor(breakdown.total);
  const resolved = library.filter(
    (i) => i.status === "complete" || i.status === "skipped",
  ).length;

  return (
    <main
      className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-0"
      style={{ background: "var(--theme-page-bg)" }}
    >
      {/* Chat pane */}
      <section
        className="flex flex-col min-w-0 h-[calc(100vh-112px)]"
        style={{
          background: "var(--theme-card-bg)",
          borderRight: "1px solid var(--theme-border)",
        }}
      >
        {/* Top status strip */}
        <div
          className="px-6 py-3 flex items-center gap-3 shrink-0"
          style={{
            background: "var(--theme-card-bg)",
            borderBottom: "1px solid var(--theme-border)",
          }}
        >
          <PacAvatar size={32} state="idle" />
          <div>
            <div
              className="text-[14px] font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Pac
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className="inline-block w-1.5 h-1.5 animate-pulse"
                style={{
                  background: "#2e7d32",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: "var(--theme-text-secondary)" }}>
                Active · Westpac AI teammate
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {timeline.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <PacAvatar size={48} state="idle" />
            </div>
          ) : null}
          {timeline.map((entry, i) =>
            entry.kind === "typing" ? (
              <TypingIndicator key={entry.id} />
            ) : (
              <MessageRow
                key={entry.message.id + i}
                message={entry.message}
                showActions={
                  i === timeline.length - 1 &&
                  awaitingAction &&
                  !!entry.message.actions?.length
                }
                onAction={handlePillClick}
              />
            ),
          )}
        </div>

        {/* Free-text input */}
        <form
          onSubmit={handleSendFreeText}
          className="shrink-0 p-4 flex items-center gap-2"
          style={{ borderTop: "1px solid var(--theme-border)" }}
        >
          <input
            type="text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Ask Pac anything about this deal…"
            disabled={playingScene !== null}
            className="flex-1 h-10 px-3 text-[13px] focus:outline-none focus-visible:ring-2"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid var(--theme-border-strong)",
              borderRadius: "var(--theme-radius)",
              color: "var(--theme-text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={!freeText.trim() || playingScene !== null}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-[12px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--theme-primary)",
              borderRadius: "var(--theme-radius)",
            }}
          >
            <Send size={12} strokeWidth={2.5} />
            Send
          </button>
        </form>
      </section>

      {/* Deal summary sidebar */}
      <aside
        className="hidden lg:flex flex-col p-5 gap-5 min-w-0"
        style={{ background: "var(--theme-page-bg)" }}
      >
        <div
          className="p-4"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <div
            className="text-[10px] uppercase font-semibold mb-1"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Deal
          </div>
          <h3
            className="text-[15px] font-semibold leading-[1.25]"
            style={{ color: "var(--theme-primary)" }}
          >
            {deal.customerName}
          </h3>
          <div
            className="text-[12px] mt-0.5"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {deal.dealName}
          </div>
        </div>

        <div
          className="p-4"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <div
            className="text-[10px] uppercase font-semibold mb-2"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Ready to Submit
          </div>
          <div
            className="text-[36px] font-semibold tabular-nums leading-none"
            style={{
              color: tone.fg,
              fontFamily: "var(--theme-font-mono)",
            }}
          >
            {breakdown.total}
            <span className="text-[16px] ml-0.5">%</span>
          </div>
          <div
            className="text-[11px] font-medium mt-1"
            style={{ color: tone.fg }}
          >
            {tone.label}
          </div>
          <div
            className="text-[10px] mt-0.5"
            style={{ color: "var(--theme-text-tertiary)" }}
          >
            {resolved} of {library.length} items resolved
          </div>
        </div>

        <div
          className="p-4"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius)",
          }}
        >
          <div
            className="text-[10px] uppercase font-semibold mb-2"
            style={{
              color: "var(--theme-text-tertiary)",
              letterSpacing: "0.5px",
            }}
          >
            Deal phases
          </div>
          <ol className="space-y-1.5">
            {PHASES.map((phase) => {
              const isCurrent = phase.id === deal.phase;
              return (
                <li
                  key={phase.id}
                  className="flex items-center gap-2 text-[12px]"
                >
                  <span
                    className="inline-block w-1.5 h-1.5"
                    style={{
                      background: isCurrent
                        ? "var(--theme-primary)"
                        : "var(--theme-border)",
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      color: isCurrent
                        ? "var(--theme-text-primary)"
                        : "var(--theme-text-tertiary)",
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                  >
                    {phase.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </main>
  );
}

function MessageRow({
  message,
  showActions,
  onAction,
}: {
  message: ScriptedMessage;
  showActions: boolean;
  onAction: (next: SceneId) => void;
}) {
  if (message.sender === "system") {
    return (
      <div className="flex items-center gap-2 justify-center text-[10px] uppercase font-semibold"
           style={{ color: "var(--theme-text-tertiary)", letterSpacing: "0.5px" }}>
        <Sparkles size={10} strokeWidth={2.2} />
        <span>{message.content}</span>
      </div>
    );
  }

  if (message.sender === "banker") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[70%] px-4 py-2.5 text-[13px] leading-[1.5]"
          style={{
            background: "var(--theme-primary)",
            color: "var(--theme-primary-fg)",
            borderRadius: "var(--theme-radius-lg)",
          }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    );
  }

  // pac
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 pt-1">
        <PacAvatar size={32} state="idle" />
      </div>
      <div className="min-w-0 max-w-[560px]">
        <div
          className="text-[11px] font-semibold mb-1"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Pac
        </div>
        <div
          className="p-4 text-[13px] leading-[1.55]"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid var(--theme-border)",
            borderRadius: "var(--theme-radius-lg)",
            color: "var(--theme-text-primary)",
          }}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        {showActions && message.actions ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAction(action.next)}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-[12px] font-semibold transition-colors"
                style={{
                  background: "var(--theme-card-bg)",
                  color: "var(--theme-primary)",
                  border: "1px solid var(--theme-primary)",
                  borderRadius: "var(--theme-radius-lg)",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 pt-1">
        <PacAvatar size={32} state="speaking" />
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-4 py-3"
        style={{
          background: "var(--theme-card-bg)",
          border: "1px solid var(--theme-border)",
          borderRadius: "var(--theme-radius-lg)",
        }}
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5"
      style={{
        background: "var(--theme-text-tertiary)",
        borderRadius: "50%",
        animation: `pac-typing 1.2s ease-in-out ${delay}ms infinite`,
      }}
    />
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
