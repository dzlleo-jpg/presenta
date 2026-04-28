# Aperture

> A design DNA. **70% Polestar austerity × 30% Apple precision** + Japanese editorial layer + Signature library.
> Signature tension: **静默剧场 × 精密信息** — 模式之间硬切。

`v0.5 · draft · 由 [user] × Claude 共创于 SolarComply 设计探索 · 2026-04`

**v0.5 新增**(基于 v0.4 playtest 暴露的 4 个工程问题): 新增工程伴侣文件 `aperture-recipes.md`（实现层 how）· §3.2 垂直间距钩子 → Recipes R3 · §7.2 视口自适应钩子 → Recipes R1 · §11.1 五级 Overlay 钩子 → Recipes R2 · §0 文档用法更新
**v0.4 新增**(基于业内 design-skill 资料融合): §6.3 AI Slop Anti-patterns(防 AI 味第三层反模式)· §4.4 字体黑名单 + 推荐白名单 · §13 oklch / color-mix / text-wrap / hanging-punctuation 现代 CSS 升级 · §7.2 Slide vs Speaker Notes 分配规则 · §14 Variance Dial(强度调节)
**v0.3 新增/修复**: §3.5 Pre-generation Pre-Check 协议 · §10.6 Latin/CJK 字号补偿规则 · §7.2 PPT 投影最小字号 · §11.4 Placeholder 视觉标准化 · §11.5 Pictogram 数量计算修正 · §12 Signature Library(5 active + 5 experimental)

---

## 0. 这份文档的用法

本文件是 Aperture DNA 的完整规格说明（**what**）。配合以下文件使用：

- `aperture-recipes.md` — 工程实现手册（**how**），包含视口骨架、Overlay 系统、垂直间距、组件库、CSS Reset 的标准代码
- `aperture.tokens.json` — 机器可读 token 文件
- `examples/` — 实例

**读法**：
- **给设计师 / 其他 AI 助手读**:第 1–12 节通读,获得风格的完整心智模型。
- **给 Claude Code 执行**:**生成任何 artifact 前必须先跑完 §3.5 Pre-Check 协议**，然后参考 `aperture-recipes.md` 中对应的 Recipe 写代码。第 3、4、5、6、8、10、11、12 节是约束 + 邀请系统。
- **判断"是否 Aperture"**:第 8 节 checklist 全过 = 是 Aperture;任意一条不过 = "Aperture-inspired" 但不算 Aperture。

> **v0.5 规则**：DNA spec 中标注"详见 Recipes §RX"的地方，必须去 `aperture-recipes.md` 找实现代码。Recipes 不能违反 DNA spec 的任何约束，但可以比 DNA spec 更具体。

---

## 1. Identity 身份

**Spirit 精神**
该静的时候静到极致,该说的时候精密到位。

**Lineage 血统**
Polestar(Volvo 设计基因) × Apple(iPhone Air 等产品页) × Pentagram(色块章节传统) × NDC/Hara Kenya(Japanese editorial layer)

