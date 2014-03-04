(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // Namespace
  // ---------------------------------------------------------------------------
  var App = window.App = {
    templates: {},
    models: {},
    collections: {},
    views: {}
  };

  // Templates
  // ---------------------------------------------------------------------------
  App.templates.home = $('#home').html();
  App.templates.candidate = $('#candidate').html();

  // Models
  // ---------------------------------------------------------------------------
  App.models.Category  = Backbone.Model.extend({});
  App.models.Party     = Backbone.Model.extend({});
  App.models.Candidate = Backbone.Model.extend({});
  App.models.Program   = Backbone.Model.extend({});

  // Collections
  // ---------------------------------------------------------------------------
  App.collections.Category = Backbone.Collection.extend({
    model: App.models.Category,
    url: window.APP_BASE_URL + 'data.json',
    parse: function(res) { return res.categories; }
  });

  App.collections.Party = Backbone.Collection.extend({
    model: App.models.Party,
    url: window.APP_BASE_URL + 'data.json',
    parse: function(res) { return res.parties; }
  });

  App.collections.Candidate = Backbone.Collection.extend({
    model: App.models.Candidate,
    url: window.APP_BASE_URL + 'data.json',
    parse: function(res) { return res.candidates; }
  });

  App.collections.Program = Backbone.Collection.extend({
    model: App.models.Program,
    url: window.APP_BASE_URL + 'data.json',
    parse: function(res) { return res.programs; }
  });

  // Views
  // ---------------------------------------------------------------------------
  App.views.Home = Backbone.View.extend({
    el: $('#content'),
    initialize: function initialize() {
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    render: function render() {
      var template = Handlebars.compile(App.templates.home);
      this.$el.html(template({candidates: this.collection.toJSON()}));
    }
  });

  App.views.Candidate = Backbone.View.extend({
    el: $('#content'),
    initialize: function(options) {
      this.options = options || {};
      this.slug = this.options.slug;
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    render: function render() {
      var model = this.collection.findWhere({slug: this.slug});
      var template = Handlebars.compile(App.templates.candidate);
      this.$el.html(template(model.toJSON()));
    }
  });

  // Router
  // ---------------------------------------------------------------------------
  App.Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    },
    initialize: function initialize() {
      this.candidates = new App.collections.Candidate();
    },
    home: function home() {
      var view = new App.views.Home({collection: this.candidates});
    },
    candidate: function candidate(slug) {
      var view = new App.views.Candidate({
        collection: this.candidates,
        slug: slug
      });
    }
  });

  // Foundation CSS Framework
  // ---------------------------------------------------------------------------
  $(document).foundation();

  // DOM Ready
  // ---------------------------------------------------------------------------
  $(function() {
    var router = new App.Router();
    Backbone.history.start({
      root: window.APP_BASE_URL
    });
  });

})(jQuery, _, Backbone, Handlebars);
