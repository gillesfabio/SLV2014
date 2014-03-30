define([

  'underscore',
  'backbone',
  'App.config',
  'App.models.OfficeResult'

], function(
  _,
  Backbone,
  config,
  OfficeResultModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : OfficeResultModel,
    url   : config.data.officesResults,

    comparator: function(model) {
      return parseInt(model.get('office').number, 10);
    },

    findByRound: function(round) {
      return new this.constructor(this.where({round: round}));
    },

    getCandidateTopFlopStats: function() {
      var first = this.first();
      if (!first) return;
      var candidates = _.map(first.get('candidates'), function(m) { return m.candidate.id; });
      var stats = {};
      candidates.forEach(function(c) {
        stats[c] = {
          candidate: null,
          max: {
            office     : null,
            percentage : 0,
            count      : 0
          },
          min: {
            office     : null,
            percentage : 0,
            count      : 0
          }
        };
        this.each(function(model) {
          var office = model.get('office');
          _.each(model.get('candidates'), function(o) {
            if (o.candidate.id === c) {
              stats[c].candidate = o.candidate;
              if (stats[c].max.percentage === 0) {
                stats[c].max.office     = office;
                stats[c].max.percentage = o.percentage;
                stats[c].max.count      = o.count;
              }
              if (stats[c].min.percentage === 0) {
                stats[c].min.office     = office;
                stats[c].min.percentage = o.percentage;
                stats[c].min.count      = o.count;
              }
              if (o.percentage >= stats[c].max.percentage) {
                stats[c].max.office     = office;
                stats[c].max.percentage = o.percentage;
                stats[c].max.count      = o.count;
              }
              if (o.percentage <= stats[c].min.percentage) {
                stats[c].min.office     = office;
                stats[c].min.percentage = o.percentage;
                stats[c].min.count      = o.count;
              }
            }
          });
        });
      }, this);
      return _.values(stats);
    },

    bestOrWorstCandidateScore: function(type, candidate) {
      type = type || 'best';
      if (!_.contains(['best', 'worst'], type)) throw new Error('You must choose "best" or "worse" for type argument');
      var scores = [];
      var best;
      this.each(function(model) {
        _.each(model.get('candidates'), function(candidate) {
          scores.push({
            office    : model.get('office').number,
            candidate : candidate.candidate.id,
            count     : candidate.count
          });
        });
      });
      best = _.chain(scores)
        .sortBy(function(m) { return (type === 'best') ? -m.count : m.count; })
        .filter(function(m) { return m.candidate === candidate; })
        .first()
        .value();
      return this.find(function(m) {
        return m.get('office').number === best.office;
      });
    }
  });
});
