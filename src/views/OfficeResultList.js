define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.OfficeResult',
  'App.config',
  'text!src/templates/office-result-list.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  OfficeResultCollection,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'office-result-list',

    initialize: function(options) {
      this.options = _.extend({
        round   : 1,
        results : new OfficeResultCollection()
      }, options);

      this.round    = this.options.round;
      this.results  = this.options.results;
      this.template = Handlebars.compile(template);

      this.listenTo(this.results, 'sync', this.render);
      this.results.fetch();
    },

    getTemplateContext: function() {
      var results = this.results.findByRound(this.round);
      return {
        config         : config,
        round          : this.round,
        results        : results.toJSON(),
        candidateStats : results.getCandidateTopFlopStats(),
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
