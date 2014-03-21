define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Candidate',
  'App.views.CandidateCard',
  'text!templates/candidate-list.hbs'

], function(Backbone, _, Handlebars, CandidateCollection, CandidateCardView, template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-list',

    initialize: function(options) {
      this.options = _.extend({
        candidates: new CandidateCollection()
      }, options);

      this.candidates = this.options.candidates;
      this.template   = Handlebars.compile(template);

      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    render: function() {
      this.$el.html(this.template());
      this.candidates = new CandidateCollection(this.candidates.shuffle());
      this.candidates.each(function(candidate) {
        var view = new CandidateCardView({
          tagName        : 'li',
          candidate      : candidate,
          showDetailLink : candidate.get('programUrl') ? true : false
        });
        this.$el.find('.candidate-list-container').append(view.el);
      }.bind(this));
    }
  });
});
