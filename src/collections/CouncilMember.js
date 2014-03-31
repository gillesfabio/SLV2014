define([

  'backbone',
  'App.config',
  'App.models.CouncilMember'

], function(Backbone, config, CouncilMemberModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : CouncilMemberModel,
    url   : config.data.councilMembers,

    cc: function() {
      return new this.constructor(this.where({cc: true}));
    },

    groupBySeats: function() {
      var grouped = this.groupBy(function(m) { return m.get('list').name; });
      var sorted  = [];
      var obj     = {};
      Object.keys(grouped).forEach(function(key) {
        sorted.push({
          count   : grouped[key].length,
          list    : key,
          members : new this.constructor(grouped[key]).toJSON()
        });
      }, this);
      sorted = _.sortBy(sorted, function(m) { return -m.count; });
      _.each(sorted, function(m) {
        obj[m.list] = m.members;
      });
      return obj;
    }
  });
});
