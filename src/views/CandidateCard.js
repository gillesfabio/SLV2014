define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Candidate',
  'App.config',
  'text!src/templates/candidate-card.hbs'

], function(Backbone, _, Handlebars, CandidateModel, config, template) {

  'use strict';

  return Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-card',

    initialize: function(options) {
      this.options = _.extend({
        candidate      : new CandidateModel(),
        showDetailLink : false
      }, options);

      this.candidate      = this.options.candidate;
      this.showDetailLink = this.options.showDetailLink;
      this.template       = Handlebars.compile(template);

      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        config         : config,
        candidate      : this.candidate.toJSON(),
        showDetailLink : this.showDetailLink
      }));
    }
  });
});
