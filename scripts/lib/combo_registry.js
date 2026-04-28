/**
 * =============================================
 * Presenta - Combo Registry
 * 管理 Planner + Renderer 技能组合
 * =============================================
 */
(function() {
  'use strict';

  window.PresentaCombos = {
    _combos: {},

    register: function(name, combo) {
      this._combos[name] = combo;
    },

    get: function(name) {
      return this._combos[name] || this._combos['classic'] || null;
    },

    list: function() {
      return Object.keys(this._combos);
    },

    has: function(name) {
      return name in this._combos;
    }
  };

  // 注册 Classic 组合（包装现有技能）
  window.PresentaCombos.register('classic', {
    name: 'Classic',
    description: '6 种风格原型，经典渲染引擎',
    planner: null,
    getRenderer: function() {
      return new RendererSkill();
    }
  });

  // 注册 Aperture 组合（DNA 驱动的 Planner + Renderer）
  window.PresentaCombos.register('aperture', {
    name: 'Aperture',
    description: '静默剧场 × 精密信息 · Stage/Info 双区模型',
    planner: function() {
      var skill = window.AperturePlannerSkill;
      return skill ? skill.buildSystemPrompt() : null;
    },
    getRenderer: function() {
      return new ApertureRendererSkill();
    }
  });

})();
