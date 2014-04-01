define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Candidate',
  'App.collections.Program',
  'App.views.CandidateCard',
  'App.config',
  'text!src/templates/candidate-detail-program.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  CandidateModel,
  ProgramCollection,
  CandidateCardView,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-detail',

    initialize: function(options) {
      this.options = _.extend({
        candidate : new CandidateModel(),
        programs  : new ProgramCollection()
      }, options);

      this.candidate = this.options.candidate;
      this.programs  = this.options.programs;
      this.template  = Handlebars.compile(template);

      this.setSubviews();

      this.listenTo(this.programs, 'sync', this.render);
      this.programs.fetch();
    },

    setSubviews: function() {
      this.candidateCardView = new CandidateCardView({
        candidate      : this.candidate,
        showDetailLink : false
      });
    },

    getTemplateContext: function() {
      return {
        config    : config,
        candidate : this.candidate.toJSON(),
        projects  : this.programs.candidateProjects(this.candidate.get('id'))
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
      this.$el.find('.candidate-detail-card').html(this.candidateCardView.el);
    }
  });
});
