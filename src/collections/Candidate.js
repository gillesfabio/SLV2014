define([

  'App.config',
  'App.models.Candidate',
  'backbone'

], function(config, CandidateModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model: CandidateModel,
    url: config.dataUrl,

    parse: function(res) {
      return res.candidates;
    },

    hasRound2: function() {
      return this.filter(function(model) {
        if (model.get('scoreRound1')) return model.get('scoreRound1') > 50;
      }).length > 0;
    },

    round2: function() {
      if (!this.hasRound2()) return;
      var prop = 'scoreRound2';
      var models = this.chain().filter(function(model) {
        return model.get(prop);
      }).sortBy(function(model) {
        return model.get(prop);
      }).value().reverse();
      if (models.length >= 2) models = models.slice(0, 2);
      return new this.constructor(models);
    }
  });
});
