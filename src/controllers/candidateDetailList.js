define([

  'jquery',
  'App.collections.Candidate',
  'App.collections.List',
  'App.views.CandidateDetailList',

], function(
  $,
  CandidateCollection,
  ListCollection,
  CandidateDetailListView) {

  'use strict';

  var controller = function(id) {

    var $content = $('#content');
    var candidates = new CandidateCollection();

    candidates.fetch({
      success: function(candidates) {
        var view  = new CandidateDetailListView({
          candidate : candidates.findWhere({id: id}),
          lists     : new ListCollection()
        });
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
