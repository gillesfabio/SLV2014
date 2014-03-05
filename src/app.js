(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  /**
   * The Application.
   * @type Object
   */
  var App = window.App = {
    dataURL     : window.APP_BASE_URL + 'data.json', // Collections URL
    templates   : {},                                // Handlebars templates
    models      : {},                                // Backbone models
    collections : {},                                // Backbone collections
    views       : {}                                 // Backbone views
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  /**
   * Candidate card Handlebars template.
   * @type String
   */
  App.templates.candidateCard = $('#candidate-card-template').html();

  /**
   * Candidate program Handlebars template.
   * @type String
   */
  App.templates.candidateProgram = $('#candidate-program-template').html();

  /**
   * Category Handlebars template.
   * @type String
   */
  App.templates.category = $('#category-template').html();

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  /**
   * Category Model.
   * @class
   */
  App.models.Category = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Party Model.
   * @class
   */
  App.models.Party = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Candidate Model.
   * @class
   */
  App.models.Candidate = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Program Model.
   * @class
   */
  App.models.Program = Backbone.Model.extend(/** @lends Backbone.Model */{});

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  /**
   * Category Collection.
   * @class
   */
  App.collections.Category = Backbone.Collection.extend(/** @lends Backbone.Collection */{

    model : App.models.Category,
    url   : App.dataURL,

    parse: function(res) {
      return res.categories;
    }
  });

  /**
   * Party Collection.
   * @class
   */
  App.collections.Party = Backbone.Collection.extend({

    model : App.models.Party,
    url   : App.dataURL,

    parse: function(res) {
      return res.parties;
    }
  });

  /**
   * Candidate Collection.
   * @class
   */
  App.collections.Candidate = Backbone.Collection.extend(/** @lends Backbone.Collection */{

    model : App.models.Candidate,
    url   : App.dataURL,

    parse: function(res) {
      return res.candidates;
    }
  });

  /**
   * Program Collection.
   * @class
   */
  App.collections.Program = Backbone.Collection.extend(/** @lends Backbone.Collection */{

    model : App.models.Program,
    url   : App.dataURL,

    parse: function(response) {
      return response.programs;
    },

    /**
     * Returns models which have `candidate.slug` equals to `slug` parameter.
     *
     * @param   {String}  slug  The candidate's slug.
     * @returns {Backbone.Collection}
     */
    findByCandidate: function(slug) {
      return this.find(function(model) {
        if (model.get('candidate').slug === slug) return model;
      });
    },

    /**
     * Returns models which have the given category in `propositions` objects.
     *
     * @param  {String} slug  The category slug.
     * @return {Array}
     */
    findByCategory: function(slug) {
      return this.filter(function(model) {
        return _.contains(_.map(model.get('propositions'), function(o) {
          return o.category.slug;
        }), slug);
      });
    },

    /**
     * Returns models which have the given category in `propositions` objects
     * grouped by candidate.
     *
     * @param  {String}  slug  The category slug.
     * @return {Object}
     */
    findByCategoryAndGroupByCandidate: function(slug) {
      var models = new App.collections.Program(this.findByCategory(slug));
      return _.groupBy(models.toJSON(), function(model) { return model.candidate.name; });
    },

    /**
     * Returns candidate propositions grouped by category.
     *
     * @param  {String}  slug  The candidate slug.
     * @return {Object}
     */
    candidatePropositions: function(slug) {
      var model = this.findByCandidate(slug);
      var propositions = model.toJSON().propositions;
      return _.groupBy(propositions, function(obj) { return obj.category.name; });
    }
  });

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  /**
   * Displays Candidate Information.
   *
   * @param {Object}               options             The view options.
   * @param {App.models.Candidate} options.model       The Candidate model instance.
   * @param {Boolean}              options.showButton  Show candidate page button (defaults to false).
   */
  App.views.CandidateCard = Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-card',

    initialize: function(options) {
      this.options    = _.extend({showButton: false}, options);
      this.showButton = options.showButton;
      this.template   = Handlebars.compile(App.templates.candidateCard);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        model      : this.model.toJSON(),
        showButton : this.showButton
      }));
    }
  });

  /**
   * Displays Candidate Program.
   *
   * @param {Object}                 options             The view options.
   * @param {String}                 options.slug        The candidate's slug.
   * @param {App.collection.Program} options.collection  The Program collection instance.
   */
  App.views.CandidateProgram = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options  = _.extend({slug: null}, options);
      this.slug     = this.options.slug;
      this.template = Handlebars.compile(App.templates.candidateProgram);
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    prepare: function() {
      this.propositions = this.collection.candidatePropositions(this.slug);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({propositions: this.propositions}));
    }
  });

  /**
   * Displays Candidate List.
   * {@link App.views.CandidateCard}
   *
   * @param  {Object}               options             View options.
   * @param  {Backbone.Collection}  options.collection  `Candidate` collection instance.
   */
  App.views.CandidateList = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-list',

    initialize: function(options) {
      this.options = options || {};
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    render: function() {
      this.collection.each(function(model) {
        var view = new App.views.CandidateCard({model: model, showButton: true});
        this.$el.append(view.el);
      }.bind(this));
    }
  });

  /**
   * Displays Home Page.
   *
   * {@link App.views.CandidateList}
   *
   * @param {Object}                    options             View options.
   * @param {App.collections.Candidate} options.collection  The collection instance.
   */
  App.views.Home = Backbone.View.extend({

    id: 'home',
    tagName: 'div',

    initialize: function(options) {
      this.options = _.extend({candidates: null}, options);
      this.candidates = this.options.candidates;
      this.candidateListView = new App.views.CandidateList({collection: this.candidates});
      this.render();
    },

    render: function() {
      this.$el.append(this.candidateListView.el);
    }
  });

  /**
   * Displays Candidate Page.
   *
   * {@link App.views.CandidateCard}
   * {@link App.views.ProgramView}
   *
   * @param {Object}                   options            View options.
   * @param {String}                   options.slug       The candidate slug.
   * @param {App.collection.Candidate} options.collection Candidate collection instance.
   * @param {App.collection.Program}   options.programs   Program collection instance.
   *
   */
  App.views.Candidate = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate',

    initialize: function(options) {
      this.options = _.extend({slug: null, programs: null}, options);
      this.slug = this.options.slug;
      this.programs = this.options.programs;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    prepare: function() {
      this.model = this.collection.findWhere({slug: this.slug});
      this.cardView = new App.views.CandidateCard({model: this.model, showButton: false});
      this.programView = new App.views.CandidateProgram({collection: this.programs, slug: this.slug});
      this.render();

    },

    render: function() {
      this.$el.append(this.cardView.el);
      this.$el.append(this.programView.el);
    }
  });

  /**
   * Displays Category Page.
   *
   * @param {Object}                  options             The view options.
   * @param {String}                  options.slug        The category slug.
   * @param {App.collection.Category} options.categories  The Category collection instance.
   * @param {App.collection.Program}  options.programs    The Program collection instance.
   */
  App.views.Category = Backbone.View.extend({

    tagName: 'div',
    className: 'category',

    initialize: function(options) {
      this.options  = _.extend({slug: null, programs: null}, options);
      this.slug     = this.options.slug;
      this.programs = this.options.programs;
      this.template = Handlebars.compile(App.templates.category);
      this.category = null;
      this.listenTo(this.collection, 'sync', this.fetch);
      this.collection.fetch();
    },

    fetch: function() {
      this.category = this.collection.findWhere({slug: this.slug});
      if (!this.category) return this.notFound();
      this.programs.fetch({success: function(collection) {
        this.programs = this.programs.findByCategoryAndGroupByCandidate(this.slug);
        this.render();
      }.bind(this)});
    },

    notFound: function() {
      this.$el.html('Catégorie non trouvée.');
    },

    render: function() {
      this.$el.html(this.template({
        category : this.category.toJSON(),
        programs : this.programs
      }));
    }
  });


  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  /**
   * Router.
   */
  App.Router = Backbone.Router.extend({

    routes: {
      ''                : 'homeController',
      'candidate/:slug' : 'candidateController',
      'category/:slug'  : 'categoryController'
    },

    initialize: function() {
      this.candidates = new App.collections.Candidate();
      this.programs   = new App.collections.Program();
      this.categories = new App.collections.Category();
      this.content    = $('#content');
    },

    /**
     * The Home Page.
     * Use {@link App.views.Home} view.
     */
    homeController: function() {
      var view = new App.views.Home({candidates: this.candidates});
      this.content.html(view.el);
    },

    /**
     * The Candidate Page.
     * Use {@link App.views.Candidate} view.
     *
     * @param  {String}  slug  The candidate slug.
     */
    candidateController: function(slug) {
      var view = new App.views.Candidate({
        slug       : slug,
        collection : this.candidates,
        programs   : this.programs
      });
      this.content.html(view.el);
    },

    /**
     * The Category Page.
     * Use {@link App.views.Category} view.
     *
     * @param  {String}  slug  The category slug.
     */
    categoryController: function(slug) {
      var view = new App.views.Category({
        collection : this.categories,
        slug       : slug,
        programs   : this.programs
      });
      this.content.html(view.el);
    }
  });

  // ---------------------------------------------------------------------------
  // Foundation CSS Framework
  // ---------------------------------------------------------------------------

  $(document).foundation();

  // ---------------------------------------------------------------------------
  // DOM Ready
  // ---------------------------------------------------------------------------

  $(function() {
    var router = new App.Router();
    Backbone.history.start({root: window.APP_BASE_URL});
  });

})(jQuery, _, Backbone, Handlebars);
