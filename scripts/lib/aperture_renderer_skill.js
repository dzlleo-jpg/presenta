/**
 * =============================================
 * Presenta - Aperture Renderer Skill
 * 继承 RendererSkill，使用 Aperture Design Tokens
 * Stage/Info 双区模型 + 8pt Grid + Bento Layout
 * =============================================
 */

class ApertureRendererSkill extends RendererSkill {
  constructor() {
    super();
    this.tokens = window.ApertureTokens || {};
  }

  // ============================================
  // 从 subsystem 获取 CSS 变量
  // ============================================
  getSubsystemCSS(subsystemId) {
    var sub = (this.tokens.subsystems || {})[subsystemId];
    if (!sub) sub = (this.tokens.subsystems || {}).default_deep || {
      mode: 'dark', bg_primary: '#0A0A0A', bg_secondary: '#131313',
      text_primary: '#FAFAFA', text_secondary: '#6E6F73',
      accent: '#B87333', border: '#1F1F1F'
    };
    var warning = sub.mode === 'dark' ? '#F59E0B' : '#D97706';
    return `
      --bg: ${sub.bg_primary};
      --bg-2: ${sub.bg_secondary};
      --text-1: ${sub.text_primary};
      --text-2: ${sub.text_secondary};
      --accent: ${sub.accent};
      --accent-2: ${sub.accent};
      --divider: ${sub.border};
      --warning: ${warning};
    `;
  }

  // ============================================
  // 重写 renderSlides：读取 Aperture 专有字段
  // ============================================
  async renderSlides(planningYaml, options) {
    options = options || {};
    var onProgress = options.onProgress;
    var onSlideComplete = options.onSlideComplete;

    var planning = this.parseYaml(planningYaml);
    if (!planning) throw new Error('无法解析 planning.yaml');

    // Aperture 专有字段
    var subsystemId = planning.subsystem || 'default_deep';
    var varianceDial = planning.variance_dial || 2;

    var slides = [];
    var totalSlides = (planning.chapters || []).reduce(function(sum, ch) {
      return sum + ((ch.slides || []).length);
    }, 0);
    if (!totalSlides) throw new Error('planning.yaml 解析后未找到任何幻灯片');

    var slideIndex = 0;
    var self = this;
    for (var ci = 0; ci < (planning.chapters || []).length; ci++) {
      var chapter = planning.chapters[ci];
      for (var si = 0; si < (chapter.slides || []).length; si++) {
        var slide = chapter.slides[si];
        slideIndex++;
        slide.index = slideIndex;
        slide.chapter = chapter.name;

        if (onProgress) {
          onProgress({ type: 'rendering', current: slideIndex, total: totalSlides,
            progress: Math.round((slideIndex / totalSlides) * 100),
            message: '正在渲染第 ' + slideIndex + ' 页…' });
        }

        var pageSubsystem = slide.subsystem_override || subsystemId;
        var html = self.renderApertureSlide(slide, planning, pageSubsystem, varianceDial);
        slides.push({
          index: slideIndex, role: slide.page_role, title: slide.title,
          html: html, transcript: slide.transcript || '',
          speakerNote: slide.director_note || ''
        });

        if (onSlideComplete) onSlideComplete(slides[slides.length - 1]);
        await sleep(50);
      }
    }
    return slides;
  }

