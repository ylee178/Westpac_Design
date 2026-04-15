# Talking Points — Westpac Interview Presentation
# Senior Experience Designer - Business Lending (Origination Platform)
# 20-minute design challenge walkthrough + rationale + Q&A

> This is the presentation script and defense preparation.
> insights.md = what I know. decisions.md = what I decided. This = what I say.

---

## CORE LINES TO MEMORIZE

These are the three sentences that hold the whole presentation together. 
If I forget everything else, these three carry the thesis.

### Opening thesis (first 60 seconds)
"The three pains in the brief look different on the surface, but they 
share one root cause: context scarcity — bankers don't have a clear, 
shared view of where they are, what's required, and what's different 
about this particular deal. My design addresses that root cause at the 
banker's workstation inside BizEdge."

### V1-to-V2 transition (around minute 11)
"A checklist answers the visibility question. But the brief's hardest 
pain — senior bankers skipping key steps on rare products — is not a 
visibility problem. It's a judgment-under-pressure problem. That's why 
I explored a second version — one that reimagines the process around 
the banker's judgment, not just around the task list."

### Closing frame (last 60 seconds)
"I'm not claiming a better checklist fixes Westpac's business lending. 
Training, incentives, and policy simplification are parallel workstreams 
that UNITE is already handling. What I'm claiming is that the banker's 
interface is one lever in that system — and my design is an intervention 
at that lever, aligned with how AUSTRAC itself is reforming the framework 
underneath."

Memorize these three sentences verbatim. Everything else is elaboration.

---

## 20-MINUTE STRUCTURE (minute-by-minute)

| Minute | Section | What I say |
|---|---|---|
| 0:00–2:00 | Opening & reframe | 3 pains → 1 root cause. Context scarcity. |
| 2:00–4:00 | Approach & assumptions | Discovery activities, key assumptions, scope |
| 4:00–6:00 | The reframe that changed my design | "Single view" is guided workflow, not dashboard |
| 6:00–11:00 | V1 walkthrough (checklist-first) | Demo wireframes, explain 5 key decisions |
| 11:00–15:00 | V2 walkthrough (AI teammate) | Why second version exists. Live demo if possible. |
| 15:00–17:30 | Trade-offs & what I didn't solve | Honest limitations. Validation plan. |
| 17:30–19:00 | Back to the business | Why this matters to Westpac's strategy right now |
| 19:00–20:00 | Open for questions | "Happy to go deeper on any part" |

---

## SECTION 1 — OPENING & REFRAME (0:00–2:00)

### What I'm trying to accomplish
Interviewer forms their first impression in 90 seconds. I want them to 
think: "This person frames problems well." Not: "This person made a 
pretty screen."

### Script

> "Thanks for the challenge. I want to start by stepping back from the 
> brief for a moment.
>
> The brief gives me three pains. New bankers make errors and learn 
> through trial and error. Senior bankers skip key steps on less common 
> products. There's no single view of where a banker is in the deal 
> lifecycle.
>
> On the surface these look like three separate problems. But when I 
> looked at each one closely, they all share the same root cause: 
> **context scarcity**. Context is missing across three dimensions — 
> where am I in the deal lifecycle, what do I do next, and why does 
> this particular deal require something different from the last one.
>
> New bankers have no *procedural or diagnostic* context — they know 
> tasks exist but don't know the sequence or the rationale. Senior 
> bankers have *default* context but not *variation* context — their 
> muscle memory is optimized for common products and rare cases slip 
> through. And the "no single view" pain is literally about *spatial* 
> context — orientation in the lifecycle.
>
> So my design isn't trying to solve three separate UX problems. It's 
> addressing one meta-problem — context scarcity — at three different 
> levels of the banker's experience inside BizEdge.
>
> That reframing shaped everything that follows."

### Key emphasis
- "These look different, but they share one root." ← frame-breaking move
- "My design addresses the root, not the symptoms." ← senior signal
- Don't rush. This 2 minutes is the most important investment.

