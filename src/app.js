(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  var App = window.App = {
    templates   : {},
    models      : {},
    collections : {},
    views       : {}
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  App.templates.candidateCard = $('#candidate-card-template').html();
  App.templates.candidateProgram = $('#candidate-program-template').html();

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  App.models.Category  = Backbone.Model.extend({});
  App.models.Party     = Backbone.Model.extend({});
  App.models.Candidate = Backbone.Model.extend({});
  App.models.Program   = Backbone.Model.extend({});

  // ---------------------------------------------------------------------------
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

    parse: function(res) {
      return res.programs;
    },

    candidate: function(slug) {
      return this.find(function(model) {
        if (model.get('candidate').slug === slug) return model;
      });
    },

    propositions: function(slug) {
      var model = this.candidate(slug);
      if (!model) return;
      return _.groupBy(model.toJSON().propositions, function(obj) {
        return obj.category.name;
      });
    }
  });

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  App.views.CandidateCard = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-card',

    initialize: function(options) {
      this.options = options || {};
      this.showButton = this.options.showButton || false;
      this.template = Handlebars.compile(App.templates.candidateCard);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({model: this.model.toJSON(), showButton: this.showButton}));
    }
  });

  App.views.CandidateProgram = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options = options || {};
      this.slug = this.options.slug;
      this.template = Handlebars.compile(App.templates.candidateProgram);
      this.listenTo(this.collection, 'sync', this.fetch);
      this.collection.fetch();
    },

    fetch: function() {
      this.propositions = this.collection.propositions(this.slug);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({propositions: this.propositions}));
    }
  });


  App.views.Home = Backbone.View.extend({

    tagName: 'div',
    id: 'home',

    initialize: function(options) {
      this.options = options || {};
      this.candidates = this.options.candidates;
      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    render: function() {
      this.candidates.each(function(model) {
        var view = new App.views.CandidateCard({model: model, showButton: true});
        this.$el.append(view.el);
      }.bind(this));
    }
  });

  App.views.Candidate = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate',

    initialize: function(options) {
      this.options = options || {};
      this.slug = this.options.slug;
      this.programs = this.options.programs;
      this.cardView = new App.views.CandidateCard({model: this.model, showButton: false});
      this.programView = new App.views.CandidateProgram({collection: this.programs, slug: this.slug});
      this.render();
    },

    render: function() {
      this.$el.append(this.cardView.el);
      this.$el.append(this.programView.el);
    }
  });

  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  App.Router = Backbone.Router.extend({

    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    },

    initialize: function() {
      this.candidates = new App.collections.Candidate();
      this.programs = new App.collections.Program();
      this.content = $('#content');
    },

    home: function() {
      var view = new App.views.Home({candidates: this.candidates});
      this.content.html(view.el);
    },

    candidate: function(slug) {
      this.candidates.fetch({success: function(collection) {
        var view = new App.views.Candidate({
          model: collection.findWhere({slug: slug}),
          programs: this.programs,
          slug: slug
        });
        this.content.html(view.el);
      }.bind(this)});
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
