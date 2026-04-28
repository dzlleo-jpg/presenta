/**
 * =============================================
 * Presenta - Aperture Design Tokens (JS Runtime)
 * 从 aperture/aperture.tokens.json v0.5 提取的关键 token
 * =============================================
 */
(function() {
  'use strict';

  window.ApertureTokens = {

    version: '0.5.0',

    // ── 子调色系统 ──
    subsystems: {
      default_deep: {
        mode: 'dark',
        bg_primary: '#0A0A0A',
        bg_secondary: '#131313',
        text_primary: '#FAFAFA',
        text_secondary: '#6E6F73',
        accent: '#B87333',
        border: '#1F1F1F'
      },
      deep_petrol: {
        mode: 'dark',
        bg_primary: '#0B1215',
        bg_secondary: '#111D22',
        text_primary: '#F0F0F0',
        text_secondary: '#6B7C85',
        accent: '#2A9D8F',
        border: '#1A2A30'
      },
      light_paper: {
        mode: 'light',
        bg_primary: '#F5F1E8',
        bg_secondary: '#FAF7F0',
        text_primary: '#1A1A1A',
        text_secondary: '#6B6560',
        accent: '#8B5E3C',
        border: '#DDD5C8'
      },
      color_block: {
        mode: 'dark',
        bg_primary: '#0A0A0A',
        bg_secondary: '#B87333',
        text_primary: '#FAFAFA',
        text_secondary: '#6E6F73',
        accent: '#B87333',
        border: '#1F1F1F'
      },
      japanese_editorial: {
        mode: 'light',
        bg_primary: '#F4EFDE',
        bg_secondary: '#FAF7EB',
        text_primary: '#1A1A1A',
        text_secondary: '#6B5E4F',
        accent: '#C62828',
        border: '#D4C8B5'
      },
      data_palette: {
        mode: 'dark',
        bg_primary: '#0A0A0A',
        bg_secondary: '#131313',
        text_primary: '#FAFAFA',
        text_secondary: '#6E6F73',
        accent: '#4ECDC4',
        border: '#1F1F1F'
      }
    },

    // ── 字体系统 ──
    fonts: {
      primary: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
      cjk: '"PingFang SC", "Source Han Sans CN", "Noto Sans CJK SC", system-ui, sans-serif',
      production_annotation: '/* production: replace with Geist or Soehne */'
    },

    // ── 字重对 ──
    weights: {
      latin: { light: 200, bold: 500 },
      cjk: { light: 100, bold: 400 }
    },

    // ── 间距（8pt grid）──
    spacing: {
      unit: 8,
      page_padding: 48,
      section_gap: 32,
      item_gap: 16,
      bento_gap: 8
    },

    // ── 字号系统（PPT 投影，最小 14px）──
    type_scale: {
      hero_stage: { min: 96, max: 140 },
      hero_info: { min: 36, max: 56 },
      h2: { min: 24, max: 32 },
      body: 15,
      caption: 11,
      section_marker: 9,
      min_projection: 14
    },

    // ── 字间距 ──
    letter_spacing: {
      hero_latin: '-0.02em',
      hero_cjk: '-0.06em',
      caption: '0.16em',
      data_label: '0.04em'
    },

    // ── 行高 ──
    line_height: {
      hero_latin: 0.92,
      hero_cjk: 1.05,
      body_latin: 1.6,
      body_cjk: 1.75,
      caption: 1.4
    },

    // ── 圆角 ──
    radius: {
      stage: 0,
      info: 4
    },

    // ── 边框 ──
    border_width: 0.5,

    // ── Variance Dial 映射 ──
    variance_dial: {
      1: { label: 'Editorial', stage_whitespace: 0.70, info_whitespace: 0.50, signature_max: 0.10 },
      2: { label: 'Default',   stage_whitespace: 0.60, info_whitespace: 0.40, signature_max: 0.30 },
      3: { label: 'Audacious', stage_whitespace: 0.55, info_whitespace: 0.35, signature_max: 0.50 }
    },

    // ── Mood → Subsystem 映射（wizard 用）──
    mood_to_subsystem: {
      'tech-dark-mode': 'default_deep',
      'editorial-swiss': 'light_paper',
      'minimal-architectural': 'light_paper',
      'magazine-big-type': 'default_deep',
      'luxury-editorial': 'japanese_editorial',
      'moodboard-collage': 'light_paper'
    }
  };

  // 注册到技能系统
  if (window.PresentaSkills) {
    window.PresentaSkills.register('aperture-tokens', window.ApertureTokens);
  }

})();
