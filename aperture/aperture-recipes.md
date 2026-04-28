# Aperture Recipes

> 工程落地手册。DNA spec 是 **what**，Recipes 是 **how**。两者必须配合使用。

`v0.1 · 2026-04 · 解决 v0.4 playtest 暴露的 4 个工程问题`

---

## 0. 这份文档的用法

本文件是 `aperture.dna.md` 的工程伴侣。DNA spec 定义"Aperture 是什么"，本文件定义"怎么把 Aperture 落到代码"。

**读者**：任何使用 Aperture DNA 生成 HTML/CSS artifact 的 AI 助手。

**触发时机**：生成任何 Aperture artifact 时，在 §3.5 Pre-Check 之后、写代码之前，必须参考本文件中对应的 Recipe。

**与 DNA spec 的关系**：
- DNA spec 中标注"详见 Recipes §X"的地方，必须来这里找实现
- Recipes 不能违反 DNA spec 的任何约束
- Recipes 可以比 DNA spec 更具体（给出代码、数值、实现细节）

---

## R1. Slide Deck Skeleton — 视口自适应骨架

> 解决问题：窗口不适配 + 部分页面黑屏

### R1.1 问题根因

传统做法用 `width: 1920px; height: 1080px` 固定尺寸 + JS `transform: scale()` 缩放。这会导致：
- 浏览器 toolbar 占去高度时，scale 计算不对，页面顶部被裁
- scale > 1 时（viewport 大于 1920×1080），translateY 位移在 scaled 坐标里出错
- 非 16:9 视口（21:9 超宽、16:10 笔记本）出现大面积黑边

### R1.2 标准实现：CSS aspect-ratio + container query

**禁止使用 JS fitStage + 固定 px 尺寸。** 改用以下纯 CSS 方案：

```html
<main class="deck">
  <section class="slide" id="s1">
    <div class="frame">
      <div class="inner">
        <!-- 内容在这里 -->
      </div>
    </div>
  </section>
  <!-- 更多 slides -->
</main>
```

```css
/* ═══ 视口骨架 ═══ */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--bg-primary, #0A0A0A);
  overflow: hidden;
}

.deck {
  height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.slide {
  height: 100dvh;
  scroll-snap-align: start;
  display: grid;
  place-items: center;
}

/* ═══ 16:9 响应式画框 ═══ */
.frame {
  width: min(100vw, 177.78dvh);   /* 16:9 = 1.7778 */
  height: min(56.25vw, 100dvh);   /* 9:16 = 0.5625 */
  container-type: inline-size;
  position: relative;
  overflow: hidden;
}

.inner {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 4.167cqi 6.25cqi;      /* 80px 120px @1920 */
}
```

### R1.3 为什么这样做

| 传统 JS scale | CSS aspect-ratio + cqi |
|---|---|
| 固定 1920×1080 + JS 缩放 | 浏览器自动计算最大 16:9 区域 |
| toolbar 变化需重新计算 | `100dvh` 自动扣除 toolbar |
| translateY 在 scaled 坐标里出错 | scroll-snap 原生处理翻页 |
| 需要 resize 监听 | 纯 CSS，零 JS |

### R1.4 翻页机制

**禁止使用 `translateY(-n * 1080px)` 手动翻页。** 改用 scroll-snap：

```css
.deck { scroll-snap-type: y mandatory; }
.slide { scroll-snap-align: start; }
```

如需键盘/按钮翻页，用 `scrollIntoView`：

```js
function goToSlide(n) {
  document.getElementById(`s${n}`).scrollIntoView({ behavior: 'smooth' });
}
```

### R1.5 所有内部尺寸用 cqi

`container-type: inline-size` 在 `.frame` 上启用后，内部所有尺寸用 `cqi`（container query inline-size 的 1%）：

```
@1920px frame width: 1cqi = 19.2px
```

| 用途 | cqi 值 | @1920 等效 |
|---|---|---|
| 8px 基础间距 | 0.417cqi | 8px |
| 16px | 0.833cqi | 16px |
| 32px | 1.667cqi | 32px |
| 48px | 2.500cqi | 48px |
| 80px padding | 4.167cqi | 80px |
| 120px padding | 6.250cqi | 120px |
| Hero 84px | 4.375cqi | 84px |
| Hero 120px | 6.250cqi | 120px |

