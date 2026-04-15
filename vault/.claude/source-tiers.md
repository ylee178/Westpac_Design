# Source Tiers
# Referenced from .claude/insight-protocol.md Step 1

When classifying a new data point, use one of these five tiers:

## Primary
Regulator guidance (AUSTRAC, APRA, ASIC), official company materials (Westpac ASX releases, investor decks, earnings calls), peer-reviewed academic research, government reports.

These sources are authoritative. Claims from primary sources can be cited directly with high confidence.

## Secondary
Reputable trade press (Reuters, Bloomberg, AFR, iTnews, MPA), established industry analyst reports, major consulting firm research (McKinsey, BCG).

These sources are reliable but derivative. They interpret or report on primary data. Cite with attribution to both the secondary source and any primary source they reference.

## Tertiary
Vendor marketing materials (nCino website, Hawthorn River blog, product brochures), LinkedIn posts, opinion commentary, Medium articles, podcasts.

Useful for color and perspective but not for load-bearing claims. Flag tier explicitly in the draft when using these.

## LLM synthesis
Perplexity output, ChatGPT summaries, Claude conversations, any AI-generated synthesis of multiple sources.

Treat these as a starting point, not a final source. The underlying sources cited by the LLM should be verified independently before being treated as primary or secondary. Always flag as "LLM synthesis" in the draft and encourage Sean to verify.

## Sean's observation
Sean's own reasoning, design intuition, pattern recognition, or conclusions drawn from personal experience (e.g., his BarNet OpenLaw background).

These are not citable in the traditional sense but are legitimate design insights. Flag as "Sean's observation" in the draft. These are especially valuable for talking-points.md.

## See also
- `.claude/insight-protocol.md` — the full workflow that references these tiers