---

## SECTION 2 — APPROACH & ASSUMPTIONS (2:00–4:00)

### What I'm trying to accomplish
Show discovery discipline. Show what I'd do with more time. Show what 
I'm explicitly NOT solving.

### Script

> "Before showing the design, let me share how I approached the problem.
>
> In a real 3-month engagement I'd run three discovery activities in 
> parallel. First, deal autopsies — pull 20-30 recent resubmissions from 
> BizEdge and pattern-match the failure modes by product type and banker 
> tenure. Banker interviews are useful but bankers don't remember why 
> they made errors; the resubmission data does.
>
> Second, paired shadowing with new and senior bankers — not to ask 
> them 'what's hard?' but to observe actual decision moments and 
> context switches.
>
> Third, a product-by-entity-by-jurisdiction matrix co-designed with 
> credit risk and compliance. Because the rare-case pain isn't just 
> product-specific — it's the combination of product plus customer 
> entity plus geography that creates variation AUSTRAC cares about.
>
> I didn't have access to that data for this challenge, so I worked 
> from three sources: Westpac's own public materials on BizEdge, 
> AUSTRAC's reform guidance, and industry research on LOS patterns 
> from nCino, Moody's, Baker Hill, and Hawthorn River.
>
> A few explicit assumptions — and the conditions under which each 
> could be wrong:
>
> I assume BizEdge's remaining bottleneck is contextual guidance, not 
> speed. Westpac's own data supports this — they've achieved 45% 
> time-to-decision reduction, so the next-wave opportunity is elsewhere. 
> But if internal metrics show speed is still the top banker complaint, 
> I'm wrong.
>
> I assume product-plus-entity combinations are where rare-case errors 
> concentrate. AUSTRAC's own guide structure supports this. But if the 
> real pattern is customer risk rating rather than entity type, my 
> dynamic checklist reshape targets the wrong axis.
>
> I assume the banker's checklist should be the primary UX and AI should 
> be a supporting layer, not the other way around. I'll come back to 
> this — I actually explored the opposite direction in a second version.
>
> Things I'm explicitly not solving: customer-facing experience, credit 
> decisioning UX, training program design, and incentive structures. 
> Those are parallel workstreams. I'm addressing the banker's interface 
> layer — one lever in a larger system."

### Key emphasis
- "Three activities I'd run in parallel" ← concrete discovery plan
- "Conditions under which each could be wrong" ← falsification > confidence
- "Things I'm explicitly not solving" ← scoping is senior signal

---

## SECTION 3 — THE REFRAME THAT CHANGED MY DESIGN (4:00–6:00)

### What I'm trying to accomplish
Show that my design is informed by research, and that I updated my 
thinking when research contradicted my initial assumption. This is 
the single strongest senior-level signal in the whole presentation.

### Script

> "One moment during research that changed my design direction.
>
> When I first read 'no single view' in the brief, I assumed it meant 
> the banker needed a unified dashboard — every piece of deal context 
> visible at once, so they could see where they were.
>
> Then I looked at how the LOS industry actually handles this. 
> nCino's Deal Proposal uses what they call a 'single sheet method' — 
> but that's not a dashboard. It's a structured dossier where information 
> is sequenced around lifecycle progression and the next task. Moody's 
> Lending Suite describes 'dynamic applications, guided workflows, 
> AI-led prioritization.' Baker Hill emphasizes pipeline-led banker 
> lens with dynamic credit memos.
>
> All three major LOS vendors converge on the same pattern: **single 
> view doesn't mean 'everything visible at once.' It means 'single 
> guided workflow surface' — information sequenced around the next 
> unresolved action.**
>
> That refuted my initial assumption. I reframed the problem. The 
> banker doesn't need a dashboard. They need a guided workspace that 
> turns ambiguity into next steps.
>
> This one reframing changed my progress spine design, my checklist 
> architecture, and how I think about what's visible by default versus 
> what expands on demand."

