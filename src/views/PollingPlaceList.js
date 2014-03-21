define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.PollingPlace',
  'App.config',
  'text!src/templates/polling-place-list.hbs'

], function(Backbone, _, Handlebars, PollingPlaceCollection, config, template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'polling-place-list',

    initialize: function(options) {
      this.options = _.extend({
        pollingPlaces: new PollingPlaceCollection()
      }, options);

      this.pollingPlaces = this.options.pollingPlaces;
      this.template      = Handlebars.compile(template);

      this.listenTo(this.pollingPlaces, 'sync', this.render);
      this.pollingPlaces.fetch();
    },

    render: function() {
      this.$el.html(this.template({
        config        : config,
        pollingPlaces : this.pollingPlaces.toJSON()
      }));
    }
  });
});
