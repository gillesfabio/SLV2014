define([

  'backbone',
  'App.config',
  'App.models.Theme'

], function(Backbone, config, ThemeModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : ThemeModel,
    url   : config.data.themes

  });
});
