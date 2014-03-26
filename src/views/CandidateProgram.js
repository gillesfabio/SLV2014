define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Program',
  'App.models.Candidate',
  'App.config',
  'text!src/templates/candidate-program.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  ProgramCollection,
  CandidateModel,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-program',

    initialize: function(options) {

      this.options = _.extend({
        programs  : new ProgramCollection(),
        candidate : new CandidateModel()
      }, options);

      this.programs  = this.options.programs;
      this.candidate = this.options.candidate;
      this.template  = Handlebars.compile(template);

      this.listenTo(this.programs, 'sync', this.render);
      this.programs.fetch();
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
    }
  });
});
