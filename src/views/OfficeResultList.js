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
        results: new OfficeResultCollection()
      }, options);

      this.results  = this.options.results;
      this.template = Handlebars.compile(template);

      this.listenTo(this.results, 'sync', this.render);
      this.results.fetch();
    },

    getTemplateContext: function() {
      return {
        config  : config,
        results : {
          r1: this.results.findByRound(1).toJSON(),
          r2: this.results.findByRound(2).toJSON()
        }
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