  // ============================================
  // 渲染单页 HTML（Aperture Zone Model）
  // ============================================
  renderApertureSlide(slide, planning, subsystemId, varianceDial) {
    var pageRole = slide.page_role || 'support';
    var renderer = this.getAperturePageRenderer(pageRole);
    var subCSS = this.getSubsystemCSS(subsystemId);
    var t = this.tokens;
    var ts = t.type_scale || {};
    var sp = t.spacing || {};
    var lh = t.line_height || {};
    var vd = (t.variance_dial || {})[varianceDial] || { stage_whitespace: 0.60, info_whitespace: 0.40 };

    var imageryHtml = this.renderApertureImagery(slide.imagery, subsystemId);

    return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + (slide.title || 'Slide') + ' - ' + (planning.title || 'Presentation') + '</title>\n<style>\n:root {\n' + subCSS + '\n  --content-fit: 1;\n  --a-hero-stage: ' + (ts.hero_stage ? ts.hero_stage.min : 96) + 'px;\n  --a-hero-info: ' + (ts.hero_info ? ts.hero_info.min : 36) + 'px;\n  --a-h2: ' + (ts.h2 ? ts.h2.min : 24) + 'px;\n  --a-body: ' + (ts.body || 15) + 'px;\n  --a-caption: ' + (ts.caption || 11) + 'px;\n  --a-marker: ' + (ts.section_marker || 9) + 'px;\n  --a-page-pad: ' + (sp.page_padding || 48) + 'px;\n  --a-section-gap: ' + (sp.section_gap || 32) + 'px;\n  --a-item-gap: ' + (sp.item_gap || 16) + 'px;\n  --a-bento-gap: ' + (sp.bento_gap || 8) + 'px;\n  --a-lh-hero: ' + (lh.hero_cjk || 1.05) + ';\n  --a-lh-body: ' + (lh.body_cjk || 1.75) + ';\n  --a-lh-caption: ' + (lh.caption || 1.4) + ';\n  --a-stage-ws: ' + vd.stage_whitespace + ';\n  --border-w: ' + (t.border_width || 0.5) + 'px;\n  /* classic compat */\n  --font-size-hero-base: ' + (ts.hero_stage ? ts.hero_stage.min : 96) + 'px;\n  --font-size-h1-base: ' + (ts.hero_info ? ts.hero_info.min : 36) + 'px;\n  --font-size-h2-base: ' + (ts.h2 ? ts.h2.min : 24) + 'px;\n  --font-size-h3-base: ' + (ts.h2 ? (ts.h2.max || 32) : 32) + 'px;\n  --font-size-h4-base: ' + (ts.h2 ? ts.h2.min : 24) + 'px;\n  --font-size-body-base: ' + (ts.body || 15) + 'px;\n  --font-size-small-base: ' + (ts.caption || 11) + 'px;\n  --font-size-xs-base: ' + (ts.section_marker || 9) + 'px;\n  --font-size-stat-base: ' + (ts.hero_info ? ts.hero_info.min : 36) + 'px;\n  --font-size-hero: calc(var(--font-size-hero-base) * var(--content-fit));\n  --font-size-h1: calc(var(--font-size-h1-base) * var(--content-fit));\n  --font-size-h2: calc(var(--font-size-h2-base) * var(--content-fit));\n  --font-size-h3: calc(var(--font-size-h3-base) * var(--content-fit));\n  --font-size-h4: calc(var(--font-size-h4-base) * var(--content-fit));\n  --font-size-body: calc(var(--font-size-body-base) * var(--content-fit));\n  --font-size-small: calc(var(--font-size-small-base) * var(--content-fit));\n  --font-size-xs: calc(var(--font-size-xs-base) * var(--content-fit));\n  --font-size-stat: calc(var(--font-size-stat-base) * var(--content-fit));\n  --slide-padding-x: calc(var(--a-page-pad) * var(--content-fit));\n  --slide-padding-y: calc(var(--a-page-pad) * var(--content-fit));\n  --slide-gap: calc(var(--a-section-gap) * var(--content-fit));\n  --slide-element-gap: calc(var(--a-item-gap) * var(--content-fit));\n  --slide-grid-gap: calc(var(--a-item-gap) * var(--content-fit));\n  --line-height: var(--a-lh-body);\n  --line-height-tight: var(--a-lh-hero);\n  --heading-weight: 500;\n  --body-weight: 300;\n  --heading-tracking: -0.02em;\n  --label-tracking: 0.16em;\n  --content-measure: min(100%, 68ch);\n}\n' + this.getApertureBaseCSS() + '\n' + this.getImagePlaceholderCSS() + '\n' + this.getCommonStyles() + '\n</style>\n</head>\n<body data-slide-id="slide-' + slide.index + '" data-role="' + pageRole + '" data-subsystem="' + subsystemId + '">\n' + imageryHtml + '\n' + renderer.call(this, slide, planning) + '\n' + this.renderSpeakerNotes(slide, null) + '\n' + this.renderAutoFitScript() + '\n</body>\n</html>';
  }

