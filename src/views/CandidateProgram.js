define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Program',
  'App.models.Candidate',
  'text!templates/candidate-program.hbs'

], function(Backbone, _, Handlebars, ProgramCollection, CandidateModel, template) {

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

    render: function() {
      this.$el.html(this.template({
        candidate : this.candidate.toJSON(),
        projects  : this.programs.candidateProjects(this.candidate.get('id'))
      }));
    }
  });
});
