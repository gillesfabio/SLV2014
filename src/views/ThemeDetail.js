define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Theme',
  'App.collections.Program',
  'App.config',
  'text!src/templates/theme-detail.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  ThemeModel,
  ProgramCollection,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'theme-detail',

    initialize: function(options) {
      this.options = _.extend({
        theme    : new ThemeModel(),
        programs : new ProgramCollection()
      }, options);

      this.theme    = this.options.theme;
      this.programs = this.options.programs;
      this.template = Handlebars.compile(template);

      this.listenTo(this.programs, 'sync', this.render);
      this.programs.fetch();
    },

    render: function() {
      var programs = this.programs.findByThemeAndGroupByCandidate(this.theme.get('id'));
      this.$el.html(this.template({
        config   : config,
        theme    : this.theme.toJSON(),
        programs : programs
      }));
    }
  });
});
