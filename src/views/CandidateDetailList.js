define([

  'backbone',
  'underscore',
  'handlebars',
  'App.models.Candidate',
  'App.collections.List',
  'App.views.CandidateCard',
  'App.config',
  'text!src/templates/candidate-detail-list.hbs'

], function(
  Backbone,
  _,
  Handlebars,
  CandidateModel,
  ListCollection,
  CandidateCardView,
  config,
  template) {

  'use strict';

  return Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-detail',

    initialize: function(options) {

      this.options = _.extend({
        candidate : new CandidateModel(),
        lists     : new ListCollection()
      }, options);

      this.candidate = this.options.candidate;
      this.lists     = this.options.lists;
      this.template  = Handlebars.compile(template);

      this.setSubviews();
      this.listenTo(this.lists, 'sync', this.render);
      this.lists.fetch();
    },

    setSubviews: function() {
      this.candidateCardView = new CandidateCardView({
        candidate      : this.candidate,
        showDetailLink : false
      });
    },

    getTemplateContext: function() {
      var filter  = function(m) { return m.get('candidate').id === this.candidate.id; }.bind(this);
      var list    = new ListCollection(this.lists.filter(filter));
      var initial = new ListCollection(list.initial()).toJSON();
      var merged  = new ListCollection(list.merged()).toJSON();
      return {
        config    : config,
        hasMerged : list.hasMerged(),
        initial   : _.rest(initial, 1),
        merged    : _.rest(merged, 1),
        candidate : this.candidate.toJSON()
      };
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateContext()));
      this.$el.find('.candidate-detail-card').html(this.candidateCardView.el);
    }
  });
});
