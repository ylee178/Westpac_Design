# Design Decisions for Westpac Design Challenge
# Senior Experience Designer - Business Lending (Origination Platform)
# Last updated: 14 April 2026

> Every decision here is traceable to insights.md.
> Format: What / Why (with evidence) / Trade-offs / Failure mode / Validation / V1-V2 scope

---

## Thesis

The three surface pains in the brief share one root cause: **context 
scarcity** across three dimensions — where am I in the lifecycle (spatial), 
what do I do next (procedural), and why does this matter, what's different 
here (diagnostic).

The industry pattern for "single view" in modern LOS is not a static 
dashboard. It is a **single guided workflow surface** — information 
sequenced around the next unresolved action. My design operationalizes 
that reframing inside BizEdge's origination flow.

Secondary thesis: BizEdge has already won on speed (45% TTD reduction). 
The marginal opportunity is not faster throughput — it is **fewer errors, 
better judgment support, and reduced rework**. My design is built for 
error prevention, not throughput acceleration.

---

## Decision 1: Dynamic checklist reshapes by product × entity × jurisdiction

### What
When a banker selects the product type, customer entity type, and flags 
jurisdictional/geographic factors, the checklist reorganizes to show the 
specific mandatory steps for that combination. Rare or edge-case steps 
are not hidden in a sea of generic items — they surface as first-class 
items when the combination triggers them.

The checklist has three reshape dimensions:
- **Product axis:** Business term loan, overdraft, bank guarantee, 
  equipment finance, trade finance, startup loan, etc.
- **Entity axis:** Individual, sole trader, body corporate/partnership/
  unincorporated association, trust, government body
- **Geography/jurisdiction axis:** Domestic only, foreign beneficiary 
  present, cross-border exposure, PEP considerations

### Why (evidence chain)
**From AUSTRAC's own structure:** AUSTRAC publishes five initial CDD 
guide paths, each with different verification requirements. The regulator 
itself acknowledges that entity type fundamentally changes what the 
banker must establish. A design that ignores this mirrors a framework 
AUSTRAC has explicitly moved away from.

**From industry LOS pattern:** Hawthorn River (US community bank LOS 
vendor) publicly articulates the principle: "validation rules will 
vary based on the structure of the loan, borrowers, and collateral." 
This is not a Westpac-specific bet — it is how the LOS industry has 
learned to design origination workflows.

**From AUSTRAC reform new:** Post-31-March-2026, enhanced CDD is 
triggered by geographic/jurisdictional risk factors that must be 
first-class decision inputs, not buried notes. A "standard" deal can 
become higher-risk purely because of structure or geography.

**From the brief:** Both pain 1 (new banker errors) and pain 2 (senior 
skip on rare products) point to variation being invisible. Static 
checklists make variation visible only through reading discipline, 
which is exactly what fails in high-volume banker workflows.

### Trade-offs
- **Gain:** Variation becomes visually unmissable. Rare-product 
  combinations are no longer hidden. New bankers get the right list 
  without having to know the right list exists. Aligned with how 
  AUSTRAC itself structures its guidance.
- **Cost:** More complex upstream product modeling. Requires a 
  maintained rules library linking product × entity × jurisdiction 
  to mandatory step sets. Implementation complexity is real.
- **Failure mode:** If the rule library is incomplete or lagging, 
  rare combinations may reshape incorrectly or fall back to a 
  generic path. This can be worse than a static checklist because 
  banker trust in the system collapses when reshape is wrong.

### Alternative considered and rejected
**Static checklist with every possible step visible.** Rejected because 
cognitive load research shows that forcing a banker to mentally filter 
out irrelevant steps is more expensive than dynamic filtering. Also 
fails the "rare product skip" scenario — if a senior banker sees the 
same 40-item list every day, muscle memory skims past the 3 items that 
matter only for this rare case.

### Validation method
- A/B test: static vs dynamic checklist with bankers of different tenure
- Metrics: time-to-first-action, submission error rate, banker-reported 
  cognitive load (SUS or bespoke)
- Edge case: track what happens when a banker changes product type 
  mid-deal — does reshape help or disorient?

### Prototype scope
- **V1:** Yes. Core demonstration — product switch triggers checklist 
  reshape. Bank guarantee vs business term loan as the visible example.
- **V2:** Yes. Same reshape logic plus AI teammate surfacing "what's 
  different from your usual deal" on the side panel.

---

