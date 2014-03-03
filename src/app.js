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
  Categories.fetch();
  Parties.fetch();
  Candidates.fetch();
  Programs.fetch();

  // Home view
  // ---------------------------------------------------------------------------
  var HomeView = Backbone.View.extend({
    el: $('#content'),
    initialize: function initialize() {
      this.listenTo(Candidates, 'sync', this.render);
    },
    render: function render() {
      console.log(Candidates);
      var template = Handlebars.compile(homeTemplate);
      this.$el.html(template({candidates: Candidates.toJSON()}));
    }
  });

  // Candidate View
  // ---------------------------------------------------------------------------
  var CandidateView = Backbone.View.extend({
    el: $('#content'),
    initialize: function() {
      this.render();
    },
    render: function render() {
      var template = Handlebars.compile(candidateTemplate);
      this.$el.html(template(this.model.toJSON()));
    }
  });

  // Router
  // ---------------------------------------------------------------------------
  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'candidate/:slug': 'candidate'
    },
    home: function home() {
      var homeView = new HomeView();
    },
    candidate: function candidate(slug) {
      var model = Candidates.findWhere({slug: slug});
      var candidateView = new CandidateView({model: model});
    }
  });

  // Foundation CSS Framework
  // ---------------------------------------------------------------------------
  $(document).foundation();

  // DOM Ready
  // ---------------------------------------------------------------------------
  $(function() {
    var router = new Router();
    Backbone.history.start();
  });

})(jQuery, _, Backbone, Handlebars);
