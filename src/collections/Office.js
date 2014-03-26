define([

  'backbone',
  'App.config',
  'App.models.Office'

], function(Backbone, config, OfficeModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : OfficeModel,
    url   : config.data.offices

  });
});
