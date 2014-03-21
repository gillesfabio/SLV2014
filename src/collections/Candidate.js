define([

  'App.config',
  'App.models.Candidate',
  'backbone'

], function(config, CandidateModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model : CandidateModel,
    url   : config.dataUrl,

    parse: function(res) {
      return res.candidates;
    },

    hasRound2: function() {
      return !this.some(function(model) {
        if (model.get('scoreRound1')) return model.get('scoreRound1') > 50;
      });
    },

    round2: function() {
      if (!this.hasRound2()) return new this.constructor();
      var prop = 'scoreRound2';
      var models = this.chain().filter(function(model) {
        return model.get(prop);
      }).sortBy(function(model) {
        return model.get(prop);
      }).value().reverse();
      if (models.length >= 2) models = models.slice(0, 2);
      return new this.constructor(models);
    },

    elected: function() {
      if (!this.hasRound2()) return this.max(function(model) {
        return model.get('scoreRound1');
      });
      if (this.hasRound2()) return this.max(function(model) {
        return model.get('scoreRound2');
      });
    }
  });
});
