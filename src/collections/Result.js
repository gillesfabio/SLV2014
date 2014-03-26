define([

  'underscore',
  'backbone',
  'App.config',
  'App.models.Result',

], function(_, Backbone, config, ResultModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : ResultModel,
    url   : config.data.results,

    findByRound: function(round) {
      return this.findWhere({round: round});
    },

    isRound1Done: function() {
      return this.isRoundDone(1);
    },

    isRound2Done: function() {
      if (this.isRound1Done() && this.noRound2()) return true;
      return this.isRoundDone(2);
    },

    hasElected: function() {
      if ((this.isRound1Done() && !this.hasRound2()) ||
          (this.isRound2Done() && this.hasRound2())) return true;
      return false;
    },

    getElected: function() {
      if (this.isRound1Done() &&
          !this.hasRound2()) return this.getMaxCandidateForRound(1);
      if (this.isRound1Done() &&
          this.hasRound2() &&
          this.isRound2Done()) return this.getMaxCandidateForRound(2);
      return;
    },

    getMaxCandidateForRound: function(round) {
      round = this.findByRound(round);
      var candidate;
      var candidates = round.get('candidates');
      var max = _.max(candidates, function(candidate) {
        if (candidate.percentage) return candidate.percentage;
      });
      if (max !== -Infinity) candidate = max;
      return candidate;
    },

    isRoundDone: function(round) {
      round = this.findByRound(round);
      if (!round) return false;
      var candidates = round.get('candidates');
      var total      = candidates.length;
      var passCount  = 0;
      candidates.forEach(function(candidate) {
        if (candidate.percentage && candidate.count) passCount += 1;
      });
      return (total === passCount);
    },

    noRound2: function() {
      if (!this.isRound1Done()) return true;
      var round = this.findByRound(1);
      var candidates = round.get('candidates');
      return _.some(candidates, function(candidate) {
        if (candidate.percentage && candidate.percentage > 50) return true;
      });
    },

    hasRound2: function() {
      return !this.noRound2();
    }
  });
});
