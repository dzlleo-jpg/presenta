# {DNA_NAME}

> {DNA_NAME} 是一个 design DNA。**{X}% {REFERENCE_1} × {Y}% {REFERENCE_2}**[ + {OPTIONAL_LAYER}].
> Signature tension: **{SIGNATURE_TENSION}** — {ONE_SENTENCE_DESCRIPTION_OF_TENSION}.

`v0.1 · draft · 由 [user] × Claude 共创于 {PROJECT_CONTEXT} · {DATE}`

<!--
USAGE OF THIS TEMPLATE
======================
This is a skeleton. Replace all {PLACEHOLDERS} with actual content.
Delete sections that don't apply to your DNA (eg §10 if Latin-only).
Keep structure consistent with Aperture for downstream compatibility.

Conventions:
- §1-§4 are Identity + Architecture (always required)
- §5 Sub-systems (always required, but content varies)
- §6 Anti-patterns (always required, both layers)
- §7 Cross-medium (always required)
- §8 Quick Checklist (always required)
- §9 Sub-system Combinations (recipes for specific project types)
- §10 CJK & Mixed-script Typography (REQUIRED if any CJK content; SKIP if Latin-only)
- §11 Media Integration & Placeholders (always required)
- §12 Signature Library (REQUIRED in v0.3+, not v0.1)

For v0.1: §1-§7 are mandatory. §8-§12 can be sketched.
For v0.2: All sections present, playtest results integrated.
For v0.3: §3.5 Pre-Check protocol mandatory; §12 active signatures locked in.
-->

---

## 0. 这份文档的用法

本文件是 {DNA_NAME} DNA 的完整规格说明。配合 `{dna_name}.tokens.json` 使用。

- **给设计师 / 其他 AI 助手读**:第 1–{N} 节通读,获得风格的完整心智模型。
- **给 Claude Code 执行**:**生成任何 artifact 前必须先跑完 §3.5 Pre-Check 协议**。第 3、4、5、6、8、{etc} 节是约束 + 邀请系统。
- **判断"是否 {DNA_NAME}"**:第 8 节 checklist 全过 = 是 {DNA_NAME};任意一条不过 = "{DNA_NAME}-inspired" 但不算 {DNA_NAME}。

---

## 1. Identity 身份

**Spirit 精神**
{ONE_SENTENCE_SPIRIT — what this DNA stands for at the deepest level}

**Lineage 血统**
{REFERENCE_1} × {REFERENCE_2}[ × {REFERENCE_3}] — with explicit percentages

**When to use 适用场景**
- {SCENARIO_1}
- {SCENARIO_2}
- {SCENARIO_3}

**When to avoid**
- {ANTI_SCENARIO_1}
- {ANTI_SCENARIO_2}

**Signature Tension 核心张力**
**{TENSION_NOUN_A} × {TENSION_NOUN_B}** — {DESCRIPTION_OF_DIALECTICAL_OPPOSITION}

This is the *single most important idea in the DNA*. If readers cannot articulate this tension after reading the document, the DNA is too vague.

---

## 2. The {N} Modes / 核心模式

<!--
Most DNAs have 2-3 distinct visual modes that interact:
- Aperture: Stage moment + Info moment, with hard cut between
- A maximalist DNA might have: Density mode + Negative mode + Climax mode
- An editorial DNA might have: Cover mode + Article mode + Caption mode

Define each mode's identity, required elements, and composition rules.
-->

### 2.1 {MODE_1_NAME}

{MODE_1_DESCRIPTION}

**必有元素**: {ELEMENT_LIST}

**构图规则**
- {RULE_1}
- {RULE_2}
- ...

### 2.2 {MODE_2_NAME}

{MODE_2_DESCRIPTION}

**必有元素**: {ELEMENT_LIST}

**构图规则**
- {RULE_1}
- {RULE_2}
- ...

### 2.3 The {TRANSITION_NAME}

How the modes interact. Aperture uses Hard Cut. A different DNA might use Crossfade, Layered Stack, etc. Spell out:
- 过渡禁用: {LIST}
- 过渡允许: {LIST}
- 节奏建议: {RHYTHM_PATTERN}

---

## 3. Universal Floor 美的下限

**Applies to all sub-systems regardless of style.**