  // ============================================
  // Aperture 基础 CSS（Zone Model）
  // ============================================
  getApertureBaseCSS() {
    return `
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
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, .ap-hero-text, .ap-hero-number {
      font-family: var(--font-heading, var(--font-cn));
      font-weight: var(--heading-weight);
      letter-spacing: var(--heading-tracking);
    }
    .ap-page {
      width: 100%; height: 100%;
      display: grid; padding: var(--a-page-pad);
      gap: var(--a-section-gap);
      position: relative; overflow: hidden; isolation: isolate;
    }
    .ap-page.layout-hero-stage { grid-template-rows: 1fr auto; }
    .ap-page.layout-split-equal { grid-template-columns: 1fr 1fr; align-items: center; }
    .ap-page.layout-info-dense { grid-template-rows: auto 1fr; }
    .ap-page.layout-bento { grid-template-rows: auto 1fr; }
    .ap-stage { display: flex; flex-direction: column; justify-content: center; }
    .ap-hero-text {
      font-size: calc(var(--a-hero-stage) * var(--content-fit));
      font-weight: 200; line-height: var(--a-lh-hero);
      letter-spacing: -0.06em; color: var(--text-1); text-wrap: balance;
    }
    .ap-hero-number {
      font-size: calc(var(--a-hero-stage) * var(--content-fit));
      font-weight: 200; line-height: 1;
      letter-spacing: -0.02em; color: var(--accent);
      font-family: var(--font-en);
    }
    .ap-hero-sub {
      font-size: var(--a-body); color: var(--text-2);
      margin-top: var(--a-item-gap); line-height: var(--a-lh-body); max-width: 36ch;
    }
    .ap-info { display: grid; gap: var(--a-item-gap); align-content: start; }
    .ap-info.bento {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--a-bento-gap);
    }
    .ap-card {
      background: var(--bg-2); border: var(--border-w) solid var(--divider);
      border-radius: 4px; padding: var(--a-item-gap);
      display: flex; flex-direction: column; gap: 8px;
    }
    .ap-card-value {
      font-size: calc(var(--a-hero-info) * var(--content-fit));
      font-weight: 500; color: var(--accent); line-height: 1;
      font-family: var(--font-en);
    }
    .ap-card-label { font-size: var(--a-body); color: var(--text-1); font-weight: 400; }
    .ap-card-desc { font-size: var(--a-caption); color: var(--text-2); line-height: var(--a-lh-caption); }
    .ap-marker {
      font-size: var(--a-marker); color: var(--text-2);
      text-transform: uppercase; letter-spacing: 0.16em; font-family: var(--font-mono);
    }
    .ap-sidebar {
      position: absolute; right: var(--a-page-pad); bottom: var(--a-page-pad);
      writing-mode: vertical-rl; font-size: var(--a-marker);
      letter-spacing: 0.16em; color: var(--text-2); opacity: 0.6;
      text-transform: uppercase; font-family: var(--font-mono);
    }
    .ap-insight {
      font-size: var(--a-body); color: var(--accent); font-weight: 400;
      padding-top: var(--a-item-gap); border-top: var(--border-w) solid var(--divider);
    }
    .ap-slide-title {
      font-size: calc(var(--a-h2) * var(--content-fit));
      font-weight: 500; letter-spacing: -0.02em; color: var(--text-1);
    }
    .ap-chart {
      min-height: 200px; position: relative; background: var(--bg-2);
      border: var(--border-w) solid var(--divider); border-radius: 4px; padding: var(--a-item-gap);
    }
    .ap-chart canvas { width: 100% !important; height: 100% !important; }
    `;
  }

  // ============================================
  // Aperture 图片占位
  // ============================================
  renderApertureImagery(imagery, subsystemId) {
    if (!imagery || imagery.role === 'none' || !imagery.role) return '';
    var sub = (this.tokens.subsystems || {})[subsystemId] || {};
    var accent = sub.accent || '#B87333';
    var bg2 = sub.bg_secondary || '#131313';
    var brief = imagery.content_brief || imagery.role || '';
    if (imagery.scale === 'full-bleed') {
      return '<div class="img-placeholder img-full-bleed" style="background:linear-gradient(135deg,' + bg2 + ',' + accent + '22)"><span class="img-label">' + brief + '</span></div>';
    }
    if (imagery.scale === 'ultra-small') {
      return '<div class="img-placeholder img-ultra-small" style="background:' + bg2 + ';border:1px solid ' + accent + '"><span class="img-label">' + (imagery.role || '') + '</span></div>';
    }
    return '';
  }

  // ============================================
  // Page Renderer 路由
  // ============================================
  getAperturePageRenderer(pageRole) {
    var renderers = {
      cover: this.apCover,
      chapter_break: this.apChapterBreak,
      climax: this.apClimax,
      support: this.apSupport,
      insight: this.apInsight,
      comparison: this.apComparison,
      closing: this.apClosing
    };
    return (renderers[pageRole] || renderers.support).bind(this);
  }

  // ============================================
  // Cover：封面页（hero-stage 布局）
  // ============================================
  apCover(slide, planning) {
    var sz = slide.stage_zone || {};
    var heroText = sz.hero_text || slide.title || planning.title || '';
    var subtitle = (slide.items && slide.items[0]) ? slide.items[0] : '';
    return '<div class="ap-page layout-hero-stage">' +
      '<div class="ap-stage">' +
        '<div class="ap-hero-text">' + heroText + '</div>' +
        (subtitle ? '<div class="ap-hero-sub">' + subtitle + '</div>' : '') +
      '</div>' +
      '<div class="ap-info">' +
        '<span class="ap-marker">' + (planning.audience || '') + '</span>' +
      '</div>' +
      (slide.sidebar ? '<div class="ap-sidebar">' + slide.sidebar + '</div>' : '') +
    '</div>';
  }

