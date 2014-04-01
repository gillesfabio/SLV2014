define([

  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Result',
  'App.config',
  'text!src/templates/elected.hbs'

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
    className : 'elected',

    initialize: function(options) {
      this.options = _.extend({
        results : new ResultCollection()
      }, options);

      this.results = this.options.results;
      this.template = Handlebars.compile(template);

      this.listenTo(this.results, 'sync', this.render);
      this.results.fetch();
    },

    getTemplateContext: function() {
      return {
        config  : config,
        elected : this.results.getElected()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