### 3.1 Universal Absolutes
<!-- Hard numbers that prevent ugly. Mostly stable across DNAs. Adjust if you have specific reasons. -->
- 最小字号 ≥ 11px (PPT 投影场景见 §7.2)
- 文字与背景对比度 ≥ 4.5:1 (WCAG AA)
- 最小可点区域 ≥ 24×24 pt
- 行长 ≤ 75 字符 (英文) / ≤ 25 字 (中文)

### 3.2 Universal Relatives
<!-- Ratios that prevent ugly. Adjust if your DNA has specific philosophy (eg Japanese-inspired DNAs need higher whitespace ratios). -->
- 行高 / 字号: Latin hero ≥ 0.9 / CJK hero ≥ 1.05
- body ≥ 1.5 (Latin) / ≥ 1.7 (CJK)
- 字号阶梯比 ≥ 1.25
- 视觉层级 ≥ 3 级

### 3.3 Universal Anti-patterns 防丑反模式
- 同一层级 ≥ 3 种字重 → 立刻丑
- 标题与正文同字重 → 层级塌陷
- ≥ 5 种字号同画面 → 视觉混乱
- 纯黑配纯白 (#000/#FFF) → 刺眼
- 阴影模糊 > 实体宽度 → 失重
- > 3 条主对齐线 → 网格凌乱

### 3.4 Layout Safety 排版安全

<!-- These rules are nearly identical across DNAs because they handle AI's blind spot
     (cannot visually verify overflow). Copy from Aperture and adjust thresholds if needed. -->

#### 3.4.1 字符宽度估算

| Script | font-size 14px | 84px hero | 140px big hero |
|---|---|---|---|
| Latin (geometric sans, -0.02em) | ~7px / char | ~38px / char | ~62px / char |
| CJK (方块字,-0.05em) | ~14px / char | ~80px / char | ~134px / char |
| 数字 / 标点 | ~5px / char @14 | ~26px / char @84 | ~44px / char @140 |
| Latin uppercase tracked 0.16em | ~9px / char @11 | — | — |

#### 3.4.2 文字放置前强制检查
1. 估算 `text_width = chars × char_width_at_size`
2. 验证 `text_width ≤ container_width - 2 × padding - 8px safety_margin`
3. 不通过 → 自动应对顺序: 缩字号 1 阶 → 断行 → 截短(ellipsis)
4. **绝不让文字超出 container**

#### 3.4.3-3.4.7
<!-- Copy from Aperture v0.3 §3.4.3-3.4.7. These cover hero safety, bento safety,
     section marker safety, vertical fit, forbidden auto-fail states. Adjust if your DNA
     has different structural elements. -->

### 3.5 Pre-generation Pre-Check 协议(必须有)

**这一节是任何 DNA 在 v0.3 必须包含的内容。** 没有它,spec rules 不会自动触发。

任何 {DNA_NAME} artifact 生成前,必须按顺序跑完:

#### Step 1 · 选定 sub-system + spectrum + signature
- 决定: {LIST_OF_SUB_SYSTEMS}
- 决定: 是否使用 {OPTIONAL_LAYER}(可选)
- 决定: 本页是否使用 §12 signature(默认不用;若用,选 1 个)

#### Step 2 · 计算可用文字带宽
- 取 container 宽 × 0.92(留 8% safety margin)
- 取 hero 字号
- 用 §3.4.1 表估算 hero 单行最大字符数
- **若 hero 内容字符数 > 此值 → 强制断行 / 缩字号一阶**

#### Step 3 · 逐元素垂直高度估算
按顺序累加: top padding + section marker 高度 + hero block + caption block + bottom margin + bottom padding
**总高度 ≤ container_height - 16px safety** → 通过;否则按 §3.4.6 顺序回退。

#### Step 4 · 反模式扫描
对照 §6.2 防偏 N 条,逐条 yes/no 标注。**任意一条 yes → 修改设计**。

#### Step 5 · CJK 内容专项扫描(若适用)
- 字距是否在 §10.3 CJK 范围
- 行高是否 ≥ 1.7
- 字重对是否在 §10.2 CJK 范围(避免 300/600)
- 中英混排是否有 0.125em breathing space
- **是否触发 §10.6 字号补偿规则**

#### Step 6 · 输出前 checklist
跑 §8 全部 checklist。任何一条不过 → 回到 Step 1 修改设计参数。

#### Step 7 · AI Slop 自检(v0.4 mandatory)
跑 §6.3.5 Anti-AI-Slop Checklist 8 项。任意一条 fail → 修改至全过。

**Pre-Check 不是建议,是硬性前置步骤。**

### 3.6 Color Expression Modernization(v0.4 mandatory · 现代色彩表达)

<!--
v0.4 mandatory section. Replace all hex with oklch as primary representation;
use color-mix() for interaction state derivation (no hardcoded hover hex).
-->

#### 3.6.1 颜色双表达原则
所有 token 同时提供:
- **hex**(给传统工具,fallback)
- **oklch**(给现代生成代码,primary)

#### 3.6.2 oklch 优势
传统 hex / rgb 在调亮度时**色相会漂移**(蓝色变浅 → 偏紫;橙色变深 → 偏红)。`oklch(L C H)` 在感知均匀色彩空间中表达,L 调整时 H 保持不变。

#### 3.6.3 用 color-mix 派生交互态
不要硬编码 hover / active / disabled,用 `color-mix()` 派生:

| 状态 | color-mix 比例 |
|---|---|
| `:hover`(深色子调) | accent 85% + black 15% |
| `:hover`(亮色子调) | accent 85% + white 15% |
| `:active` | accent 75% + black 25% |
| `:disabled` | accent 30% + bg_primary 70% |
| accent secondary(brand spectrum 副 accent)| 主 accent 70% + bg_primary 30% |

```css
.button:hover {
  background: color-mix(in oklch, var(--accent) 85%, black);
}
```

**禁止**:为每个交互态硬编码新 hex(eg `--accent-hover: #9F6841`)。

#### 3.6.4 浏览器支持
oklch:Chrome 111+, Safari 15.4+, Firefox 113+。color-mix:Chrome 111+, Safari 16.2+, Firefox 113+。不支持时 fallback 到 hex 即可。

---

## 4. Style DNA — Locked

**Change any of these and it's no longer {DNA_NAME}.**

### 4.1 Style Absolutes

| Property | Value | Rationale |
|---|---|---|
| {PROPERTY_1} | {VALUE} | {WHY_LOCKED} |
| {PROPERTY_2} | {VALUE} | {WHY_LOCKED} |
| ... | ... | ... |

### 4.2 Style Relatives <!-- THIS IS THE SOUL OF THE DNA -->

| Relation | Constraint |
|---|---|
| {RATIO_1} | {VALUE} |
| {RATIO_2} | {VALUE} |
| ... | ... |

<!-- Style Relatives are the most important part of the DNA. Change a hex value and the
     DNA still feels intact. Change a ratio (H1:body, whitespace, weight pair extreme)
     and it's a different DNA entirely. Spend more design time on this section than any other. -->

### 4.3 Never Allowed

- {BANNED_THING_1}
- {BANNED_THING_2}
- ...

### 4.4 Font Selection(v0.4 mandatory · 字体黑白名单)

<!--
v0.4 mandatory section. Every production-grade DNA must take a stance on fonts.
AI fingerprint fonts are the strongest "AI smell" indicator.
-->

#### 4.4.1 Latin 字体黑名单(production 禁用)

以下字体在 {DNA_NAME} 生产环境**禁止作为 primary 字族**(可作 fallback):

- Inter — AI 生成默认
- Roboto — Google 默认,过度泛滥
- Helvetica / Helvetica Neue — 滥用程度仅次 Inter
- Arial — 系统兜底,作品级永不主用
- Open Sans — 塑料感
- Fraunces — AI 滥用衬线
- Space Grotesk — 近期 AI 最爱

**沙箱降级**:沙箱 / 演示环境无法引入 web font 时允许 `system-ui` fallback,但需明确标注"production 替换为 {推荐字体}"。

#### 4.4.2 Latin 字体白名单(推荐 primary)

| Context | 推荐 |
|---|---|
| 默认 / 现代感 | {DEFAULT_FONT_RECOMMENDATION,如 Geist / Söhne} |
| 高端 / 奢侈 | {LUXURY_FONT,如 Cabinet Grotesk / Satoshi} |
| Editorial / 文学 | {EDITORIAL_SERIF,如 Lyon Text / Newsreader / Instrument Serif} |
| 数据 / 技术等宽 | {MONO_FONT,如 Geist Mono / JetBrains Mono} |

#### 4.4.3 CJK 字体白名单(若适用)

- PingFang SC(中文 macOS / iOS 默认)
- Source Han Sans CN / Noto Sans CJK SC
- Yu Gothic / Hiragino Kaku Gothic ProN(日文)

避免:Microsoft YaHei、SimSun / SimHei 系统默认。

---

## 5. Sub-systems — 参数化子调

Each sub-system is a *variant* of the DNA, not a separate DNA. They share Style DNA Locked rules but vary in tokens.

### 5.1 Default {NAME} (必备)
<!-- The baseline look. Most artifacts use this. -->

```json
{
  "bg_primary": "{HEX}",
  "bg_secondary": "{HEX}",
  "text_primary": "{HEX}",
  "text_secondary": "{HEX}",
  "accent": "{HEX}",
  "border": "{HEX}"
}
```

**用途**: {USE_CASES}

### 5.2 {VARIANT_2_NAME}

{MECHANISM — what changes vs default}

**用途**: {USE_CASES}

<!-- Add §5.3, §5.4, etc. for additional sub-systems.
     Common patterns:
     - Atmospheric swap (eg deep_petrol — replace pure black with jewel tone)
     - Value inversion (eg light_paper — full token set inverted)
     - Saturated canvas (eg color_block — single saturated color full bleed for chapters)
     - Extended palette (eg data_palette — additional 3-5 muted colors for charts)
     - Layered modifier (eg brand_spectrum — accent layer overlay by domain)
     - Complete subsystem (eg japanese_editorial — entire token replacement) -->

---

## 6. Anti-patterns

### 6.1 防丑反模式
即 §3.3,适用所有风格。

### 6.2 防偏反模式 (Anti-drift)

违反任意一条 → **不再是 {DNA_NAME}**:

1. {DRIFT_VIOLATION_1}
2. {DRIFT_VIOLATION_2}
3. {DRIFT_VIOLATION_3}
... (aim for 8-12 items)

<!-- Each drift violation must be operationally testable.
     ✓ "Stage hero using weight 400/500/700"
     ✓ "Two saturated colors outside Brand Spectrum rules"
     ✗ "Looks too commercial" (vague, untestable)
     ✗ "Lacks elegance" (subjective) -->

### 6.3 AI Slop Anti-patterns(v0.4 mandatory · 防 AI 味第三层反模式)

<!--
v0.4 mandatory section. §6.1 防丑 + §6.2 防偏 都过的设计,仍可能因落入 AI 默认套路而显得廉价。
此层捕获"AI 指纹" — 即使其他规则都对,违反这里 = 作品有 AI 味。
-->

#### 6.3.1 视觉陷阱

- 紫→粉→蓝全屏渐变(AI landing page 第一选择)
- 圆角卡片 + 左 border accent 色("AI 卡片签名" CSS)
- 纯黑 #000000 背景(过于极端,无层次)
- 霓虹 outer glow / 外发光
- AI Purple / Blue palette(Lila Ban)
- Emoji 装饰标题
- AI 手绘 SVG 插画
- 激进 Bento Grid(每个 landing page 都做)
- "Hero + 3列 Features + Testimonials + CTA" 模板
- Card 等大等样
- 居中 Hero
- 圆形 loading spinner

#### 6.3.2 字体陷阱

见 §4.4。**Inter / Roboto / Helvetica / Space Grotesk / Fraunces 在 production 环境出现 = AI 味自动 +50%**。

#### 6.3.3 文案陷阱

| 类型 | AI Slop 示例 | {DNA_NAME} 替代 |
|---|---|---|
| Data slop | "10,000+ happy customers" / "99.9% uptime" | 留 placeholder 等真数据,或具体场景数字 |
| Filler 动词 | "Elevate" / "Unleash" / "Transform" / "Revolutionize" | 具体动词:reduce / automate / verify / shorten |
| Filler 形容词 | "Seamless" / "Next-gen" / "Cutting-edge" | 描述具体属性 |
| Generic 名字 | "John Doe" / "Acme Corp" / "Lorem ipsum" | 真实感名字 + 真实场景,或 "[NAME PLACEHOLDER]" |
| 模糊承诺 | "Built for the future" / "Designed with you in mind" | 可验证陈述 |

**规则**:文案以**具体的名词、可验证的数字、真实的动词**为主。空洞营销词汇 ≥ 2 个 = §6.3 自动 fail。

#### 6.3.4 结构陷阱

- 3 列等宽 feature cards
- 每张幻灯片 / section 重复同一布局公式
- "Hero + Features + Pricing + Testimonials + Footer" 模板
- 占位文字仍写 "Lorem ipsum"

#### 6.3.5 Anti-AI-Slop 8 项 Checklist

- [ ] 主字体不在 §4.4 黑名单
- [ ] 无紫粉蓝渐变
- [ ] 无 emoji 装饰
- [ ] 无 ≥ 2 个 filler 词
- [ ] 数据真实或明确标注 placeholder
- [ ] 占位符按 §11.4 标准级别,不是 lorem ipsum
- [ ] 无居中 hero
- [ ] Card 不是等大等样

任意一条 fail → 修改后再 ship。

---

## 7. Cross-medium

### 7.1 Web (Desktop, ≥ 1280px)
{ADJUSTMENTS}

### 7.2 PPT / Keynote (16:9)
- **PPT 投影场景全局最小字号 ≥ 14px**
- {OTHER_ADJUSTMENTS}

#### 7.2.1 Slide vs Speaker Notes 内容分配(v0.4 mandatory)

PPT 不只是排版,也是**内容架构问题**。{DNA_NAME} 强制规定 slide 与 speaker notes 各承担:

**Slide 上只放**:
- 一个信息重心(数字 / 一句话 / 一张图)
- 必要图表 / 视觉
- Section marker / 页码

**Slide 上绝不放**:
- ≥ 4 行 bullet points(变成"PPT 朗读会")
- 详细解释、例子、引文(全部进 speaker notes)
- 完整段落

**Speaker notes 必须包含**:
- 3-5 个 talking points(不照念屏幕)
- Transition 衔接句
- Backup data(听众可能问到的支撑细节)
- Optional asides

#### 7.2.2 5-second test
设计完后用 5 秒扫一眼:≥ 5 秒理解不了主信息 → 太复杂;≤ 1 秒理解 → 太单薄;**2-4 秒理解 → 刚好**。

### 7.3 Mobile (≤ 480px)
{ADJUSTMENTS}

---

## 8. Quick Checklist

- [ ] **Pre-Check 6 步全部跑过**(§3.5)
- [ ] {DNA_SPECIFIC_CHECK_1}
- [ ] {DNA_SPECIFIC_CHECK_2}
- [ ] **Layout Safety: 无文字溢出/重叠/裁切**
- [ ] **PPT 场景所有小字 ≥ 14px**
- [ ] {CJK_CHECKS_IF_APPLICABLE}
- [ ] **如使用 Signature,符合 §12 元规则**

---

## 9. Sub-system Combinations / 子调组合范式

### 9.1 {PROJECT_TYPE_1}
- 主: {SUB_SYSTEM}
- 数据页: {SUB_SYSTEM}
- 章节页: {SUB_SYSTEM}
- 不用: {SUB_SYSTEM}

(repeat for 3-5 typical project types)

---

## 10. CJK & Mixed-script Typography

<!-- INCLUDE THIS SECTION IF the DNA serves any CJK content.
     SKIP if Latin-only.
     Copy this entire section verbatim from Aperture v0.3 §10 — these rules are
     largely DNA-agnostic and capture the universal CJK typography requirements. -->

### 10.1 字族 Font family
{COMPOUND_FONT_STACKS_FOR_CJK_PLUS_LATIN}

### 10.2 字重对调整
| Use case | Latin pair | CJK pair |
|---|---|---|
| Default | `[200/300, 500/600]` | `[100/200, 400/500]` |

### 10.3 字距 Letter-spacing
| Element | Latin | CJK |
|---|---|---|
| Hero | -0.02em | **-0.05em ~ -0.08em** |
| Caption | +0.16em | **+0.10em ~ +0.15em** |

### 10.4 行高 Line-height
| Element | Latin | CJK |
|---|---|---|
| Hero | 0.92 | **≥ 1.05** |
| Body | 1.55 | **≥ 1.7** |

### 10.5 标点 Punctuation
- 中文段落: 全角标点
- 日文段落: 全角 + 「」『』
- 中英 / 日英混排: CJK 全角 / Latin 半角,**不混用**
- 行首禁则: 。、,)」』】 ! ? : ;
- 行末禁则: ( 「 『 【

### 10.6 Mixed-script 字号补偿(必有)

中英混排同行同语义时:

| Use case | Latin 字号 vs CJK |
|---|---|
| Hero 同行 | Latin ≈ CJK × 0.85 ~ 0.92 |
| Body 同行 | Latin ≈ CJK × 0.92 ~ 0.95 |
| Caption 同行 | Latin ≈ CJK × 0.95 ~ 1.0 |

加上 0.125em breathing space + Latin 基线偏移 -1 ~ -2px。

### 10.7 横排与竖排
- 横排: default
- 竖排: 仅 Japanese Editorial Stage hero
- 竖排时数字/英文用 Tate-chu-yoko

### 10.8 CJK Anti-patterns
- 中文用了 Latin 字距数值
- CJK 用了 300/600 字重
- 中英混排无空气分隔
- 段落首字符是禁则字符
- 中文 body line-height < 1.7
- 中英混排同行未应用字号补偿规则

### 10.9 Modern CSS Layer(v0.4 mandatory · 现代浏览器排版升级)

<!--
v0.4 mandatory section. These CSS techniques must be globally applied — they prevent
typical AI-output failures (orphan last lines, sloppy CJK punctuation, jittery numbers).
-->

#### 10.9.1 Text wrapping — 消灭孤行寡词

```css
h1, h2, h3, .hero { text-wrap: balance; }
p, .body, .caption { text-wrap: pretty; }
```

#### 10.9.2 中文 / CJK 标点压缩与悬挂

```css
* { text-spacing-trim: space-all; }
p, .cjk-body { hanging-punctuation: first; }
```

#### 10.9.3 OpenType features

```css
body { font-feature-settings: "kern", "liga", "calt"; }
.tabular { font-variant-numeric: tabular-nums; }
.hero { font-feature-settings: "kern", "liga", "lnum"; }
```

**Data 强制**:Info moment 的 bento cell 数据展示和 chart **必须** `tabular-nums`,否则数字滚动 / 变化跳动。

#### 10.9.4 Mandatory CSS reset 摘要

```css
:root {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
* { text-spacing-trim: space-all; }
h1, h2, h3, .hero { text-wrap: balance; }
p, .body, .caption { text-wrap: pretty; }
p { hanging-punctuation: first; }
body { font-feature-settings: "kern", "liga", "calt"; }
.tabular { font-variant-numeric: tabular-nums; }
```

#### 10.9.5 浏览器降级
所有现代特性安全降级为默认行为,无需 polyfill。{DNA_NAME} 不为旧浏览器牺牲现代体验。

---

## 11. Media Integration & Placeholders

### 11.1 Image-text Composition Patterns

- **Pattern A: Full-bleed Hero Image** — overlay 0.20 opacity, text in lower 1/3
- **Pattern B: Image as Bento Cell** — corner radius ≤ 4, border 0.5px, brightness ≤ 70%
- **Pattern C: Side-by-side** — ratios 1:1.4 / 1:1.7 / 1:2, gap 8-16px
- **Pattern D: Pictogram** — 50-80px, fill only, single color
- **Pattern E: Ambient Video** — ≤ 8s, muted, ≤ 5% pixel change

### 11.2 Placeholder Format with AI Generation Prompts

When media is missing, every artifact MUST include a structured placeholder.

**HTML attributes required**: `data-aperture-media`, `data-aspect`, `data-pattern`, `data-subsystem`, `data-placeholder-level`

**Prompt fields required**: `ASPECT / PATTERN / SUBSYSTEM / SUBJECT / COMPOSITION / MOOD / PALETTE / STYLE-TAGS / FORBIDDEN / MEDIUM`

### 11.3 Placeholder Visual Standardization (4 levels)

| Level | Use | Spec |
|---|---|---|
| 1 Solid | Simple replacement | `bg_secondary` + 0.5px accent border |
| 2 Hairline Pattern | **Default** | 45° hairline pattern + 0.5px accent border |
| 3 Centered Tag | Standalone clarity | Level 2 + center tag box (3 lines: pattern · subject · aspect+prompt) |
| 4 Full Spec Card | User reviewing | Level 3 + expanded prompt visible |

### 11.4 Anti-patterns
- 图像与文字之间无 contrast layer
- 图像含与 {DNA_NAME} 不符的元素
- 图像超出 cell 边界
- 多于 3 个图像在同一 moment(pictogram 不计入)
- 图像比例不在允许范围
- placeholder 无 prompt 字段或不在标准 level

---

## 12. {DNA_NAME} Signature Library

<!-- THIS IS WHERE 80% BECOMES 90%+. SPEND TIME HERE. -->

### 12.1 元规则

1. 每页只能用 1 个 signature
2. 一份 deck 用 signature 总数 ≤ 30%
3. 相邻 signature 不能同型
4. Signature 必须有内容理由
5. Signatures 是邀请,不是要求
6. Signature 页可豁免某些 §4 约束,但不能违反 §3 universal floor 和 §3.5 pre-check

### 12.2 Active Signatures

#### Signature {N}: {NAME}

- **Spirit**: {ONE_SENTENCE}
- **Best moment**: {WHERE_IN_A_DECK_OR_SITE}
- **Implementation**:
  - {SIZE_RULES}
  - {POSITION_RULES}
  - {COLOR_RULES}
- **Content requirements**: {WHAT_KIND_OF_CONTENT_SUPPORTS_IT}
- **Forbidden**: {WHAT_BREAKS_IT}
- **Frequency**: {PER_DECK_LIMIT}
- **Mutual exclusion**: {WHICH_OTHER_SIGNATURES_CANNOT_BE_ADJACENT}
- **CJK advantage**: {LOW / MEDIUM / HIGH / EXTREMELY_HIGH}

(repeat for 3-7 signatures)

### 12.3 Experimental Signatures

Signatures considered but not yet locked. May activate in v0.4+ based on real project usage.

- **Sig X: {NAME}** — {ONE_LINE_SPIRIT}
- ...

### 12.4 Signature Selection Guide

| Project type | Recommended signatures |
|---|---|
| {PROJECT_TYPE} | {SIGNATURE_LIST} |

---

## 13. Variance Dial(v0.4 mandatory · 强度调节)

<!--
v0.4 mandatory section. Same DNA flexes from Editorial (1) to Audacious (3) via this dial.
Project-level decision, not per-page. Locks identity but adjusts boldness.
-->

### 13.1 三档强度

| 档位 | 名字 | 适用项目 | 留白比例 | Signature 频率 | Accent 大胆度 | 字号比 |
|---|---|---|---|---|---|---|
| **1** | **Editorial** | 年报、白皮书、政府报告、严肃 SaaS | ≥ 70% / ≥ 50% | ≤ 10% pages | 饱和度 ≤ 20% | hero {RANGE_FOR_DIAL_1} |
| **2** | **Default** | B2B 产品、内容型 PPT、品牌官网 | ≥ 60% / ≥ 40% | ≤ 30% pages | 饱和度 ≤ 30% | hero {RANGE_FOR_DIAL_2} |
| **3** | **Audacious** | 品牌 manifesto、艺术项目、概念发布 | ≥ 55% / ≥ 35% | ≤ 50% pages | 饱和度 ≤ 50% | hero {RANGE_FOR_DIAL_3} |

### 13.2 Dial 调节什么 / 不调节什么

**Dial 调节**(每档不同):Stage 留白下限、signature 频率、accent saturation、Color Block 在 deck 中允许的最大数量、Hero 字号比上限

**Dial 不调节**(三档相同):
- §3 Universal Floor
- §4 Style DNA Locked
- §6.3 AI Slop
- §4.4 字体黑白名单
- §10 CJK Typography
- Pre-Check 7 步

### 13.3 Aperture-mandated Dial × 项目映射

| 项目类型 | Dial |
|---|---|
| {PROJECT_TYPE_1} | {DIAL} |
| {PROJECT_TYPE_2} | {DIAL} |

### 13.4 Dial 一致性

**关键原则**:同一份 deck / 同一个网站,Dial 必须**全程一致**。Dial 是项目级决定,不是页面级决定。

例外:数据页可在 Audacious 整体下感觉安静(Info moment 自然如此),不算切换 Dial。

### 13.5 Pre-Check Step 1 整合

§3.5 Step 1 升级:在 Declare-Before-Build 时**首次为项目声明 Dial 档位**,后续 artifact 沿用。

---

## 14. Examples / 实例

链接到 `examples/` 目录的渲染样本。

---

## 15. Versioning

- **v0.1** — Initial draft (Phases 1-7 of dna-forge methodology)
- **v0.2** — After playtest, added: {WHAT_v0_2_ADDED}
- **v0.3** — Added Pre-Check protocol, Layout Safety hardening, Signature library activation
- **v0.4** — Added §4.4 font blacklist/whitelist, §6.3 AI Slop layer, §3.6 oklch + color-mix, §10.9 modern CSS, §7.2 slide vs speaker notes, §13 Variance Dial
- **v0.5+** — TBD based on production project feedback