  // ============================================
  // Chapter Break：章节过渡页
  // ============================================
  apChapterBreak(slide, planning) {
    var chapterNum = (slide.chapter || '').split('：')[0] || '章节';
    return '<div class="ap-page layout-hero-stage">' +
      '<div class="ap-stage">' +
        '<span class="ap-marker">' + chapterNum + '</span>' +
        '<div class="ap-hero-text" style="margin-top:var(--a-item-gap)">' + (slide.title || '') + '</div>' +
      '</div>' +
      '<div class="ap-info"></div>' +
    '</div>';
  }

  // ============================================
  // Climax：高潮页（大数字/核心论点）
  // ============================================
  apClimax(slide, planning) {
    var sz = slide.stage_zone || {};
    var iz = slide.info_zone || {};
    var items = slide.items || [];
    var heroText = sz.hero_text || '';
    var isNumber = (sz.content_type === 'hero-number') || /^[\d.,+\-$¥€%]+/.test(heroText);

    // 如果没有 stage_zone，从 items 提取
    if (!heroText && items.length > 0) {
      var extracted = this.extractNumber(items[0]);
      heroText = extracted.num || items[0];
      isNumber = !!extracted.num;
    }

    var secondaryHtml = '';
    var secondaryItems = items.slice(heroText ? 0 : 1);
    if (sz.hero_text) secondaryItems = items; // stage_zone 有值时 items 全部是辅助
    if (secondaryItems.length > 0) {
      secondaryHtml = '<div class="ap-info bento">';
      for (var i = 0; i < secondaryItems.length; i++) {
        var num = this.extractNumber(secondaryItems[i]);
        secondaryHtml += '<div class="ap-card">' +
          (num.num ? '<span class="ap-card-value">' + num.num + '</span>' : '') +
          (num.label ? '<span class="ap-card-label">' + num.label + '</span>' : '') +
          (num.desc ? '<span class="ap-card-desc">' + num.desc + '</span>' : '') +
          (!num.num && !num.label ? '<span class="ap-card-label">' + secondaryItems[i] + '</span>' : '') +
        '</div>';
      }
      secondaryHtml += '</div>';
    }

    return '<div class="ap-page layout-hero-stage">' +
      '<div class="ap-stage">' +
        '<div class="' + (isNumber ? 'ap-hero-number' : 'ap-hero-text') + '">' + heroText + '</div>' +
        (slide.title && heroText !== slide.title ? '<div class="ap-hero-sub">' + slide.title + '</div>' : '') +
      '</div>' +
      secondaryHtml +
      (slide.insight ? '<div class="ap-insight">' + slide.insight + '</div>' : '') +
      (slide.sidebar ? '<div class="ap-sidebar">' + slide.sidebar + '</div>' : '') +
    '</div>';
  }

  // ============================================
  // Support：支撑页（数据+图表，info-dense 布局）
  // ============================================
  apSupport(slide, planning) {
    var hasChart = slide.chart && slide.chart.chart_type;
    var items = slide.items || [];
    var infoZone = slide.info_zone || {};
    var layout = infoZone.layout || (items.length >= 3 ? 'bento-grid' : 'stack');
    var isBento = layout.indexOf('bento') >= 0;

    var itemsHtml = '';
    if (isBento) {
      itemsHtml = '<div class="ap-info bento">';
    } else {
      itemsHtml = '<div class="ap-info">';
    }
    for (var i = 0; i < items.length; i++) {
      var num = this.extractNumber(items[i]);
      if (isBento) {
        itemsHtml += '<div class="ap-card">' +
          (num.num ? '<span class="ap-card-value">' + num.num + '</span>' : '') +
          '<span class="ap-card-label">' + (num.label || items[i]) + '</span>' +
          (num.desc ? '<span class="ap-card-desc">' + num.desc + '</span>' : '') +
        '</div>';
      } else {
        itemsHtml += '<div class="ap-card" style="flex-direction:row;align-items:baseline;gap:var(--a-item-gap)">' +
          (num.num ? '<span class="ap-card-value">' + num.num + '</span>' : '') +
          '<div><span class="ap-card-label">' + (num.label || items[i]) + '</span>' +
          (num.desc ? '<br><span class="ap-card-desc">' + num.desc + '</span>' : '') +
          '</div></div>';
      }
    }
    itemsHtml += '</div>';

    var chartHtml = '';
    if (hasChart) {
      chartHtml = '<div class="ap-chart"><canvas id="chart-' + slide.index + '"></canvas></div>' +
        this.renderChartScript(slide.chart, slide.index);
    }

    var gridStyle = hasChart ? 'display:grid;grid-template-columns:1fr 1.2fr;gap:var(--a-section-gap);min-height:0' : '';

    return '<div class="ap-page layout-info-dense">' +
      '<div class="ap-slide-title">' + (slide.title || '') + '</div>' +
      '<div style="' + gridStyle + '">' +
        itemsHtml +
        chartHtml +
      '</div>' +
      (slide.insight ? '<div class="ap-insight">' + slide.insight + '</div>' : '') +
      (slide.sidebar ? '<div class="ap-sidebar">' + slide.sidebar + '</div>' : '') +
    '</div>';
  }

