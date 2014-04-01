define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.CouncilMember',
  'App.config',
  'text!src/templates/council.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  CouncilMemberCollection,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'council',

    initialize: function(options) {
      this.options = _.extend({
        councilMembers: new CouncilMemberCollection()
      }, options);

      this.councilMembers  = this.options.councilMembers;
      this.template = Handlebars.compile(template);

      this.listenTo(this.councilMembers, 'sync', this.render);
      this.councilMembers.fetch();
    },

    getTemplateContext: function() {
      var cmMembers = this.councilMembers.groupBySeats();
      var ccMembers = this.councilMembers.cc().groupBySeats();
      return {
        config    : config,
        cmMembers : cmMembers,
        ccMembers : ccMembers
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
    }
  });
});
