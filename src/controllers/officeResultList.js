define([

  'jquery',
  'underscore',
  'App.views.OfficeResultList',
  'App.collections.OfficeResult',
  'App.config'

], function(
  $,
  _,
  OfficeResultListView,
  OfficeResultCollection,
  config) {

  'use strict';

  var controller = function(round) {
    round = parseInt(round, 10);
    var $content = $('#content');
    var exists = _.contains([1, 2], round);
    if (!exists) return $content.html("Désolé, cette page n'existe pas.");
    var view = new OfficeResultListView({
      config  : config,
      round   : round,
      results : new OfficeResultCollection()
    });
    $content.html(view.el);
  };

  return controller;

});
