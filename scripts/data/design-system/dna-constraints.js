(function() {
  'use strict';

  window.DNAConstraints = {
    version: '1.2.0',
    rules: {
      T2: { name: 'Heading-to-body ratio', min: 2.5, editorial_min: 3.5 },
      T4: { name: 'Weight contrast', min_span: 400 },
      T5: { name: 'Body line-height', min: 1.4, max: 1.6 },
      T6: { name: 'Letter-spacing', display_min: -0.03, display_max: -0.01, label_min: 0.04, label_max: 0.08 },
      C1: { name: 'Neutral dominance', neutral_min: 0.70, accent_max: 0.15 },
      C5: { name: 'Body text contrast', min_ratio: 7.0 },
      L1: { name: 'Single focal point', max: 1 },
      L2: { name: 'Whitespace minimum', creative: 0.40, classical: 0.50 },
      S2: { name: 'Border-radius values', max_distinct: 2 },
      S3: { name: 'Shadow styles', max_distinct: 1, preferred: 0 },
      I9: { name: 'Binary image scale', full_bleed_min: 0.85, ultra_small_max: 0.12 },
      I13: { name: 'Binary type-image relation', integration_min_type_px: 96, integration_min_contrast: 7.0 }
    },

    validate: function(tokens) {
      var results = [];
      var r = this.rules;

      if (tokens.h_b_ratio !== undefined) {
        results.push({ rule: 'T2', pass: tokens.h_b_ratio >= r.T2.min, measured: tokens.h_b_ratio, target: '>=' + r.T2.min });
      }
      if (tokens.weight_span !== undefined) {
        results.push({ rule: 'T4', pass: tokens.weight_span >= r.T4.min_span, measured: tokens.weight_span, target: '>=' + r.T4.min_span });
      }
      if (tokens.body_line_height !== undefined) {
        results.push({ rule: 'T5', pass: tokens.body_line_height >= r.T5.min && tokens.body_line_height <= r.T5.max, measured: tokens.body_line_height, target: r.T5.min + '-' + r.T5.max });
      }
      return results;
    }
  };
})();
