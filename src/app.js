(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  /**
   * The Application Namespace.
   *
   * @namespace App
   */
  var App = window.App = {

    /**
     * Data URL.
     *
     * @type {string}
     * @memberof App
     */
    dataURL: window.APP_BASE_URL + 'data.json',

    /**
     * Application Templates.
     *
     * @namespace App.templates
     */
    templates: {},

    /**
     * Application models.
     *
     * @namespace App.models
     */
    models: {},

    /**
     * Application collections.
     *
     * @namespace App.collections
     */
    collections: {},

    /**
     * Application views.
     *
     * @namespace App.views
     */
    views: {}
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  /**
   * Candidate Card Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CandidateCardTemplate = $('#candidate-card-template').html();

  /**
   * Candidate Program Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CandidateProgramTemplate = $('#candidate-program-template').html();

  /**
   * Category Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CategoryTemplate = $('#category-template').html();

  /**
   * Category List Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CategoryListTemplate = $('#category-list-template').html();

  /**
   * About Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.AboutTemplate = $('#about-template').html();

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  /**
   * Category Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.CategoryModel = Backbone.Model.extend(
    /** @lends App.models.CategoryModel.prototype */{}
  );

  /**
   * Party Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.PartyModel = Backbone.Model.extend(
    /** @lends App.models.PartyModel.prototype */{}
  );

  /**
   * Candidate Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.CandidateModel = Backbone.Model.extend(
    /** @lends App.models.CandidateModel.prototype */{}
  );

  /**
   * Program Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.ProgramModel = Backbone.Model.extend(
    /** @lends App.models.ProgramModel.prototype */{}
  );

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  /**
   * Category Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.CategoryCollection = Backbone.Collection.extend(
    /** @lends App.collections.CategoryCollection.prototype */ {

    model: App.models.CategoryModel,
    url: App.dataURL,

    parse: function(res) {
      return res.categories;
    }
  });

  /**
   * Party Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.PartyCollection = Backbone.Collection.extend(
    /** @lends App.collections.PartyCollection.prototype */ {

    model: App.models.PartyModel,
    url: App.dataURL,

    parse: function(res) {
      return res.parties;
    }
  });

  /**
   * Candidate Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.CandidateCollection = Backbone.Collection.extend(
    /** @lends App.collections.CandidateCollection.prototype */ {

    model: App.models.CandidateModel,
    url: App.dataURL,

    parse: function(res) {
      return res.candidates;
    }
  });

  /**
   * Program Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.ProgramCollection = Backbone.Collection.extend(
    /** @lends App.collections.ProgramCollection.prototype */ {

    model: App.models.ProgramModel,
    url: App.dataURL,

    parse: function(response) {
      return response.programs;
    },

    /**
     * Returns models which have `candidate.slug` equals to `slug` parameter.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The candidate's slug.
     * @returns {App.collection.ProgramCollection}
     */
    findByCandidate: function(slug) {
      return this.find(function(model) {
        if (model.get('candidate').slug === slug) return model;
      });
    },

    /**
     * Returns models which have the given category in `propositions` objects.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The category slug.
     * @returns {Array}
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
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The category slug.
     * @returns {Object}
     */
    findByCategoryAndGroupByCandidate: function(slug) {
      var models = new App.collections.ProgramCollection(this.findByCategory(slug));
      return _.groupBy(models.toJSON(), function(model) { return model.candidate.name; });
    },

    /**
     * Returns candidate propositions grouped by category.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The candidate slug.
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
   * @class
   * @memberof App.views
   * @augments Backbone.View
   * @param {Object} options The view options.
   * @param {App.models.CandidateModel} options.model The Candidate model instance.
   * @param {Boolean} options.showButton Show candidate page button (defaults to `false`).
   */
  App.views.CandidateCardView = Backbone.View.extend(
    /** @lends App.views.CandidateCardView.prototype */ {

    tagName   : 'div',
    className : 'candidate-card',

    initialize: function(options) {
      this.options = _.extend({showButton: false}, options);
      this.showButton = options.showButton;
      this.template = Handlebars.compile(App.templates.CandidateCardTemplate);
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateCardView#
     */
    render: function() {
      this.$el.html(this.template({
        model: this.model.toJSON(),
        showButton: this.showButton
      }));
    }
  });

  /**
   * Displays Candidate Program.
   *
   * @class
   * @memberof App.views
   * @augments Backbone.View
   * @param {Object} options The view options.
   * @param {String} options.slug The candidate's slug.
   * @param {App.collection.ProgramCollection} options.collection The Program collection instance.
   */
  App.views.CandidateProgramView = Backbone.View.extend(
    /** @lends App.views.CandidateProgramView.prototype */ {

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options = _.extend({slug: null}, options);
      this.slug = this.options.slug;
      this.template = Handlebars.compile(App.templates.CandidateProgramTemplate);
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    /**
     * Prepare template context.
     *
     * @memberof App.views.CandidateProgramView#
     */
    prepare: function() {
      this.propositions = this.collection.candidatePropositions(this.slug);
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateProgramView#
     */
    render: function() {
      this.$el.html(this.template({propositions: this.propositions}));
    }
  });

  /**
   * Displays Candidate List.
   *
   * Subviews:
   *
   * - {@link App.views.CandidateCardView}
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {App.collection.CandidateCollection} options.collection `CandidateCollection` instance.
   */
  App.views.CandidateListView = Backbone.View.extend(
    /** @lends App.views.CandidateListView.prototype */ {

    tagName: 'div',
    className: 'candidate-list',

    initialize: function(options) {
      this.options = options || {};
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateListView#
     */
    render: function() {
      this.collection.each(function(model) {
        var view = new App.views.CandidateCardView({model: model, showButton: true});
        this.$el.append(view.el);
      }.bind(this));
    }
  });

  /**
   * Displays Home Page.
   *
   * Subviews:
   *
   * - {@link App.views.CandidateListView}
   *
   * @class
   * @memberof App.views
   * @param {Object} options View options.
   * @param {App.collections.CandidateCollection} options.collection The collection instance.
   */
  App.views.HomeView = Backbone.View.extend(
    /** @lends App.views.HomeView.prototype */{

    id: 'home',
    tagName: 'div',

    initialize: function(options) {
      this.options = _.extend({candidates: null}, options);
      this.candidates = this.options.candidates;
      this.candidateListView = new App.views.CandidateListView({collection: this.candidates});
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.HomeView#
     */
    render: function() {
      this.$el.append(this.candidateListView.el);
    }
  });

  /**
   * Displays Candidate Page.
   *
   * Subviews:
   *
   * - {@link App.views.CandidateCardView}
   * - {@link App.views.CandidateProgramView}
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {String} options.slug The candidate slug.
   * @param {App.collection.CandidateCollection} options.collection Candidate collection instance.
   * @param {App.collection.ProgramCollection} options.programs Program collection instance.
   *
   */
  App.views.CandidateView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate',

    initialize: function(options) {
      this.options = _.extend({slug: null, programs: null}, options);
      this.slug = this.options.slug;
      this.programs = this.options.programs;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    /**
     * Prepares template context.
     *
     * @memberof App.views.CandidateView#
     */
    prepare: function() {
      this.model = this.collection.findWhere({slug: this.slug});
      this.cardView = new App.views.CandidateCardView({model: this.model, showButton: false});
      this.programView = new App.views.CandidateProgramView({collection: this.programs, slug: this.slug});
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateView#
     */
    render: function() {
      this.$el.append(this.cardView.el);
      this.$el.append(this.programView.el);
    }
  });

  /**
   * Displays Category Page.
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {String} options.slug The category slug.
   * @param {App.collection.CategoryCollection} options.categories The `CategoryCollection` instance.
   * @param {App.collection.ProgramCollection} options.programs The `ProgramCollection` instance.
   */
  App.views.CategoryView = Backbone.View.extend(
    /** @lends App.views.CategoryView.prototype */{

    tagName: 'div',
    className: 'category',

    initialize: function(options) {
      this.options = _.extend({slug: null, programs: null}, options);
      this.slug = this.options.slug;
      this.programs = this.options.programs;
      this.template = Handlebars.compile(App.templates.CategoryTemplate);
      this.category = null;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    /**
     * Prepares template context.
     *
     * @memberof App.views.CategoryView#
     */
    prepare: function() {
      this.category = this.collection.findWhere({slug: this.slug});
      if (!this.category) return this.notFound();
      this.programs.fetch({success: function(collection) {
        this.programs = this.programs.findByCategoryAndGroupByCandidate(this.slug);
        this.render();
      }.bind(this)});
    },

    /**
     * Informs user if category does not exist.
     *
     * @memberof App.views.CategoryView#
     */
    notFound: function() {
      this.$el.html('Catégorie non trouvée.');
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CategoryView#
     */
    render: function() {
      this.$el.html(this.template({
        category: this.category.toJSON(),
        programs: this.programs
      }));
    }
  });

  /**
   * Displays the list of categories.
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {App.collections.CategoryCollection} options.collection The `CategoryCollection` instance.
   */
  App.views.CategoryListView = Backbone.View.extend(
    /** @lends App.views.CategoryListView.prototype */ {

    initialize: function(options) {
      this.options = options || {};
      this.template = Handlebars.compile(App.templates.CategoryListTemplate);
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CategoryListView#
     */
    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
    }
  });

  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  /**
   * Router.
   *
   * @class
   * @memberof App
   * @augments Backbone.Router
   */
  App.Router = Backbone.Router.extend(
    /** @lends App.Router.prototype */{

    routes: {
      ''                : 'homeController',
      'candidats'       : 'homeController',
      'candidats/:slug' : 'candidateController',
      'themes'          : 'categoryListController',
      'themes/:slug'    : 'categoryController',
      'a-propos'        : 'aboutController'
    },

    initialize: function() {
      this.candidates = new App.collections.CandidateCollection();
      this.programs = new App.collections.ProgramCollection();
      this.categories = new App.collections.CategoryCollection();
      this.content = $('#content');
    },

    /**
     * The Home Controller.
     *
     * @memberof App.Router#
     */
    homeController: function() {
      var view = new App.views.HomeView({candidates: this.candidates});
      this.content.html(view.el);
    },

    /**
     * The Candidate Controller.
     *
     * @memberof App.Router#
     * @param {String} slug The candidate slug.
     */
    candidateController: function(slug) {
      var view = new App.views.CandidateView({
        slug: slug,
        collection: this.candidates,
        programs: this.programs
      });
      this.content.html(view.el);
    },

    /**
     * The Category Controller.
     *
     * @memberof App.Router#
     * @param {String} slug The category slug.
     */
    categoryController: function(slug) {
      var view = new App.views.CategoryView({
        collection: this.categories,
        slug: slug,
        programs: this.programs
      });
      this.content.html(view.el);
    },

    /**
     * The Category List Controller.
     *
     * @memberof App.Router#
     */
    categoryListController: function() {
      var view = new App.views.CategoryListView({collection: this.categories});
      this.content.html(view.el);
    },

    /**
     * The About Controller.
     *
     * @memberof App.Router#
     */
    aboutController: function() {
      this.content.html(Handlebars.compile(App.templates.AboutTemplate)());
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
