# Design Narrative — Westpac BizEdge Challenge

Senior Experience Designer · Business Lending (Origination Platform)
Interview presentation flow · April 2026

---

## Section 1 — The problem as given

The brief set the scenario plainly: I was designing for a new
business lending originations platform used by bankers to create
and submit deals, supporting multiple product types — business
loans, overdrafts, guarantees — each with different data
requirements and compliance checks. *— brief.md*

The task was literal: *"Design a checklist-style home page for a
single deal that helps bankers navigate deal origination with
confidence."* *— brief.md*

Two banker archetypes anchor the challenge.

**Alex — new banker.**
Stated pain, verbatim from the brief:

> "New bankers are prone to errors in deal setup and tend to
> learn through trial and error." *— brief.md*

**Sarah — experienced banker.**
Stated pain, verbatim from the brief:

> "Experienced bankers often have to resubmit deals because they
> skip key steps for less common product types." *— brief.md*

And one shared organisational pain sitting underneath both:

> "There is currently no single view that shows a banker where
> they are in the deal lifecycle or what's outstanding."
> *— brief.md*

That is the starting point. Not the insight. The insight came
out of research.

---

## Section 2 — What research revealed

Three findings shaped my design. The first was the pivot — the
moment my direction changed. The second and third tightened the
case.

### FINDING 01 — The "single view" I expected was the wrong one

**PART A — What I assumed.**
When I first read "no single view" in the brief, I assumed it
meant the banker needed a unified dashboard — every piece of deal
context visible at once, so they could see where they were.
*— talking-points.md*

My initial mental model was monolithic: pull every field, every
document, every status into one screen and call that the "single
view." *— insights.md*

**PART B — What I found.**
I looked at how the loan origination system (LOS) industry
actually handles this question. Four major vendors converged on
the same answer — and none of them meant "dashboard."

- **nCino.** *"nCino's Deal Proposal uses a 'single sheet method'
  — a structured dossier with relationship context, proposal
  fields, and activity history consolidated into one workspace.
  Organized around lifecycle progression and task completion,
  not monolithic information display."* *— insights.md*

- **Moody's Lending Suite.** Front-office brochure describes
  *"dynamic applications, guided workflows, AI-led prioritization,
  prepopulated data, secure document collection, transparent
  application/document status."* *— insights.md*

- **Baker Hill.** Emphasises *"pipeline-led banker lens, dynamic
  credit memo, and streamlined renewals — not a static file
  cabinet."* *— insights.md*

- **Hawthorn River.** Uses a banking-as-assembly-line metaphor:
  *"Banks produce services by moving information through a
  series of processing steps — this is a bank's assembly line."*
  The banker works at a station and needs station-specific
  context, not warehouse-level inventory. *— insights.md*

Four vendors. One pattern. **The industry's real meaning of
"single view" is not "everything visible at once." It is "single
guided workflow surface" — information sequenced around the
next unresolved action.** *— insights.md*

**PART C — Why this mattered.**
This was the single biggest direction change in my thinking.

From insights.md, in my own words:

> "Where the framing came from: initially I assumed 'single view'
> meant a unified dashboard where every piece of deal context is
> simultaneously visible. Industry research reframed that
> assumption. My progress spine and checklist architecture both
> changed as a result." *— insights.md*

The reframing led directly to two decisions:

- **D5 Progress spine.** A horizontal lifecycle strip at the top
  — Setup → Identification → Credit → Approval → Settlement —
  with the current stage emphasised. It answers one question:
  "Where am I, and what's next?" *— decisions.md*

- **D4 Progressive disclosure.** Below the spine, only the
  current stage's dynamic checklist with next-action emphasis.
  The same interface adapts to deal variation through contextual
  expansion, without asking the banker to declare their
  experience level. *— decisions.md*

This is the pivot. Everything that follows sits on top of it.

### FINDING 02 — Cognitive science: expertise reversal effect

Senior bankers don't lack knowledge. They have something the
cognitive psychology literature calls the **expertise reversal
effect** — instructional designs effective for novices become
ineffective or harmful for experts because experts over-rely on
schema-based processing and ignore redundant guidance. It's
well-documented in aviation and medicine. Applied to banking,
senior bankers run automated pattern-matching that fails on
atypical cases unless variation is made visually unmissable.
*— insights.md*

This explains the rare-product skip pattern specifically.
Australian context sharpens the point: three of the four major
Australian banks have stopped offering bank guarantees to retail
customers because of risk and complexity. The ones Westpac still
writes are a specialised offering more than an ordinary product
— which makes the rare-product skip problem especially acute at
Westpac. *— insights.md*

