define([

  'backbone',
  'App.config',
  'App.models.Candidate'

], function(Backbone, config, CandidateModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : CandidateModel,
    url   : config.data.candidates

  });
});
