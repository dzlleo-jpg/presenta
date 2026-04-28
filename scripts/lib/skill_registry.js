(function() {
  'use strict';
  window.PresentaSkills = {
    _skills: {},
    register: function(name, skill) {
      this._skills[name] = skill;
    },
    get: function(name) {
      return this._skills[name] || null;
    },
    list: function() {
      return Object.keys(this._skills);
    },
    has: function(name) {
      return name in this._skills;
    }
  };
})();
