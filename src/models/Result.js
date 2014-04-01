define(['backbone'], function(Backbone) {

  'use strict';

  return Backbone.Model.extend({

    sortCandidatesByResult: function() {
      if (!this.collection) return;
      var round         = parseInt(this.get('round'), 10);
      var candidates    = this.get('candidates');
      var sort          = function(c) { return -c.percentage; };
      var round1Done    = this.collection.isRound1Done();
      var hasRound2     = this.collection.hasRound2();
      var round2NotDone = !this.collection.isRound2Done();

      if (round === 2 && round1Done && hasRound2 && round2NotDone) {
        var sorted = _.sortBy(this.collection.findWhere({round: 1}).get('candidates'), sort);
        candidates = _.map(sorted, function(c) {
          return _.find(candidates, function(o) {
            if (o.candidate.id === c.candidate.id) return true;
          });
        });
        candidates = _.filter(candidates, function(c) { if (c) return true; });
        this.set('candidates', candidates);
        return this;
      }

      candidates = _.sortBy(candidates, sort);
      this.set('candidates', candidates);
      return this;
    }
  });
});
