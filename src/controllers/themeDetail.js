define([

  'jquery',
  'App.collections.Theme',
  'App.views.ThemeDetail',

], function($, ThemeCollection, ThemeDetailView) {

  'use strict';

  var controller = function(id) {

    var $content = $('#content');
    var themes = new ThemeCollection();

    themes.fetch({
      success: function(themes) {
        var view = new ThemeDetailView({theme: themes.findWhere({id: id})});
        $content.html(view.el);
      },
      error: function(error) {
        console.error(error);
        $content.html("Désolé, une erreur est survenue.");
      }
    });
  };

  return controller;

});