### R1.6 全屏与非全屏

此方案在全屏和非全屏下都正确工作：
- 非全屏：`100dvh` 自动等于浏览器可视区域（已扣 toolbar）
- 全屏：`100dvh` = 屏幕高度
- 无需任何 JS 监听或重新计算

### R1.7 页码导航（可选）

```html
<nav class="page-nav">
  <span class="page-current">3</span>
  <span class="page-sep">/</span>
  <span class="page-total">18</span>
</nav>
```

```css
.page-nav {
  position: fixed;
  bottom: 1.667cqi;
  right: 2.083cqi;
  font-size: 0.625cqi;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  z-index: 100;
}
```

页码更新用 IntersectionObserver：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelector('.page-current').textContent = 
        e.target.id.replace('s', '');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.slide').forEach(s => observer.observe(s));
```

---

## R2. Image Overlay 5-Level System — 图文对比度

> 解决问题：图片上文字看不清

### R2.1 问题根因

DNA spec v0.4 §11.1 Pattern A 规定 `overlay opacity 0.20`，但：
- 真实图像亮度不均匀（局部高光区域会"穿透" overlay）
- 中文字笔画细（Aperture 强制 light axis 100/200），需要更强对比
- 单一 flat overlay 无法同时满足"图像可见"和"文字可读"

### R2.2 五级 Overlay 系统

**v0.5 起，废弃单一 flat overlay。** 根据图像亮度和文字位置选择合适级别：

#### Level 1: Flat Overlay（仅用于暗调均匀图像）

```css
.ov-flat::after {
  content: '';
  position: absolute;
  inset: 0;
  background: oklch(0.13 0 0 / 0.55);
  pointer-events: none;
}
```

#### Level 2: Bottom Gradient（文字在下方 1/3 — 最常用）

```css
.ov-gradient::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    oklch(0.13 0 0 / 0.85) 0%,
    oklch(0.13 0 0 / 0.40) 40%,
    oklch(0.13 0 0 / 0.05) 70%,
    transparent 100%
  );
  pointer-events: none;
}
```

#### Level 3: Vignette（文字在中心区域）

```css
.ov-vignette::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 70% at 50% 50%,
    oklch(0.13 0 0 / 0.70) 0%,
    oklch(0.13 0 0 / 0.30) 60%,
    oklch(0.13 0 0 / 0.10) 100%
  );
  pointer-events: none;
}
```

#### Level 4: Text Zone Mask（精确保护文字区域）

```css
.ov-textzone::before {
  content: '';
  position: absolute;
  inset: 0;
  background: oklch(0.13 0 0 / 0.25);
  pointer-events: none;
}
.ov-textzone .text-area {
  position: relative;
  z-index: 1;
  padding: 2.083cqi;
  background: oklch(0.13 0 0 / 0.65);
}
```

#### Level 5: Blur + Overlay（图像极亮或极杂时的最强保护）

```css
.ov-blur .bg-image {
  position: absolute;
  inset: 0;
  object-fit: cover;
  filter: brightness(0.6) saturate(0.7);
}
.ov-blur .text-area {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px) brightness(0.4);
  -webkit-backdrop-filter: blur(20px) brightness(0.4);
  padding: 2.083cqi;
}
```

### R2.3 文字辅助增强（所有级别通用）

Aperture 的 light-axis 文字（200/300 字重）笔画细，在图像上需要 text-shadow 辅助：

```css
.hero-on-image {
  text-shadow:
    0 1px 3px oklch(0.13 0 0 / 0.50),
    0 0 20px oklch(0.13 0 0 / 0.30);
}
```

这不是装饰性阴影（DNA spec §4.3 禁止 box-shadow），而是可读性辅助。

### R2.4 选择指南

| 场景 | 推荐级别 |
|---|---|
| 暗调均匀图像 + 下方文字 | Level 1 |
| 普通图像 + 下方文字 | **Level 2**（默认） |
| 普通图像 + 居中文字 | Level 3 |
| 亮图像 + 固定文字区 | Level 4 |
| 极亮/极杂图像 | Level 5 |

### R2.5 对比度验证

无论用哪个级别，最终必须满足：
- 文字与其正下方背景的对比度 ≥ 4.5:1（WCAG AA）
- **在图像最亮区域测量**，不是在平均亮度处测量

---

## R3. Vertical Rhythm — 垂直间距系统

> 解决问题：内容紧贴分割线、留白不够

### R3.1 问题根因

DNA spec §3.2 只规定了比例关系（行高/字号），没有规定：
- 标题/分隔线与下方内容的**最小垂直间距**
- 不同层级元素之间的**间距阶梯**

AI 生成时会用 `padding-bottom: 10px` 这种"看起来有间距但实际太紧"的值。
在 1920×1080 的画面上，16px 的间距视觉上几乎等于"贴着"。

### R3.2 间距阶梯（8pt grid，强制）

所有垂直间距必须是 8 的倍数（用 cqi 表达）。以下是 Aperture slide 场景的强制最小值：

| 元素关系 | 最小间距 | cqi 值 | @1920 等效 |
|---|---|---|---|
| Section marker → Hero | 32px | 1.667cqi | 32px |
| Hero → Caption/Subtitle | 24px | 1.250cqi | 24px |
| 分隔线（hairline）→ 下方内容 | **32px** | **1.667cqi** | **32px** |
| 分隔线（hairline）← 上方内容 | 16px | 0.833cqi | 16px |
| 数据行之间 | 16px | 0.833cqi | 16px |
| 数据组之间 | 32px | 1.667cqi | 32px |
| 最后一个内容元素 → 页脚 | 48px | 2.500cqi | 48px |
| 页面顶部 padding | 80px | 4.167cqi | 80px |
| 页面底部 padding | 80px | 4.167cqi | 80px |
| 页面左右 padding | 120px | 6.250cqi | 120px |

### R3.3 分隔线规则

分隔线（hairline rule）是 Aperture 的核心视觉元素，但它的间距经常被 AI 做错：

```css
.section-divider {
  border: none;
  border-bottom: 0.5px solid var(--border, #1F1F1F);
  margin-top: 0.833cqi;     /* 上方内容到线：16px */
  margin-bottom: 1.667cqi;  /* 线到下方内容：32px（关键！） */
  padding: 0;
}
```

**关键规则**：分隔线下方间距 ≥ 分隔线上方间距 × 2。
这是因为分隔线在视觉上"属于上方内容的结尾"，而不是"下方内容的开头"。

### R3.4 Section Head 标准实现

```css
.section-head {
  display: flex;
  align-items: baseline;
  gap: 0.833cqi;              /* 16px */
  padding-bottom: 0.833cqi;   /* 16px */
  border-bottom: 0.5px solid var(--border);
  margin-bottom: 1.667cqi;    /* 32px — 这是关键间距 */
}
```

**禁止**：`margin-bottom` 或 `padding-bottom` 小于 1.667cqi（32px @1920）。

### R3.5 数据列表间距

```css
.data-list {
  display: flex;
  flex-direction: column;
  gap: 0.833cqi;              /* 行间 16px */
}

.data-group + .data-group {
  margin-top: 1.667cqi;       /* 组间 32px */
}

.data-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  padding: 0.833cqi 0;        /* 行内上下 16px */
}
```

### R3.6 内容不能紧贴容器边缘

所有内容区域必须有内边距：

```css
.content-area {
  padding: 0.833cqi;          /* 最小 16px 内边距 */
}

