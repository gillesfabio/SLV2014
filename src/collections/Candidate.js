define([

  'underscore',
  'App.config',
  'App.models.Candidate',
  'backbone'

], function(_, config, CandidateModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model : CandidateModel,
    url   : config.data.candidates,

    parse: function(res) {
      return res.candidates;
    }
  });
});
