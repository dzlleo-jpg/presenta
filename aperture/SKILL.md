# DNA Forge

> Methodology for crafting unique, production-grade visual DNAs that escape AI design averaging.
> 一套打造独特视觉 DNA 的方法论 — 让生成式 AI 真正产出有 character 的设计,而不是平均化的"还行"。

`v0.1 · 由 [user] × Claude 共创于 2026-04 · 从 Aperture DNA 创作过程反向抽取`

---

## name
dna-forge

## description
Use this skill when a user wants to create a **new visual DNA** / design system / brand visual language for use across PPT, web UI, mobile UI, or marketing materials. Triggers include: "design DNA", "design system", "visual identity", "视觉 DNA", "视觉语言", "设计系统", "design language", or when a user describes wanting a particular look-and-feel that fuses 2-3 brand references (eg "70% Polestar 30% Apple", "类似 Pentagram 但更克制"). Especially trigger when the user wants something that goes beyond template-style outputs and produces designs that feel **distinct, premium, intentional**. This skill produces two output files: `<dna_name>.dna.md` (the human-readable spec) and `<dna_name>.tokens.json` (the machine-readable companion for use by Claude Code, design tools, and other AI agents).

---

## When to use this skill

Use dna-forge when:
- User wants to **create a new visual DNA from scratch**, often by fusing 2-3 reference brands or aesthetics
- User has a project (product, brand, deck, app) that needs a distinctive look beyond generic templates
- User explicitly mentions wanting "高级感" / "premium" / "时尚" / "独特" / "creative" / "out of the box" beyond standard design system aesthetics
- User wants outputs usable by both **humans (designers reading)** and **AI agents (Claude Code generating code)**

Do NOT use dna-forge when:
- User wants to apply an *existing* design system (Material, Tailwind UI, etc.) — use frontend-design skill instead
- User wants a quick mockup with no system-level intent — use frontend-design skill instead
- User has an existing brand they want to *extend* (not create new) — use brand-guidelines skill if available
- User is asking for a single static asset (logo, poster) — use canvas-design skill instead

---

## What this skill produces

Two files in the working directory:

1. **`<dna_name>.dna.md`** — the complete human-readable specification, ~500-700 lines, structured with:
   - Identity (spirit, lineage, when to use, signature tension)
   - Two modes (or whatever modal structure fits the DNA)
   - Universal Floor (anti-ugly rules, applies regardless of style)
   - Style DNA Locked (anti-drift rules, what makes this DNA *this* DNA)
   - Sub-systems (parametric variants of the DNA)
   - Anti-patterns (防丑 + 防偏)
   - CJK & Mixed-script Typography (if applicable)
   - Media Integration & Placeholders
   - Signature Library (deliberate breaks that elevate from 80% to 90%+)
   - Cross-medium adjustments
   - Quick checklist

2. **`<dna_name>.tokens.json`** — machine-readable companion with the same logical structure, used by Claude Code and other AI agents to generate compliant artifacts.

---

## The DNA Forge Methodology (8 phases)

This skill orchestrates a **conversational, iterative process**. Do not try to produce the full DNA in one pass. Each phase has its own goal, deliverable, and decision points.

### Phase 1 · Identity & References

**Goal**: Establish what the DNA *is*.

**Conversation moves**:
- Ask user for **2-3 reference brands or aesthetics** they want to fuse
- Ask for the percentages (eg 70/30, 60/30/10) — this forces commitment over vague "inspired by"
- Ask the **domain** (B2B SaaS, consumer app, cultural institution, AI product, etc.)
- Ask the **scripts** (Latin only / CJK only / bilingual / multilingual)
- Ask for **explicit "when to use" and "when NOT to use"** scenarios

**Visual move**: Use `image_search` to find actual examples of each reference brand. Do not rely on text descriptions alone — the user can't react to "Polestar minimalism" until they see it. Show 2-3 images per reference.

**Deliverable**: A draft Identity block with:
- Name (proposed; user-confirmed before locking)
- Spirit (one sentence)
- Lineage (the references with percentages)
- When to use / When to avoid
- **Signature Tension** (the core dialectical pair — eg "静默剧场 × 精密信息" for Aperture). This is the *single most important* idea in the DNA. If this is weak or generic, the entire DNA will be weak.

**Decision point**: User confirms name, lineage, and signature tension before moving to Phase 2.

### Phase 2 · The Two-Layer Architecture

**Goal**: Split rules into two distinct layers — Universal Floor (anti-ugly) vs Style DNA (anti-drift).

