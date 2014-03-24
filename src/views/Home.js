define([

  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'App.views.ResultList',
  'App.views.Elected',
  'App.config',
  'text!src/templates/home.hbs'

], function(
  $,
  Backbone,
  _,
  Handlebars,
  ResultListView,
  ElectedView,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName : 'div',
    id      : 'home',

    initialize: function(options) {
      this.options = _.extend({}, options);
      this.template = Handlebars.compile(template);
      this.setSubviews();
      this.render();
    },

    setSubviews: function() {
      this.round1View  = new ResultListView({round: 1});
      this.round2View  = new ResultListView({round: 2});
      this.electedView = new ElectedView();
    },

    getTemplateContext: function() {
      return {
        config: config
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
      this.$el.find('.home-results-elected').html(this.electedView.el);
      this.$el.find('.home-results-round1').html(this.round1View.el);
      this.$el.find('.home-results-round2').html(this.round2View.el);
    }
  });
});
