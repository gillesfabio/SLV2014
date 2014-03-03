(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // Templates
  // ---------------------------------------------------------------------------
  var homeTemplate = $('#home').html();
  var candidateTemplate = $('#candidate').html();

  // Models
  // ---------------------------------------------------------------------------
  var CategoryModel  = Backbone.Model.extend({});
  var PartyModel     = Backbone.Model.extend({});
  var CandidateModel = Backbone.Model.extend({});
  var ProgramModel   = Backbone.Model.extend({});

  // Collections
  // ---------------------------------------------------------------------------
  var CategoryCollection = Backbone.Collection.extend({
    model: CategoryModel,
    url: '/data.json',
    parse: function(res) { return res.categories; }
  });

  var PartyCollection = Backbone.Collection.extend({
    model: PartyModel,
    url: '/data.json',
    parse: function(res) { return res.parties; }
  });

  var CandidateCollection = Backbone.Collection.extend({
    model: CandidateModel,
    url: '/data.json',
    parse: function(res) { return res.candidates; }
  });

  var ProgramCollection = Backbone.Collection.extend({
    model: ProgramModel,
    url: '/data.json',
    parse: function(res) { return res.programs; }
  });

  // Collection instances
  // ---------------------------------------------------------------------------
  var Categories = new CategoryCollection();
  var Parties    = new PartyCollection();
  var Candidates = new CandidateCollection();
  var Programs   = new ProgramCollection();

  // Fetching
  // ---------------------------------------------------------------------------

  // Home view
  // ---------------------------------------------------------------------------
  var HomeView = Backbone.View.extend({
    el: $('#content'),
    initialize: function initialize() {
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    render: function render() {
      var template = Handlebars.compile(homeTemplate);
      this.$el.html(template({candidates: this.collection.toJSON()}));
    }
  });

  // Candidate View
  // ---------------------------------------------------------------------------
  var CandidateView = Backbone.View.extend({
    el: $('#content'),
    initialize: function(options) {
      this.options = options || {};
      this.slug = this.options.slug;
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    render: function render() {
      var model = this.collection.findWhere({slug: this.slug});
      var template = Handlebars.compile(candidateTemplate);
      this.$el.html(template(model.toJSON()));
    }
  });

  // Router
  // ---------------------------------------------------------------------------
  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    },
    initialize: function initialize() {
      this.homeView      = null;
      this.candidateView = null;
    },
    home: function home() {
      this.homeView = this.homeView || new HomeView({collection: Candidates});
    },
    candidate: function candidate(slug) {
      this.candidateView = this.candidateView || new CandidateView({
        collection: Candidates,
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
    var router = new Router();
    Backbone.history.start({pushState: true});
  });

})(jQuery, _, Backbone, Handlebars);
