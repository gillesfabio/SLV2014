define([

  'jquery',
  'App.views.PollingPlaceList',
  'App.collections.PollingPlace'

], function($, PollingPlaceView, PollingPlaceCollection) {

  'use strict';

  var controller =function() {
    var view = new PollingPlaceListView({
      pollingPlaces: new PollingPlaceCollection()
    });
    $('#content').html(view.el);
  };

  return controller;

});
