/**
 * =============================================
 * Presenta - Renderer Skill
 * 将 planning.yaml 转换为 HTML 幻灯片
 * =============================================
 */

class RendererSkill {
  constructor() {
    this.presets = this.loadPresets();
  }

  // ============================================
  // 视觉主题库（从 DesignArchetypes 动态生成）
  // ============================================
  loadPresets() {
    var archetypes = window.DesignArchetypes || {};
    var presets = {};

    for (var id in archetypes) {
      if (!archetypes.hasOwnProperty(id)) continue;
      var arch = archetypes[id];
      presets[id] = {
        name: arch.name,
        archetype: arch,
        css: this.archetypeToCSS(arch),
        fontUrl: ''
      };
    }

    // 旧预设名别名（向后兼容已保存项目）
    if (presets['tech-dark-mode']) { presets['tech'] = presets['tech-dark-mode']; presets['finance'] = presets['tech-dark-mode']; presets['dark-minimal'] = presets['tech-dark-mode']; }
    if (presets['editorial-swiss']) { presets['business'] = presets['editorial-swiss']; presets['consulting'] = presets['editorial-swiss']; presets['government'] = presets['editorial-swiss']; }
    if (presets['magazine-big-type']) { presets['startup'] = presets['magazine-big-type']; }
    if (presets['moodboard-collage']) { presets['brand'] = presets['moodboard-collage']; }
    if (presets['minimal-architectural']) { presets['academic'] = presets['minimal-architectural']; presets['medical'] = presets['minimal-architectural']; }

    if (Object.keys(presets).length === 0) {
      presets['editorial-swiss'] = {
        name: 'Default',
        archetype: null,
        css: '--bg:#F5F4F0;--bg-2:#FAF9F6;--text-1:#0E1013;--text-2:#5A6069;--accent:#0E1013;--accent-2:#C9FF3B;--warning:#D97706;--divider:#D8DADC;--font-cn:"Inter Tight","Noto Sans SC",system-ui,sans-serif;--font-en:"Inter Tight","Noto Sans SC",system-ui,sans-serif;--font-heading:"Archivo","Noto Serif SC",system-ui,sans-serif;--font-mono:"IBM Plex Mono","Noto Sans SC",ui-monospace,monospace;',
        fontUrl: ''
      };
      presets['tech'] = presets['editorial-swiss'];
      presets['business'] = presets['editorial-swiss'];
    }

    return presets;
  }

  archetypeToCSS(arch) {
    var c = arch.color;
    var t = arch.typography;
    var warning = c.mode === 'dark' ? '#F59E0B' : '#D97706';
    return `
      --bg: ${c.neutral.bg};
      --bg-2: ${c.neutral.surface};
      --text-1: ${c.neutral.text};
      --text-2: ${c.neutral.text_muted};
      --accent: ${c.accent.primary};
      --accent-2: ${c.accent.secondary || c.accent.primary};
      --warning: ${warning};
      --divider: ${c.neutral.hairline};
      --font-cn: ${t.families.body.stack};
      --font-en: ${t.families.body.stack};
      --font-heading: ${t.families.heading.stack};
      ${t.families.mono ? '--font-mono: ' + t.families.mono.stack + ';' : ''}
    `;
  }

  // ============================================
  // 主渲染方法
  // ============================================
  async renderSlides(planningYaml, options = {}) {
    const { onProgress, onSlideComplete } = options;

    // 解析 YAML
    const planning = this.parseYaml(planningYaml);
    if (!planning) {
      throw new Error('无法解析 planning.yaml');
    }

    const archetypeId = planning.archetype || planning.visual_preset || 'editorial-swiss';
    const preset = this.presets[archetypeId] || this.presets['editorial-swiss'] || Object.values(this.presets)[0];
    const slides = [];
    const totalSlides = (planning.chapters || []).reduce((sum, chapter) => {
      return sum + ((chapter?.slides || []).length);
    }, 0);

    if (!totalSlides) {
      throw new Error('planning.yaml 解析后未找到任何幻灯片');
    }

    // 收集所有 slides
    let slideIndex = 0;
    for (const chapter of planning.chapters || []) {
      for (const slide of chapter.slides || []) {
        slideIndex++;
        slide.index = slideIndex;
        slide.chapter = chapter.name;

        if (onProgress) {
          onProgress({
            type: 'rendering',
            current: slideIndex,
            total: totalSlides,
            progress: Math.round((slideIndex / totalSlides) * 100),
            message: `正在渲染第 ${slideIndex} 页…`
          });
        }

        // 渲染单页
        const html = this.renderSlide(slide, preset, planning);
        slides.push({
          index: slideIndex,
          role: slide.page_role,
          title: slide.title,
          html: html,
          transcript: slide.transcript || '',
          speakerNote: slide.director_note || ''
        });

        if (onSlideComplete) {
          onSlideComplete(slides[slides.length - 1]);
        }

        // 模拟流式延迟
        await sleep(50);
      }
    }

    return slides;
  }

