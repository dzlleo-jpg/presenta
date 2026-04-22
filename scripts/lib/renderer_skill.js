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
  // 视觉主题库（10个 preset）
  // ============================================
  loadPresets() {
    return {
      tech: {
        name: '深色科技风',
        css: `
          --bg: #0A0E1A;
          --bg-2: #111827;
          --text-1: #F0F4FF;
          --text-2: rgba(240, 244, 255, 0.55);
          --accent: #3B82F6;
          --accent-2: #06B6D4;
          --warning: #F59E0B;
          --divider: rgba(59, 130, 246, 0.18);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Inter', 'DM Sans', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      finance: {
        name: '深色金融风',
        css: `
          --bg: #0D1117;
          --bg-2: #161B22;
          --text-1: #E6EDF3;
          --text-2: rgba(230, 237, 243, 0.50);
          --accent: #D4AF37;
          --accent-2: #4ADE80;
          --warning: #F87171;
          --divider: rgba(212, 175, 55, 0.20);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'DM Sans', 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      business: {
        name: '商务稳重风',
        css: `
          --bg: #1E293B;
          --bg-2: #334155;
          --text-1: #F8FAFC;
          --text-2: rgba(248, 250, 252, 0.60);
          --accent: #3B82F6;
          --accent-2: #60A5FA;
          --warning: #EF4444;
          --divider: rgba(59, 130, 246, 0.20);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      startup: {
        name: '融资路演风',
        css: `
          --bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          --bg-2: rgba(255, 255, 255, 0.05);
          --text-1: #FFFFFF;
          --text-2: rgba(255, 255, 255, 0.60);
          --accent: #667eea;
          --accent-2: #764ba2;
          --warning: #F59E0B;
          --divider: rgba(102, 126, 234, 0.25);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Space Grotesk', 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      brand: {
        name: '品牌创意风',
        css: `
          --bg: #FF6B6B;
          --bg-2: rgba(255, 255, 255, 0.15);
          --text-1: #FFFFFF;
          --text-2: rgba(255, 255, 255, 0.75);
          --accent: #FFE66D;
          --accent-2: #4ECDC4;
          --warning: #FF4757;
          --divider: rgba(255, 255, 255, 0.25);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Work Sans', 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      consulting: {
        name: '咨询专业风',
        css: `
          --bg: #FAFAF8;
          --bg-2: #F0EDE8;
          --text-1: #1A1A2E;
          --text-2: #6B7280;
          --accent: #1E3A5F;
          --accent-2: #C0392B;
          --warning: #E67E22;
          --divider: rgba(30, 58, 95, 0.15);
          --font-cn: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
          --font-en: 'Playfair Display', 'Georgia', serif;
        `,
        fontUrl: ''
      },
      academic: {
        name: '学术严谨风',
        css: `
          --bg: #F7F5F0;
          --bg-2: #EDEAE3;
          --text-1: #2C2C2C;
          --text-2: #6B6B6B;
          --accent: #2D4A3E;
          --accent-2: #8B6914;
          --warning: #C0392B;
          --divider: rgba(45, 74, 62, 0.18);
          --font-cn: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
          --font-en: 'EB Garamond', 'Georgia', serif;
        `,
        fontUrl: ''
      },
      government: {
        name: '政务庄重风',
        css: `
          --bg: #FFFFFF;
          --bg-2: #F5F5F5;
          --text-1: #1A1A1A;
          --text-2: #666666;
          --accent: #C41E3A;
          --accent-2: #8B0000;
          --warning: #D4AF37;
          --divider: rgba(196, 30, 58, 0.15);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Noto Sans SC', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      medical: {
        name: '医疗健康风',
        css: `
          --bg: #F0F9FF;
          --bg-2: #E0F2FE;
          --text-1: #0C4A6E;
          --text-2: #0369A1;
          --accent: #0EA5E9;
          --accent-2: #0284C7;
          --warning: #DC2626;
          --divider: rgba(14, 165, 233, 0.20);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      },
      'dark-minimal': {
        name: '极简深色风',
        css: `
          --bg: #000000;
          --bg-2: #111111;
          --text-1: #FFFFFF;
          --text-2: rgba(255, 255, 255, 0.50);
          --accent: #FFFFFF;
          --accent-2: #888888;
          --warning: #FF4444;
          --divider: rgba(255, 255, 255, 0.10);
          --font-cn: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          --font-en: 'Inter', 'PingFang SC', sans-serif;
        `,
        fontUrl: ''
      }
    };
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

    const preset = this.presets[planning.visual_preset] || this.presets.tech;
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

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slide.title || 'Slide'} - ${planning.title || 'Presentation'}</title>
  <style>
    :root {
      ${preset.css}
      /* 字号/间距变量（编辑器滑块控制） */
      --font-size-base: 24px;
      --font-size-h1: 80px;
      --font-size-h2: 56px;
      --font-size-h3: 36px;
      --font-size-h4: 32px;
      --font-size-body: 18px;
      --font-size-small: 16px;
      --font-size-xs: 14px;
      --font-size-hero: 160px;
      --font-size-stat: 48px;
      /* 间距和行高变量 */
      --slide-padding-x: 64px;
      --slide-padding-y: 48px;
      --slide-gap: 48px;
      --slide-element-gap: 16px;
      --line-height: 1.5;
      --line-height-tight: 1.1;
      --line-height-loose: 1.9;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    body {
      font-family: var(--font-cn);
      background: var(--bg);
      color: var(--text-1);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* 通用文字行高 */
    .slide-container > * {
      line-height: var(--line-height);
    }

    .slide-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: var(--slide-padding-y) var(--slide-padding-x);
      position: relative;
      overflow: hidden;
    }

    .font-en {
      font-family: var(--font-en);
    }

    ${this.getCommonStyles()}
    ${this.getTransitionStyles(planning.transitions, slide.index)}
  </style>
</head>
<body data-slide-id="slide-${slide.index}" data-role="${pageRole}">
  ${renderer(slide, preset, planning)}
  ${this.renderSpeakerNotes(slide)}
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
    ${slide.sidebar ? `<div class="slide-sidebar">${slide.sidebar}</div>` : ''}
  </div>
  <style>
    .cover-page {
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .cover-title {
      font-size: var(--font-size-h1);
      font-weight: 700;
      line-height: var(--line-height-tight);
      margin-bottom: var(--slide-element-gap);
    }
    .cover-subtitle {
      font-size: var(--font-size-h3);
      color: var(--text-2);
      font-weight: 400;
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
      justify-content: center;
      align-items: flex-start;
      padding-left: calc(var(--slide-padding-x) * 1.5);
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
    ${slide.sidebar ? `<div class="slide-sidebar">${slide.sidebar}</div>` : ''}
  </div>
  <style>
    .climax-page {
      flex-direction: row;
      align-items: center;
      gap: 64px;
    }
    .climax-main {
      flex: 2;
      display: flex;
      flex-direction: column;
    }
    .hero-number {
      font-size: var(--font-size-hero);
      font-weight: 800;
      color: var(--accent);
      line-height: 1;
      margin-bottom: var(--slide-element-gap);
    }
    .hero-label {
      font-size: var(--font-size-h4);
      color: var(--text-2);
    }
    .climax-secondary {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: calc(var(--slide-gap) * 0.67);
      border-left: 1px solid var(--divider);
      padding-left: var(--slide-gap);
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
      position: absolute;
      bottom: 48px;
      left: 64px;
      right: 64px;
      font-size: var(--font-size-body);
      color: var(--accent);
      font-weight: 500;
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
    ${slide.sidebar ? `<div class="slide-sidebar">${slide.sidebar}</div>` : ''}
  </div>
  ${hasChart ? this.renderChartScript(slide.chart, slide.index) : ''}
  <style>
    .support-page {
      padding-top: var(--slide-padding-y);
    }
    .slide-title {
      font-size: var(--font-size-h3);
      font-weight: 700;
      margin-bottom: calc(var(--slide-gap) * 0.83);
    }
    .support-content {
      display: flex;
      gap: var(--slide-gap);
      flex: 1;
    }
    .support-numbers {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: calc(var(--slide-gap) * 0.67);
    }
    .number-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      flex: 1.2;
      min-height: 0;
      position: relative;
    }
    .support-chart canvas {
      width: 100% !important;
      height: 100% !important;
    }
    .slide-insight {
      margin-top: var(--slide-element-gap);
      padding-top: var(--slide-element-gap);
      border-top: 1px solid var(--divider);
      font-size: var(--font-size-body);
      color: var(--accent);
      font-weight: 500;
    }
    .slide-sidebar {
      position: absolute;
      right: 64px;
      top: 50%;
      transform: translateY(-50%);
      writing-mode: vertical-rl;
      font-size: var(--font-size-xs);
      color: var(--text-2);
      opacity: 0.7;
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
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: calc(var(--slide-padding-y) * 1.5) calc(var(--slide-padding-x) * 1.5);
    }
    .insight-quote {
      font-size: var(--font-size-h2);
      font-weight: 600;
      line-height: var(--line-height);
      color: var(--text-1);
      border: none;
      padding: 0;
      margin: 0;
    }
    .insight-source {
      margin-top: calc(var(--slide-gap) * 0.83);
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
      padding-top: var(--slide-padding-y);
    }
    .slide-title {
      font-size: var(--font-size-h3);
      font-weight: 700;
      margin-bottom: calc(var(--slide-gap) * 0.83);
    }
    .comparison-grid {
      display: flex;
      gap: var(--slide-gap);
      flex: 1;
    }
    .comparison-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: calc(var(--slide-gap) * 0.5);
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
      border-radius: 8px;
      font-size: var(--font-size-body);
      line-height: var(--line-height);
    }
    .comparison-item.highlight {
      border-left: 4px solid var(--accent);
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
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: calc(var(--slide-padding-y) * 1.5) calc(var(--slide-padding-x) * 1.5);
    }
    .closing-title {
      font-size: var(--font-size-h2);
      font-weight: 700;
      margin-bottom: calc(var(--slide-gap));
    }
    .closing-points {
      display: flex;
      flex-direction: column;
      gap: var(--slide-element-gap);
      margin-bottom: 64px;
    }
    .closing-point {
      font-size: var(--font-size-body);
      color: var(--text-2);
    }
    .closing-footer {
      position: absolute;
      bottom: 48px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
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
  renderSpeakerNotes(slide) {
    if (!slide.transcript && !slide.director_note) return '';

    return `
  <div class="speaker-notes" id="speakerNotes">
    <div class="notes-label">演讲提示</div>
    <div class="notes-content">
      ${slide.transcript ? `<div class="notes-transcript">${slide.transcript.replace(/\n/g, '<br>')}</div>` : ''}
      ${slide.director_note ? `<div class="notes-director">${slide.director_note.replace(/\n/g, '<br>')}</div>` : ''}
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
