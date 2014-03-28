define([

  'jquery',
  'App.collections.Candidate',
  'App.collections.Program',
  'App.views.CandidateDetailProgram'

], function(
  $,
  CandidateCollection,
  ProgramCollection,
  CandidateDetailView) {

  'use strict';

  var controller = function(id) {

    var $content = $('#content');
    var candidates = new CandidateCollection();

    candidates.fetch({
      success: function(candidates) {
        var view  = new CandidateDetailView({
          candidate : candidates.findWhere({id: id}),
          programs  : new ProgramCollection()
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
