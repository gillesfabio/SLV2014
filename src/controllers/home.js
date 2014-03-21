define([

  'jquery',
  'App.views.Home'

], function($, HomeView) {

  'use strict';

  var controller = function() {
    var view = new HomeView();
    $('#content').html(view.el);
  };

  return controller;

});