  // ============================================
  // 渲染单页 HTML
  // ============================================
  renderSlide(slide, preset, planning) {
    const pageRole = slide.page_role || 'support';
    const renderer = this.getPageRenderer(pageRole);
    const arch = preset.archetype;
    const ts = arch ? arch.typography.scale : null;
    const grid = arch ? arch.grid : null;

    const imageryHtml = this.renderImagePlaceholder(slide.imagery, arch, pageRole);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.title || 'Slide'} - ${planning.title || 'Presentation'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600&family=Inter+Tight:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      ${preset.css}
      --content-fit: 1;
      --font-size-base-base: 24px;
      --font-size-h1-base: ${ts ? ts.h1.size_px : 80}px;
      --font-size-h2-base: ${ts ? ts.h2.size_px : 56}px;
      --font-size-h3-base: ${ts ? Math.round(ts.h2.size_px * 0.7) : 36}px;
      --font-size-h4-base: ${ts ? Math.round(ts.h2.size_px * 0.6) : 32}px;
      --font-size-body-base: ${ts ? ts.body.size_px : 18}px;
      --font-size-small-base: ${ts ? Math.max(ts.body.size_px - 2, 14) : 16}px;
      --font-size-xs-base: ${ts ? ts.label.size_px + 3 : 14}px;
      --font-size-hero-base: ${ts ? ts.display.size_px : 160}px;
      --font-size-stat-base: 48px;
      --slide-padding-x-base: ${grid ? grid.margin : 64}px;
      --slide-padding-y-base: ${grid ? Math.round(grid.margin * 0.5) : 48}px;
      --slide-gap-base: ${grid ? grid.gutter * 2 : 48}px;
      --slide-element-gap-base: ${grid ? grid.gutter : 16}px;
      --font-size-base: calc(var(--font-size-base-base) * var(--content-fit));
      --font-size-h1: calc(var(--font-size-h1-base) * var(--content-fit));
      --font-size-h2: calc(var(--font-size-h2-base) * var(--content-fit));
      --font-size-h3: calc(var(--font-size-h3-base) * var(--content-fit));
      --font-size-h4: calc(var(--font-size-h4-base) * var(--content-fit));
      --font-size-body: calc(var(--font-size-body-base) * var(--content-fit));
      --font-size-small: calc(var(--font-size-small-base) * var(--content-fit));
      --font-size-xs: calc(var(--font-size-xs-base) * var(--content-fit));
      --font-size-hero: calc(var(--font-size-hero-base) * var(--content-fit));
      --font-size-stat: calc(var(--font-size-stat-base) * var(--content-fit));
      --slide-padding-x: calc(var(--slide-padding-x-base) * var(--content-fit));
      --slide-padding-y: calc(var(--slide-padding-y-base) * var(--content-fit));
      --slide-gap: calc(var(--slide-gap-base) * var(--content-fit));
      --slide-element-gap: calc(var(--slide-element-gap-base) * var(--content-fit));
      --line-height: ${ts ? ts.body.line_height : 1.5};
      --line-height-tight: ${ts ? ts.h1.line_height : 1.1};
      --line-height-loose: 1.9;
      --heading-weight: ${ts ? ts.h1.weight : 700};
      --body-weight: ${ts ? ts.body.weight : 400};
      --heading-tracking: ${ts ? ts.h1.tracking : -0.015}em;
      --label-tracking: ${ts ? ts.label.tracking : 0.06}em;
      --slide-grid-gap: calc(var(--slide-element-gap) * 1.35);
      --content-measure: min(100%, 68ch);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }

    body {
      font-family: var(--font-cn);
      background: var(--bg);
      color: var(--text-1);
      display: grid;
      position: relative;
      font-weight: var(--body-weight);
      line-height: var(--line-height);
      text-rendering: optimizeLegibility;
    }

    h1, h2, .cover-title, .chapter-title, .hero-number {
      font-family: var(--font-heading, var(--font-cn));
      font-weight: var(--heading-weight);
      letter-spacing: var(--heading-tracking);
    }

    .slide-container > * {
      min-width: 0;
      line-height: var(--line-height);
    }

    .slide-container {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-auto-rows: min-content;
      align-content: start;
      gap: var(--slide-grid-gap);
      padding: var(--slide-padding-y) var(--slide-padding-x);
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }

    .font-en { font-family: var(--font-en); }

    .chapter-number, .col-label, .page-label {
      font-family: var(--font-mono, var(--font-cn));
      letter-spacing: var(--label-tracking);
      text-transform: uppercase;
      font-size: var(--font-size-xs);
      font-weight: 400;
    }