/* 左右栏都需要 padding */
.col-left { padding-right: 2.500cqi; }   /* 48px */
.col-right { padding-left: 2.500cqi; }   /* 48px */
```

**禁止**：只设 `padding-left` 不设 `padding-right`（或反过来）。
内容区域的四个方向都必须有 padding。

### R3.7 垂直间距自检

生成完成后检查：
- [ ] 分隔线下方间距 ≥ 32px（1.667cqi）
- [ ] 没有任何两个内容元素间距 < 16px（0.833cqi）
- [ ] 页面四边 padding 完整（上下 80px，左右 120px）
- [ ] 数据行右侧内容没有紧贴容器右边缘

---

## R4. Aperture Component Library — 标准组件骨架

> 解决问题：缺少可直接复用的标准 HTML 结构

### R4.1 用法

以下组件是 Aperture slide 中最常用的结构。生成时直接使用这些骨架，替换内容即可。
所有组件已内置 R3 的间距规则。

### R4.2 Cover Page（封面页）

```html
<section class="slide" id="s1">
  <div class="frame">
    <div class="inner cover">
      <header class="section-marker">
        <span class="marker-brand">BRAND NAME</span>
        <span class="marker-line"></span>
        <span class="marker-meta">2026 Q1</span>
      </header>
      <div class="cover-hero">
        <h1 class="hero-title">主标题</h1>
        <p class="hero-caption">SUBTITLE · CONTEXT</p>
      </div>
      <footer class="slide-footer">
        <span class="footer-source">Source info</span>
        <span class="footer-page">01</span>
      </footer>
    </div>
  </div>