### FINDING 03 — Regulatory shift in real time

AUSTRAC's AML/CTF reform **commenced 31 March 2026** for
existing reporting entities, Westpac included. The interview is
two weeks later. *— insights.md*

AUSTRAC describes the change in its own words as a shift
*"from a compliance-based approach to a risk-based,
outcomes-oriented approach."* *— insights.md*

The operational consequence: bankers can no longer just tick
boxes. They must judge risk and document their reasoning. Senior
muscle memory built under the old compliance-based framing may
now create compliance risk — a single deal can be partially
under old rules and partially under new rules, and the mode
indicator must make that visually obvious. *— insights.md*

This is not just an operational problem. It is regulatory
urgency landing the same month as the interview.

### The synthesis

All three pains in the brief share one root cause:
**context scarcity** across three dimensions:

- **Spatial** — "Where am I in this deal lifecycle?"
- **Procedural** — "What do I do next?"
- **Diagnostic** — "Why is this deal different from the last?"

*— insights.md · brief.md*

New bankers lack procedural and diagnostic context. Senior
bankers have default context but not variation context. And
the "no single view" pain is literally about spatial context.

One root, three dimensions. Every decision that follows is an
intervention on one of them.

---

## Section 3 — Decisions grounded in insights

Nine decisions, grouped by the dimension of context scarcity
each one addresses. One line per decision, connecting it to the
specific research finding that produced it.

### Spatial context — "Where am I?"