    ${this.getImagePlaceholderCSS()}
    ${this.getCommonStyles()}
    ${this.getTransitionStyles(planning.transitions, slide.index)}
  </style>
</head>
	<body data-slide-id="slide-${slide.index}" data-role="${pageRole}">
	  ${imageryHtml}
	  ${renderer(slide, preset, planning)}
	  ${this.renderSpeakerNotes(slide, arch)}
	  ${this.renderAutoFitScript()}
	</body>
	</html>`;
  }

  // ============================================
  // 页面渲染器路由
  // ============================================
  getPageRenderer(pageRole) {
    const renderers = {
      cover: this.renderCover.bind(this),
      chapter_break: this.renderChapterBreak.bind(this),
      climax: this.renderClimax.bind(this),
      support: this.renderSupport.bind(this),
      insight: this.renderInsight.bind(this),
      comparison: this.renderComparison.bind(this),
      closing: this.renderClosing.bind(this)
    };
    return renderers[pageRole] || renderers.support;
  }

  // ============================================
  // 各 page_role 渲染器
  // ============================================

  // Cover 页：封面
  renderCover(slide, preset, planning) {
    return `
  <div class="slide-container cover-page">
    <div class="cover-content">
      <h1 class="cover-title">${slide.title || planning.title}</h1>
      ${slide.items && slide.items[0] ? `<p class="cover-subtitle">${slide.items[0]}</p>` : ''}
    </div>
    ${slide.sidebar ? `<div class="slide-sidebar meta-rail">${slide.sidebar}</div>` : ''}
  </div>
  <style>
    .cover-page {
      align-content: center;
      grid-template-rows: auto auto;
    }
    .cover-title {
      max-width: 10ch;
      font-size: var(--font-size-h1);
      font-weight: 700;
      line-height: var(--line-height-tight);
      margin-bottom: calc(var(--slide-element-gap) * 1.2);
    }
    .cover-subtitle {
      max-width: 34ch;
      font-size: var(--font-size-h3);
      color: var(--text-2);
      font-weight: 400;
    }
    .cover-content {
      grid-column: 2 / span 8;
      display: grid;
      gap: var(--slide-element-gap);
      align-self: center;
    }
    .cover-page .slide-sidebar {
      grid-column: 12;
      grid-row: 2;
    }
  </style>`;
  }

  // Chapter Break：章节过渡页
  renderChapterBreak(slide, preset, planning) {
    return `
  <div class="slide-container chapter-page">
    <div class="chapter-content">
      <span class="chapter-number">${slide.chapter?.split('：')[0] || '章节'}</span>
      <h2 class="chapter-title">${slide.title}</h2>
    </div>
  </div>
  <style>
    .chapter-page {
      align-content: center;
    }
    .chapter-number {
      font-size: var(--font-size-body);
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: var(--slide-element-gap);
      display: block;
    }
    .chapter-title {
      font-size: var(--font-size-h1);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }
    .chapter-content {
      grid-column: 2 / span 8;
      display: grid;
      gap: var(--slide-element-gap);
    }
  </style>`;
  }

  // Climax：高潮页（核心数字）
  renderClimax(slide, preset, planning) {
    const items = slide.items || [];
    const mainNumber = this.extractNumber(items[0]) || { num: '40.9%', label: '', desc: '' };

    return `
  <div class="slide-container climax-page">
    <div class="climax-main">
      <span class="hero-number font-en">${mainNumber.num}</span>
      <span class="hero-label">${mainNumber.label}</span>
    </div>
    ${items.length > 1 ? `
    <div class="climax-secondary">
      ${items.slice(1).map(item => {
        const num = this.extractNumber(item);
        return `<div class="secondary-item">
          <span class="secondary-number font-en">${num.num}</span>
          <span class="secondary-label">${num.label}</span>
        </div>`;
      }).join('')}
    </div>` : ''}
    ${slide.insight ? `<div class="slide-insight">${slide.insight}</div>` : ''}
    ${slide.sidebar ? `<div class="slide-sidebar meta-rail">${slide.sidebar}</div>` : ''}
  </div>
  <style>
    .climax-page {
      align-content: center;
    }
    .climax-main {
      grid-column: 1 / span 8;
      display: grid;
      gap: var(--slide-element-gap);
      align-self: center;
    }
    .hero-number {
      font-size: var(--font-size-hero);
      font-weight: 800;
      color: var(--accent);
      line-height: 1;
    }
    .hero-label {
      font-size: var(--font-size-h4);
      color: var(--text-2);
      max-width: 16ch;
    }
    .climax-secondary {
      grid-column: 9 / -1;
      display: grid;
      gap: calc(var(--slide-gap) * 0.67);
      border-left: 1px solid var(--divider);
      padding-left: var(--slide-gap);
      align-self: stretch;
    }
    .secondary-number {
      font-size: var(--font-size-stat);
      font-weight: 700;
      color: var(--text-1);
      display: block;
    }
    .secondary-label {
      font-size: var(--font-size-body);
      color: var(--text-2);
    }
    .slide-insight {
      grid-column: 1 / span 10;
      font-size: var(--font-size-body);
      color: var(--accent);
      font-weight: 500;
      padding-top: var(--slide-element-gap);
      border-top: 1px solid var(--divider);
      align-self: end;
    }
    .climax-page .slide-sidebar {
      grid-column: 12;
      grid-row: 3;
    }
  </style>`;
  }

  // Support：支撑页（数据+图表）
  renderSupport(slide, preset, planning) {
    const hasChart = slide.chart && slide.chart.chart_type;

    return `
  <div class="slide-container support-page">
    <h2 class="slide-title">${slide.title}</h2>
    <div class="support-content">
      <div class="support-numbers">
        ${(slide.items || []).map(item => {
          const num = this.extractNumber(item);
          return `<div class="number-item">
            <span class="number-value font-en">${num.num}</span>
            <span class="number-metric">${num.label}</span>
            <span class="number-desc">${num.desc}</span>
          </div>`;
        }).join('')}
      </div>
      ${hasChart ? `<div class="support-chart">
        <canvas id="chart-${slide.index}"></canvas>
      </div>` : ''}
    </div>
    ${slide.insight ? `<div class="slide-insight">${slide.insight}</div>` : ''}
    ${slide.sidebar ? `<div class="slide-sidebar meta-rail">${slide.sidebar}</div>` : ''}
  </div>
  ${hasChart ? this.renderChartScript(slide.chart, slide.index) : ''}
  <style>
    .support-page {
      align-content: start;
    }
    .slide-title {
      grid-column: 1 / span 9;
      font-size: var(--font-size-h3);
      font-weight: 700;
    }
    .support-content {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: ${hasChart ? 'minmax(0, 1.05fr) minmax(0, 1.25fr)' : 'minmax(0, 1fr)'};
      gap: var(--slide-gap);
      min-height: 0;
    }
    .support-numbers {
      display: grid;
      align-content: start;
      gap: calc(var(--slide-gap) * 0.67);
    }
    .number-item {
      display: grid;
      gap: 4px;
      padding-bottom: calc(var(--slide-element-gap) * 1.15);
      border-bottom: 1px solid var(--divider);
    }
    .number-value {
      font-size: var(--font-size-stat);
      font-weight: 700;
      color: var(--accent);
    }
    .number-metric {
      font-size: var(--font-size-body);
      font-weight: 600;
      color: var(--text-1);
    }
    .number-desc {
      font-size: var(--font-size-small);
      color: var(--text-2);
    }
    .support-chart {
      min-height: 0;
      min-height: 240px;
      position: relative;
      background: linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.58));
      border: 1px solid var(--divider);
      padding: calc(var(--slide-element-gap) * 1.3);
    }
    .support-chart canvas {
      width: 100% !important;
      height: 100% !important;
    }
    .slide-insight {
      grid-column: 1 / span 10;
      padding-top: var(--slide-element-gap);
      border-top: 1px solid var(--divider);
      font-size: var(--font-size-body);
      color: var(--accent);
      font-weight: 500;
    }
    .support-page .slide-sidebar {
      grid-column: 12;
      grid-row: 3;
    }
  </style>`;
  }

  // Insight：金句页（纯文字）
  renderInsight(slide, preset, planning) {
    return `
  <div class="slide-container insight-page">
    <blockquote class="insight-quote">${slide.title}</blockquote>
    ${slide.items && slide.items[0] ? `<cite class="insight-source">${slide.items[0]}</cite>` : ''}
  </div>
  <style>
    .insight-page {
      align-content: center;
    }
    .insight-quote {
      grid-column: 2 / span 9;
      font-size: var(--font-size-h2);
      font-weight: 600;
      line-height: var(--line-height);
      color: var(--text-1);
      border: none;
      padding: 0;
      margin: 0;
      max-width: 14ch;
    }
    .insight-source {
      grid-column: 2 / span 6;
      font-size: var(--font-size-body);
      color: var(--text-2);
      font-style: normal;
    }
  </style>`;
  }

  // Comparison：对比页
  renderComparison(slide, preset, planning) {
    const items = slide.items || [];
    const mid = Math.ceil(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);

    return `
  <div class="slide-container comparison-page">
    <h2 class="slide-title">${slide.title}</h2>
    <div class="comparison-grid">
      <div class="comparison-col comparison-left">
        <span class="col-label">传统方案</span>
        ${left.map(item => `<div class="comparison-item">${item}</div>`).join('')}
      </div>
      <div class="comparison-col comparison-right">
        <span class="col-label highlight">我们的方案</span>
        ${right.map(item => `<div class="comparison-item highlight">${item}</div>`).join('')}
      </div>
    </div>
    ${slide.insight ? `<div class="slide-insight">${slide.insight}</div>` : ''}
  </div>
  <style>
    .comparison-page {
      align-content: start;
    }
    .slide-title {
      grid-column: 1 / span 9;
      font-size: var(--font-size-h3);
      font-weight: 700;
    }
    .comparison-grid {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: var(--slide-gap);
    }
    .comparison-col {
      display: grid;
      align-content: start;
      gap: calc(var(--slide-gap) * 0.5);
    }
    .comparison-left {
      grid-column: 1 / span 5;
    }
    .comparison-right {
      grid-column: 7 / span 6;
    }
    .col-label {
      font-size: var(--font-size-body);
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .col-label.highlight {
      color: var(--accent);
    }
    .comparison-item {
      padding: 20px 24px;
      background: var(--bg-2);
      border-left: 1px solid var(--divider);
      font-size: var(--font-size-body);
      line-height: var(--line-height);
    }
    .comparison-item.highlight {
      border-left: 4px solid var(--accent);
    }
    .comparison-page .slide-insight {
      grid-column: 1 / span 10;
      padding-top: var(--slide-element-gap);
      border-top: 1px solid var(--divider);
      font-size: var(--font-size-body);
      color: var(--accent);
      font-weight: 500;
    }
  </style>`;
  }

  // Closing：结尾页
  renderClosing(slide, preset, planning) {
    return `
  <div class="slide-container closing-page">
    <h2 class="closing-title">${slide.title}</h2>
    ${slide.items ? `
    <div class="closing-points">
      ${slide.items.map(item => `<div class="closing-point">${item}</div>`).join('')}
    </div>` : ''}
    <div class="closing-footer">
      <span class="closing-brand">${planning.title}</span>
      ${slide.insight ? `<span class="closing-insight">${slide.insight}</span>` : ''}
    </div>
  </div>
  <style>
    .closing-page {
      align-content: space-between;
    }
    .closing-title {
      grid-column: 2 / span 8;
      font-size: var(--font-size-h2);
      font-weight: 700;
      max-width: 12ch;
    }
    .closing-points {
      grid-column: 2 / span 7;
      display: grid;
      gap: var(--slide-element-gap);
    }
    .closing-point {
      font-size: var(--font-size-body);
      color: var(--text-2);
      padding-top: calc(var(--slide-element-gap) * 0.85);
      border-top: 1px solid var(--divider);
    }
    .closing-footer {
      grid-column: 10 / -1;
      align-self: end;
      display: grid;
      gap: 8px;
      justify-items: start;
    }
    .closing-brand {
      font-size: var(--font-size-body);
      color: var(--text-2);
    }
    .closing-insight {
      font-size: var(--font-size-small);
      color: var(--accent);
    }
  </style>`;
  }

  // ============================================
  // 图片占位渲染
  // ============================================

  renderImagePlaceholder(imagery, arch, pageRole) {
    if (!imagery || imagery.role === 'none' || !imagery.role) return '';
    var treatment = arch ? arch.imagery_script.tonal_treatment : 'cool-wash';
    var c = arch ? arch.color : null;
    var bg = this.getTonalGradient(treatment, c);
    var brief = imagery.content_brief || imagery.role || '';

    if (imagery.scale === 'full-bleed') {
      return '<div class="img-placeholder img-full-bleed" style="background:' + bg + '">' +
        '<span class="img-label">' + brief + '</span></div>';
    }
    if (imagery.scale === 'ultra-small') {
      var border = c ? c.accent.primary : '#666';
      return '<div class="img-placeholder img-ultra-small" style="background:' + bg + ';border:1px solid ' + border + '">' +
        '<span class="img-label">' + (imagery.role || '') + '</span></div>';
    }
    return '';
  }

  getTonalGradient(treatment, color) {
    var accent = color ? color.accent.primary : '#333';
    var text = color ? color.neutral.text : '#000';
    var gradients = {
      'bw': 'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 40%, #3a3a3a 100%)',
      'duotone': 'linear-gradient(135deg, ' + text + ' 0%, ' + accent + ' 100%)',
      'warm-wash': 'linear-gradient(135deg, #8B7355 0%, #C4A882 50%, #A0845C 100%)',
      'cool-wash': 'linear-gradient(135deg, #2C3E50 0%, #4A6B8A 50%, #34495E 100%)',
      'desaturate-30': 'linear-gradient(135deg, #7A7A72 0%, #9A9A8E 50%, #8A8A7E 100%)',
      'grain-overlay': 'linear-gradient(135deg, #8B7355 0%, #A0845C 50%, #7A6545 100%)'
    };
    return gradients[treatment] || gradients['cool-wash'];
  }

  getImagePlaceholderCSS() {
    return `
    .img-placeholder { position: absolute; z-index: 0; }
    .img-full-bleed {
      inset: 0;
      display: flex; align-items: flex-end; justify-content: flex-end;
      padding: 16px;
    }
    .img-full-bleed ~ .slide-container { position: relative; z-index: 1; }
    .img-ultra-small {
      bottom: var(--slide-padding-y, 48px);
      right: var(--slide-padding-x, 64px);
      width: 100px; height: 68px;
      border-radius: 2px;
      display: flex; align-items: center; justify-content: center;
    }
    .img-label {
      font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em;
      color: rgba(255,255,255,0.35); background: rgba(0,0,0,0.25);
      padding: 3px 8px; border-radius: 2px; max-width: 200px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    `;
  }

  // ============================================
  // 辅助方法
  // ============================================

  // 提取数字格式：**数字** | 指标 | 描述
  extractNumber(text) {
    if (!text) return { num: '', label: '', desc: '' };

    // 匹配 **数字** 格式
    const boldMatch = text.match(/\*\*([^*]+)\*\*\s*\|\s*([^|]*)\s*\|\s*(.*)/);
    if (boldMatch) {
      return {
        num: boldMatch[1].trim(),
        label: boldMatch[2].trim(),
        desc: boldMatch[3].trim()
      };
    }

    // 简单返回
    return { num: text, label: '', desc: '' };
  }

  // 渲染演讲者备注
  renderSpeakerNotes(slide, arch) {
    var hasImagery = slide.imagery && slide.imagery.role && slide.imagery.role !== 'none' && slide.imagery.content_brief;
    if (!slide.transcript && !slide.director_note && !hasImagery) return '';

    var imagePromptHtml = '';
    if (hasImagery && arch && arch.imagery_script) {
      imagePromptHtml = '<div class="notes-imagery"><strong>Image prompt:</strong> ' +
        arch.imagery_script.prompt_template + ' — ' + slide.imagery.content_brief + '</div>';
    }

    return `
  <div class="speaker-notes" id="speakerNotes">
    <div class="notes-label">演讲提示</div>
    <div class="notes-content">
      ${slide.transcript ? `<div class="notes-transcript">${slide.transcript.replace(/\n/g, '<br>')}</div>` : ''}
      ${slide.director_note ? `<div class="notes-director">${slide.director_note.replace(/\n/g, '<br>')}</div>` : ''}
      ${imagePromptHtml}
    </div>
  </div>
  <script>
    // S键切换演讲提示
    document.addEventListener('keydown', (e) => {
      if (e.key === 's' || e.key === 'S') {
        const notes = document.getElementById('speakerNotes');
        if (notes) {
          notes.style.display = notes.style.display === 'none' ? 'block' : 'none';
        }
      }
    });
  </script>
  <style>
    .speaker-notes {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: var(--slide-padding-y) var(--slide-padding-x);
      font-size: var(--font-size-xs);
      line-height: var(--line-height);
      z-index: 1000;
      display: none;
    }
    .notes-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .notes-transcript {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #333;
    }
    .notes-director {
      color: #aaa;
      font-size: 13px;
      white-space: pre-wrap;
    }
    .notes-imagery {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #333;
      color: #7ab;
      font-size: 12px;
      font-family: monospace;
    }
  </style>`;
  }

  // 渲染 Chart.js 脚本
  renderChartScript(chart, index) {
    if (!chart || !chart.data) return '';

    const chartType = chart.chart_type || 'line';
    const data = chart.data;

    return `
  <script>
    (function() {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      s.async = true;
      s.onload = function() { renderChart(); };
      s.onerror = function() { console.warn('Chart.js load failed'); };
      document.head.appendChild(s);
    })();
    function renderChart() {
      const ctx = document.getElementById('chart-${index}');
      if (!ctx || typeof Chart === 'undefined') return;

      const rootStyles = getComputedStyle(document.documentElement);
      const textColor = rootStyles.getPropertyValue('--text-1').trim();
      const gridColor = rootStyles.getPropertyValue('--divider').trim();
      const accentColor = rootStyles.getPropertyValue('--accent').trim();

      new Chart(ctx, {
        type: '${chartType}',
        data: {
          labels: ${JSON.stringify(data.labels || [])},
          datasets: [{
            label: '${data.datasets?.[0]?.label || '数据'}',
            data: ${JSON.stringify(data.datasets?.[0]?.data || [])},
            borderColor: accentColor,
            backgroundColor: ${chartType === 'line' ? "'transparent'" : 'accentColor'},
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: accentColor
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: textColor, font: { family: 'var(--font-cn)' } }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'var(--font-cn)' } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'var(--font-cn)' } }
            }
          }
        }
      });
    }
  </script>`;
  }

  // 通用样式
  getCommonStyles() {
    return `
    /* 动画 */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .slide-container > * {
      animation: fadeIn 0.6s ease-out;
    }

    .slide-container p,
    .slide-container li,
    .slide-container blockquote,
    .slide-container cite,
    .slide-container span,
    .slide-container h1,
    .slide-container h2,
    .slide-container h3,
    .slide-container h4 {
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .slide-container p,
    .slide-container blockquote {
      max-width: var(--content-measure);
      text-wrap: pretty;
    }

    .slide-title,
    .cover-title,
    .chapter-title,
    .closing-title,
    .insight-quote {
      text-wrap: balance;
    }

    .meta-rail,
    .slide-sidebar {
      align-self: end;
      justify-self: end;
      writing-mode: vertical-rl;
      font-size: var(--font-size-xs);
      letter-spacing: var(--label-tracking);
      color: var(--text-2);
      opacity: 0.78;
      text-transform: uppercase;
    }

    .section-divider {
      width: 100%;
      height: 1px;
      background: var(--divider);
    }

    /* 数字动画 */
    @keyframes countUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero-number, .number-value {
      animation: countUp 0.8s ease-out;
    }
    `;
  }

  renderAutoFitScript() {
    return `
  <script>
    (function() {
      var root = document.documentElement;
      var slide = document.querySelector('.slide-container');
      if (!root || !slide) return;

      var minFit = 0.68;
      var fitRaf = 0;

      function hasOverflow() {
        return slide.scrollHeight > slide.clientHeight + 1 || slide.scrollWidth > slide.clientWidth + 1;
      }

      function fitSlide() {
        if (fitRaf) cancelAnimationFrame(fitRaf);
        fitRaf = requestAnimationFrame(function() {
          var fit = 1;
          var attempts = 0;
          root.style.setProperty('--content-fit', '1');

          while (attempts < 12 && hasOverflow() && fit > minFit) {
            fit = Math.max(minFit, Number((fit - 0.04).toFixed(2)));
            root.style.setProperty('--content-fit', String(fit));
            attempts += 1;
          }
        });
      }

      window.addEventListener('load', fitSlide);
      window.addEventListener('resize', fitSlide);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fitSlide);
      } else {
        setTimeout(fitSlide, 50);
      }

      fitSlide();
    })();
  </script>`;
  }

  // 转场动画样式
  getTransitionStyles(transitions, currentIndex) {
    if (!transitions || !Array.isArray(transitions)) return '';

    const relevant = transitions.find(t => t.to === currentIndex);
    if (!relevant) return '';

    const animations = {
      'fade': 'fadeIn 0.6s ease-out',
      'slide-left': 'slideInLeft 0.5s ease-out',
      'slide-right': 'slideInRight 0.5s ease-out',
      'scale-in': 'scaleIn 0.5s ease-out',
      'wipe': 'fadeIn 0.4s ease-out'
    };

    const animation = animations[relevant.type] || animations.fade;

    return `
    .slide-container {
      animation: ${animation};
    }`;
  }

  getIndent(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  findNextMeaningfulLine(lines, startIndex) {
    for (let i = startIndex; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      return {
        index: i,
        line: lines[i],
        trimmed,
        indent: this.getIndent(lines[i])
      };
    }
    return null;
  }

  parseScalarValue(rawValue) {
    const value = String(rawValue || '').trim();
    if (!value) return '';
    if (value === '[]') return [];
    if (value === '{}') return {};

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value.replace(/'/g, '"'));
      } catch (e) {
        return value;
      }
    }

    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
      return Number(value);
    }

    if (/^(true|false)$/i.test(value)) {
      return value.toLowerCase() === 'true';
    }

    return value;
  }

  parseBlockScalar(lines, startIndex, parentIndent) {
    const collected = [];
    let minIndent = Infinity;
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      const indent = trimmed ? this.getIndent(line) : Infinity;

      if (trimmed && indent <= parentIndent) {
        break;
      }

      if (trimmed && !trimmed.startsWith('#')) {
        minIndent = Math.min(minIndent, indent);
      }

      collected.push(line);
      i++;
    }

    const baseIndent = Number.isFinite(minIndent) ? minIndent : parentIndent + 2;
    const value = collected
      .map((line) => {
        if (!line.trim()) return '';
        return line.slice(Math.min(baseIndent, line.length)).replace(/\s+$/, '');
      })
      .join('\n')
      .replace(/\n+$/, '');

    return { value, nextIndex: i };
  }

  parseMapping(lines, startIndex, indent) {
    const obj = {};
    let i = startIndex;

    while (i < lines.length) {
      const current = this.findNextMeaningfulLine(lines, i);
      if (!current) {
        return { value: obj, nextIndex: lines.length };
      }

      if (current.indent < indent) {
        return { value: obj, nextIndex: current.index };
      }

      if (current.indent > indent) {
        i = current.index + 1;
        continue;
      }

      if (current.trimmed.startsWith('- ')) {
        return { value: obj, nextIndex: current.index };
      }

      const match = current.trimmed.match(/^([^:]+):\s*(.*)$/);
      if (!match) {
        i = current.index + 1;
        continue;
      }

      const key = match[1].trim();
      const rawValue = match[2];

      if (rawValue === '|' || rawValue === '>') {
        const block = this.parseBlockScalar(lines, current.index + 1, current.indent);
        obj[key] = block.value;
        i = block.nextIndex;
        continue;
      }

      if (rawValue === '') {
        const next = this.findNextMeaningfulLine(lines, current.index + 1);
        if (!next || next.indent <= current.indent) {
          obj[key] = '';
          i = current.index + 1;
          continue;
        }

        if (next.trimmed.startsWith('- ')) {
          const nested = this.parseSequence(lines, next.index, next.indent);
          obj[key] = nested.value;
          i = nested.nextIndex;
          continue;
        }

        const nested = this.parseMapping(lines, next.index, next.indent);
        obj[key] = nested.value;
        i = nested.nextIndex;
        continue;
      }

      obj[key] = this.parseScalarValue(rawValue);
      i = current.index + 1;
    }

    return { value: obj, nextIndex: i };
  }

  parseSequence(lines, startIndex, indent) {
    const arr = [];
    let i = startIndex;

    while (i < lines.length) {
      const current = this.findNextMeaningfulLine(lines, i);
      if (!current) {
        return { value: arr, nextIndex: lines.length };
      }

      if (current.indent < indent || current.indent > indent || !current.trimmed.startsWith('- ')) {
        return { value: arr, nextIndex: current.index };
      }

      const itemContent = current.trimmed.slice(2).trim();

      if (!itemContent) {
        const next = this.findNextMeaningfulLine(lines, current.index + 1);
        if (!next || next.indent <= current.indent) {
          arr.push('');
          i = current.index + 1;
          continue;
        }

        const nested = next.trimmed.startsWith('- ')
          ? this.parseSequence(lines, next.index, next.indent)
          : this.parseMapping(lines, next.index, next.indent);
        arr.push(nested.value);
        i = nested.nextIndex;
        continue;
      }

      const inlineMatch = itemContent.match(/^([^:]+):\s*(.*)$/);
      const isQuotedScalar = itemContent.startsWith('"') || itemContent.startsWith("'");

      if (inlineMatch && !isQuotedScalar) {
        const item = {};
        const key = inlineMatch[1].trim();
        const rawValue = inlineMatch[2];
        let nextIndex = current.index + 1;

        if (rawValue === '|' || rawValue === '>') {
          const block = this.parseBlockScalar(lines, current.index + 1, current.indent);
          item[key] = block.value;
          nextIndex = block.nextIndex;
        } else if (rawValue === '') {
          const next = this.findNextMeaningfulLine(lines, current.index + 1);
          if (!next || next.indent <= current.indent) {
            item[key] = '';
          } else if (next.trimmed.startsWith('- ')) {
            const nested = this.parseSequence(lines, next.index, next.indent);
            item[key] = nested.value;
            nextIndex = nested.nextIndex;
          } else {
            const nested = this.parseMapping(lines, next.index, next.indent);
            item[key] = nested.value;
            nextIndex = nested.nextIndex;
          }
        } else {
          item[key] = this.parseScalarValue(rawValue);
        }

        const continuation = this.findNextMeaningfulLine(lines, nextIndex);
        if (
          continuation &&
          continuation.indent > current.indent &&
          !continuation.trimmed.startsWith('- ')
        ) {
          const nested = this.parseMapping(lines, continuation.index, continuation.indent);
          Object.assign(item, nested.value);
          nextIndex = nested.nextIndex;
        }

        arr.push(item);
        i = nextIndex;
        continue;
      }

      arr.push(this.parseScalarValue(itemContent));
      i = current.index + 1;
    }

    return { value: arr, nextIndex: i };
  }

  // 面向 planning schema 的 YAML 解析器
  parseYaml(yaml) {
    try {
      console.log('[RendererSkill] parseYaml 开始，yaml长度:', yaml?.length);
      console.log('[RendererSkill] yaml前200字符:', yaml?.substring(0, 200));

      if (!yaml || !yaml.trim()) {
        return null;
      }

      const normalized = yaml.replace(/\r\n?/g, '\n');
      const lines = normalized.split('\n');
      const first = this.findNextMeaningfulLine(lines, 0);

      if (!first) {
        return null;
      }

      const parsed = this.parseMapping(lines, first.index, first.indent).value;
      const chapterCount = Array.isArray(parsed?.chapters) ? parsed.chapters.length : 0;
      const slideCount = (parsed?.chapters || []).reduce((sum, chapter) => {
        return sum + ((chapter?.slides || []).length);
      }, 0);

      console.log('[RendererSkill] parseYaml 完成，chapters:', chapterCount, 'slides:', slideCount);
      return parsed;
    } catch (e) {
      console.error('YAML parse error:', e);
      return null;
    }
  }
}

// 辅助函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export
window.RendererSkill = RendererSkill;
if (window.PresentaSkills) window.PresentaSkills.register('renderer', RendererSkill);
