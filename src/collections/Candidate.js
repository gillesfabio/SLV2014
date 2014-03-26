define([

  'underscore',
  'backbone',
  'App.config',
  'App.models.Candidate'

], function(_, Backbone, config, CandidateModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : CandidateModel,
    url   : config.data.candidates

  });
});
