define([

  'jquery',
  'App.views.ThemeList',
  'App.collections.Theme'

], function($, ThemeListView, ThemeCollection) {

  'use strict';

  var controller = function() {
    var view = new ThemeListView({themes: new ThemeCollection()});
    $('#content').html(view.el);
  };

  return controller;

});
