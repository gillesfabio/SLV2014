define([

  'App.config',
  'App.models.Theme',
  'backbone'

], function(config, ThemeModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model: ThemeModel,
    url: config.dataURL,

    parse: function(res) {
      return res.themes;
    }
  });
});