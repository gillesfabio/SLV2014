define([

  'App.config',
  'App.models.PollingPlace',
  'backbone'

], function(config, PollingPlaceModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model : PollingPlaceModel,
    url   : config.data.offices,

    parse: function(res) {
      return res.pollingPlaces;
    }
  });
});
