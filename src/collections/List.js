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
    }
  });
});
