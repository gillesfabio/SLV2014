define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Theme',
  'text!templates/theme-list.hbs'

], function(Backbone, _, Handlebars, ThemeCollection, template) {

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

    render: function() {
      this.$el.html(this.template(this.themes.toJSON()));
    }
  });
});
