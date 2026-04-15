# Insight Addition Protocol
# Referenced from CLAUDE.md when Sean shares new data points

This document defines the full workflow for adding new insights or data points to insights.md or decisions.md. It is referenced from CLAUDE.md and should be read whenever Sean shares new research, observations, or facts that might belong in the main working files.

## Step 1 — Check what I gave you
Look at what Sean has shared and identify what's missing:

- **Source**: Where did this come from? (URL, article name, conversation, his own observation, Perplexity output, etc.)
- **Source tier**: Which category does the source fall into? (See `.claude/source-tiers.md` for full definitions)
  - *Primary*: Regulator (AUSTRAC), official company materials (Westpac ASX releases, investor decks), peer-reviewed research
  - *Secondary*: Reputable trade press (Reuters, iTnews, AFR), industry analyst reports
  - *Tertiary*: Vendor marketing (nCino website, Hawthorn River blog), LinkedIn posts, commentary
  - *LLM synthesis*: Perplexity, ChatGPT, or other AI-generated summary
  - *Sean's observation*: Sean's own reasoning or design intuition
- **Date**: When is this from? (Especially important for changing figures like market share, hiring numbers, regulatory dates)
- **Relevance**: How does this connect to the existing insights? Does it support, challenge, or refine a current claim?

## Step 2 — Ask Sean for whatever is missing
If any of those four are missing or unclear, ASK before proceeding. Ask in a single message, list all the gaps at once (don't drip-feed questions). Example:

"I want to add this to insights.md, but I need a few things from you first:
1. Where does this come from? (URL or source name)
2. Is this a primary, secondary, tertiary, LLM, or your own observation?
3. When is it from? (date or approximate)
4. Anything specific about why you think this matters?

Once you answer, I'll draft the addition and show you before saving."

If Sean replies "I don't know the source" or "I don't remember exactly," accept that and mark the insight with a clear flag in the draft (e.g., "[source uncertain — Sean to verify]" or "[tier: LLM synthesis, not primary verified]"). Do not refuse to add it, but make the uncertainty visible in the text.

## Step 3 — Check for contradictions
Before drafting, scan insights.md and decisions.md for anything that contradicts the new data point. If you find a contradiction:
- Show Sean BOTH the old claim and the new claim side by side
- Ask which one to keep, or whether to note both as conflicting sources
- Do not proceed until Sean decides

## Step 4 — Propose section placement
Identify which existing section in insights.md (or decisions.md) this data point belongs in. Do NOT create new sections without asking. If the data point doesn't fit any existing section, tell Sean:
"This doesn't fit any existing section in insights.md. Options: (a) skip it, (b) force-fit into [closest section], (c) create a new section called [suggested name]. Which do you want?"

## Step 5 — Draft the addition with full attribution
Write the draft exactly as it will appear in the file, including:
- The fact or claim itself, in the same style as surrounding content
- Inline source attribution
- Source tier marker if the tier is anything less than primary
- Date if relevant
- Any confidence or caveat Sean has expressed

Show Sean the draft in your response, clearly marked as a preview. Do NOT write to the file yet.

Additionally, always stash the draft to `sources/_drafts/` as a safety net. Create the folder if it doesn't exist. Name the stash file with a timestamp and short slug, e.g., `sources/_drafts/2026-04-14-austrac-entity-types.md`. The stash file should contain:
- The original data point Sean shared (so you have the raw input)
- Your draft (exactly as shown in the response)
- Proposed section placement
- Current status: 'pending approval'

This way, if Sean moves on to another task before approving, the draft survives and he can come back to it later.

## Step 6 — Wait for approval
Sean will reply with one of:
- 'save' or 'yes' or 'ok' → you write to insights.md or decisions.md, then delete the stash file from sources/_drafts/
- 'change X to Y, then save' → you apply the edit, save to the target file, then delete the stash
- 'drop it' or 'never mind' → you delete the stash file, no changes to main files
- Silence or unrelated message → you do nothing. The stash file remains in sources/_drafts/ until Sean returns to it.
- 'what was I adding earlier?' or similar → you check sources/_drafts/ for any pending stash files and show the list. Sean can pick which to resume or drop.

## Step 7 — Confirm after saving
Once saved, reply with a one-line confirmation:
"Added to insights.md → [section name]. No contradictions found."
or
"Added to decisions.md → Decision [N]. Flagged for later verification."

Do not narrate the whole addition again. Just confirm it's in.

## Step 8 — Periodic cleanup
If sources/_drafts/ contains files older than 48 hours, mention it next time Sean asks to add an insight. Example: "Note: you have 3 pending drafts in sources/_drafts/ from earlier sessions. Want to review them before we add a new one?"

Do not auto-delete old drafts. Sean decides what to do with them.

## See also
- `.claude/source-tiers.md` — detailed definitions of source tiers referenced in Step 1
- `CLAUDE.md` — the map that points to this protocol