### Key emphasis
- "I was wrong at first" ← this is strength, not weakness
- Three industry sources converging on the same pattern ← not opinion
- "Reframing the problem" is a deliberate act of senior design

### Why this section matters disproportionately
Junior designers show their final answer. Senior designers show their 
thinking process — especially the part where they updated their mind. 
If I only take 2 minutes on this, take 2 minutes on this.

---

## SECTION 4 — V1 WALKTHROUGH: CHECKLIST-FIRST (6:00–11:00)

### What I'm trying to accomplish
Show the design. Anchor each decision to a piece of evidence from 
research. Don't just describe screens — explain *why* the screen looks 
this way.

### Setup (30 seconds)
> "V1 takes the checklist as the primary interaction, because research 
> supports the idea that structured task guidance works better than 
> conversational AI for regulated workflows where the user needs to 
> finish a specific task under time pressure. Let me walk through the 
> key decisions."

### Decision walkthrough — 5 key points (4 minutes)

**Point 1: Dynamic checklist reshapes by product × entity × jurisdiction (45 sec)**
> "The checklist isn't static. When the banker selects the product type 
> and customer entity, the checklist reshapes to show the specific 
> mandatory steps for that combination.
>
> This isn't my invention. Hawthorn River, an LOS vendor, articulates 
> this as an industry principle — validation rules must vary based on 
> loan structure, borrower, and collateral. AUSTRAC's own structure 
> publishes different initial CDD guide paths for different entity types. 
> A static checklist ignores the way both the industry and the regulator 
> already model the problem."

**Point 2: Progress spine as orientation, not dashboard (45 sec)**
> "The top of the screen is a progress spine showing lifecycle stages — 
> Setup, Identification, Credit, Approval, Settlement. The banker's 
> current position is visually emphasized. But critically — the spine 
> doesn't try to display every piece of deal data at once. It answers 
> one question only: 'where am I, and what's next?'
>
> That's the reframing I mentioned earlier. Single guided surface, not 
> parallel information display."

**Point 3: Three-way task ownership (45 sec)**
> "Every outstanding item shows who it's waiting on. Banker-owned. 
> System-owned — PPSR search running, credit decisioning in queue. 
> Customer-owned — documents not yet uploaded. The banker can filter 
> to 'my actions only' and focus on their actionable queue.
>
> This came from McKinsey's research on what they call swivel chair 
> work — context loss happens when attention fragments across items 
> the banker can't act on. Showing ownership lets them mentally park 
> what isn't theirs.
>
> And this three-way split isn't theoretical — BizEdge's own 
> architecture is two-sided, with Rich Data Co's contribution 
> described as 'a two-sided digital finance application form where 
> customers and bankers jointly work on an application.' The 
> customer isn't an abstract third actor — they're a real surface 
> in the existing platform."

**Point 4: Skip is friction, not block (45 sec)**
> "When a banker tries to proceed past an incomplete item, there's no 
> hard block. There's a lightweight dialog asking for a one-line reason, 
> which becomes audit data. The deal continues.
>
> This isn't just a UX preference — it's aligned with AUSTRAC's reform. 
> AUSTRAC explicitly states that some initial CDD steps can be delayed 
> 'where essential to avoid interrupting ordinary business.' That's a 
> direct departure from 'all boxes must be ticked before anything 
> happens.' My design operationalizes the regulator's own intent."

**Point 5: Inline expandable knowledge, not chatbot (45 sec)**
> "Each checklist item has an 'i' affordance that expands inline, 
> showing why the step is required, common mistakes for this specific 
> combination, and example of correct completion. Default state is 
> collapsed — banker-triggered, not system-pushed.
>
> The alternative I rejected was a separate chatbot. It fails new 
> bankers because it forces them to leave the workflow, re-explain 
> context, and formulate a question they don't yet know how to ask. 
> Inline expansion has the context already — the checklist row knows 
> what it's about."

