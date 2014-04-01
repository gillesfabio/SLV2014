define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Office',
  'App.config',
  'text!src/templates/office-list.hbs'

], function(Backbone, _, Handlebars, OfficeCollection, config, template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'office-list',

    initialize: function(options) {
      this.options = _.extend({
        offices: new OfficeCollection()
      }, options);

      this.offices  = this.options.offices;
      this.template = Handlebars.compile(template);

      this.listenTo(this.offices, 'sync', this.render);
      this.offices.fetch();
    },

    getTemplateContext: function() {
      return {
        config  : config,
        offices : this.offices.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
