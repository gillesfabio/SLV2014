define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Candidate',
  'App.collections.Program',
  'App.collections.RunningMate',
  'App.views.CandidateCard',
  'App.views.CandidateProgram',
  'App.views.RunningMateList',
  'App.config',
  'text!src/templates/candidate-detail.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  CandidateModel,
  ProgramCollection,
  RunningMateCollection,
  CandidateCardView,
  CandidateProgramView,
  RunningMateListView,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-detail',

    initialize: function(options) {
      this.options = _.extend({
        candidate    : new CandidateModel(),
        programs     : new ProgramCollection(),
        runningMates : new RunningMateCollection()
      }, options);

      this.candidate    = this.options.candidate;
      this.programs     = this.options.programs;
      this.runningMates = this.options.runningMates;
      this.template     = Handlebars.compile(template);

      this.setSubviews();
      this.render();
    },

    setSubviews: function() {
      this.candidateCardView = new CandidateCardView({
        candidate      : this.candidate,
        showDetailLink : false
      });
      this.candidateProgramView = new CandidateProgramView({
        programs  : this.programs,
        candidate : this.candidate
      });
      this.runningMateListView = new RunningMateListView({
        runningMates : this.runningMates,
        candidate    : this.candidate
      });
    },

    getTemplateContext: function() {
      return {
        config    : config,
        candidate : this.candidate.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
      this.$el.find('.candidate-detail-running-mates').html(this.runningMateListView.el);
      this.$el.find('.candidate-detail-card').html(this.candidateCardView.el);
      this.$el.find('.candidate-detail-program').html(this.candidateProgramView.el);
    }
  });
});
