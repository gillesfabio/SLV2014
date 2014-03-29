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
      return model.get('office').number;
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
