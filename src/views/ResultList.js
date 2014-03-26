define([

  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Result',
  'App.config',
  'text!src/templates/result-list.hbs'

], function(
  $,
  Backbone,
  _,
  Handlebars,
  ResultCollection,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'result-list',

    initialize: function(options) {

      this.options = _.extend({
        round   : 1,
        results : new ResultCollection()
      }, options);

      this.round    = this.options.round;
      this.results  = this.options.results;
      this.template = Handlebars.compile(template);

      this.listenTo(this.results, 'sync', this.render);
      this.results.fetch();
    },

    getTemplateContext: function() {
      var results = this.results.findByRound(this.round);
      if (results) results.sortCandidatesByResult();
      return {
        config    : config,
        results   : results ? results.toJSON() : null
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
