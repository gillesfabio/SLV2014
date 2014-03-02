(function($, _, Backbone, Handlebars) {

  'use strict';

  var homeTemplate = $('#home').html();
  var candidateTemplate = $('#candidate').html();

  /**
   * Home view.
   */
  var HomeView = Backbone.View.extend({

    el: $('#content'),

    initialize: function initialize() {
      this.render();
    },

    render: function render() {
      var template = Handlebars.compile(homeTemplate);
      this.$el.html(template);
    }
  });

  var CandidateView = Backbone.View.extend({

    el: $('#content'),

    initialize: function initialize() {
      this.render();
    },

    render: function render() {
      var template = Handlebars.compile(candidateTemplate);
      this.$el.html(template);
    }
  });

  /**
   * The homepage.
   */
  function home() {
    var homeView = new HomeView();
  }

  /**
   * Candidate Profile.
   */
  function candidate(slug) {
    var candidateView = new CandidateView();
  }

  /**
   * Application router.
   */
  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    }
  });

  // Foundation
  $(document).foundation();

  // DOM Ready
  $(function() {
    var router = new Router();
    router.on('route:home', home);
    router.on('route:candidate', candidate);
    Backbone.history.start();
  });

})(jQuery, _, Backbone, Handlebars);
