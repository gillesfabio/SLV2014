define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.List',
  'App.models.Candidate',
  'App.config',
  'text!src/templates/list.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  ListCollection,
  CandidateModel,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'list',

    initialize: function(options) {

      this.options = _.extend({
        lists     : new ListCollection(),
        candidate : new CandidateModel()
      }, options);

      this.candidate = this.options.candidate;
      this.lists     = this.options.lists;
      this.template  = Handlebars.compile(template);

      this.listenTo(this.lists, 'sync', this.render);
      this.lists.fetch();
    },

    getTemplateContext: function() {
      var people = this.lists.findByCandidate(this.candidate.get('id'));
      return {
        config : config,
        people : people.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
