define([

  'underscore',
  'App.config',
  'App.models.Candidate',
  'backbone'

], function(_, config, CandidateModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model : CandidateModel,
    url   : config.dataUrl,

    parse: function(res) {
      return res.candidates;
    },

    isRound1Done: function() {
      var models = this.filter(function(model) {
        var score = model.get('scoreRound1');
        if (score && _.isNumber(score)) return true;
      });
      return (this.size() === models.length);
    },

    isRound2Done: function() {
      if (this.isRound1Done() && this.noRound2()) return true;
      var models = this.filter(function(model) {
        var score = model.get('scoreRound2');
        if (score && _.isNumber(score)) return true;
      });
      return (models.length >= 2);
    },

    noRound2: function() {
      if (!this.isRound1Done()) return true;
      return this.some(function(model) {
        var score = model.get('scoreRound1');
        if (score && _.isNumber(score) && score > 50) return true;
      });
    },

    hasRound2: function() {
      return !this.noRound2();
    },

    round1: function(options) {
      options = options || {shuffle: false};
      var models = this.sortBy(function(model) { return model.get('scoreRound1'); }).reverse();
      if (options.shuffle) return new this.constructor(models).shuffle();
      return new this.constructor(models);
    },

    round2: function() {
      if (!this.hasRound2()) return;
      var models = this.chain().filter(function(model) {
        var score = model.get('scoreRound1');
        if (score && _.isNumber(score) && score >= 10) return true;
      }).sortBy(function(model) {
        return model.get('scoreRound1');
      }).value().reverse();
      return new this.constructor(models);
    },

    elected: function() {
      if (!this.isRound1Done()) return;
      var model;
      var max;
      if (!this.hasRound2()) {
        max = this.max(function(model) {
          if (model.get('scoreRound1')) return model.get('scoreRound1');
        });
      } else {
        max = this.max(function(model) {
          if (model.get('scoreRound2')) return model.get('scoreRound2');
        });
      }
      if (max !== -Infinity) model = max;
      return model;
    }
  });
});