- **D5 · Progress spine as guided workflow surface.**
  Directly translates the four-vendor LOS convergence (nCino,
  Moody's, Baker Hill, Hawthorn River) into Westpac's interface
  — position plus next action, not parallel information
  display. *— decisions.md*

- **D4 · Progressive disclosure, no mode toggle.**
  Replaces an earlier Learning/Expert mode toggle I had in
  drafts, after NN/g research showed toggles create stigma for
  juniors and false confidence for seniors. *— decisions.md*

### Procedural context — "What next?"

- **D1 · Dynamic checklist reshapes per deal.**
  Mirrors AUSTRAC's own five initial-CDD guide paths and
  Hawthorn River's stated principle that *"validation rules
  will vary based on the structure of the loan, borrowers, and
  collateral."* *— decisions.md · insights.md*

- **D3 · Inline expandable knowledge, not a chatbot.**
  Answers McKinsey's finding that commercial onboarding takes
  30–100 days primarily due to tooling fragmentation and swivel-
  chair work — help lives at the row, not across a context
  switch. *— decisions.md*

- **D7 · Three-way task ownership — banker / system / customer.**
  Mirrors BizEdge's actual two-sided architecture from Rich
  Data Co (*"a two-sided digital finance application form…
  customers and bankers jointly work on an application"*),
  not an abstract design construct. *— decisions.md · insights.md*

### Diagnostic context — "Why is this deal different?"

- **D2 · Skip as friction with structured picker.**
  Operationalises AUSTRAC's own reform intent: *"Some initial
  CDD steps can be delayed where essential to avoid interrupting
  ordinary business."* Logged reason becomes audit data instead
  of silent workaround. *— decisions.md · insights.md*

- **D8 · Legacy ACIP vs Reform CDD mode indicator.**
  Targets the transition trap — one deal partially under old
  rules and partially under new rules — so senior muscle memory
  can't silently apply the wrong framework. *— decisions.md*

- **D6 · Provenance indicators on auto-filled data.**
  Responds to the reform's "reasonable grounds" standard and
  Westpac's specific institutional history — the 2020 AUSTRAC
  A$1.3B civil penalty made banker-level evidence visibility
  load-bearing, not decorative. *— decisions.md · insights.md*

### Umbrella

- **D9 · Ready to Submit score.**
  Takes the brief's core verb — *"navigate deal with confidence"*
  — literally. A single perceivable metric across four inputs
  (checklist completion, skip reason quality, data provenance,
  mode alignment) that D1–D8 feed into. Bankers perceive D9;
  D1–D8 work beneath the surface. *— decisions.md · brief.md*

---

## Section 4 — V1: The guided checklist

The brief asked for a checklist. The decisions translated that
into a guided progressive workflow.

**Flow:**

Empty state → Dynamic checklist build → Focused single-item
view → Phase transitions → Submission readiness.

V1 takes the checklist as the primary interaction because
research supports the idea that structured task guidance works
better than conversational AI for regulated workflows where the
user needs to finish a specific task under time pressure.
*— talking-points.md*

Built with Next.js + TypeScript + Tailwind + shadcn/ui on top
of IBM Carbon as the design-system substrate, with a Westpac
brand overlay. Deployed live to Vercel so the interview is a
working demonstration, not just wireframes.

Live URL: **westpac-bizedge-prototype.vercel.app**

V1 is intentionally described briefly here. The prototype itself
is the demonstration.

---

## Section 5 — V2: But I didn't stop there

A checklist answers the visibility question. *"Where am I"* and
*"what do I do next"* are procedural questions, and V1 handles
them. But the brief's hardest pain — senior bankers skipping key
steps on less common products — isn't a visibility problem.
Senior bankers know the steps exist. They skip them because
their muscle memory is optimised for common products and
variation doesn't break through. That is a judgment-under-
pressure problem. A better checklist helps, but it doesn't
fundamentally solve it. *— talking-points.md*

So I explored a second version. Three signals pointed beyond V1.

### SIGNAL 01 — Industry trajectory

LOS platforms are moving toward conversational AI assistance.
nCino and Moody's roadmaps both signal in-context AI as the
next layer, not a separate chatbot. *— insights.md*

### SIGNAL 02 — Combinatorial complexity

4 products × 4 entity types × 5 jurisdictions × 4+ purposes ×
AUSTRAC legacy-vs-reform mode split — more deal shapes than a
static checklist can cover cleanly. AI assistance becomes
structurally necessary, not stylistically optional.

### SIGNAL 03 — AI capability shift

2024–26 enterprise AI is mature enough for in-context,
judgment-respecting assistance. The pattern that works in
coding tools — Cursor, Claude Code — translates to enterprise
workflows: ambient, proactive, rationale-attached, never
deciding for the user.

### Two AI teammates sharing the same panel

V2 uses the same shell as V1 — same checklist, same progress
spine. It adds a persistent AI teammate panel on the right side.
Not a chat interface. An ambient colleague that watches deal
state and surfaces context when it thinks the banker needs it.
*— talking-points.md*

**ASSISTANT 01 — Smart onboarding (for Alex, the new banker).**
Data-driven contextual guidance for new bankers. Surfaces *"what
to do next and why this matters"* without forcing the banker to
leave the workflow, re-explain context, or formulate a question
they don't yet know how to ask. Directly addresses Edmondson's
psychological safety layer — the junior doesn't have to declare
ignorance to get help. *— talking-points.md · insights.md*

**ASSISTANT 02 — Change watch (for Sarah, the experienced
banker).**
Keeps experienced bankers current on what's changed — regulatory
shifts, product variations, deal specifics. Calibrated to deal
rarity, not banker tenure. *"A senior banker seeing their 1000th
term loan gets a quiet panel. The same banker opening a trust-
structured bank guarantee with a foreign beneficiary gets a loud
one. Same UI, adaptive response."* The contextual interrupt
strong enough to break the automated pattern-match on the
specific cases where it's wrong — the direct answer to the
expertise reversal effect. *— talking-points.md*

Same workflow underneath. AI adds a layer that knows the deal,
knows the banker, and knows what's changed.

---

## Section 6 — A surprise from the inside

Here is the part I want to flag carefully, because it is the
climax of the narrative.

I arrived at the ambient-versus-reactive distinction
**independently** — from cognitive psychology and my own prior
work on a Slack-based AI companion. I designed V2 around the
three signals above before I saw any Westpac-internal direction
on AI. *— talking-points.md*

Then, in research for this challenge, I found Dr Martin
Anderson, Westpac's Head of Technology for Business Lending,
speaking at the AWS Financial Services Symposium in Sydney
earlier this year. He said this:

> "People are going to be surprised by how these sequences are
> going to be reorganised, resequenced, rewired. It's not just
> going to be a case of adding in AI-specific points; it's
> actually reimagining the process so that you can actually
> optimise it to leverage AI and all the various capabilities."
>
> — **Dr Martin Anderson** · Head of Technology & Business
> Lending, Westpac
> AWS Financial Services Symposium, Sydney 2026
> *Source: iTnews article 620401 — insights.md*

In my own framing from talking-points.md: *"That's convergent
evidence, not borrowed authority."*

**V1 makes the product the brief asked for** — a checklist,
with AI-specific points added on.

**V2 reimagines the process** — exactly what Anderson describes.
The alignment was a surprise, but it confirms the direction is
the one Westpac itself is already moving toward.

---

## Section 7 — Bridge to demo

Let me show you what V1 + V2 actually look like.

**Live:** westpac-bizedge-prototype.vercel.app

---

## Vault gaps

Facts or framings the narrative wanted but the vault did not
fully supply. Flagging so you can decide whether to add them
back to the source of truth.

1. **Persona first-person voice lines.** The vault names Alex
   (new banker, Pain 1 evidence) and Sarah (senior banker, Pain
   2 evidence) in `decisions.md` around D9, but it does not
   contain full persona sheets with "in their own voice" one-
   liners. Section 1 falls back to the brief's verbatim pain
   statements as stand-ins. If you want the presentation to
   have real persona voice quotes, the vault needs a short
   persona section — ideally in `insights.md` or a new
   `personas.md`.

2. **BizEdge production launch date.** `insights.md` explicitly
   flags this as "not verified — April 2023 refers to the
   SIMPLE+ pathway launch, not BizEdge itself." The narrative
   avoided claiming a launch date on purpose. Worth confirming
   in the role.

3. **Exact AWS Financial Services Symposium date.**
   `insights.md` says "Sydney, early 2026" for Anderson's
   appearance. The process-frame.html already notes this gap.
   A confirmed month would tighten the attribution.

4. **Decision 9 missing from the decisions.md summary table.**
   The body of `decisions.md` has all nine decisions (D1–D9),
   but the summary table at the bottom only lists eight.
   This narrative uses all nine; recommend updating the summary
   table to match.

5. **RBC 88-error-types / A$30M figure.** `insights.md` cites
   this from `cognitivegroup.com/portfolio/loan-origination-rbc/`
   — a tertiary case-study source. Not used in this narrative
   because it did not load load-bearing weight, but worth
   reviewing if you want a specific banker-error cost figure.

6. **JPMorgan Coach AI 10–20% efficiency stat.** Flagged in
   `insights.md` as "exact figures from trade press — verify
   before citing in detail." Deliberately omitted here.

---

## Source map

Which vault files the narrative used, section by section, so
future cross-checking is fast.

- **Section 1 — The problem as given**
  `brief.md` (verbatim scenario, task, three pains)

- **Section 2 — What research revealed**
  `insights.md` (LOS vendor framings, context-scarcity thesis,
  expertise reversal effect, AUSTRAC reform commencement + direct
  AUSTRAC quote, reframe passage)
  `talking-points.md` Section 3 — The reframe that changed my
  design (user's own wording of the assumption → research →
  reframe arc)
  `brief.md` (three pains verbatim)

- **Section 3 — Decisions grounded in insights**
  `decisions.md` (all nine decisions, evidence chains, explicit
  V1/V2 scope lines)
  `insights.md` (McKinsey swivel-chair, Hawthorn River
  validation-rules quote, AUSTRAC "reasonable grounds" framing,
  2020 A$1.3B fine context)

- **Section 4 — V1: The guided checklist**
  `talking-points.md` Section 4 (V1 walkthrough + "structured
  task guidance" framing)
  `decisions.md` V1 scope lines per decision
  Working knowledge of the deployed prototype (Vercel URL)

- **Section 5 — V2: But I didn't stop there**
  `talking-points.md` Section 5 (V2 walkthrough, judgment-under-
  pressure framing, ambient vs reactive distinction, the
  "1000th term loan" passage, Edmondson psychological safety
  link)
  `insights.md` (industry trajectory, combinatorial complexity
  inputs, Edmondson)
  `decisions.md` D3, D4 (inline help and progressive disclosure
  V2 roles)

- **Section 6 — A surprise from the inside**
  `talking-points.md` Section 5 verbatim: "I came to the
  ambient-versus-reactive distinction independently — from
  cognitive psychology and my own work on a Slack-based AI
  companion. Then in research for this challenge I found Dr
  Martin Anderson… That's convergent evidence, not borrowed
  authority."
  `insights.md` (Anderson quote verbatim + iTnews 620401
  attribution + AWS Financial Services Symposium Sydney
  early 2026)

- **Section 7 — Bridge to demo**
  Working knowledge of the deployed prototype
  (westpac-bizedge-prototype.vercel.app)

- **Citation hygiene across all sections**
  `.claude/source-tiers.md` (five-tier system — Primary /
  Secondary / Tertiary / LLM synthesis / Sean's observation)
