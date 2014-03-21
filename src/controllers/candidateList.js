define([

  'jquery',
  'App.views.CandidateList'

], function($, CandidateListView) {

  'use strict';

  var controller = function() {
    var view = new CandidateListView();
    $('#content').html(view.el);
  };

  return controller;

});