**The user's key insight (from Aperture creation)**: There are TWO kinds of rules with TWO kinds of values each:
- **Universal Absolutes** — hard numbers that prevent ugly regardless of style (eg minimum font size 11px, contrast ratio 4.5:1, minimum touch target 24pt)
- **Universal Relatives** — ratios that prevent ugly (eg whitespace/content ≥ 0.4, type scale step ≥ 1.25, line-height ≥ 1.5)
- **Style Absolutes** — hard values that define this DNA (eg specific font weights, accent placements, corner radius)
- **Style Relatives** — ratios that define this DNA (eg H1:body ≥ 5.0 — change this and it's not the same DNA anymore)

**Critical insight**: **Style Relatives matter more than Style Absolutes**. Hex values can vary; ratios define identity. Polestar without champagne accent is still Polestar; Polestar with H1:body of 2:1 instead of 5:1 is no longer Polestar.

**Conversation moves**:
- Help user identify what universal floor applies (probably similar across DNAs — use Aperture's as starting baseline)
- Help user identify the 6-10 Style Locked rules that define identity
- Force user to commit to specific numbers (not "thin font" but "weight 200 only")

**Deliverable**: Section §3 (Universal Floor) and Section §4 (Style DNA Locked) of the spec.

### Phase 3 · Sub-systems / Parametric Variants

**Goal**: Define the DNA not as a single fixed look, but as a **parametric system** that can flex across contexts.

**Why this matters**: A single fixed look is brittle. The DNA needs to handle:
- Light mode vs dark mode
- Saturated chapter pages vs muted content pages
- Dashboard data viz vs marketing hero
- Different brand domains (energy, finance, health, culture)

**Conversation moves**:
- Propose a **default sub-system** (the "baseline look")
- Propose 3-6 **variant sub-systems** (eg petrol, light_paper, color_block, data_palette in Aperture)
- For each, define what changes (only bg + text? full inversion? saturated canvas?) and what stays locked (the Style DNA from Phase 2)
- Add **layered modifiers** if relevant (eg Brand Spectrum in Aperture — content-driven palette overlays)

**Deliverable**: Section §5 of the spec (sub-systems with tokens and constraints).

### Phase 4 · CJK & Mixed-script Layer (if applicable)

**Skip this phase** if user is Latin-only.

**Critical knowledge**:
- CJK and Latin have fundamentally different typography logic (block-glyph density vs word-space rhythm)
- Same font-size: Latin has 8-12% more visual weight than CJK due to ascenders/descenders
- CJK needs different letter-spacing (-0.05 to -0.08em hero), different line-height (≥ 1.7 body), different weight pairs (avoid 300/600 — they map to Latin 400/700 visually)
- Mixed-script same line needs **size compensation** (Latin 0.85-0.92 of CJK at hero, 0.92-0.95 at body)
- Punctuation rules (full-width vs half-width, line-start/end forbidden chars)
- Vertical writing only in native Japanese editorial contexts

**Conversation moves**:
- Confirm scripts in scope
- If CJK: include §10 CJK & Mixed-script Typography section in the spec
- If specifically Japanese editorial work: include a Japanese Editorial sub-system (Hara Kenya / NDC blood) with separate tokens

**Deliverable**: Section §10 of the spec.

### Phase 5 · Media Integration & Placeholders

**Goal**: Define how images, video, pictograms integrate with the DNA, AND how to handle missing media gracefully.

**Why this matters**: Real-world artifacts always include media. A DNA that only handles typography breaks down the moment a real project ships.

**Conversation moves**:
- Define 4-6 image-text composition patterns (Pattern A: full-bleed hero; Pattern B: bento cell; Pattern C: side-by-side; Pattern D: pictogram; Pattern E: ambient video)
- For each, define geometry constraints (corner radius, contrast layers, max brightness ratios)
- Define **placeholder schema** for missing media:
  - HTML attributes (data-aspect, data-pattern, data-subsystem, data-placeholder-level)
  - Required prompt fields (ASPECT, PATTERN, SUBJECT, COMPOSITION, MOOD, PALETTE, STYLE-TAGS, FORBIDDEN, MEDIUM)
  - **4 standardized visual levels** (solid / hairline pattern / centered tag / full spec card)
- Specify which placeholder level is default for which pattern

**Critical insight**: Placeholders must be both visual (preserves layout) AND structured (contains AI prompts). The prompts must be **subsystem-aware** (palette pre-bound) so generated media stays on-brand.

**Deliverable**: Section §11 of the spec.

### Phase 6 · Anti-patterns (the dual layer)

**Goal**: Make the DNA robust against both ugliness and drift.

**Two distinct lists**:

**6.1 防丑反模式 (Anti-ugly)** — applies to all DNAs, similar across most projects:
- ≥ 3 weights in same hierarchy
- Title and body same weight
- ≥ 5 font sizes per screen
- Pure black on pure white
- Shadow blur > element width
- > 3 alignment columns

**6.2 防偏反模式 (Anti-drift)** — DNA-specific, hardest part to write well:
- What kills *this* DNA's identity?
- Each item should be a sentence: "{condition} → no longer {DNA name}"
- Aim for 8-12 items
- Examples from Aperture: "Bento corners ≥ 8px", "stage hero using forbidden weight", "two saturated colors outside Brand Spectrum rules"

**Conversation moves**:
- Force user to articulate "what makes this DNA *not* this DNA"
- Test each anti-drift item: would removing it still leave the DNA identifiable?
- Reject vague items ("looks too modern"); require operational items ("font weight 400 used in hero")

**Deliverable**: Section §6 of the spec.

### Phase 7 · Signature Library (the 80% → 90%+ jump)

**Goal**: Add the *deliberate breaks-from-norm* that elevate the DNA from "safe and acceptable" to "memorable and premium".

**Why this is the crucial phase**: Constraints alone produce ~80% quality (safe, no ugly). The jump to 90%+ requires **signatures** — explicit moves that violate everyday expectations in service of memorability.

**Signature characteristics**:
1. Constrained violation (breaks one minor rule, follows everything else)
2. Super-scale contrast (one element 2x larger or smaller than "reasonable")
3. Spatial intrusion (content reaches "where it shouldn't")
4. Unusual character handling (punctuation as subject, single glyph heroic)
5. Rhythm break (sudden silence in info density)

**Conversation moves**:
- Propose 5-10 signature candidates based on the DNA's identity
- For each: spec the implementation (sizes, positions, accents), the best moment to use, content requirements (signatures need content drama, not just form), forbidden cases, frequency caps
- Establish **meta-rules**:
  - Max 1 signature per page
  - Total signatures ≤ 30% of pages in a deck
  - Adjacent signatures cannot be same type
  - Must have content reason (not pure form)
  - Signatures are *invitations*, not requirements
- Distinguish **active signatures** (fully spec'd) vs **experimental** (placeholder for v0.4+ activation)

**For CJK-friendly DNAs**: include 2-3 signatures that *only work with CJK* (eg single glyph heroic, vertical tower, the punch with extreme size ratio between Latin and CJK). These are competitive moats — Latin-only design systems literally cannot replicate them.

**Deliverable**: Section §12 of the spec.

### Phase 8 · Playtest & Iteration

**Goal**: Use the DNA on real content, find blind spots, iterate.

**Conversation moves**:
- Pick a real or representative project (eg user's actual current product)
- Generate 4-6 sample artifacts using the v0.1 spec — covering all sub-systems and at least 2 signatures
- For each artifact, **explicitly check against §3.5 Pre-Check protocol** (see TEMPLATE_dna.md for the protocol)
- Run the **5-dimensional human review** (below) on each artifact
- Catalog blind spots in a numbered list
- Iterate to v0.2, v0.3 based on findings

**Common blind spots** (observed during Aperture playtest):
1. Layout safety rules exist but don't auto-trigger → need pre-check protocol making rules mandatory before generation
2. Font size compensation between scripts not specified → need explicit Latin/CJK same-line ratios
3. Cross-medium minimum font size differences not addressed (PPT projection vs web)
4. Placeholder visuals not standardized → different sessions produce different placeholders → need 4-level visual standardization
5. Pictogram counting toward image limit unclear → need separate pictogram count rule
6. **AI Slop layer missing** — even when style rules pass, AI fingerprints (Inter font, purple-pink-blue gradients, "Elevate/Seamless/Unleash" filler words) can still leak through. v0.4+ DNAs must include §6.3 Anti-AI-Slop layer.

#### 5-dimensional human review checklist

While the §8 Quick Checklist is machine-verifiable (yes/no per rule), this 5-dim review captures judgment calls that machines cannot. Score each artifact 0-10 per dimension; flag dimensions scoring < 7 for revision.

| Dimension | Question | Look for |
|---|---|---|
| **哲学一致性 Philosophical coherence** | Does this design have one clear core concept that all elements serve? | Single dominant idea visible in 3 seconds; nothing contradicting it |
| **视觉层级 Visual hierarchy** | Where does the eye go first? Second? Does information priority match visual priority? | First fixation = highest semantic priority; clear 2nd and 3rd order elements |
| **细节执行 Execution detail** | Are spacings mathematically precise? Fonts unmixed? Colors aligned with tokens? | No off-by-1px gaps; no rogue font weights; all colors traceable to tokens |
| **功能性 Functionality** | Are interaction states present (loading/empty/error)? Are click targets ≥ 44px? | Real states designed, not just happy path; touch targets meet floor |
| **创新性 Innovation** | Is there any decision here that another designer would NOT make? Or is it 100% expected? | At least one deliberate non-default choice (signature, ratio, or unexpected pairing) |

**Use**: After Pre-Check passes, run this 5-dim review. If 5 / 5 dimensions ≥ 8 — ship. If any < 7 — revise that dimension. If multiple < 7 — the artifact's foundation is wrong; reconsider sub-system or signature choice rather than patch surface.

**Critical insight**: Spec rules are not enough. v0.3 of any DNA must include a **mandatory Pre-Check protocol** (a 6-step routine the AI runs before generating). Without this, the rules sit in the spec but don't fire. v0.4 must additionally include §6.3 Anti-AI-Slop layer — the rules in §3-§4 prevent ugly and prevent drift, but they do not prevent generic-AI-fingerprint output.

**Deliverable**: v0.3 of the spec with all blind spots fixed and Pre-Check protocol added; v0.4 with AI-Slop layer.

---

## Workflow orchestration

When this skill is invoked, the standard flow is:

1. **Read the user's request carefully**. Identify which phase(s) apply (sometimes user already has Phase 1 done).

2. **Use `image_search` to gather visual references** for any brand mentioned. Do not skip this — text alone is insufficient for design judgment.

3. **Walk through phases sequentially**. Do not skip ahead. Each phase has decision points that affect later phases.

4. **Use `visualize:show_widget`** to render concrete examples at each phase. Spec text alone does not communicate design judgment. Render. Show. Iterate.

5. **Maintain conversational pacing**. Each turn should advance one phase or one decision within a phase. Do not dump the entire methodology in one response.

6. **At each phase boundary, summarize and confirm** before moving forward.

7. **When all phases complete**, generate the two output files using TEMPLATE_dna.md and TEMPLATE_tokens.json as scaffolds. Place them in the working directory.

8. **Mention versioning explicitly**. The first output is v0.1. Encourage the user to playtest and iterate to v0.3 before treating it as production-ready.

---

## Declare-Before-Build Micro-pattern (NEW v0.4)

**This pattern applies every time an artifact is generated using a DNA — both during Phase 8 playtest (in dna-forge) and during ongoing production use (after the DNA is shipped).**

Before writing any code or rendering any visual, the AI must **declare the design system in plain text** for that artifact and wait for user confirmation. This is a check-in pattern that prevents "build half-way then realize the wrong direction".

### Declaration template

When about to generate an artifact, output a declaration block first:

```
我准备生成的设计系统:

- 子调:default_deep + Solar Spectrum
- 模式:Stage moment(此页)
- 字体:Söhne(production) / system-ui(沙箱回退)
- 主 accent:#B2774A copper / oklch(0.59 0.115 51)
- 副 accent:无(未启用 spectrum 双 accent)
- Signature:#10 The Punch(因为内容是双语对照)
- 媒体:Pattern A 全屏 hero,使用 Level 3 占位符
- 字号比 hero:body = 7:1
- 排版规则:CJK 字距 -0.06em,行高 1.05,中英混排 size compensation 启用

确认这个方向我就开始生成。如有调整请告诉我。
```

### Why this works

- **暴露隐藏假设**:Claude 默认会做一堆假设(用什么字体、什么 accent、要不要 signature)。声明出来,用户看得到。
- **节省时间**:用户在 30 秒内可以喊停,不用等 5 分钟生成完才发现选错 spectrum。
- **强化 Pre-Check**:声明本身就是 §3.5 Step 1 的可见化。把"内部规划"变成"对话内容"。
- **降低修改成本**:修改一个声明文本 vs 修改一个已生成的 artifact,成本差 10 倍。

### When to skip

- 用户**明确说"直接做"**或"省略确认"
- 用户已经在最近 1-2 turn 内确认过设计系统(同一会话连续生成同类 artifact 时,只在第一次声明)
- 紧急修复 / 单一参数调整(eg "把这个改成 Light Paper") — 这种细粒度调整不需要全套声明

### When to absolutely not skip

- 第一次为某项目生成 artifact
- 切换 sub-system / spectrum / signature 时
- 跨语种(单语 → 双语)切换时
- 跨媒介(web → PPT → mobile)切换时

---

## Companion files

- **`TEMPLATE_dna.md`** — skeleton for the human-readable spec(v0.4 含 §4.4 字体黑白名单、§3.6 oklch 现代色彩、§6.3 AI Slop 层、§7.2 Slide vs Speaker Notes、§10.9 Modern CSS、§13 Variance Dial 全部 mandatory placeholders)
- **`TEMPLATE_tokens.json`** — skeleton for the machine-readable companion(v0.4 含 `font_selection` / `modern_css` / `ai_slop_anti_patterns` / `variance_dial` / `ppt_keynote.slide_vs_speaker_notes_rules` 全部 mandatory blocks)
- **`REFERENCE.md`** — 8 个精选风格参考(Pentagram / Müller-Brockmann / Fathom / Build / Kenya Hara / Experimental Jetset / Takram / Sagmeister & Walsh)+ 5 个融合范式(70/30, 60/30/10, 50/50, 90/10, 反模式)+ 7 个 signature 类别分类法 + 配色基础库 + 字体白名单扩展

When generating the final DNA, *always* read TEMPLATE_dna.md and TEMPLATE_tokens.json before writing. They contain the structural conventions (Pre-Check 7-step protocol, anti-pattern triple layer 6.1/6.2/6.3, signature meta-rules, font blacklist, oklch color expression, Variance Dial) that should be present in every DNA produced through this skill.

REFERENCE.md is for inspiration during **Phase 1**(identity & references — 用户参考不清晰时)和 **Phase 7**(signatures — 想加 experimental signature 时)。Read it when stuck or when user asks "what are some examples of..."。**不要照搬这 8 个风格** — 它们是参考点,不是模板。每个新 DNA 都应该有自己独特的融合和 signature tension。

---

## Output naming

The DNA name is chosen by the user in Phase 1. Files use a slugified lowercase name:

- `aperture.dna.md` / `aperture.tokens.json`
- `boreal.dna.md` / `boreal.tokens.json`
- `gangwon-editorial.dna.md` / `gangwon-editorial.tokens.json`

Avoid generic names ("modern", "minimal", "premium"). The DNA needs an identity, and identity starts with a name that means something.

---

## Versioning convention

Every DNA goes through at least 3 versions before production:

- **v0.1** — Initial draft from Phases 1-7
- **v0.2** — After first playtest (real content), expanded to cover blind spots
- **v0.3** — Mandatory addition of Pre-Check protocol, anti-pattern hardening, Layout Safety rules

Mark explicitly in the DNA file what each version added or fixed. Do not skip versions — the playtest reveals blind spots that pre-meditative spec writing cannot.

---

## Critical principles (the meta-philosophy)

1. **Commitment > correctness**. A DNA's value comes from *committing* to a specific identity, not from being technically optimal across all dimensions. AI design averaging is the enemy; commitment is the cure.

2. **Locked relatives > locked absolutes**. Hex values, exact font sizes — these are slots. Ratios (H1:body, whitespace ratios, weight pairs) are identity. Lock the relatives, leave the absolutes parametric.

3. **Sub-systems > single look**. A DNA must flex across contexts (light/dark, dense/sparse, B2B/consumer). Build it as a parametric system from day one.

4. **Constraints + invitations**. Constraints prevent ugly. Invitations (signatures) create memorable. Need both.

5. **Playtest reveals blind spots**. No DNA is complete at v0.1. The pre-check protocol, the size compensation rules, the placeholder standardization — these all came from Aperture's playtest, not from initial design. Plan for v0.2 and v0.3.

6. **CJK is first-class, not translation**. If the DNA serves CJK, do not "add CJK support later". Bake it into Phase 4 with separate weight pairs, letter-spacing, and signatures (vertical tower, the punch) that *only* CJK can do.

7. **Spec rules need triggers**. Rules in spec ≠ rules executed. Every DNA must include a Pre-Check protocol that makes the rules mandatory pre-generation steps, not optional reference material.

---

## Final output

After Phase 8, the skill produces:
- `<dna_name>.dna.md` (human spec, ~500-700 lines)
- `<dna_name>.tokens.json` (machine companion, ~400-600 lines)
- A short summary message to the user explaining: what's in v0.3, what was learned during playtest, and what signatures were activated vs left experimental.

Encourage the user to:
1. Use the DNA on a real next project to expose v0.4 blind spots
2. Share the file pair with team members or other AI agents
3. Iterate quarterly — DNAs evolve as projects expose new constraints

The DNA is alive. The skill helps create it. The user keeps growing it.
