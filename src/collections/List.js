define([

  'underscore',
  'backbone',
  'App.config',
  'App.models.List'

], function(_, Backbone, config, ListModel) {

  'use strict';

  return Backbone.Collection.extend({

    model      : ListModel,
    url        : config.data.lists,
    comparator : 'position',

    findByCandidate: function(candidate) {
      return new this.constructor(this.filter(function(m) { return m.get('candidate').id === candidate; }));
    },

    mergeDiff: function() {
      var filter = function(r, m) { return m.get('round') === r; };
      var r1 = this.filter(filter.bind(null, 1));
      var r2 = this.filter(filter.bind(null, 2));
      r1 = r1.map(function(m) { return m.get('name'); });
      r2 = r2.map(function(m) { return m.get('name'); });
      return _.difference(r2, r1);
    },

    hasMerged: function() {
      if (this.mergeDiff().length) return true;
      return false;
    },

    initial: function() {
      return new this.constructor(this.where({round: 1}));
    },

    merged: function() {
      if (!this.hasMerged) return;
      return new this.constructor(this.where({round: 2}));
    }
  });
});
