define([

  'backbone',
  'underscore',
  'handlebars',
  'App.collections.Candidate',
  'countdown',
  'text!templates/home.hbs',
  'underscore.string'

], function(Backbone, _, Handlebars, CandidateCollection, countdown, template) {

  'use strict';

  return Backbone.View.extend({

    tagName : 'div',
    id      : 'home',

    initialize: function(options) {
      this.options = _.extend({
        candidates: new CandidateCollection()
      }, options);

      this.candidates = this.options.candidates;
      this.template   = Handlebars.compile(template);
      this.tsRound1   = null;
      this.tsRound2   = null;

      this.dates = {
        round1: new Date(2014, 2, 23),
        round2: new Date(2014, 2, 30)
      };

      this.clearTimers();

      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    clearTimers: function() {
      window.clearInterval(this.tsRound1);
      window.clearInterval(this.tsRound2);
    },

    renderTimers: function() {
      this.tsRound1 = countdown(this.dates.round1, function(ts) {
        this.renderCountDown(ts, 'round1');
      }.bind(this));

      this.tsRound2 = countdown(this.dates.round2, function(ts) {
        this.renderCountDown(ts, 'round2');
      }.bind(this));
    },

    renderCountDown: function(ts, round) {
      var output = [];
      var units = {
        'days'    : 'jour',
        'hours'   : 'heure',
        'minutes' : 'minute'
      };
      Object.keys(units).forEach(function(key) {
        var word = units[key];
        if (ts[key]) {
          word = (ts[key] > 1) ? word + 's' : word;
          output.push(_.str.sprintf('%d %s', ts[key], word));
        }
      }.bind(this));
      this.$el.find(_.str.sprintf('.countdown-%s', round)).html(output.join(', '));
    },

    render: function() {
      var elected, candidatesRound2;
      elected          = this.candidates.findWhere({elected: true});
      elected          = elected ? elected.toJSON() : null;
      candidatesRound2 = this.candidates.round2();
      candidatesRound2 = candidatesRound2 ? candidatesRound2.toJSON() : null;

      this.$el.html(this.template({
        elected          : elected,
        candidatesRound1 : new CandidateCollection(this.candidates.shuffle()).toJSON(),
        hasRound2        : this.candidates.hasRound2(),
        candidatesRound2 : candidatesRound2
      }));

      this.renderTimers();
    }
  });
});
