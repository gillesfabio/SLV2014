define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Theme',
  'App.config',
  'text!src/templates/theme-list.hbs'

], function(Backbone, _, Handlebars, ThemeCollection, config, template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'theme-list',

    initialize: function(options) {
      this.options = _.extend({
        themes: new ThemeCollection()
      }, options);

      this.themes   = this.options.themes;
      this.template = Handlebars.compile(template);

      this.listenTo(this.themes, 'sync', this.render);
      this.themes.fetch();
    },

    getTemplateContext: function() {
      return {
        config : config,
        themes : this.themes.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
