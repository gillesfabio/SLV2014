define([

  'jquery',
  'App.views.OfficeList',
  'App.collections.Office'

], function($, OfficeListView, OfficeCollection) {

  'use strict';

  var controller = function() {
    var view = new OfficeListView({
      offices: new OfficeCollection()
    });
    $('#content').html(view.el);
  };

  return controller;

});