**When to use 适用场景**
- 高级感 B2B 产品(SaaS 仪表盘、合规工具、企业平台)
- 内容型 PPT / Keynote(品牌叙事 + 数据汇报混合)
- AI 产品的首页和发布材料
- 需要同时传递"premium"和"精密"双重信号的品牌
- **中文 / 日文为主的高级品牌项目**(配合 §5.8 + §10 + §12 Signature #2/#4/#10)

**When to avoid**
- 消费类大众产品(过冷)
- 面向儿童 / 教育(默认子调不友好)
- 低密度纯信息工具(没有内容支撑会显得空洞)

**Signature Tension 核心张力**
**静默剧场 × 精密信息** — 体验在两种模式之间剧烈切换。两种模式之间的过渡必须是硬切。

---

## 2. The Two Modes

### 2.1 Stage Moment

Polestar 式英雄区:画面上几乎只有一个主体,周围全是留白。情感温度冷而克制,但不是空,而是"屏息"。

**必有元素**:Section marker · Hero 主体 · Caption 锚点 · Bottom mark

**构图规则**
- Hero 占视觉中心或左下,**不能左右居中**
- Hero 字号 ≥ 84px(web)/ ≥ 96px(PPT)/ ≥ 64px(mobile)
- Hero 字重必须取自字重对的"轻"侧(Latin: 200/300;CJK: 100/200)
- Caption 字数 ≤ 28 词(英文)/ ≤ 14 字(中文)
- 整个画面 ≥ 60% 是留白(Japanese Editorial 子调 ≥ 70%)
- 一个 Stage 只允许 1 个 accent

### 2.2 Info Moment

Apple iPhone Air 式 Bento 构图:精确格子,密度突然飙升。

**构图规则**
- Bento gap 8px(±2)
- 列比例避免 1:1(用 1.4:1, 1.7:1, 2:1)
- Cell 圆角 ≤ 4px,边框 0.5px,padding ≥ 20px
- 数据/数字字重必须是 200 或 300(CJK 100 或 200)

### 2.3 The Hard Cut
- **过渡禁用**:渐变、淡入淡出、缩放、滑动、视差
- **过渡允许**:无过渡、瞬切、Section marker 切换
- **节奏建议**:`Stage → Info → Info → Stage → Info`(剧场频率约 1/3 – 1/4)

---

## 3. Universal Floor 美的下限

### 3.1 Universal Absolutes
- 最小字号 ≥ 11px(PPT 投影场景见 §7.2)
- 文字与背景对比度 ≥ 4.5:1(WCAG AA)
- 行长 ≤ 75 字符(英文)/ ≤ 25 字(中文)

### 3.2 Universal Relatives
- 行高 / 字号:Latin hero ≥ 0.9 / CJK hero ≥ 1.05
- body ≥ 1.5(Latin)/ ≥ 1.7(CJK)
- 字号阶梯比 ≥ 1.25
- 视觉层级 ≥ 3 级
- **垂直间距必须遵循 8pt grid**：分隔线下方 ≥ 32px，数据行间 ≥ 16px，页面四边 padding 完整（详见 Recipes §R3）
- **垂直间距强制最小值**（NEW v0.5）：标题/分隔线下方间距 ≥ 32px（1.667cqi），所有间距必须是 8 的倍数。**详见 Recipes §R3**

### 3.3 Universal Anti-patterns 防丑反模式
- 同一层级 ≥ 3 种字重 → 立刻丑
- 标题与正文同字重 → 层级塌陷
- ≥ 5 种字号同画面 → 视觉混乱
- 纯黑配纯白(#000/#FFF) → 刺眼
- 阴影模糊 > 实体宽度 → 失重
- > 3 条主对齐线 → 网格凌乱

### 3.4 Layout Safety 排版安全

#### 3.4.1 字符宽度估算

| Script | font-size 14px | 84px hero | 140px big hero |
|---|---|---|---|
| Latin(geometric sans, -0.02em) | ~7px / char | ~38px / char | ~62px / char |
| CJK(方块字,-0.05em) | ~14px / char | ~80px / char | ~134px / char |
| 数字 / 标点 | ~5px / char @14 | ~26px / char @84 | ~44px / char @140 |
| Latin uppercase tracked 0.16em | ~9px / char @11 | — | — |

#### 3.4.2 文字放置前强制检查
1. 估算 `text_width = chars × char_width_at_size`
2. 验证 `text_width ≤ container_width - 2 × padding - 8px safety_margin`
3. 不通过 → 自动应对顺序:
   - 缩字号 1 阶
   - 断行(2 行,每行独立验证)
   - 截短(ellipsis)
   - **绝不让文字超出 container**

#### 3.4.3 Hero 安全
- 单行:`hero_size × longest_line_chars ≤ container_width × 0.92`
- 双行:每行独立验证,行间垂直距离 ≥ hero_size × 0.92
- CJK hero:**首选断行而非缩字号**

#### 3.4.4 Bento Cell 安全
- `cell_width ≥ longest_label_width + 2 × padding`
- `cell_height ≥ stat + label + caption + paddings + gaps`
- Cell 内最大 stat:`min(cell_width × 0.85 / digit_count, cell_height × 0.5)`

#### 3.4.5 Section Marker 安全
`brand · hairline · meta` 三段式:
- hairline 最小可见长度 24px
- 总和超过 container(常见 mobile <420px):**降级为 `brand · meta`,16px gap**

#### 3.4.6 垂直 fit
放完所有元素后 sum 高度 + paddings + gaps,如超过容器:
1. 缩 hero 一阶
2. 缩 caption 至 12px floor
3. 缩 paddings 至原 75%
4. 截短文字内容(不裁切元素)

#### 3.4.7 Forbidden states 自动 fail
- 文字 bleed 出 container 边
- 文字元素重叠 > 2px
- hairline rule 塌陷 < 16px
- caption 字数超过 mode 上限
- cell 内容被 `overflow: hidden` 裁切

### 3.5 Pre-generation Pre-Check 协议(NEW v0.3 · 关键修复)

**问题来源**:v0.2 playtest 暴露,§3.4 公式写在 spec 里,但 Claude / Claude Code 生成时**没有自动触发**,仍靠手动平衡 → 仍然出现垂直挤压。

**v0.3 解法**:把 §3.4 从"参考规则"升级为**生成前的强制 6 步流程**。任何 Aperture artifact 生成前,必须按顺序跑完:

#### Step 1 · 选定 sub-system + spectrum + signature
- 决定:default_deep / deep_petrol / light_paper / japanese_editorial 之一
- 决定:brand_spectrum 谱系(可选)
- 决定:本页是否使用 §12 signature(默认不用;若用,选 1 个)

#### Step 2 · 计算可用文字带宽
- 取 container 宽 × 0.92(留 8% safety margin)
- 取 hero 字号(参考 §2.1)
- 用 §3.4.1 表估算 hero 单行最大字符数
- **若 hero 内容字符数 > 此值 → 强制断行 / 缩字号一阶**

#### Step 3 · 逐元素垂直高度估算
按顺序累加:
- top padding
- section marker 高度(11px line × 1.4 + 16px gap)
- hero block 高度(hero_size × line-height × line_count + 16px gap)
- caption block 高度
- bottom margin
- bottom padding

`总高度 ≤ container_height - 16px safety` → 通过;否则按 §3.4.6 顺序回退。

#### Step 4 · 反模式扫描
对照 §6.2 防偏 11 条,逐条 yes/no 标注。**任意一条 yes → 修改设计**。

#### Step 5 · CJK 内容专项扫描
若内容含 CJK:
- 字距是否在 §10.3 CJK 范围
- 行高是否 ≥ 1.7
- 字重对是否在 §10.2 CJK 范围(避免 300/600)
- 中英混排是否有 0.125em breathing space
- **是否触发 §10.6 字号补偿规则**(Latin 同字号需小 1-2px)

#### Step 6 · 输出前 checklist
跑 §8 全部 checklist。任何一条不过 → 回到 Step 1 修改设计参数。

#### Step 7 · AI Slop 自检(NEW v0.4)
跑 §6.3.5 Anti-AI-Slop Checklist 8 项。任意一条 fail → 修改至全过。

**Pre-Check 不是建议,是硬性前置步骤。** 跳过 = 不算 Aperture compliant。

### 3.6 Color Expression Modernization(NEW v0.4 · 现代色彩表达)

Aperture 颜色 spec 同时提供 hex 值(可读)和 **oklch 表达式**(技术正确),并使用 `color-mix()` 派生交互态颜色,避免硬编码的明暗变体。

#### 3.6.1 为什么用 oklch

传统 hex / rgb 在调亮度时**色相会漂移**(蓝色变浅 → 偏紫;橙色变深 → 偏红)。`oklch(L C H)` 在感知均匀色彩空间中表达,L 调整时 H 保持不变,色相稳定。

#### 3.6.2 Aperture 默认 token 的 oklch 表达

```css
:root {
  /* Default Deep subsystem */
  --bg-primary:    #0A0A0A;  /* oklch(0.13 0 0) */
  --bg-secondary:  #131313;  /* oklch(0.17 0 0) */
  --text-primary:  #FAFAFA;  /* oklch(0.98 0 0) */
  --text-secondary: #6E6F73; /* oklch(0.50 0.005 264) */
  --border:        #1F1F1F;  /* oklch(0.21 0 0) */

  /* Solar Spectrum primary accent */
  --accent:        #B2774A;  /* oklch(0.59 0.115 51) */
}
```

**两种表达并存的规则**:tokens.json 同时提供 `hex`(给传统工具)和 `oklch`(给现代生成代码)。Claude Code 生成 CSS 时**优先输出 oklch**,在 fallback chain 中提供 hex。

#### 3.6.3 用 color-mix 派生交互态

不要硬编码 hover / active / disabled 的颜色,用 `color-mix()` 派生:

```css
/* 推荐做法 */
.button {
  background: var(--accent);
}
.button:hover {
  /* accent 与黑色按 85:15 混合 → 加深 15% */
  background: color-mix(in oklch, var(--accent) 85%, black);
}
.button:active {
  background: color-mix(in oklch, var(--accent) 75%, black);
}
.button:disabled {
  /* accent 与背景按 30:70 混合 → 失活 */
  background: color-mix(in oklch, var(--accent) 30%, var(--bg-primary));
}
```

**禁止**:为每个交互态硬编码新 hex(eg `--accent-hover: #9F6841`)。这是 v0.4 的硬规则。

#### 3.6.4 Aperture-mandated 派生比例

| 状态 | color-mix 比例 |
|---|---|
| `:hover` | accent 85% + black 15%(deep_*)/ accent 85% + white 15%(light_paper) |
| `:active` | accent 75% + black 25% |
| `:disabled` | accent 30% + bg_primary 70% |
| accent secondary(brand spectrum 副 accent)| 主 accent 70% + bg_primary 30% |

#### 3.6.5 浏览器支持

`oklch()`:Chrome 111+, Safari 15.4+, Firefox 113+(已普及)。`color-mix()`:Chrome 111+, Safari 16.2+, Firefox 113+。
不支持时 fallback 到 hex 即可,Aperture 接受这一降级。

---

## 4. Style DNA — Locked

**Change any of these and it's no longer Aperture.**

### 4.1 Style Absolutes

| Property | Latin | CJK |
|---|---|---|
| Font family count | 1 | 1 (CJK + Latin pair) |
| Font weight pair | `[200/300, 500/600]` | `[100/200, 400/500]` |
| Font weight forbidden | 400, 700, 800 | 300, 600, 700 |
| Hero letter-spacing | ≤ -0.02em | -0.05em ~ -0.08em |
| Caption letter-spacing | ≥ +0.16em | +0.10em ~ +0.15em |
| Stage corner-radius | 0px | 0px |
| Info corner-radius | ≤ 4px | ≤ 4px |
| Border-width | 0.5px only | 0.5px only |
| Caption case | UPPERCASE + tracking | 全角 / 半角混合,小尺寸 |

### 4.2 Style Relatives

| Relation | Constraint |
|---|---|
| H1 : body 字号比(Stage) | ≥ 5.0 |
| H1 : body 字号比(Info 大数字) | ≥ 3.5 |
| Hero 区留白占比(Stage default) | ≥ 60% |
| Hero 区留白占比(Japanese Editorial) | ≥ 70% |
| Bento gap | 8px ± 2 |
| Section marker 位置 | 第一屏顶部,`brand · hairline · meta` |
| Accent 数量 | 默认 1 / Brand Spectrum 1主+1副 / Signature 页可豁免 |

### 4.3 Never Allowed

- 阴影(box-shadow,除 focus ring 外)
- 渐变(除 Photographic Atmosphere 与 image overlay 外)
- 装饰性边框、圆形装饰
- Emoji 作为视觉元素
- 插画 / 卡通(NDC pictogram 在 Japanese Editorial 中除外)
- icon stroke-width ≥ 1.5px
- 多于 1 主 + 1 副 accent(Signature 页可豁免)

### 4.4 Font Selection(NEW v0.4 · 字体黑/白名单)

**Aperture 对字体选择有严格立场。** 字体是 AI slop 最强的"指纹" — 用错字体,即使其他规则全对,作品也会立即暴露 AI 出身。

#### 4.4.1 Latin 字体黑名单(production 禁用)

以下字体在 Aperture 生产环境**禁止作为 primary 字族**(可作 fallback):

- **Inter** — AI 生成网页的默认字体,看见即 AI 味
- **Roboto** — Google 默认,极度泛滥
- **Helvetica / Helvetica Neue** — 滥用程度仅次于 Inter
- **Arial** — 系统兜底字体,作品级永不主用
- **Open Sans** — Google Fonts 早期默认,塑料感
- **Fraunces** — AI 发现后用滥的"高级"衬线
- **Space Grotesk** — 近期 AI 最爱,过度曝光

**沙箱降级允许**:Claude 沙箱 / 演示 widget / artifact 预览环境因无法引入 web font,允许使用 `system-ui, -apple-system, BlinkMacSystemFont` 作为占位 fallback,但 spec 注释或代码 header 中**必须明确标注"production 替换为 {推荐字体}"**。

#### 4.4.2 Latin 字体白名单(推荐 primary)

按场景分类的推荐:

| Context | 推荐字体 | 为什么 |
|---|---|---|
| 默认 / 现代感 | **Geist** / **Geist Mono** | Vercel 出品,几何感克制,AI 味为零 |
| 时尚 / 编辑感 | **Söhne** / **GT America** | 商业字体,Polestar / Apple 同源审美 |
| 高端 / 奢侈 | **Cabinet Grotesk** / **Satoshi** | Premium 感强,免费可用 |
| Editorial / 文学 | **Lyon Text** / **Newsreader** / **Instrument Serif** | 衬线带 editorial 气质,Aperture 仅在 Japanese Editorial 子调允许 |
| 数据 / 技术 | **Geist Mono** / **JetBrains Mono** | 等宽字必须用,数字一律 monospace |

**规则**:Aperture 默认 / Deep Petrol / Light Paper 子调用 Geist / Söhne / Cabinet Grotesk 任一;Color Block 子调可同上;Japanese Editorial 子调用 Yu Gothic / Hiragino,必要时 Latin 部分配 GT America。

#### 4.4.3 CJK 字体白名单

Aperture CJK 字体选择本身就比 Latin 安全(可选项有限,AI 味问题小),但仍需注意:

- **PingFang SC**(中文默认 macOS / iOS)
- **Source Han Sans CN / Noto Sans CJK SC**(开源跨平台)
- **思源黑体**(Source Han Sans 的中文名)
- **Yu Gothic / Hiragino Kaku Gothic ProN**(日文)

避免:微软雅黑(老旧,Windows 默认味)、宋体 / 黑体 系统默认(无设计感)。

---

## 5. Sub-systems(略 — 见 v0.2,本节 v0.3 无修改)

子调清单不变:default_deep / deep_petrol / light_paper / color_block / data_palette / photographic_atmosphere / brand_spectrum / japanese_editorial。详见 aperture.tokens.json 里的 `subsystems` 字段。

---

## 6. Anti-patterns

### 6.1 防丑反模式
即 §3.3。

### 6.2 防偏反模式

违反任意一条 → **不再是 Aperture**:

1. 同画面 ≥ 2 个饱和度 ≥ 30% 的颜色(Brand Spectrum 1主+1副情况除外)
2. Bento 圆角 ≥ 8px
3. Stage hero 用了禁用字重(Latin 400/500/700, CJK 300/600/700)
4. 出现插画 / 装饰 icon / 卡通(NDC pictogram 在 Japanese Editorial 中除外)
5. accent 用作填充色块
6. caption 区用了 sentence case(CJK 不适用此条)
7. 模式之间出现渐变 / 淡入淡出
8. Section marker 缺失
9. **文字溢出 / 重叠**(§3.4 自动 fail)
10. **图像超出 cell 边界**(§11)
11. **CJK 内容用了 Latin 字距规则**(§10)

### 6.3 AI Slop Anti-patterns(NEW v0.4 · 防 AI 味第三层反模式)

**这一层与 §6.1 防丑、§6.2 防偏不同**。§6.1 防止"看着难看",§6.2 防止"风格走偏",§6.3 防止"AI 味浓"。即使前两层都过,作品仍可能因落入 AI 默认套路而显得廉价、generic、"机器生成感强"。

#### 6.3.1 视觉陷阱(Visual AI Slop)

违反任意一条 → 即使其他规则都过,作品仍带 AI 味:

1. **紫→粉→蓝全屏渐变** — AI landing page 第一选择。Aperture 用单色或克制 accent 替代
2. **圆角卡片 + 左 border accent 色** — AI 卡片"签名式"CSS。Aperture 用背景色对比 / 字重对比 / 0.5px hairline 替代
3. **纯黑 #000000 背景** — 过于极端,无层次。Aperture 用 #0A0A0A(本就如此)
4. **霓虹 outer glow / 外发光** — 廉价"科技感"。Aperture 永远不用,改用内边框或 tinted 阴影
5. **AI Purple / Blue 调色盘**(即 "Lila Ban" 紫蓝渐变按钮)— Aperture 的 Brand Spectrum 已经避免,但需明确禁止
6. **Emoji 装饰标题**(🚀✨✅🎯)— 直接暴露 AI。Aperture §4.3 已禁,§6.3 重申
7. **AI 手绘风 SVG 插画 / 廉价场景图** — Aperture 改用占位符 + AI prompt(§11),不允许 inline AI 插画
8. **激进 Bento Grid(每个 landing page 都做)** — Aperture 仅在 Info moment 用 bento,且严格 §2.2 规则
9. **大 Hero + 3列 Features + Testimonials + CTA 模板** — 该结构被 AI 用烂。Aperture 用 stage/info hard cut 节奏替代
10. **Card 等大等样的机械感** — Aperture 的 bento 强制 1.4:1 / 1.7:1 / 2:1 不对称,本就避免
11. **居中 Hero H1 大标题** — AI 最爱的对称偏差。Aperture §2.1 已强制不允许居中
12. **圆形加载 spinner** — 改用 skeleton loader 匹配布局尺寸

#### 6.3.2 字体陷阱(Typography AI Slop)

见 §4.4 字体黑名单。**重点**:Inter / Roboto / Helvetica / Space Grotesk / Fraunces 在 production 环境出现 = AI 味自动 +50%。Aperture 不允许它们作为 primary 字族。

#### 6.3.3 文案陷阱(Content AI Slop)

Aperture 不仅约束视觉,**也约束文案**(因为视觉与文案共同构成"高级感"):

| Pattern | AI Slop 示例 | Aperture 替代 |
|---|---|---|
| Data slop | "10,000+ happy customers" / "99.9% uptime" / "Trusted by Fortune 500" | 留 placeholder 等真数据,或具体场景:"127 instalaciones revisadas en Q2" |
| Filler 动词 | "Elevate" / "Unleash" / "Transform" / "Revolutionize" | 具体动作:"reduce" / "automate" / "verify" / "shorten" |
| Filler 形容词 | "Seamless" / "Next-gen" / "Cutting-edge" / "World-class" | 描述具体属性:"8-minute" / "RD 244/2019-compliant" / "asymmetric" |
| Generic 名字 | "John Doe" / "Acme Corp" / "Lorem ipsum" | 真实感名字 + 真实场景,或明确标注 "[NAME PLACEHOLDER]" |
| 模糊承诺 | "Built for the future" / "Designed with you in mind" | 可验证陈述:"Reviews 127 项目 / 季度,平均 8 分钟" |

**规则**:Aperture 文案以**具体的名词、可验证的数字、真实的动词**为主。空洞营销词汇出现 ≥ 2 个 = §6.3 自动 fail。

#### 6.3.4 结构陷阱(Layout AI Slop)

1. **3 列等宽 feature cards** — Aperture 强制不对称比例
2. **每张幻灯片 / section 重复同一布局公式** — Aperture 用 stage / info / color block 三种模式硬切打破
3. **"Hero + Features + Pricing + Testimonials + Footer" 模板** — Aperture 不预设这种页面顺序;由内容驱动节奏
4. **占位文字仍写 "Lorem ipsum"** — Aperture 占位符必须按 §11.4 standardized levels,不允许 lorem 出现

#### 6.3.5 Anti-AI-Slop Checklist(快速自检)

生成 artifact 前最后一步:

- [ ] 主字体不在 §4.4 黑名单中?
- [ ] 没有出现紫粉蓝渐变?
- [ ] 没有 emoji 装饰?
- [ ] 没有"Elevate / Seamless / Unleash"类填充词?
- [ ] 数据是真实的或明确标注 placeholder?
- [ ] 占位符按 §11.4 标准级别,不是 lorem ipsum?
- [ ] 没有居中 hero?
- [ ] Card 不是等大等样?

任意一条 fail → 修改后再 ship。

---

## 7. Cross-medium

### 7.1 Web (Desktop, ≥ 1280px)
默认参数全部生效。Stage hero 字号 84-96px。

### 7.2 PPT / Keynote (16:9)

**v0.5 新增 · Slide Deck 视口自适应**：
- **禁止使用 JS fitStage + 固定 px 尺寸**。Slide deck 必须使用 CSS `aspect-ratio` + `container-type: inline-size` + `cqi` 单位实现视口自适应（详见 Recipes §R1）
- **禁止使用 `translateY(-n * 1080px)` 手动翻页**。改用 `scroll-snap-type: y mandatory`（详见 Recipes §R1.4）
- 所有内部尺寸用 `cqi`（container query inline-size 的 1%），不用固定 px（详见 Recipes §R1.5）

**v0.3 修复**:
- **PPT 投影场景全局最小字号 ≥ 14px**(覆盖 §3.1 的 11px 全局值)
- caption / label / legend 类小字号必须 ≥ 14px
- Stage hero 字号 96-140px
- 章节页强制 Color Block
- 数据页强制 Data Palette
- Stage 与 Info 之间留一张过渡页

**v0.4 新增 · Slide vs Speaker Notes 内容分配**

PPT 不只是排版,也是**内容架构问题**。Aperture 强制规定 slide 与 speaker notes 各承担什么:

#### 7.2.1 Slide 上**只放**

- **一个**信息重心(可能是一个数字、一句话、一张图)
- 必要的图表(数据页除外,数据页本身就是重心)
- Section marker / 页码

#### 7.2.2 Slide 上**绝不放**

- 多于 4 行 bullet points → 会变成"PPT 朗读会",观众读屏不听讲
- 详细解释、例子、引文 → 全部进 speaker notes
- 完整段落 → 段落是给 reader 不是给 viewer 的

#### 7.2.3 Speaker Notes 必须包含

每张幻灯片都必须配 speaker notes,内容包括:
- **Talking points**:这张幻灯片要讲的 3-5 个要点(不要照念屏幕字)
- **Transition**:这张到下一张的衔接句
- **Backup data**:听众可能问到的支撑细节(数字来源、参考链接、反例)
- **Optional asides**:相关故事、行业背景

#### 7.2.4 Aperture-mandated PPT 文件结构

生成 PPT 时(无论 .pptx 还是 keynote-style web slides),每页必须包含两层:

```
slide_visible_layer:
  hero: <one big idea>
  caption: <≤ 14 字 / 28 词 caption>
  visual: <chart or image or single glyph>
  section_marker: <brand · hairline · meta>

speaker_notes:
  talking_points: [<3-5 个要点>]
  transition: <这页到下页的桥>
  backup: [<数据/引文/反例>]
```

#### 7.2.5 检验:5-second test

Aperture PPT 设计完后,**用 5 秒钟扫一眼**:
- ≥ 5 秒理解不了主信息 → 太复杂,精简到一个 hero
- ≤ 1 秒理解(瞬间懂)→ 太单薄,加 caption / 数据
- 2-4 秒理解 → 刚好

### 7.3 Mobile (≤ 480px)
- H1:body 比降到 3.5:1
- Bento 改单列 stack
- 留白比例下限改 40%
- 字号最小值改 12px
- Section marker 退化为 `brand · meta`

---

## 8. Quick Checklist

- [ ] **Pre-Check 7 步全部跑过**(§3.5,v0.4 加 AI Slop 自检)
- [ ] Section marker 在场(三段式或降级两段式)
- [ ] 字重对只有两组(对应当前语言)
- [ ] H1:body 比例满足下限
- [ ] Accent 数量满足规则(默认 1 / Spectrum 1+1 / Signature 页可豁免)
- [ ] caption 类文字符合当前语言规则
- [ ] Stage 圆角 0px / Info 圆角 ≤ 4px
- [ ] 没有 shadow / gradient(除允许子调外)
- [ ] 模式之间 hard cut
- [ ] 留白比例满足该 moment 类型下限
- [ ] **Layout Safety:无文字溢出/重叠/裁切**
- [ ] **图像在合规 pattern 内,且与文字 contrast 足够**
- [ ] **CJK 内容应用 §10 typography 规则,含 §10.6 字号补偿**
- [ ] **PPT 场景所有小字 ≥ 14px**
- [ ] 反偏 11 条全过
- [ ] **如使用 Signature,符合 §12 元规则**(每页 ≤ 1 个,内容必须有戏)
- [ ] **§4.4 字体不在黑名单**(production 不用 Inter/Roboto/Helvetica/Space Grotesk/Fraunces) NEW v0.4
- [ ] **§6.3.5 Anti-AI-Slop 8 项全过** NEW v0.4

---

## 9. 子调组合范式(略 — 见 v0.2)

---

## 10. CJK & Mixed-script Typography

### 10.1 字族 — 略,见 v0.2

### 10.2 字重对 — 略,见 v0.2

### 10.3 字距

| Element | Latin | CJK |
|---|---|---|
| Hero | -0.02em | **-0.05em ~ -0.08em** |
| Body | 0 | 0 |
| Caption | +0.16em | **+0.10em ~ +0.15em** |
| 数字标签 | +0.04em | +0.04em |

### 10.4 行高

| Element | Latin | CJK |
|---|---|---|
| Hero | 0.92 | **≥ 1.05** |
| Body | 1.55 | **≥ 1.7** |
| Caption | 1.5 | **≥ 1.6** |

### 10.5 标点 — 略,见 v0.2

### 10.6 Mixed-script 字号补偿(NEW v0.3 · 关键修复)

**问题**:v0.2 §10.6 写了"基线偏移 -1px",但只针对纵向位置,**没写字号补偿规则** → P2 中西文 sub-line 同字号 13px,Latin 视觉重于 CJK,失衡。

**v0.3 修复**:

Latin 因有 ascender / descender(b, d, p, g 等),即使同字号也比 CJK 视觉重 8-12%。中英混排同行同语义时:

| Use case | 视觉等重的字号关系 |
|---|---|
| Hero 同行(eg "合规 Compliance") | Latin 字号 ≈ CJK × 0.85 ~ 0.92 |
| Body 同行 | Latin 字号 ≈ CJK × 0.92 ~ 0.95 |
| Caption 同行 | Latin 字号 ≈ CJK × 0.95 ~ 1.0(差异不明显) |

**示例计算**:CJK hero 是 84px → Latin 同行同等重的字号应在 71-77px(可写 72px)。

**追加规则**:
- 中英混排同行的 Latin 部分 baseline 偏移 -1 ~ -2px(向下,轻微"沉")
- 0.125em breathing space 仍保留(本规则不替代 §10.6 v0.2 老规则,而是叠加)
- **若 Hero 是设计意图为"Latin mass + CJK minim"(Signature #10),本规则不适用** — Signature 故意打破等重

### 10.7 横排与竖排
- **横排**:default 模式
- **竖排**:仅 Japanese Editorial Stage 允许,且仅 hero
- **竖排时**:数字、英文、缩写需 Tate-chu-yoko
- 实现:`writing-mode: vertical-rl; text-orientation: mixed`
- 也用于 Signature #4 Vertical Tower,但**实现不同**(见 §12)

### 10.8 CJK Anti-patterns(防偏)
- 中文用了 Latin letter-spacing 数值
- CJK 用了 300/600 字重
- 中英混排无空气分隔
- 段落首字符是禁则字符
- 中文 body line-height < 1.7
- **中英混排同行未应用字号补偿规则**(NEW v0.3)

### 10.9 Modern CSS Layer(NEW v0.4 · 现代浏览器排版升级)

Aperture spec 不止规定"做什么 / 不做什么",也规定**用什么现代 CSS 工具实现**。以下规则在所有支持的浏览器(Chrome 114+, Safari 17.4+, Firefox 121+)上必须默认启用:

#### 10.9.1 Text wrapping — 消灭孤行寡词

```css
/* 标题级:平衡换行,避免末行孤词 */
h1, h2, h3, .hero, [class*="hero"] {
  text-wrap: balance;
}

/* 正文级:避免孤行寡字,但保留性能 */
p, .body, .caption {
  text-wrap: pretty;
}
```

`text-wrap: balance` 用于 hero / 标题 — 浏览器会自动平衡多行字数,避免第二行只剩 1-2 字符。
`text-wrap: pretty` 用于 body / caption — 性能略好,避免典型"段落最后一行只剩一个字"的视觉伤害。

**这是 Aperture 中最容易被忽视的"高级感"细节**。两行规则,直接消除典型 AI 生成排版的尴尬末行。

#### 10.9.2 中文 / CJK 标点压缩与悬挂

```css
/* 全局:CJK 标点自动压缩(全角标点之间和与字符之间)*/
* {
  text-spacing-trim: space-all;
}

/* 中文段落:首字符标点悬挂(让段落首字符的引号/括号挂出主文本边界)*/
p, .cjk-body {
  hanging-punctuation: first;
}
```

`text-spacing-trim` 让 CJK 全角标点的两侧空格自动收紧,避免"。"、"」"周围的视觉空洞。
`hanging-punctuation: first` 让段落开头的「、"、(等悬挂在段落主体之外,获得更整齐的对齐边缘 — 典型 editorial 高级排版做法。

#### 10.9.3 Latin 字距精细化

```css
/* OpenType features:启用上下文连字 + 标准连字,关闭花式 */
body, .text, .caption {
  font-feature-settings: "kern", "liga", "calt";
  font-variant-numeric: tabular-nums; /* 数字等宽,数据页必备 */
}

/* Hero 文字:lining figures + 老式数字按需切换 */
.hero {
  font-feature-settings: "kern", "liga", "lnum";
}
```

`tabular-nums` 让所有数字宽度一致 — 在 Info moment 的 bento cell 数据展示和 chart 中**强制要求**,否则数字滚动 / 变化时跳动。

#### 10.9.4 Aperture-mandated CSS reset 摘要

任何 Aperture 项目的全局 CSS 必须包含:

```css
/* Aperture v0.4 mandatory reset */
:root {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* { text-spacing-trim: space-all; }

h1, h2, h3, .hero { text-wrap: balance; }
p, .body, .caption { text-wrap: pretty; }
p { hanging-punctuation: first; }

body { font-feature-settings: "kern", "liga", "calt"; }
.tabular { font-variant-numeric: tabular-nums; }
```

#### 10.9.5 浏览器降级

`text-wrap: balance/pretty`、`text-spacing-trim`、`hanging-punctuation` 在不支持的旧浏览器上**安全降级为默认行为**,无需 polyfill。Aperture 不为旧浏览器牺牲现代体验。

---

## 11. Media Integration & Placeholders

### 11.1 Image-text Composition Patterns

5 种 Aperture 允许的图文组合,每种都有几何规则:

- **Pattern A: Full-bleed Hero Image** — 图像填满 stage,文字 overlay 在下 1/3。**v0.5 起，单一 flat overlay（opacity 0.20）已废弃，改用五级 Overlay 系统，根据图像亮度和文字位置选择合适级别（详见 Recipes §R2）**
- **Pattern B: Image as Bento Cell** — 图像作为 cell,与数据 cell 等地位
- **Pattern C: Side-by-side** — 图文 1:1.4 / 1:1.7 / 1:2 不对称栅格
- **Pattern D: Pictogram(NDC tradition)** — 50-80px 几何 / 仅 fill 不 stroke / 单色
- **Pattern E: Ambient Video Loop** — Stage moment 限定,≤8s,muted,subtle motion

**v0.5 新增 · 五级 Overlay 系统**：v0.4 的单一 flat overlay（opacity 0.20）已废弃。图片上文字必须使用五级 Overlay 系统，根据图像亮度和文字位置选择合适级别（Level 1 Flat → Level 5 Blur+Overlay）。所有级别通用 text-shadow 辅助。**详见 Recipes §R2**

(详细约束见 aperture.tokens.json `media_patterns`)

### 11.2 Placeholder Format with AI Generation Prompts

当用户缺素材,生成的 artifact 必须包含结构化 placeholder。
必填字段:`ASPECT / PATTERN / SUBSYSTEM / SUBJECT / COMPOSITION / MOOD / PALETTE / STYLE-TAGS / FORBIDDEN / MEDIUM`。

(完整 schema 见 aperture.tokens.json `media_patterns.placeholder_schema`)

### 11.3 Image-text Anti-patterns
- 图像与文字之间无 contrast layer 致文字不可读
- 图像含与 Aperture 不符的元素(emoji、卡通、过饱和色)
- 图像超出 cell 边界
- **多于 3 个图像在同一 Info moment**(变 gallery,失精密感)— pictogram 不计入此数,见 §11.5
- 图像比例不在允许范围(eg 7:3, 5:4)
- placeholder 无 prompt 字段

### 11.4 Placeholder 视觉标准化(NEW v0.3 · 关键修复)

**问题**:v0.2 §11.2 schema 完整,但**视觉本身没标准化** → 不同 Claude session 会画出不同样子的 placeholder。

**v0.3 修复**:placeholder 视觉必须遵守以下 5 条强制规则:

#### 4 个标准视觉等级

| Level | 用途 | 视觉样式 |
|---|---|---|
| **Level 1: Solid** | 简单替代,无内容线索 | 纯 `bg_secondary` 色块 + 0.5px accent border |
| **Level 2: Hairline Pattern** | 标准等级,**默认使用** | 45° 斜纹(`bg_primary` + `bg_secondary` 1:11 间距)+ 0.5px accent border |
| **Level 3: Centered Tag** | 详情清晰,可独立看懂 | Level 2 + 中心标签盒(`bg_secondary` + 0.5px accent border + 3 行 spec 文字) |
| **Level 4: Full Spec Card** | 用户审稿用 | Level 3 + 折叠 `<details>` 含完整 prompt |

#### 标签盒内容固定结构

```
▣ {Pattern_name} · {Subsystem_name}
{Subject 一句话}
{Aspect_ratio} · See <details> for prompt
```

#### Border 颜色规则
- 永远 `accent` 色 0.5px
- 不允许其他颜色 / 粗细 / 样式

#### 必带 data-attributes
HTML 节点必须挂:
```
data-aperture-media="image|video|pictogram"
data-aspect="{ratio}"
data-pattern="{A|B|C|D|E}"
data-subsystem="{name}"
data-placeholder-level="{1|2|3|4}"
```

#### 默认 level 选择
- Stage moment 的 Pattern A/E → Level 3
- Info moment 的 Pattern B → Level 2
- Pattern C/D → Level 2
- 用户审稿场景 → Level 4

(机器读规则见 aperture.tokens.json `media_patterns.placeholder_schema.visual_levels`)

### 11.5 Pictogram 数量计算修正(NEW v0.3 · 小修复)

**问题**:v0.2 §11.3 写"≥ 3 图变 gallery",但没说 pictogram 是否计入。

**v0.3 修复**:
- **Pictogram (Pattern D) 不计入"图像数量"上限**
- 一个 Info / Stage moment 内 pictogram 数量上限单独定:**≤ 6**
- 但 pictogram 与照片/视频混用时,照片/视频部分单独计数,仍走"≤ 3"
- 且总和(pictogram + 照片)≤ 8

---

## 12. Aperture Signature Library(NEW v0.3 · 大功能)

**Signatures 是 Aperture 的"破格动作库"**。它们与 §3-§6 的约束规则不同 — **是邀请,不是要求**。

### 12.1 元规则(必读)

1. **每页只能用 1 个 signature**。多个同时使用 = chaos,不再是 Aperture
2. **一份 deck 用 signature 总数 ≤ 30%**。70% 是"标准 Aperture",30% 是 signature 页 — 这样 signature 才有冲击力
3. **相邻 signature 不能同型**(eg 用了 #6 不能马上用 #1,都是顶部水平动作)
4. **Signature 必须有内容理由**。#10 punch 配 "SOL/日"、#9 type-as-image 配 "CUMPLE." — signature 不能纯形式炫技
5. **Signatures 是邀请**。Claude Code 生成时可以**主动选 0-3 个**用在合适的页,但不是每页都必须用
6. **Signature 页可豁免某些 §4 约束**(eg accent 数量限制),但不能违反 §3 universal floor 和 §3.5 pre-check

### 12.2 Active Signatures(v0.3 实装 5 个)

每个 signature 写法是**邀请性 spec**,而非强制约束:

#### Signature #2: Single Glyph Heroic(单字英雄尺度)

- **Spirit**:把整个画面压缩到 1 个字符,占据画面 ≥ 50% 高度
- **Best moment**:Stage 章节封面 / 单概念页(eg "日 / 火 / 力" 这种意象字)
- **Implementation**:
  - 字符字号 ≥ 320px(16:9)/ ≥ 240px(mobile)
  - 字重 100 或 200(必须最轻)
  - 位置:不居中,推到画面 55-60% 横向位置
  - 颜色:与 Stage 默认一致,或在 Color Block 子调中用纯黑/纯白
  - 必须配 1 行 ≤ 11px 的注解(在画面边缘)
- **CJK 优势**:**极高**(方块字单字本身就是图形)
- **Forbidden**:不能堆叠多个字符;不能加任何装饰;角落注解不能超过 1 行
- **Frequency**:一份 deck ≤ 1 次;一个产品官网 ≤ 2 次
- **Mutual exclusion**:与 #4 / #10 不能用在相邻页

#### Signature #4: Vertical Tower(垂直塔式)

- **Spirit**:中文 / 日文 hero 文字纵向排成"塔",每行一字,挑战水平阅读
- **Best moment**:CJK Stage moment / 文学感强的章节页 / Manifesto 页
- **Implementation**:
  - 字符字号 80-120px,行高 0.95-1.0(几乎贴紧)
  - 字符列居中或偏左 1/3
  - 终点字(末字)承载 accent 色 — 这是 signature 的关键 punctum
  - 右侧/下方配 Latin 翻译 + caption(用于双语场景)
  - 实现可用 flex column / grid,不强制 `writing-mode: vertical-rl`(那是 §10.7 的纯日文场景)
- **CJK 优势**:**极高**(Latin only 做不出来)
- **Forbidden**:终点字不能没有 accent;塔高 < 4 字不算 tower
- **Frequency**:CJK 项目一份 deck ≤ 2 次
- **Mutual exclusion**:与 #2 / #10 不能用在相邻页

#### Signature #7: Caption as Subject(字号层级颠倒)

- **Spirit**:把通常 11-12px 的 caption 放大到 hero 尺度,真正的"标题"反而做小
- **Best moment**:Manifesto 页 / 法律 / 致敬 / 哲学论述页
- **Implementation**:
  - 巨型 caption 字号 36-56px,保留 caption 全部特征:UPPERCASE + tracked 0.16em + accent 色
  - "真正的"标题缩到 14-16px,字重 200,正文常规色
  - 整体留白比例提升到 65%+
- **核心要求**:**self-referential** — 内容必须暗示"小字 / 注脚 / 细节",形式才能 self-aware
  - ✓ 适配内容:"Subject to RD 1955/2000 — verified in 8 minutes" / "In the smallest print, the largest implications"
  - ✗ 不适配:任何普通陈述句
- **CJK 优势**:中(中文也能做,但 UPPERCASE 概念缺失,需调整)
- **Forbidden**:无内容理由的纯炫技
- **Frequency**:一份 deck ≤ 1 次
- **Risk**:**最高** — 用得好像 Pentagram,用得不好像炫技。Pre-check 时必须验证"内容是否给出 self-reference"

#### Signature #9: Type as Image(单词字符变图形)

- **Spirit**:把单词字母拆开,字母间距拉到屏幕宽度,每个字母变成独立构图元素 — 像化学元素表
- **Best moment**:产品名 / 品牌名 / 标语展开页 / Stage 启始页
- **Implementation**:
  - 适用单词长度 4-7 字符(短了不够"拉",长了塞不下)
  - 字母字号 140-180px(16:9 中需要根据字符数计算)
  - 字母字重 100,letter-spacing 0(因为已用 grid 拉开)
  - 每个字母下方配 9-10px 的 sequence number(01/02/...)
  - 底部可加渐淡 hairline 连接线
  - 一个字母用 accent 色 — 必须有内容意义(eg "P" in CUMPLE 因 SolarComply 的 P)
- **CJK 优势**:**低**(方块字之间天然有空气,拉开效果减弱)— 仅适合 Latin
- **Forbidden**:适用只限 Latin / 字符数不在 4-7 范围 / accent 字母选择无内容理由
- **Frequency**:一份 deck ≤ 1 次,产品名展开类页面专用

#### Signature #10: The Punch(超大西文 + 极小中文)

- **Spirit**:Latin 字号巨大(eg 280px) + 同义 CJK 极小(eg 18px),极端字号比 ≥ 10:1
- **Best moment**:Aperture × CJK 双语项目的 Manifesto / 概念页 / 文化对照页
- **Implementation**:
  - Latin 字号 240-320px,字重 100
  - CJK 同义字 16-22px,字重 200
  - 字号比必须 ≥ 10:1(刻意打破 §10.6 的字号补偿规则 — signature 豁免)
  - CJK 元素 baseline 与 Latin 元素的 baseline 对齐(底对齐)
  - CJK 旁边配 9px ratio tag(eg "CN · 1 char")
  - 底部 caption 解释这种处理(self-aware)
- **CJK 优势**:**极高**(Latin only 完全做不出来 — 需要双语)
- **Forbidden**:CJK 与 Latin 不同义 / 字号比 < 10:1 / 无 ratio tag 或 self-aware caption
- **Frequency**:Aperture × CJK 项目一份 deck ≤ 1 次,作为视觉高潮
- **Mutual exclusion**:与 #2 / #4 不能用在相邻页

### 12.3 Experimental Signatures(v0.3 标记,v0.4+ 扩展)

留位但暂不展开,有内容理由再激活:

- **#1: Punctuation as Subject** — 标点放大到 hero,字号 ≥ 400px
- **#3: Edge-bleed Number** — 主体侵入容器边界,只露 2/3
- **#5: Asymmetric Number Pair** — 数字组合,字号 + baseline 故意不对齐
- **#6: Negative Space Logo** — section marker 拉到画面 60% 宽,主从反转
- **#8: The Misalignment** — 一个元素故意比基线低 22px,需文字戏剧支撑

每个 experimental signature 在 tokens.json 里有占位,但 spec 不展开实现细节。**生产环境慎用** — 等 v0.4+ 真有项目用过再固化规则。

### 12.4 Signature 选择指南

| 项目 / 内容场景 | 推荐 Signature(s) |
|---|---|
| 中英双语品牌 manifesto | #4 + #10(不相邻) |
| 文化 / 出版项目 | #2, #4 |
| B2B SaaS 产品页 | #7(配法律内容)、#9(产品名展开) |
| AI 产品发布 | #2(单字概念)、#10(双语) |
| 季度汇报 PPT | 可用 #4 章节页 + #7 总结页 |
| 中文-only 项目 | #2, #4(Latin signature 不适用) |

---

## 13. Variance Dial(NEW v0.4 · 强度调节)

**Aperture 不是单一强度的 DNA**。同样的核心约束(§3 §4)+ 同样的 sub-systems(§5)+ 同样的 signatures(§12),通过调节 Variance Dial,可以输出从"严肃报告"到"实验性视觉"三档不同强度。

### 13.1 三档强度

| 档位 | 名字 | 适用项目 | 留白比例 | Signature 频率 | Accent 大胆度 | 字号比 |
|---|---|---|---|---|---|---|
| **1** | **Editorial** 编辑式 | 年报、白皮书、政府报告、严肃 SaaS | ≥ 70%(stage)/ ≥ 50%(info) | ≤ 10% pages | 极克制,饱和度 ≤ 20% | hero 5:1 ~ 6:1 |
| **2** | **Default** 默认 | B2B 产品、内容型 PPT、品牌官网 | ≥ 60% / ≥ 40%(本就如此) | ≤ 30% pages(本就如此) | 标准,饱和度 ≤ 30% | hero ≥ 5:1 |
| **3** | **Audacious** 大胆 | 品牌 manifesto、艺术项目、概念发布 | ≥ 55% / ≥ 35% | ≤ 50% pages | 允许饱和度 ≤ 50% accent + 章节页用 Color Block | hero ≥ 6:1,允许 8:1 ~ 10:1 |

### 13.2 调节什么、不调节什么

**Dial 调节**(每档不同):
- Stage 留白比例下限
- 一份 deck 中 signature 出现频率
- accent saturation 上限
- Color Block 在 deck 中允许的最大数量(Editorial 0 个,Default 2-3 个,Audacious 4-5 个)
- Hero 字号比的上限(下限永远 ≥ 5:1 不变)

**Dial 不调节**(三档相同):
- §3 Universal Floor(美的下限不变)
- §4 Style DNA Locked(身份不变)
- §6.3 AI Slop 反模式(AI 味永远禁)
- 字体黑白名单(永远不用 Inter)
- §10 CJK Typography(永远不变)
- Pre-Check 7 步(永远必跑)

### 13.3 Aperture-mandated Dial × 项目映射

如果用户没明说,Claude Code 按以下默认选档:

| 项目类型 | Dial |
|---|---|
| 政府 / 法律 / 金融年报 | 1 Editorial |
| B2B SaaS、内容型 PPT、产品官网 | 2 Default |
| 品牌发布、产品 manifesto、AI 产品 launch | 2-3 Default 或 Audacious |
| 艺术机构、设计项目、文化展览 | 3 Audacious |
| 西班牙 SolarComply | 2 Default |

### 13.4 Dial 与 Sub-systems 的关系

| Dial | Default Deep | Deep Petrol | Light Paper | Color Block | Data Palette | Japanese Editorial |
|---|---|---|---|---|---|---|
| 1 Editorial | ✓ | △ 慎用 | ✓ | ✗ 禁用 | ✓ | ✓ |
| 2 Default | ✓ | ✓ | ✓ | ✓ ≤ 3 次 | ✓ | ✓ |
| 3 Audacious | ✓ | ✓ | ✓ | ✓ ≤ 5 次 | ✓ | ✓ |

### 13.5 Dial 与 Signatures 的关系

| Dial | 推荐 active signatures | 频率上限 |
|---|---|---|
| 1 Editorial | #4 Vertical Tower(章节页)、#7 Caption as Subject | ≤ 1 次 / deck |
| 2 Default | #2, #4, #7, #9, #10 全可用 | ≤ 30% pages |
| 3 Audacious | 全部 active + 可激活 1 个 experimental(eg #1 Punctuation as Subject) | ≤ 50% pages |

### 13.6 Dial 切换不破坏一致性

**关键原则**:同一份 deck / 同一个网站,Dial 必须**全程一致**。不允许"封面用 Audacious,内容页用 Editorial"。Dial 是项目级决定,不是页面级决定。

例外:数据页可用 Editorial 节奏,即使整体是 Audacious — 因为数据页本身就需要克制。这不算切换 Dial,而是 Dial 内的"Info moment 自然安静"。

### 13.7 Pre-Check Step 1 整合

§3.5 Step 1 升级:

> Step 1 · 选定 sub-system + spectrum + signature **+ Variance Dial(整个项目级,首次确认)**

新项目第一次声明设计系统时(参见 dna-forge 的 Declare-Before-Build),必须明确 Dial 档位。后续 artifact 沿用,不重复声明。

---

## 14. 版本与下一步

- **v0.1** — 初始 DNA + 5 个 sub-systems(SolarComply 探索)
- **v0.2** — Layout Safety / Brand Spectrum / Japanese Editorial / CJK Typography / Media Integration & Placeholders
- **v0.3** — 修复 v0.2 的 5 个 playtest 问题 + 实装 5 个 active signatures(#2 #4 #7 #9 #10)+ 5 个 experimental signature 占位 + Pre-Check 协议
- **v0.4** — AI Slop 反模式层(§6.3)+ 字体黑白名单(§4.4)+ oklch / color-mix 现代色彩表达(§3.6)+ text-wrap / hanging-punctuation 现代 CSS(§10.9)+ PPT Slide vs Speaker Notes 规则(§7.2)+ Variance Dial 强度调节(§13)
- **v0.5**（本文件） — 新增工程伴侣 `aperture-recipes.md`（R1 视口骨架 · R2 五级 Overlay · R3 垂直间距 · R4 组件库 · R5 CSS Reset）+ §3.2 垂直间距钩子 + §7.2 视口自适应钩子 + §11.1 五级 Overlay 钩子 + §0 文档用法更新
- **v0.6** — Photographic Atmosphere 子调 + 1-2 个 experimental signature 激活(根据真实项目反馈)
- **v1.0** — 自动校验脚本 + Japanese Editorial / CJK 完整实例 + components/ 模板