  // ============================================
  // Insight：金句页（hero-stage 纯文字）
  // ============================================
  apInsight(slide, planning) {
    var stageText = (slide.stage_zone && slide.stage_zone.hero_text) || slide.title || '';
    var source = (slide.items && slide.items[0]) || '';
    return '<div class="ap-page layout-hero-stage">' +
      '<div class="ap-stage">' +
        '<blockquote class="ap-hero-text" style="border:none;padding:0;max-width:14ch">' + stageText + '</blockquote>' +
        (source ? '<cite style="font-size:var(--a-body);color:var(--text-2);font-style:normal;margin-top:var(--a-item-gap)">' + source + '</cite>' : '') +
      '</div>' +
      '<div class="ap-info"></div>' +
    '</div>';
  }

  // ============================================
  // Comparison：对比页（split-equal 布局）
  // ============================================
  apComparison(slide, planning) {
    var items = slide.items || [];
    var mid = Math.ceil(items.length / 2);
    var leftItems = items.slice(0, mid);
    var rightItems = items.slice(mid);
    var leftLabel = (slide.info_zone && slide.info_zone.left_label) || '传统方案';
    var rightLabel = (slide.info_zone && slide.info_zone.right_label) || '我们的方案';

    var leftHtml = '<div style="display:grid;gap:var(--a-item-gap);align-content:start">' +
      '<span class="ap-marker">' + leftLabel + '</span>';
    for (var i = 0; i < leftItems.length; i++) {
      leftHtml += '<div class="ap-card">' +
        '<span class="ap-card-label">' + leftItems[i] + '</span></div>';
    }
    leftHtml += '</div>';

    var rightHtml = '<div style="display:grid;gap:var(--a-item-gap);align-content:start">' +
      '<span class="ap-marker" style="color:var(--accent)">' + rightLabel + '</span>';
    for (var j = 0; j < rightItems.length; j++) {
      rightHtml += '<div class="ap-card" style="border-left:3px solid var(--accent)">' +
        '<span class="ap-card-label">' + rightItems[j] + '</span></div>';
    }
    rightHtml += '</div>';

    return '<div class="ap-page layout-info-dense">' +
      '<div class="ap-slide-title">' + (slide.title || '') + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--a-section-gap)">' +
        leftHtml + rightHtml +
      '</div>' +
      (slide.insight ? '<div class="ap-insight">' + slide.insight + '</div>' : '') +
    '</div>';
  }

  // ============================================
  // Closing：结尾页
  // ============================================
  apClosing(slide, planning) {
    var stageText = (slide.stage_zone && slide.stage_zone.hero_text) || slide.title || '';
    var items = slide.items || [];

    var pointsHtml = '';
    if (items.length > 0) {
      pointsHtml = '<div class="ap-info">';
      for (var i = 0; i < items.length; i++) {
        pointsHtml += '<div style="font-size:var(--a-body);color:var(--text-2);padding-top:var(--a-item-gap);border-top:var(--border-w) solid var(--divider)">' + items[i] + '</div>';
      }
      pointsHtml += '</div>';
    }

    return '<div class="ap-page layout-hero-stage">' +
      '<div class="ap-stage">' +
        '<div class="ap-hero-text">' + stageText + '</div>' +
      '</div>' +
      pointsHtml +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end">' +
        '<span class="ap-marker">' + (planning.title || '') + '</span>' +
        (slide.insight ? '<span style="font-size:var(--a-caption);color:var(--accent)">' + slide.insight + '</span>' : '') +
      '</div>' +
    '</div>';
  }
}

// ============================================
// 注册
// ============================================
function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

window.ApertureRendererSkill = ApertureRendererSkill;
if (window.PresentaSkills) {
  window.PresentaSkills.register('aperture_renderer', ApertureRendererSkill);
}
