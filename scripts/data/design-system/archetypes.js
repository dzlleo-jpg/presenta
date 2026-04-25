(function() {
  'use strict';

  // Meridian Design System — shared font stacks
  const MERIDIAN_FONTS = {
    heading: { stack: '"Archivo", "Noto Serif SC", "PingFang SC", "Songti SC", "Helvetica Neue", system-ui, sans-serif', category: 'geometric-grotesk' },
    body:    { stack: '"Inter Tight", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", system-ui, sans-serif', category: 'utilitarian-sans' },
    mono:    { stack: '"IBM Plex Mono", "Noto Sans SC", ui-monospace, monospace' }
  };

  window.DesignArchetypes = {

    'editorial-swiss': {
      name: '瑞士编辑风',
      name_en: 'Editorial Swiss',
      pick_when: ['investor decks', 'B2B SaaS', 'consulting', 'financial reports'],
      signature: '大数字 + 几何标题 + 细线分隔',
      tonality: ['precise', 'authoritative', 'restrained', 'credible'],
      color: {
        neutral: { bg: '#F5F4F0', surface: '#FAF9F6', text: '#0E1013', text_muted: '#5A6069', hairline: '#D8DADC' },
        accent: { primary: '#0E1013', secondary: '#C9FF3B' },
        temperature: 'cool',
        mode: 'light'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 112, weight: 300, line_height: 0.95, tracking: -0.035 },
          h1: { size_px: 88, weight: 300, line_height: 0.95, tracking: -0.035 },
          h2: { size_px: 56, weight: 300, line_height: 1.0, tracking: -0.025 },
          body: { size_px: 15, weight: 400, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.12, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 48 },
      radius: 0,
      accent_devices: ['giant-number', 'page-label-header', 'hairline-divider'],
      imagery_script: {
        primary_language: 'architectural-photography',
        tonal_treatment: 'bw',
        aspect_ratios: ['16:9', '1:1'],
        coverage_target: '35-45%',
        scale_policy: { hero: 'full-bleed', supporting: 'ultra-small' },
        type_image_relation: 'separation',
        prompt_template: 'editorial B&W architectural photograph, single subject, negative space, natural light, high contrast, magazine-quality'
      }
    },

    'magazine-big-type': {
      name: '杂志大字风',
      name_en: 'Magazine Big-Type',
      pick_when: ['brand launches', 'creative pitches', 'cultural products'],
      signature: '超大标题溢出画布',
      tonality: ['bold', 'expressive', 'cultural', 'confident'],
      color: {
        neutral: { bg: '#F5F4F0', surface: '#ECEDEE', text: '#0E1013', text_muted: '#5A6069', hairline: '#D8DADC' },
        accent: { primary: '#E5523C', secondary: null },
        temperature: 'warm',
        mode: 'light'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 160, weight: 600, line_height: 0.85, tracking: -0.03 },
          h1: { size_px: 88, weight: 500, line_height: 0.95, tracking: -0.03 },
          h2: { size_px: 56, weight: 500, line_height: 1.0, tracking: -0.02 },
          body: { size_px: 15, weight: 400, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.12, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 48 },
      radius: 0,
      accent_devices: ['oversized-caption', 'page-label-header'],
      imagery_script: {
        primary_language: 'editorial-portrait',
        tonal_treatment: 'warm-wash',
        aspect_ratios: ['4:5', '16:9'],
        coverage_target: '50-60%',
        scale_policy: { hero: 'full-bleed' },
        type_image_relation: 'integration',
        integration_overlay: 'gradient-40',
        prompt_template: 'high-fashion editorial portrait, dramatic lighting, 4:5 composition, unified warm magazine tone, Kodak Portra film emulation'
      }
    },

    'minimal-architectural': {
      name: '极简建筑风',
      name_en: 'Minimal Architectural',
      pick_when: ['luxury', 'real estate', 'architecture', 'craft', 'hospitality'],
      signature: '超宽留白 + 单张主图',
      tonality: ['quiet', 'spacious', 'restrained', 'luxurious'],
      color: {
        neutral: { bg: '#FAF9F6', surface: '#FFFFFF', text: '#0E1013', text_muted: '#858A92', hairline: '#ECEDEE' },
        accent: { primary: '#2A2E35', secondary: null },
        temperature: 'neutral',
        mode: 'light'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 112, weight: 300, line_height: 0.95, tracking: -0.035 },
          h1: { size_px: 72, weight: 300, line_height: 1.0, tracking: -0.025 },
          h2: { size_px: 44, weight: 300, line_height: 1.1, tracking: -0.015 },
          body: { size_px: 15, weight: 300, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.12, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 64 },
      radius: 0,
      accent_devices: ['hairline-divider', 'page-label-header'],
      imagery_script: {
        primary_language: 'architectural-photography',
        tonal_treatment: 'desaturate-30',
        aspect_ratios: ['16:9', '21:9', '1:1'],
        coverage_target: '60-70%',
        scale_policy: { hero: 'full-bleed', supporting: 'ultra-small' },
        type_image_relation: 'separation',
        prompt_template: 'minimal architectural photography, single building, overcast sky, desaturated, geometric, no people, wide composition'
      }
    },

    'moodboard-collage': {
      name: '情绪拼贴风',
      name_en: 'Moodboard Collage',
      pick_when: ['fashion', 'lifestyle', 'creative portfolios', 'cultural briefs'],
      signature: '重叠图片 + 手写点缀',
      tonality: ['warm', 'tactile', 'curated', 'human'],
      color: {
        neutral: { bg: '#F5F4F0', surface: '#ECEDEE', text: '#1A1D22', text_muted: '#5A6069', hairline: '#D8DADC' },
        accent: { primary: '#E5523C', secondary: '#C9FF3B' },
        temperature: 'warm',
        mode: 'light'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 88, weight: 400, line_height: 0.95, tracking: -0.03 },
          h1: { size_px: 56, weight: 400, line_height: 1.0, tracking: -0.02 },
          h2: { size_px: 36, weight: 400, line_height: 1.1, tracking: -0.015 },
          body: { size_px: 15, weight: 400, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.12, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 48 },
      radius: 0,
      accent_devices: ['handwritten-signature', 'oversized-caption', 'page-label-header'],
      imagery_script: {
        primary_language: 'product-still-life',
        tonal_treatment: 'grain-overlay',
        aspect_ratios: ['1:1', '4:5', '3:4'],
        coverage_target: '70-80%',
        scale_policy: { hero: 'full-bleed', supporting: 'ultra-small' },
        type_image_relation: 'integration',
        integration_overlay: 'none',
        prompt_template: 'warm earth-tone moodboard: ceramic object, linen texture, unified cream-sage-rust palette, film grain, analog warmth'
      }
    },

    'luxury-editorial': {
      name: '奢品编辑风',
      name_en: 'Luxury Editorial',
      pick_when: ['premium consumer', 'beauty', 'hospitality', 'fine jewelry'],
      signature: '轻量几何体 + 静奢色板',
      tonality: ['refined', 'quiet', 'timeless', 'precious'],
      color: {
        neutral: { bg: '#F5F4F0', surface: '#FAF9F6', text: '#0E1013', text_muted: '#858A92', hairline: '#D8DADC' },
        accent: { primary: '#5A6069', secondary: '#FFB800' },
        temperature: 'warm',
        mode: 'light'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 112, weight: 300, line_height: 0.95, tracking: -0.035 },
          h1: { size_px: 72, weight: 300, line_height: 1.0, tracking: -0.025 },
          h2: { size_px: 44, weight: 300, line_height: 1.1, tracking: -0.015 },
          body: { size_px: 15, weight: 300, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.14, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 64 },
      radius: 0,
      accent_devices: ['hairline-divider', 'oversized-caption', 'page-label-header'],
      imagery_script: {
        primary_language: 'product-still-life',
        tonal_treatment: 'warm-wash',
        aspect_ratios: ['4:5', '3:4'],
        coverage_target: '45-55%',
        scale_policy: { hero: 'full-bleed', supporting: 'ultra-small' },
        type_image_relation: 'separation',
        prompt_template: 'silent luxury product photography, cashmere or leather or brass, warm natural light, shadow play, minimal styling, unpopulated'
      }
    },

    'tech-dark-mode': {
      name: '科技暗黑风',
      name_en: 'Tech Dark Mode',
      pick_when: ['AI products', 'developer tools', 'fintech', 'deep tech'],
      signature: '黑色画布 + 电光强调色 + 等宽数据',
      tonality: ['precise', 'futuristic', 'confident', 'systems-thinking'],
      color: {
        neutral: { bg: '#0E1013', surface: '#1A1D22', text: '#F5F4F0', text_muted: '#858A92', hairline: '#2A2E35' },
        accent: { primary: '#C9FF3B', secondary: '#FFB800' },
        temperature: 'cool',
        mode: 'dark'
      },
      typography: {
        families: {
          heading: MERIDIAN_FONTS.heading,
          body: MERIDIAN_FONTS.body,
          mono: MERIDIAN_FONTS.mono
        },
        scale: {
          display: { size_px: 112, weight: 300, line_height: 0.95, tracking: -0.035 },
          h1: { size_px: 88, weight: 300, line_height: 0.95, tracking: -0.03 },
          h2: { size_px: 56, weight: 400, line_height: 1.0, tracking: -0.02 },
          body: { size_px: 15, weight: 300, line_height: 1.6, tracking: 0 },
          label: { size_px: 11, weight: 400, line_height: 1.0, tracking: 0.12, uppercase: true }
        }
      },
      grid: { columns: 12, gutter: 24, margin: 48 },
      radius: 0,
      accent_devices: ['giant-number', 'page-label-header', 'hairline-divider'],
      imagery_script: {
        primary_language: 'abstract-texture',
        tonal_treatment: 'cool-wash',
        aspect_ratios: ['16:9', '21:9'],
        coverage_target: '40-50%',
        scale_policy: { hero: 'full-bleed', supporting: 'ultra-small' },
        type_image_relation: 'separation',
        prompt_template: 'abstract 3D render, dark void background, single glowing geometric form, cinematic volumetric light, tech minimalism, lime-green emission'
      }
    }
  };

  if (window.PresentaSkills) {
    window.PresentaSkills.register('design-archetypes', window.DesignArchetypes);
  }
})();
