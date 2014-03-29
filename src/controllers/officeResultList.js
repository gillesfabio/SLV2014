define([

  'jquery',
  'App.views.OfficeResultList',
  'App.collections.Office'

], function($, OfficeResultListView, OfficeCollection) {

  'use strict';

  var controller = function() {
    var view = new OfficeResultListView({
      offices: new OfficeCollection()
    });
    $('#content').html(view.el);
  };

  return controller;

});
