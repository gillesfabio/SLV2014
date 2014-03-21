define([

  'App.config',
  'App.models.RunningMate',
  'backbone'

], function(config, RunningMateModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model: RunningMateModel,
    url: config.dataURL,

    parse: function(res) {
      return res.runningMates;
    },

    findByCandidate: function(id) {
      var models = this.filter(function(model) {
        return model.get('candidate').id === id;
      });
      return new this.constructor(models);
    }
  });
});
