(function($, _, Backbone, Handlebars) {

  'use strict';

  /**
   * Home Template.
   */
  var homeTemplate = $('#home').html();

  /**
   * Candidate Template.
   */
  var candidateTemplate = $('#candidate').html();

  /**
   * Candidate Model.
   */
  var CandidateModel = Backbone.Model.extend({});

  /**
   * Candidate Collection.
   */
  var CandidateCollection = Backbone.Collection.extend({
    model: CandidateModel,
    url: '/data.json'
  });

  /**
   * Candidate Collection Instance.
   */
  var Candidates = new CandidateCollection();

  /**
   * Home view.
   */
  var HomeView = Backbone.View.extend({

    el: $('#content'),

    initialize: function initialize() {
      this.listenTo(Candidates, 'sync', this.render);
      Candidates.fetch();
    },

    render: function render() {
      var template = Handlebars.compile(homeTemplate);
      this.$el.html(template({candidates: Candidates.toJSON()}));
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
   * Application router.
   */
  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    }
  });

  /**
   * The router instance.
   */
  var router = new Router();

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

  // Foundation
  $(document).foundation();

  // DOM Ready
  $(function() {
    router.on('route:home', home);
    router.on('route:candidate', candidate);
    Backbone.history.start();
  });

})(jQuery, _, Backbone, Handlebars);