## Decision 2: Skip is friction, not block, with logged reason

### What
When a banker attempts to proceed past a checklist item without 
completing it, the system does not hard-block. It presents a lightweight 
dialog with a structured reason picker: the banker selects from 4-5 
common skip reasons (e.g., "Documentation provided outside the 
platform", "Policy override approved by team lead", "Customer declined 
this step", "Existing relationship — previously verified"), or chooses 
"Other" which reveals a free-text field for custom reasons. The skip 
is recorded with both the category and any free-text addition.

Exceptions: items that are legally mandatory (not just policy-preferred) 
cannot be skipped. These are clearly visually distinguished from 
policy-preferred items.

### Why (evidence chain)
**Regulator-aligned:** AUSTRAC's post-reform guidance explicitly states: 
"Some initial CDD steps can be delayed where essential to avoid 
interrupting ordinary business." This is a direct departure from the 
old "all boxes must be ticked before anything happens" mentality. My 
decision to treat skip as friction rather than hard block is not just 
a UX preference — it operationalizes the regulator's own reform intent.

**From the brief:** The brief says experienced bankers skip steps and 
end up resubmitting. A hard block approach would either prevent the 
skip (introducing workaround behavior — emails, memos, other systems) 
or allow silent skip (no audit trail). Logged-reason friction is the 
middle path: respects banker judgment, creates visibility, creates data 
over time.

**From cognitive research:** Expertise reversal effect research shows 
that experts perform worse than novices on atypical cases because their 
automated schemas don't match variation. A block would be stigmatizing; 
a friction-with-reason creates just enough interruption to break the 
automated pattern-match without insulting the senior's expertise.

**Structured over free-text:** A pure free-text reason field collapses 
into "ok" or "approved" under time pressure, producing audit trail 
noise. A structured picker with an "Other" safety valve turns skip 
reasons into categorizable data from day one, while still allowing 
edge cases. The picker categories themselves become a living 
vocabulary — if "Other" is used frequently, that signals the picker 
is missing a category. This addresses D2's known failure mode directly.

### Trade-offs
- **Gain:** Respects banker judgment. Creates audit trail. Generates 
  data about why skips happen, which feeds back to policy refinement. 
  Aligned with regulator's post-reform intent.
- **Cost:** Some genuine skip mistakes will still pass through because 
  friction is small. Data quality depends on banker writing meaningful 
  reasons (not just "ok" or "approved"). The picker categories must 
  be designed carefully. Wrong categories force bankers into "Other" 
  constantly, defeating the purpose. Category design is itself a 
  compliance-product collaboration that requires input from credit 
  risk, compliance, and banker observation.
- **Failure mode:** If picker categories don't match banker reality, 
  "Other" becomes the default and we're back to free-text quality 
  issues. Mitigation: periodic review of "Other" text to discover 
  missing categories and refine the picker.

### Alternative considered and rejected
**Hard block on any incomplete step.** Rejected because it forces 
bankers into workaround behaviors (documenting outside the system, 
pushing back on deal structure, escalating unnecessarily). Also ignores 
AUSTRAC's own position that some CDD steps can be legitimately deferred. 
A blocking approach would contradict the regulatory framework.

**Silent skip with no record.** Rejected because it provides no 
mechanism for policy to learn from banker behavior over time. Audit 
trail matters even when the decision is approved — it is how governance 
improves.

### Validation method
- Track skip reason quality over time (proportion of meaningful vs 
  lazy reasons)
- Correlate logged skip reasons with downstream resubmission/rework rates
- Measure whether senior bankers feel friction-as-friction (intentional) 
  vs friction-as-obstacle (resented)
- Track the "Other" usage rate. If more than 30% of skips use "Other", 
  the picker categories need revision. Track which categories are 
  most common per product type to inform category evolution.

### Prototype scope
- **V1:** Yes. Structured picker with 4-5 initial common categories 
  (designed from insights.md's "common senior errors" list for bank 
  guarantees, trust lending, partnerships) plus "Other" option. 
  Default state has nothing selected — banker must make a deliberate 
  choice. Submit disabled until selection made.
- **V2:** Yes. AI dynamically orders the picker categories based on 
  deal profile (product type, entity type, customer tenure). Most 
  likely categories rise to top of the picker. Banker still chooses — 
  AI does not pre-select. AI may also surface new candidate categories 
  based on patterns in "Other" free text over time.

---

## Decision 3: Inline expandable knowledge, not separate chatbot

### What
Each checklist item has a small "i" affordance that expands inline 
within the checklist row, revealing:
- Why this step is required (plain language + regulatory source)
- Common mistakes for this specific product × entity combination
- Example of correct completion
- Link to relevant policy or AUSTRAC guidance

The expansion is banker-initiated (default collapsed) and lives inside 
the checklist, not in a separate panel or chat interface.

### Why (evidence chain)
**From new-banker research:** McKinsey finds commercial banking 
onboarding takes 30-100 days, primarily due to tooling fragmentation 
and swivel chair work — not only psychological barriers to asking 
questions. A separate chatbot forces the banker to leave the workflow, 
re-explain context, and formulate a question — three friction points 
at exactly the moment the banker is trying to finish a task.

**From psychological safety research:** Amy Edmondson's framework 
applied to banking (Chartered Banker Institute commentary) confirms 
juniors in finance often delay questions due to reputation risk. An 
inline, always-available knowledge expansion removes the social cost 
of asking — but only when the banker chooses to engage with it.

**From progressive disclosure research (NN/g):** Research on 
progressive disclosure shows that user-triggered revelation of detail 
outperforms system-pushed help. It avoids banner blindness because 
the user only opens what they chose to open. It avoids stigma because 
no one is forced into a "novice mode."

**Against banner blindness critique:** A legitimate counter-argument 
is that inline help becomes ignored in high-pressure workflows. This 
design mitigates that by making help collapsed-by-default and 
banker-triggered — the user only sees it when they actively seek it, 
which is when they are most likely to actually read it.

### Trade-offs
- **Gain:** Learning happens at the point of work. Psychological 
  safety preserved — no one watches the banker ask for help. Context 
  is always correct because the knowledge is attached to the specific 
  checklist row. New bankers learn without interrupting workflow; 
  senior bankers leave it collapsed for common products and expand 
  it for rare ones.
- **Cost:** Knowledge content must be maintained and accurate. If 
  policy changes and the expansion is stale, banker trust collapses. 
  Requires a content ownership model.
- **Failure mode:** If content is thin or generic, expansion becomes 
  decorative and bankers stop opening it. The feature dies silently.

### Alternative considered and rejected
**Separate chatbot / AI assistant.** Rejected because:
- Forces banker to leave workflow
- Requires banker to formulate a coherent question (hardest for new 
  bankers who don't know what they don't know)
- Removes context — chatbot doesn't know which checklist item you're 
  looking at unless you tell it
- LLM hallucination risk in regulated context — "confidence veneer" 
  critique applies

**External documentation / wiki.** Rejected because findability is 
poor and bankers don't leave their workflow to hunt through a wiki 
during deal setup.

### Validation method
- Expansion click-through rate by checklist item (which items get 
  expanded most? which never?)
- Correlation between expansion use and downstream error rate
- Tenure-based segmentation — do new bankers open more than senior 
  bankers? Do senior bankers open more on rare products?

### Prototype scope
- **V1:** Yes. Static knowledge content in expansion drawer.
- **V2:** Yes. Expansion content is AI-generated from current deal 
  context — the explanation is tailored to this specific deal's 
  product and entity combination, not a generic FAQ.

---

## Decision 4: Progressive disclosure instead of Learning/Expert mode toggle

### What
There is no mode toggle. Every banker sees the same checklist, the 
same expansions, the same progress spine. Experience-level adaptation 
happens through progressive disclosure: the same UI surface adapts to 
how the banker actually uses it, without asking them to declare their 
level.

Rare product combinations auto-expand diagnostic content (because they 
warrant attention from everyone). Common product combinations keep it 
collapsed (because reading it every day becomes noise).

### Why (evidence chain)
**This decision replaced an earlier design.** In my initial exploration 
I had a Learning/Expert mode toggle. Research refuted it.

**NN/g research:** Explicit mode toggles create:
- Stigma for juniors (declaring "I need help")
- False confidence for seniors (declaring "I don't need help" on a 
  deal type they haven't seen recently)
- Decision paralysis (users often don't know which mode fits them)
- Discoverability problems when mode state is hidden

**NN/g recommendation:** Use progressive disclosure instead. Same 
interface adapts through contextual expansion, not mode choice.

**From expertise reversal research:** Expertise is not banker-general 
— it is product-specific. A senior banker may be expert on term loans 
and novice on trust lending. Binary banker-level toggle cannot capture 
this granularity. Progressive disclosure can, because it responds to 
the deal profile rather than the banker profile.

**From the brief:** Both pain 1 (new banker errors) and pain 2 (senior 
skip on rare products) share the same root — variation in the deal 
needs to break through banker defaults. A single UI that adapts to 
deal variation serves both groups without asking either to declare 
their level.

### Trade-offs
- **Gain:** No stigma. No false confidence. Responds to deal-specific 
  expertise, not banker-general. Single UI to maintain. Aligned with 
  NN/g research and modern design system conventions.
- **Cost:** Analytics are harder — no explicit "mode" makes it harder 
  to segment user behavior by experience level. Must use tenure-based 
  backend analysis instead of UI-based signal.
- **Failure mode:** If progressive disclosure is too subtle, new 
  bankers may miss the expansion affordance and fall back to asking 
  colleagues. If too aggressive, senior bankers experience it as 
  noise.

### Alternative considered and rejected
**Self-toggle Learning vs Expert mode.** Rejected after research.

**Auto-detect mode based on banker tenure / usage patterns.** Rejected 
because tenure is a poor proxy for product-specific expertise, and 
silent auto-detection hurts discoverability and consistency.

### Validation method
- New bankers: does expansion use decline over time as they learn?
- Senior bankers: does expansion use spike on rare products (indicating 
  the system correctly triggered their attention)?
- Banker interviews: does anyone ask for a mode toggle? If multiple 
  senior bankers ask for "hide all this beginner stuff," the design 
  needs revision.

### Prototype scope
- **V1:** Yes. Progressive disclosure via expandable rows. No mode 
  toggle in UI.
- **V2:** Yes. AI teammate contributes to progressive disclosure by 
  deciding *which* checklist items to auto-expand based on deal risk 
  and rarity.

---

## Decision 5: Progress spine as guided workflow surface, not dashboard

### What
The top of the deal home page is a horizontal progress spine showing 
the lifecycle stages: Setup → Identification → Credit → Approval → 
Settlement. The banker's current position is visually emphasized. 
Each stage shows completion state (not started / in progress / 
complete / blocked).

The spine is a *navigation and orientation* surface, not an information 
dashboard. It does not try to show every piece of deal data at once. 
It answers one question: "Where am I, and what stage is next?"

Below the spine sits the dynamic checklist for the *current* stage 
only, with next-action emphasis.

### Why (evidence chain)
**Major reframing — this was the biggest change in my thinking.** 
Initially I assumed "single view" meant a unified dashboard showing 
all deal context at once. Industry research changed that assumption.

**From industry LOS research:** nCino's Deal Proposal uses a "single 
sheet method" — a structured dossier organized around lifecycle 
progression and task completion. Not monolithic information display. 
Moody's Lending Suite describes "dynamic applications, guided workflows, 
AI-led prioritization." Baker Hill emphasizes pipeline-led banker lens 
with dynamic credit memo. All three major LOS vendors converge on the 
same pattern: sequenced workflow surface, not parallel information 
dashboard.

**The industry's real meaning of "single view":** not "everything 
visible at once" but "one coordinated workspace where information is 
sequenced around the next action." This directly contradicts my 
initial assumption.

**From the brief:** Pain 3 says "no single view that shows a banker 
where they are in the deal lifecycle or what's outstanding." A 
dashboard approach would technically answer "where am I" by showing 
everything — but research suggests this increases cognitive load 
rather than reducing it. A guided workflow surface answers "where am 
I" through position + next action emphasis.

**From Hawthorn River's assembly-line metaphor:** The banker is 
working at a station in a larger assembly line. They need station-
specific context (what to do here), not warehouse-level inventory 
(everything in the plant). The progress spine is the station-to-
station view; the checklist is the station-level work.

### Trade-offs
- **Gain:** Banker orientation without overload. Aligned with 
  industry LOS patterns. Scales to complex deals because information 
  lives in stages, not in one page. Works on a single screen.
- **Cost:** Some deal information lives "off-stage" and requires 
  navigation to reach. For deals where bankers need to cross-reference 
  multiple stages simultaneously, this adds clicks.
- **Failure mode:** If bankers frequently need to jump between 
  non-adjacent stages, the spine-plus-current-stage model becomes 
  a friction. Edge case deals may require a "show all" escape hatch.

### Alternative considered and rejected
**Unified dashboard showing all deal state at once.** Rejected after 
research. Not how major LOS vendors design this view. Increases 
cognitive load. Creates banner blindness for non-critical information.

**Accordion-style expandable stages.** Considered. Weaker than spine 
because accordions hide position — the banker loses the "where am 
I in the lifecycle" orientation. Spine preserves that orientation 
always.

### Validation method
- Cognitive walkthrough: "I'm a banker 4 days into this deal. Show 
  me where I am and what's next." Does the spine answer in under 3 
  seconds?
- Deal handoff test: banker A sets up deal, banker B picks it up. 
  How long to orient? Does the spine reduce handoff time?

### Prototype scope
- **V1:** Yes. Horizontal spine with 5 lifecycle stages. Stage-specific 
  checklist below.
- **V2:** Yes. AI teammate adds contextual notes on specific spine 
  stages ("This deal has been in Credit for 3 days — usual is 1 day 
  for this product. Blocker: valuation outstanding.")

---

## Decision 6: Provenance indicators for auto-filled data

### What
Any field in BizEdge that is auto-populated from external systems 
(Company search, PPSR search, Xero/MYOB integration, previous customer 
records) shows a small provenance indicator: source + timestamp + 
confidence if applicable. Hovering reveals: "Pulled from PPSR search 
on 2026-04-14 10:23. Match confidence 98%. Banker can override."

Banker can always override with one click, and the override is logged 
alongside the original.

### Why (evidence chain)
**From AUSTRAC reform:** The post-March-2026 framework requires bankers 
to establish matters "on reasonable grounds" — which means they need 
to be able to justify why they accepted a piece of information. If the 
information was pulled from an external system without visible source, 
the banker cannot defend the decision in an audit.

**From BizEdge's own capabilities:** Westpac publicly claims BizEdge 
does customer data pre-population, automated Company search, and 
automated PPSR search. These are sources of data the banker did not 
personally verify. Without provenance, the banker is implicitly 
trusting the system without being able to show why.

**From commercial banking compliance research:** FrankieOne's 
post-reform guidance explicitly notes that the old "2+2 safe harbour" 
mindset is gone — banker verification depth must now match actual 
risk. That means bankers need to see what evidence underpins 
pre-filled fields so they can decide whether that evidence is 
sufficient for the risk profile of this deal.

### Trade-offs
- **Gain:** Compliance defensibility. Transparency for the banker. 
  Bridges the gap between automation and the banker's personal 
  accountability. Aligned with AUSTRAC's "reasonable grounds" 
  standard.
- **Cost:** Visual complexity — every auto-filled field has an 
  indicator. Risk of cluttering the UI.
- **Failure mode:** If banker never clicks the indicator, it becomes 
  decorative and the compliance value is theoretical. If banker 
  clicks but the provenance data is wrong or missing, trust 
  collapses.

### Alternative considered and rejected
**No provenance, full trust in automation.** Rejected because it 
contradicts AUSTRAC's new reasonable-grounds standard and leaves the 
banker unable to justify decisions in audit.

**Separate provenance panel.** Rejected because it separates the 
evidence from the field — banker would have to context-switch to 
check each auto-filled value.

### Validation method
- Click-through rate on provenance indicators
- Override rate (how often does the banker reject auto-filled values?)
- Audit scenario test: "Show me how you verified this beneficial 
  owner." Can the banker answer in under 10 seconds?

### Prototype scope
- **V1:** Small. Static indicator icons next to auto-filled fields, 
  with hover tooltip.
- **V2:** Yes. Provenance panel shows the full chain — when did the 
  system query, what did it receive, what's the match confidence, 
  what alternative matches were considered.

---

## Decision 7: Three-way task ownership distinction — Banker / System / Customer

### What
Every outstanding item in the checklist shows an owner indicator:
- **👤 You** — banker action needed (write the credit memo, review 
  document, confirm entity classification)
- **⚙️ System** — automated processing in progress (PPSR search 
  running, Company search running, credit decisioning in queue)
- **⏳ Customer** — waiting on customer action (documents not yet 
  uploaded, outstanding queries not yet answered)

Each owner has distinct color and icon. Banker can filter checklist 
by owner ("show only my actions") to focus on their queue.

### Why (evidence chain)
**From the brief:** The brief says bankers don't know "what's 
outstanding." This is technically true but incomplete — there are 
different kinds of outstanding. Some are waiting on the banker, some 
on the system, some on the customer. Collapsing these into one 
"outstanding" bucket makes the banker chase items they cannot act on.

**From McKinsey swivel-chair research:** Banker context loss happens 
when attention fragments across items the banker cannot resolve 
independently. Showing ownership distinction lets the banker focus on 
their actionable queue and mentally park the rest.

**From Hawthorn River assembly-line metaphor:** In an assembly line, 
a worker needs to see what's at their station versus what's upstream 
(coming from another station) versus what's downstream (waiting for 
the next station). Owner indicators operationalize this metaphor.

**From BizEdge's actual two-sided architecture:** Rich Data Co's 
contribution to BizEdge is described as a *"two-sided digital 
finance application form, which allows both customers and bankers 
to jointly work on an application"* (Westpac/RDC press, January 
2023). This means "Customer-owned" items in my checklist are not 
abstract design constructs — they correspond to real interactions 
on a real customer surface that already exists inside BizEdge today. 
The three-way ownership distinction (Banker / System / Customer) 
mirrors the actual architecture of the platform, not just a 
conceptual model of work. This is the strongest single evidence 
point for Decision 7 because it ties the design pattern directly 
to the platform Westpac has already built.

### Trade-offs
- **Gain:** Banker can focus on actionable queue. Reduces wasted 
  effort on items that are not theirs to resolve. Creates clear 
  handoff visibility when deal switches hands.
- **Cost:** Requires accurate ownership metadata for every checklist 
  item. If ownership is miscoded, the banker either does work that 
  wasn't theirs (wasted effort) or ignores their own work thinking 
  it was the system's (missed deadline).
- **Failure mode:** Ambiguous ownership on joint items (e.g., 
  "banker reviews customer-uploaded document") can produce confusion 
  about when the item transitions from customer-owned to banker-owned.

### Alternative considered and rejected
**Single "outstanding" status with no ownership.** Rejected because 
it forces the banker to mentally categorize every item by who owns 
it, which is what the UI should do for them.

### Validation method
- Time spent by banker on non-banker-owned items (should decrease 
  with filter)
- Handoff orientation speed (should improve)
- Misattribution rate — are any items coded wrong?

### Prototype scope
- **V1:** Yes. Clear owner icons next to each checklist item.
- **V2:** Yes. AI teammate watches for items that have been in one 
  owner state too long and surfaces a nudge ("This has been waiting 
  on customer for 4 days — average for this product is 1 day. 
  Consider following up.")

---

## Decision 8: Mode indicator for legacy ACIP vs reform CDD

### What
The deal home page shows a small persistent indicator at the top-right 
of the progress spine: "Initial CDD: Legacy ACIP (transition)" or 
"Initial CDD: Reform framework." Ongoing CDD and monitoring are always 
under the reform framework (no choice, applies from 31 March 2026).

The indicator is clickable — it reveals why this deal is under this 
framework, what the implications are, and when the transition to 
reform must happen.

### Why (evidence chain)
**From AUSTRAC transition rules (FirstAML, Hall & Wilcox analysis):** 
Existing reporting entities may continue using pre-reform ACIP for 
initial CDD until 31 March 2029, BUT ongoing CDD and risk monitoring 
apply under the reform framework immediately from 31 March 2026.

**The transition trap:** This creates a situation where one deal can 
be partially under old rules (initial CDD) and partially under new 
rules (ongoing CDD). Senior bankers may assume the old framework 
applies uniformly because "I heard we have until 2029" — but ongoing 
obligations changed two weeks ago.

**From the brief:** Pain 2 (senior banker skip on rare products) is 
urgent precisely because rare products are where the banker's mental 
model is most likely to be wrong about which framework applies. 
Making the mode explicit prevents the banker from silently applying 
the wrong rule set.

**From AUSTRAC reform principle:** The reform requires bankers to 
document their reasoning. An explicit mode indicator means the 
framework-selection reasoning is built into the UI, not assumed.

### Trade-offs
- **Gain:** Removes ambiguity during a multi-year transition period. 
  Prevents the senior-banker muscle-memory trap. Provides audit 
  evidence that the banker knew which framework they were applying. 
  Useful for the full transition window until 2029.
- **Cost:** Adds a small UI element that becomes irrelevant after 
  2029. Requires backend logic to correctly determine which framework 
  applies to each deal.
- **Failure mode:** If the mode is incorrectly auto-determined, the 
  banker may trust the indicator and apply the wrong framework. 
  Mitigated by making the indicator clickable with rationale display.

### Alternative considered and rejected
**No mode indicator — assume banker knows which framework applies.** 
Rejected because the whole point of the design is to reduce reliance 
on banker muscle memory, and the legacy/reform split is exactly the 
kind of thing muscle memory gets wrong during transition.

**Separate UI for legacy vs reform deals.** Rejected because it 
creates parallel workflows and doubles maintenance burden. Better to 
have one workflow with clear mode indication.

### Validation method
- Banker interview: "Which framework is this deal under, and why?" 
  Can they answer without looking at the indicator? With the 
  indicator? Is the indicator trusted?
- Audit scenario: how easy is it to demonstrate the framework 
  selection reasoning to a compliance reviewer?
- Transition tracking: as deals roll over to reform, does the 
  indicator correctly update?

### Prototype scope
- **V1:** Yes. Static label showing current framework. Click reveals 
  rationale.
- **V2:** Yes. AI teammate can suggest framework transition when 
  deal conditions warrant ("This customer's ongoing CDD now uses 
  reform framework. Consider updating initial CDD as well for 
  consistency.")

---

## Decision 9: Deal Confidence Score

### What
A persistent "Deal Confidence: X%" indicator visible in the BizEdge 
deal header throughout the deal lifecycle. The score is calculated 
from four inputs: (1) checklist completion percentage, (2) skip 
reason quality (skips with categorized reasons vs "Other" or lazy 
text), (3) data provenance confidence (auto-filled with source 
traceability vs manually entered), and (4) mode indicator alignment 
(whether the deal is correctly classified as legacy ACIP or reform 
CDD).

The score is advisory, not blocking. Red flags (missing legally 
mandatory items, policy violations) override the score with explicit 
warnings regardless of the number.

D9 is the umbrella metric. D1–D8 are the inputs that feed into it. 
Bankers perceive and act on D9; D1–D8 work beneath the surface.

### Why (evidence chain)
**Brief literal match:** The brief's core verb is "navigate deal with 
confidence." Making confidence a visible metric — not an inferred 
outcome — is a literal reading of what the brief asks for. None of 
D1–D8 addresses confidence as an outcome directly; they address its 
inputs. D9 closes this gap.

**For new bankers (emotional anchor):** For the Alex persona profile 
from Pain 1 evidence, the score provides an emotional anchor. 
"I'm at 72% — I'm doing okay" addresses the anxiety pattern 
documented in McKinsey onboarding research and Edmondson 
psychological safety literature. The score gives juniors permission 
to feel they're progressing without needing to ask colleagues.

**For senior bankers (efficiency signal):** For the Sarah persona 
profile from Pain 2 evidence, the score provides an efficiency 
signal. "I'm at 95% — I can submit" addresses the pattern where 
experienced bankers either over-check (wasting time on routine work) 
or under-check (expertise reversal failure modes on rare products). 
The score provides a calibration signal against their intuition.

**Decision-centered framing:** The interview narrative becomes "I 
made confidence literally measurable, which is what the brief asked 
for" — a literal brief-to-design match that's easy to defend.

### Trade-offs
- **Gain:** Makes abstract "confidence" concrete and measurable. 
  Provides emotional anchor for new bankers and efficiency check 
  for senior bankers using the same metric. Creates a single 
  perceivable outcome that integrates D1–D8's contributions into 
  one banker-facing signal.
- **Cost:** Calculation logic must be transparent — a black-box 
  score erodes trust. The score must be based on explainable inputs 
  the banker can inspect ("why 72%? checklist 80% complete, skip 
  reasons 60% categorized, provenance 90% verified, mode alignment 
  100%"). Adding this metric also introduces gamification risk 
  where bankers optimize for score rather than actual deal quality.
- **Failure mode:** If the score is wrong — for example showing 85% 
  when a hidden compliance risk exists — bankers may over-trust it 
  and skip critical judgment. Mitigation: the score is advisory 
  only, never blocks submission, and red flags from legally 
  mandatory items always override the score display with explicit 
  warnings that the score cannot be trusted for this deal.

### Alternative considered and rejected
**Passive confidence (inferred from banker behavior, never shown 
explicitly).** Rejected because the brief explicitly asks for 
navigation with confidence — this requires confidence to be 
perceivable, not merely inferred. A hidden metric cannot serve the 
emotional anchor role for new bankers or the efficiency check role 
for senior bankers.

**Binary ready/not-ready indicator.** Rejected because deal 
readiness is gradient, not binary. A 72% confidence deal with known 
gaps is different from a 72% deal with unclear gaps, and this 
distinction matters for the banker's next action. A percentage 
preserves the nuance and drives specific next actions.

### Validation method
- Track whether confidence scores correlate with downstream rework 
  rates (high confidence deals should have low rework)
- Measure banker behavior on high-confidence vs low-confidence deals 
  (do seniors actually submit faster when score is high?)
- Interview new bankers specifically about whether the confidence 
  number reduces anxiety or creates new anxiety
- Track whether red flag override warnings are noticed and acted on
- Track whether bankers inspect the score breakdown (hover tooltip 
  usage rate) — low usage signals the score is being taken at face 
  value without scrutiny

### Prototype scope
- **V1:** Visible in deal header as "Deal Confidence: 72%". Updates 
  dynamically as banker completes checklist items or logs skip 
  reasons. Tooltip on hover explains the four input categories and 
  their current state.
- **V2:** AI analyzes deal profile (product type, entity structure, 
  customer history) and contributes a fifth input to the score 
  calculation. Banker can click the score to see AI's reasoning 
  and the full breakdown.

---

## Summary table — all 9 decisions

| # | Decision | V1 | V2 | Brief pain addressed |
|---|---|---|---|---|
| 1 | Dynamic checklist (product × entity × jurisdiction) | ✓ | ✓ | All three pains |
| 2 | Skip as friction with logged reason | ✓ | ✓ (+ AI-ordered picker) | Pain 2 (senior skip) |
| 3 | Inline expandable knowledge | ✓ (static) | ✓ (AI-generated) | Pain 1 (new banker) |
| 4 | Progressive disclosure (no mode toggle) | ✓ | ✓ | Pain 1 + Pain 2 |
| 5 | Progress spine as guided workflow | ✓ | ✓ (+ AI notes) | Pain 3 (no single view) |
| 6 | Provenance indicators | ✓ (basic) | ✓ (full chain) | Cross-cutting |
| 7 | Three-way task ownership | ✓ | ✓ (+ AI nudges) | Pain 3 (outstanding) |
| 8 | Legacy ACIP vs reform CDD mode indicator | ✓ | ✓ | Pain 2 (senior skip urgency) |

---

## What this design explicitly does NOT solve

- **Customer-facing experience.** The deal home page is banker-facing. 
  Customer touchpoints (application form, document upload, status 
  portal) are a parallel design problem that this challenge does not 
  address.
- **Credit decisioning UX.** The decisioning engine is downstream of 
  deal setup. My design feeds it cleaner inputs but does not redesign 
  how credit decisions are made.
- **Training program design.** McKinsey's research says tooling is 
  the primary bottleneck for new bankers, but training is still a 
  parallel workstream. My design reduces the learning curve through 
  tooling, not curriculum.
- **Incentive structures.** If Westpac's KPIs reward throughput over 
  completeness, my friction-based skip decision creates measurement 
  data but does not fix the underlying incentive. That's a governance 
  workstream.
- **Policy simplification.** If credit policy is fragmented, my UI 
  can surface the fragmentation but not consolidate it. Policy 
  simplification is part of UNITE, not part of this design.
- **Full dynamic rule library.** The prototype demonstrates dynamic 
  reshaping on a small number of product × entity combinations. A 
  production system would need a maintained rules library covering 
  all combinations, which is an infrastructure investment, not a 
  design decision.

---

## What I would validate in the role (first 3 months)

1. **Open the resubmission data.** Break down by product type, 
   entity type, banker tenure. Test the core hypothesis that rare 
   product × senior banker is the worst combination.

2. **Shadow 3 new bankers and 3 senior bankers through a deal.** 
   Observe actual skip behavior, actual expansion use, actual 
   context-switching patterns.

3. **Talk to compliance team about the transition.** Has Westpac 
   internally transitioned all bankers to the reform framework, or 
   is the legacy ACIP still in use? How does that affect the mode 
   indicator design?

4. **Check BizEdge's API surface.** Does deal state get exposed to 
   a customer portal? If not, the provenance decisions and shareable 
   state assumptions need to be revisited.

5. **Analyze the current AI "real-time knowledge assistance" 
   deployment.** What does it actually do today? Is V2 teammate 
   an extension or a replacement?

6. **Observe a deal handoff between two bankers.** Where does context 
   get lost? Does the progress spine help or is it insufficient for 
   real handoffs?