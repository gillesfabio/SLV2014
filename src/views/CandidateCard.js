define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Candidate',
  'text!templates/candidate-card.hbs'

], function(Backbone, _, Handlebars, CandidateModel, template) {

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
        candidate      : this.candidate.toJSON(),
        showDetailLink : this.showDetailLink
      }));
    }
  });
});