</section>
```

```css
.cover {
  grid-template-rows: auto 1fr auto;
  align-content: stretch;
}
.cover-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.250cqi;             /* 24px */
}
.hero-title {
  font-size: 4.688cqi;       /* 90px @1920 */
  font-weight: 200;
  letter-spacing: -0.02em;
  line-height: 0.92;
  text-wrap: balance;
}
.hero-caption {
  font-size: 0.625cqi;       /* 12px @1920 */
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}
```

### R4.3 Data Page（数据明细页）

```html
<section class="slide" id="s3">
  <div class="frame">
    <div class="inner data-page">
      <header class="section-head">
        <span class="section-tag">03 · COST</span>
        <span class="section-line"></span>
        <span class="section-title">成本明细</span>
      </header>
      <div class="data-stage">
        <div class="data-group">
          <div class="data-row">
            <span class="data-label">土地成本</span>
            <span class="data-value">605<span class="data-unit">万</span></span>
          </div>
          <div class="data-row">
            <span class="data-label">建安成本</span>
            <span class="data-value">592<span class="data-unit">万</span></span>
          </div>
        </div>
      </div>
      <footer class="slide-footer">
        <span class="footer-source">数据来源：XX报告</span>
        <span class="footer-page">03</span>
      </footer>
    </div>
  </div>
</section>
```

```css
.data-page { grid-template-rows: auto 1fr auto; }
.section-head {
  display: flex;
  align-items: baseline;
  gap: 0.833cqi;
  padding-bottom: 0.833cqi;
  border-bottom: 0.5px solid var(--border);
  margin-bottom: 1.667cqi;        /* 32px — R3 强制最小值 */
}
.section-tag {
  font-size: 0.573cqi;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}
.section-line {
  flex: 1;
  height: 0.5px;
  background: var(--border);
}
.data-stage {
  display: flex;
  flex-direction: column;
  gap: 1.667cqi;                   /* 组间 32px */
}
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.417cqi 0;
  border-bottom: 0.5px solid var(--border);
}
.data-value {
  font-size: 2.083cqi;            /* 40px */
  font-weight: 200;
  font-variant-numeric: tabular-nums;
}
.data-unit {
  font-size: 0.729cqi;
  font-weight: 300;
  color: var(--text-secondary);
  margin-left: 0.208cqi;
}
```

### R4.4 Stat Card（统计卡片 — Bento Cell 内部）

```html
<div class="stat-card">
  <span class="stat-label">OCCUPANCY RATE</span>
  <span class="stat-value">94.7<span class="stat-pct">%</span></span>
  <span class="stat-context">同比 +3.2pp</span>
</div>
```

```css
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.417cqi;
  padding: 1.250cqi;              /* 24px — cell padding ≥ 20px */
}
.stat-label {
  font-size: 0.573cqi;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.stat-value {
  font-size: 2.604cqi;            /* 50px */
  font-weight: 200;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1;
}
.stat-pct {
  font-size: 1.250cqi;
  font-weight: 300;
}
.stat-context {
  font-size: 0.625cqi;
  font-weight: 300;
  color: var(--accent);
}
```

### R4.5 Section Marker（三段式标记 — 每页必有）

```html
<header class="section-marker">
  <span class="marker-brand">BRAND</span>
  <span class="marker-line"></span>
  <span class="marker-meta">SECTION · 2026</span>
</header>
```

```css
.section-marker {
  display: flex;
  align-items: center;
  gap: 0.833cqi;
}
.marker-brand {
  font-size: 0.573cqi;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  white-space: nowrap;
}
.marker-line {
  flex: 1;
  height: 0.5px;
  background: var(--border);
  min-width: 1.250cqi;            /* 24px — hairline 最小可见长度 */
}
.marker-meta {
  font-size: 0.573cqi;
  font-weight: 300;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-secondary);
  white-space: nowrap;
}
```

### R4.6 Slide Footer（页脚 — 每页必有）

```html
<footer class="slide-footer">
  <span class="footer-source">Source: XX Report 2026</span>
  <span class="footer-page">03</span>
