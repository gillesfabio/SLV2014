(function($, _, Backbone, Handlebars) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  /**
   * The Application.
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
  App.templates.candidateCard = $('#candidate-card-template').html();

  /**
   * Candidate Program Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.candidateProgram = $('#candidate-program-template').html();

  /**
   * Category Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.category = $('#category-template').html();

  /**
   * Category List Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.categoryList = $('#category-list-template').html();

  /**
   * About Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.about = $('#about-template').html();

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  /**
   * Category Model.
   *
   * @class
   * @memberof App.models
   */
  App.models.Category = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Party Model.
   *
   * @class
   * @memberof App.models
   */
  App.models.Party = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Candidate Model.
   *
   * @class
   * @memberof App.models
   */
  App.models.Candidate = Backbone.Model.extend(/** @lends Backbone.Model */{});

  /**
   * Program Model.
   *
   * @class
   * @memberof App.models
   */
  App.models.Program = Backbone.Model.extend(/** @lends Backbone.Model */{});

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  /**
   * Category Collection.
   *
   * @class
   * @memberof App.collections
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
   *
   * @class
   * @memberof App.collections
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
   *
   * @class
   * @memberof App.collections
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
   *
   * @class
   * @memberof App.collections
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
   * @memberof App.views
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
   * @memberof App.views
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
   * @memberof App.views
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
   * {@link App.views.CandidateList}
   *
   * @memberof App.views
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
   * @memberof App.views
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
   * @memberof App.views
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

  /**
   * Displays the list of categories.
   *
   * @memberof App.views
   */
  App.views.CategoryList = Backbone.View.extend({

    initialize: function(options) {
      this.options = options || {};
      this.template = Handlebars.compile(App.templates.categoryList);
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

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
   * @memberof App
   */
  App.Router = Backbone.Router.extend(/** @lends Backbone.Router */{

    routes: {
      ''                : 'homeController',
      'candidats'       : 'homeController',
      'candidats/:slug' : 'candidateController',
      'themes'          : 'categoryListController',
      'themes/:slug'    : 'categoryController',
      'a-propos'        : 'aboutController'
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
    },

    /**
     * The Category List Controller.
     * Use {@link App.views.CategoryList} view.
     */
    categoryListController: function() {
      var view = new App.views.CategoryList({collection: this.categories});
      this.content.html(view.el);
    },

    aboutController: function() {
      this.content.html(Handlebars.compile(App.templates.about)());
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
