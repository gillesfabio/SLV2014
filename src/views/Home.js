define([

  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Candidate',
  'App.config',
  'text!src/templates/home.hbs',
  'underscore.string'

], function(
  $,
  Backbone,
  _,
  Handlebars,
  CandidateCollection,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName : 'div',
    id      : 'home',

    initialize: function(options) {
      this.options = _.extend({
        candidates: new CandidateCollection()
      }, options);

      this.candidates = this.options.candidates;
      this.template   = Handlebars.compile(template);

      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    getTemplateContext: function() {
      return {
        config           : config,
        elected          : this.candidates.elected() ? this.candidates.elected().toJSON() : null,
        candidatesRound1 : new CandidateCollection(this.candidates.shuffle()).toJSON(),
        hasRound2        : false, //this.candidates.hasRound2(),
        candidatesRound2 : this.candidates.round2() ? this.candidates.round2().toJSON() : null
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
