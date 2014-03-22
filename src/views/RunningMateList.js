define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.RunningMate',
  'App.models.Candidate',
  'App.config',
  'text!src/templates/running-mate-list.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  RunningMateCollection,
  CandidateModel,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'running-mate-list',

    initialize: function(options) {
      this.options = _.extend({
        runningMates : new RunningMateCollection(),
        candidate    : new CandidateModel()
      }, options);

      this.candidate    = this.options.candidate;
      this.runningMates = this.options.runningMates;
      this.template     = Handlebars.compile(template);

      this.listenTo(this.runningMates, 'sync', this.render);
      this.runningMates.fetch();
    },

    getTemplateContext: function() {
      var runningMates = this.runningMates.findByCandidate(this.candidate.get('id'));
      return {
        config       : config,
        runningMates : runningMates.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