### Closing of V1 (30 sec)
> "V1 is a controlled intervention. It's not trying to revolutionize 
> the banker's day. It's trying to eliminate specific failure modes at 
> the deal-setup stage inside BizEdge. If I measure success, I measure 
> it in resubmission rates going down and time-in-stage shrinking — 
> not in feature count going up."

---

## SECTION 5 — V2 WALKTHROUGH: AI TEAMMATE (11:00–15:00)

### Transition (30 sec) — THIS IS A KEY MOMENT
> "A checklist answers the visibility question. 'Where am I' and 'what 
> do I do next' are procedural questions, and V1 handles them. But the 
> brief's hardest pain — senior bankers skipping key steps on less 
> common products — isn't really a visibility problem. Senior bankers 
> know the steps exist. They skip them because their muscle memory is 
> optimized for common products and variation doesn't break through.
>
> That's a judgment-under-pressure problem. A better checklist helps, 
> but it doesn't fundamentally solve it. So I explored a second version."

### Theory behind V2 (60 sec)
> "V2 uses the same shell as V1 — same checklist, same progress spine. 
> But it adds a persistent AI teammate panel on the right side. Not a 
> chat interface. An ambient colleague that watches deal state and 
> surfaces context when it thinks the banker needs it.
>
> This isn't a chatbot. Chatbots are reactive — banker has to ask. The 
> problem with new bankers is they don't know what to ask. The problem 
> with senior bankers on rare products is they don't know they should 
> be asking. Both groups need proactive guidance, not reactive Q&A.
>
> Westpac's current BizEdge AI is described as 'real-time knowledge 
> assistance' — which is reactive. V2 is a deliberate different bet: 
> ambient, proactive, rationale-attached.
>
> Quick note on how I got here. I came to the ambient-versus-reactive 
> distinction independently — from cognitive psychology and my own 
> work on a Slack-based AI companion. Then in research for this 
> challenge I found Dr Martin Anderson, Westpac's Head of Technology 
> for business lending, saying at the AWS Financial Services Symposium 
> in Sydney earlier this year that bankers will be 'surprised by how 
> these sequences are going to be reorganised, resequenced, rewired,' 
> and that BizEdge's evolution is 'not just adding in AI-specific 
> points — it's actually reimagining the process.' That's convergent 
> evidence, not borrowed authority. V2 is one version of what 
> reimagining could look like at the banker's workstation."