</footer>
```

```css
.slide-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 0.833cqi;
  border-top: 0.5px solid var(--border);
}
.footer-source {
  font-size: 0.573cqi;
  font-weight: 300;
  color: var(--text-secondary);
}
.footer-page {
  font-size: 0.573cqi;
  font-weight: 500;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
```

### R4.7 Cover Page with Image（图片封面 — 使用 R2 Overlay）

```html
<section class="slide" id="s1">
  <div class="frame">
    <div class="inner cover-image ov-gradient">
      <img class="cover-bg" src="hero.jpg" alt="">
      <div class="cover-content">
        <header class="section-marker">
          <span class="marker-brand">品牌名</span>
          <span class="marker-line"></span>
          <span class="marker-meta">2026</span>
        </header>
        <div class="cover-hero">
          <h1 class="hero-title text-on-image">主标题</h1>
          <p class="hero-caption">SUBTITLE</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
.cover-image { position: relative; padding: 0; }
.cover-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 4.167cqi 6.25cqi;
  align-content: end;
}
.text-on-image {
  text-shadow:
    0 1px 3px oklch(0.13 0 0 / 0.50),
    0 0 20px oklch(0.13 0 0 / 0.30);
}
```

### R4.8 Bento Grid（Info Moment 数据网格）

```html
<div class="bento">
  <div class="bento-cell bento-wide"><!-- stat-card --></div>
  <div class="bento-cell"><!-- stat-card --></div>
  <div class="bento-cell bento-tall"><!-- 图表 --></div>
</div>
```

```css
.bento {
  display: grid;
  grid-template-columns: 1.4fr 1fr;  /* 不对称 — DNA spec §2.2 */
  gap: 0.417cqi;                      /* 8px — bento gap */
}
.bento-cell {
  background: var(--bg-secondary);
  border: 0.5px solid var(--border);
  border-radius: 0.208cqi;           /* ≤ 4px */
  padding: 1.250cqi;                  /* ≥ 20px */
  overflow: hidden;
}
.bento-wide { grid-column: span 2; }
.bento-tall { grid-row: span 2; }
```

---

## R5. Aperture CSS Reset — 全局样式基础

> 每个 Aperture artifact 的 `<style>` 开头必须包含此 reset。

```css
/* ═══ Aperture v0.5 Mandatory Reset ═══ */
:root {
  --bg-primary:    #0A0A0A;   /* oklch(0.13 0 0) */
  --bg-secondary:  #131313;   /* oklch(0.17 0 0) */
  --text-primary:  #FAFAFA;   /* oklch(0.98 0 0) */
  --text-secondary:#6E6F73;   /* oklch(0.50 0.005 264) */
  --border:        #1F1F1F;   /* oklch(0.21 0 0) */
  --accent:        #B2774A;   /* oklch(0.59 0.115 51) */

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-spacing-trim: space-all;
}

h1, h2, h3, .hero, [class*="hero"] { text-wrap: balance; }
p, .body, .caption { text-wrap: pretty; }
p { hanging-punctuation: first; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  /* production 替换为 Geist / Söhne / Cabinet Grotesk */
  font-feature-settings: "kern", "liga", "calt";
  color: var(--text-primary);
  background: var(--bg-primary);
}

.tabular, [class*="value"], [class*="num"] {
  font-variant-numeric: tabular-nums;
}
```

---

## 版本记录

- **v0.1**（本文件）— R1-R5，解决 v0.4 playtest 的 4 个工程问题
- **v0.2**（计划）— Bento 布局变体、Data Palette 图表组件、Mobile 响应式降级
- **v0.3**（计划）— Signature 组件骨架（#2 Single Glyph、#4 Vertical Tower 等）