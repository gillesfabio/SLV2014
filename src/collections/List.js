define([

  'backbone',
  'App.config',
  'App.models.List'

], function(Backbone, config, ListModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : ListModel,
    url   : config.data.lists,

    findByCandidate: function(id) {
      var models = this.filter(function(model) {
        return model.get('candidate').id === id;
      });
      return new this.constructor(models);
    },

    findByRound: function(round) {
      var models = this.where({round: round});
      if (models) return new this.constructor(models);
    },

    hasMerged: function() {
      if (this.findByRound(2).length > 0) return true;
      return false;
    },

    initial: function() {
      return this.findByRound(1);
    },

    merged: function() {
      return this.findByRound(2);
    }
  });
});