### Live demo moment (60 sec) — if prototype is live
> "Let me show what happens when the banker selects a bank guarantee 
> — a rare product. Watch the right panel.
>
> [Demo: select bank guarantee, AI teammate surfaces: 'This product has 
> mandatory steps your recent deals haven't needed: beneficiary legal 
> name, expiry alignment with contract, term deposit security. Click 
> for details.']
>
> The key design choice: the AI never decides. It suggests. Every 
> suggestion has a 'why' rationale attached, and the banker always has 
> one-click dismiss. AI suggests, banker decides. In a regulated context, 
> that distinction is not optional."

### Explaining expertise reversal effect (60 sec)
> "The reason V2 works this way comes from a cognitive psychology 
> concept called the expertise reversal effect. It's well-studied in 
> aviation and medicine. Experts over-apply their automated mental 
> model to atypical cases because their schemas don't match the 
> variation. The fix isn't to make experts feel like beginners. The 
> fix is a contextual interrupt strong enough to break the automated 
> pattern-match on the specific cases where it's wrong.
>
> V2's AI teammate is that interrupt — calibrated to deal rarity, 
> not banker tenure. A senior banker seeing their 1000th term loan 
> gets a quiet panel. The same banker opening a trust-structured 
> bank guarantee with a foreign beneficiary gets a loud one. Same UI, 
> adaptive response."

### V2 closing (30 sec)
> "V2 is more ambitious than V1. It has a real failure mode — if the 
> AI is wrong or annoying, bankers ignore it and the feature dies 
> silently. I'd roll V1 first, measure, then layer V2 only if V1's 
> impact plateaus. Don't ship AI because AI is trendy. Ship AI when 
> the problem it solves is one the non-AI version can't reach."

---

## SECTION 6 — TRADE-OFFS & LIMITATIONS (15:00–17:30)

### Setup (30 sec)
> "Every design has failure modes. I want to be honest about the ones 
> in mine before the interview gets to them."

### Trade-off matrix (90 sec)
> "Dynamic checklist vs static. Dynamic is more complex to maintain, 
> requires a rules library. If that library is incomplete, rare 
> combinations reshape incorrectly — which is worse than a static 
> checklist because banker trust collapses when reshape is wrong. 
> Mitigation: ship static for well-understood combinations, dynamic 
> only where product × entity variation is frequent enough to justify 
> the complexity.
>
> Skip-as-friction vs hard block. Some genuine skip mistakes will still 
> pass through. The skip reasons data might become noisy if bankers 
> write lazy reasons. Mitigation: measure skip reason quality over 
> time; if it degrades, tighten the friction.
>
> Inline expandable help vs separate chatbot. If expansion content 
> is thin or stale, bankers stop opening it and the feature dies. 
> Mitigation: content ownership and freshness cycle, not a one-time 
> build.
>
> Progressive disclosure vs mode toggle. I actually explored the 
> toggle first, then dropped it. NN/g research and my own reasoning 
> showed toggles create stigma for juniors and false confidence for 
> seniors. But progressive disclosure is harder to instrument — no 
> explicit mode makes behavioral analytics harder. I accept that 
> trade-off because user experience wins over analytics convenience 
> when the two conflict."

### What I'd validate (30 sec)
> "If I joined Westpac, the first three months I'd validate:
>
> One — open BizEdge resubmission data, broken down by product type 
> and banker tenure. Test the core hypothesis that rare product × 
> senior banker is the worst combination.
>
> Two — shadow actual bankers through actual deals. Observe real skip 
> behavior and context-switching patterns.
>
> Three — talk to compliance about the AUSTRAC transition. Has 
> Westpac internally transitioned bankers to the reform framework, or 
> is legacy ACIP still widely in use? That affects the urgency framing."

---

## SECTION 7 — BACK TO THE BUSINESS (17:30–19:00)

### Why this matters to Westpac right now (90 sec)
> "Let me end by connecting the design back to the business.
>
> Westpac is in a specific moment. Business & Wealth delivered about 
> 33% of group profit in the first half of fiscal 2025 — business 
> lending is not a side bet, it's the strategic engine. Westpac is 
> chasing NAB and CBA in market share, with Reuters showing Westpac 
> at 16.1 percent versus CBA at 18.85 and NAB at 21.6 as of mid-2025. 
> They're narrowing the gap but still trailing.
>
> The bank is scaling both sides of the equation. UNITE has already 
> decommissioned 180-plus applications, simplified over 70% of 
> products, and streamlined 700-plus processes — that's happening 
> underneath BizEdge. On the people side, Westpac committed to 200 
> more business bankers in their November 2024 announcement, with 
> Reuters reporting that target expanded to 350 by September 2025 
> and 135 already hired.
>
> And this is all happening two weeks after AUSTRAC's AML/CTF reform 
> commenced on 31 March 2026. Every existing banker is adjusting to 
> a framework AUSTRAC describes as a shift 'from a compliance-based 
> approach to a risk-based, outcomes-oriented approach.' Senior 
> muscle memory built under the old framing is actively dangerous 
> right now.
>
> One strategic signal. My thesis leans on nCino's 'single sheet 
> method' as the industry pattern for guided LOS workflows — that's 
> where my progress spine concept comes from. Researching this 
> challenge I learned that Westpac and nCino co-led Rich Data Co's 
> US$17.5M Series B in November 2023. The global LOS leader and 
> Westpac investing together in the same AI decisioning platform. 
> I wasn't surprised to find this — it confirms the LOS pattern I 
> designed toward is one Westpac is already strategically aligned 
> with, not one I'm asking the bank to discover.
>
> And specifically for Westpac — this isn't a hypothetical regulatory 
> concern. Westpac paid Australia's largest corporate fine, $1.3 
> billion to AUSTRAC in 2020, and spent five years rebuilding 
> controls. That history gives specific weight to my decisions 
> around banker-level evidence visibility — provenance indicators 
> in Decision 6, the legacy-versus-reform mode indicator in 
> Decision 8.
>
> So when I design a checklist for BizEdge, I'm not designing in a 
> vacuum. I'm designing at the convergence of three forces: a 
> competitive push to win back market share, a regulatory shift that 
> just landed, and a large banker workforce that needs to become 
> productive fast. My design is an intervention at one specific lever 
> in that system — the banker's interface — aligned with the direction 
> the rest of the system is already moving."

### Key emphasis
- Specific numbers ← shows I did the homework
- "Convergence of three forces" ← frames the hire as strategic, not cosmetic
- "One lever in a system" ← humility without self-diminishment

---

## SECTION 8 — OPEN FOR QUESTIONS (19:00–20:00)

### What I say
> "I'd rather leave time for your questions than pack more into the 
> walkthrough. I can go deeper on any part — the research behind a 
> specific decision, the trade-off logic, the prototype implementation, 
> or what I'd change if I had more time. Where would you like to 
> start?"

### What I don't say
- "That's all I have." ← weak closing
- "Any questions?" ← passive
- Apologize for time ← never apologize

---

## DEVIL'S ADVOCATE — 7 ATTACKS AND REBUTTALS

These are the hardest attacks interviewer could throw. Each has a 
rehearsed answer. Memorize the shape, not the words.

### Attack 1: "Context scarcity is not the real root cause. It's capability, incentives, or process ownership."
**Rebuttal:**
> "Fair critique. My design addresses the interface layer — what the 
> banker sees and interacts with when they sit down to do a deal. It 
> doesn't fix onboarding, KPI structures, or credit policy fragmentation. 
> Those are parallel workstreams. What I'm proposing is a controlled 
> intervention at the error-surface-area, not a universal solution. I 
> see UX, policy, and incentives as three levers. I'm pulling one."

### Attack 2: "Inline help becomes banner blindness. Your expansion drawer will be ignored."
**Rebuttal:**
> "Banner blindness happens when help is always present. My expansion 
> is default collapsed. Banker-triggered, not system-pushed. NN/g's 
> progressive disclosure research shows user-triggered reveal avoids 
> banner blindness because users only open what they chose to open. 
> The risk isn't zero, but the pattern is deliberately chosen to 
> mitigate it."

### Attack 3: "Self-toggle between modes is vulnerable. Users don't know which mode to be in."
**Rebuttal:**
> "I agree — which is why I explicitly moved away from self-toggle. 
> In my initial exploration I had a Learning/Expert mode toggle. 
> Research from NN/g and reasoning about stigma made me drop it. My 
> final design uses progressive disclosure instead: every banker sees 
> the same checklist; expansion is banker-triggered. The system never 
> asks the banker to declare their experience level."

### Attack 4: "'New banker errors' is a training problem, not a UX problem."
**Rebuttal:**
> "Training is absolutely part of the picture. But McKinsey's research 
> on commercial banking onboarding finds 30 to 100 days to productivity, 
> and they attribute it primarily to fragmented systems and manual 
> workflows, not curriculum quality. Even with perfect training, a new 
> banker hits tooling fragmentation on day one. My design addresses 
> the tooling half. Training remains a parallel workstream."

### Attack 5: "'Senior banker skip' is an incentive problem. KPIs reward throughput."
**Rebuttal:**
> "Incentive fixes are outside my scope. I can't fix Westpac's KPI 
> structures from the UI. But here's what I can do: my friction-based 
> skip creates audit-trail data. Over time, skip reasons become visible. 
> Visible patterns inform policy conversations. Policy conversations 
> inform incentive design. So my UI doesn't solve the incentive problem, 
> but it creates the measurement layer that makes the incentive problem 
> visible. That's what an interface can legitimately contribute."

### Attack 6: "'Single view' may be a vanity feature. How do you know it actually reduces rework?"
**Rebuttal:**
> "Completely fair. That's why my validation plan doesn't measure 
> 'does the single view exist.' It measures rework reduction, escalation 
> rate, approval delay compression, time-to-first-action. If none of 
> those shift after six months, the design hasn't earned its place. I 
> wouldn't defend the design in year two if the metrics didn't move."

### Attack 7: "Westpac has cultural and complexity issues UX can't fix. A prettier checklist won't fix the bank."
**Rebuttal:**
> "You're right. I'm not here to tell Westpac a prettier checklist fixes 
> the culture. It won't. What I am here to do is design the interface 
> layer in a way that supports, rather than obstructs, the simplification 
> already happening through UNITE. UNITE has delivered real progress — 
> 180-plus applications decommissioned, 70-plus percent of products 
> simplified. My design rides that wave. If UNITE were failing, my 
> design would fail too.
>
> And specifically for Westpac, the 2020 AUSTRAC case is the reason 
> banker-level evidence visibility isn't a nice-to-have. Westpac 
> spent five years and $1.3 billion dollars learning how critical 
> that visibility is. My design treats it as foundational.
>
> Because UNITE is delivering, my design operationalizes that 
> progress at the banker's workstation."

---

## LIKELY INTERVIEWER QUESTIONS (10)

### Q1: "Walk me through your research process."
> "I worked from three sources. Westpac's own public materials — 
> investor presentations, ASX announcements, the FY25 results. AUSTRAC's 
> reform guidance, especially the post-March-2026 CDD changes. And 
> industry research on LOS patterns from nCino, Moody's, Baker Hill, 
> Hawthorn River. I explicitly didn't have access to internal data 
> like resubmission rates or actual banker interviews, so I noted 
> those as open questions I'd validate in the first three months of 
> the role."

### Q2: "How would you validate your key hypothesis?"
> "The core hypothesis is that BizEdge's remaining bottleneck is 
> contextual guidance, not speed. I'd validate by pulling resubmission 
> data broken down by product type and banker tenure. If senior bankers 
> on rare products don't show elevated resubmission rates, my hypothesis 
> is wrong and I'd rethink the design direction. I'd also run A/B tests 
> on static versus dynamic checklist with bankers of mixed experience."

### Q3: "What would you do differently if you had more time?"
> "Three things. One — actual banker shadowing. I was designing from 
> research inference, not observation. Two — a proper product × entity 
> × jurisdiction matrix co-designed with credit risk and compliance. 
> I hand-waved the complexity of that matrix in my wireframes. Three — 
> I'd explore card-based work queues and exception-first dashboards 
> as alternatives to the checklist paradigm itself, not just as 
> implementation variants."

### Q4: "Why didn't you use more high-fidelity visuals?"
> "The brief specified clarity of thinking over visual polish. I took 
> that literally. My wireframes are annotated mid-fidelity — the 
> annotations are where the design thinking lives, not the pixel detail. 
> If you'd prefer, I can toggle my prototype into high-fi mode and walk 
> through styled versions, but I wanted to make sure the decisions 
> were legible first."

### Q5: "How would this work on mobile?"
> "Honestly, I deliberately scoped mobile out. Banker workflows for 
> deal setup are desktop-dominant in practice — the volume of information 
> per screen and the document-handling requirements make mobile a 
> different problem. If I were designing for mobile, I'd start over 
> with different assumptions, not try to responsive-ify the desktop 
> design. Scoping mobile out let me go deeper on the core decisions 
> in the time I had."

### Q6: "How does your design handle edge cases like joint deals or complex trust structures?"
> "Two honest answers. First — for joint deals, my three-way task 
> ownership model (banker / system / customer) handles it structurally 
> because each party can own different items. Second — for complex 
> trust structures, I'd lean heavily on the dynamic checklist reshape 
> plus the AI teammate in V2 to surface 'this trust has unusual control 
> structure' flags. But I also want to be honest: I didn't wireframe 
> a complex trust scenario. If you want to walk through one now as a 
> hypothetical, I'd find that useful."

### Q7: "What's the biggest risk in this design?"
> "The AI teammate in V2 has the highest risk. If it's wrong or annoying, 
> bankers ignore it and the feature dies silently. Unlike a static 
> checklist, an AI suggestion that gets dismissed trains the banker to 
> dismiss the next one too. The mitigation is to ship V1 first, measure 
> carefully, and only layer V2 when the impact plateau justifies the 
> risk. Don't ship AI because AI is trendy.
>
> That said, I found after completing my design that Dr Martin 
> Anderson — your Head of Technology for business lending — recently 
> said publicly that BizEdge's evolution isn't about adding AI points 
> but about reimagining the process around AI. My V2 is one version 
> of what that reimagining could look like at the banker's 
> workstation. The risk isn't that the direction is wrong — the 
> direction has executive backing. The risk is in the specific 
> execution of an ambient versus reactive AI, which is where I'd 
> want real user testing before shipping."

### Q8: "How would you work with engineering to build this?"
> "For V1, I'd pair with an engineer on the dynamic checklist reshape 
> logic first — that's the highest complexity and the highest risk if 
> mis-built. I'd build a product × entity rule library in collaboration 
> with credit risk and compliance, not just handed to engineering as a 
> spec. I'd use a progressive rollout — start with two or three product 
> × entity combinations where we're confident, not the full matrix. 
> Measure, then expand. For V2, I'd want strong evaluation criteria 
> for the AI output before the feature ships — not after."

### Q9: "How do you handle stakeholder pushback?"
> "Depends on the pushback. If a stakeholder says 'this is too complex,' 
> I ask what specifically feels complex and whether it's the concept 
> or the wireframe expression. If they say 'bankers won't adopt this,' 
> I ask what they base that on and whether there's data or it's gut 
> feel — then I propose a measurement plan to decide. If they say 'we 
> don't have budget,' I ask what gets de-scoped and propose a phased 
> rollout. What I try not to do is defend my design emotionally. The 
> design has to earn its way."

### Q10: "What design work in your background is most relevant to this role?"
> "Two pieces. At BarNet OpenLaw I designed UX for a legal tech 
> platform used by barristers — high-stakes regulated professionals 
> who don't tolerate UI mistakes. That trained me for the 'expert user 
> in a regulated workflow' problem, which is exactly what Westpac 
> business bankers are. Separately, I built an AI companion agent in 
> my own time — a proactive Slack assistant with a three-layer 
> architecture that watches, analyzes, and surfaces context. That's 
> where the V2 ambient teammate pattern came from. I've actually 
> shipped a working version of the pattern I'm proposing here, just 
> at a smaller scale and in a different domain."

---

## PRESENTATION-DAY CHECKLIST

### Morning-of
- Read insights.md once through (20 minutes)
- Read decisions.md scanning headers (10 minutes)
- Read this file, memorize Core Lines at top, scan rebuttals (15 minutes)
- Prototype URLs open in browser tabs, logged in, tested
- Slide deck / Figma open, first slide up
- Water nearby

### Minutes before
- Quick scan of Core Lines (opening, V1-to-V2 transition, closing)
- Deep breath, shoulders down

### If I forget what to say
- Fall back to Core Lines
- "Let me walk you through the three pains first" always restarts the 
  narrative

### If a question blindsides me
- "That's a good question — let me think for a second." ← use this, 
  don't rush
- "My honest answer is I haven't considered that. Here's how I'd think 
  about it..." ← honesty beats faking
- Never make up data. "I don't have that number" beats inventing one.

---

## AFTER THE PRESENTATION

Take a moment to note:
- What question caught me most off-guard?
- What did I say that I wish I'd said differently?
- What did the interviewer seem most interested in?

Write it down within 30 minutes. That's the learning layer for the 
next interview, not just this one.