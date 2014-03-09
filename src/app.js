(function($, _, Backbone, Handlebars, markdown) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  /**
   * Application Namespace.
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
   * Running Mate List Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.RunningMateListTemplate = $('#running-mate-list-template').html();

  /**
   * Candidate Program Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CandidateProgramTemplate = $('#candidate-program-template').html();

  /**
   * Candidate Program Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.CandidateDetailTemplate = $('#candidate-detail-template').html();

  /**
   * Theme Detail Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.ThemeDetailTemplate = $('#theme-detail-template').html();

  /**
   * Theme List Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.ThemeListTemplate = $('#theme-list-template').html();

  /**
   * About Handlebars Template.
   *
   * @type {String}
   * @memberof App.templates
   */
  App.templates.AboutTemplate = $('#about-template').html();


  //----------------------------------------------------------------------------
  // Template Helpers
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('md2html', function(md) {
    return new Handlebars.SafeString(markdown.toHTML(md));
  });

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  /**
   * Theme Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.ThemeModel = Backbone.Model.extend(
    /** @lends App.models.ThemeModel.prototype */{}
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
   * Running Mate Model.
   *
   * @class
   * @memberof App.models
   * @augments Backbone.Model
   */
  App.models.RunningMateModel = Backbone.Model.extend(
    /** @lends App.models.RunningMateModel.prototype */{}
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
   * Theme Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.ThemeCollection = Backbone.Collection.extend(
    /** @lends App.collections.ThemeCollection.prototype */ {

    model: App.models.ThemeModel,
    url: App.dataURL,

    parse: function(res) {
      return res.themes;
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
   * Running Mate Collection.
   *
   * @class
   * @memberof App.collections
   * @augments Backbone.Collection
   */
  App.collections.RunningMateCollection = Backbone.Collection.extend(
    /** @lends App.collections.RunningMateCollection.prototype */ {

    model: App.models.RunningMateModel,
    url: App.dataURL,

    parse: function(res) {
      return res.runningMates;
    },

    /**
     * Returns models for the given candidate.
     *
     * @memberof App.collections.RunningMateCollection#
     * @param {String} The candidate slug.
     * @returns {Array}
     */
    findByCandidate: function(slug) {
      var models = this.filter(function(model) {
        return model.get('candidate').slug === slug;
      });
      return new App.collections.RunningMateCollection(models);
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
     * Returns models which have the given theme in `projects` array.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The theme slug.
     * @returns {Array}
     */
    findByTheme: function(slug) {
      var models = [];
      this.each(function(model) {
        var projects = _.filter(model.get('projects'), function(project) {
          return project.theme.slug === slug;
        });
        if (projects.length > 0) {
          model.attributes.projects = projects;
          models.push(model);
        }
      });
      return new App.collections.ProgramCollection(models);
    },

    /**
     * Returns models which have the given theme in `projects` array
     * grouped by candidate.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The theme slug.
     * @returns {Object}
     */
    findByThemeAndGroupByCandidate: function(slug) {
      var models = this.findByTheme(slug);
      models = models.groupBy(function(m) { return m.get('candidate').name; });
      Object.keys(models).forEach(function(key) {
        models[key] = models[key][0].toJSON();
      });
      return models;
    },

    /**
     * Returns candidate projects grouped by theme.
     *
     * @memberof App.collections.ProgramCollection#
     * @param {String} slug The candidate slug.
     * @return {Object}
     */
    candidateProjects: function(slug) {
      var model = this.findByCandidate(slug);
      var projects = model.get('projects');
      return _.groupBy(projects, function(obj) { return obj.theme.name; });
    }
  });

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  /**
   * Candidate Card View.
   *
   * @class
   * @memberof App.views
   * @augments Backbone.View
   * @param {Object} options The view options.
   * @param {App.models.CandidateModel} options.model The model instance.
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
   * Running Mate List View.
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {App.collections.RunningMateCollection} options.collection The collection instance.
   */
  App.views.RunningMateListView = Backbone.View.extend(
    /** @lends App.views.RunningMateListView.prototype */ {

    tagName: 'div',
    className: 'running-mate-list',

    initialize: function(options) {

      this.options = _.extend({
        slug         : null,
        runningMates : new App.collections.RunningMateCollection()
      }, options);

      this.slug         = this.options.slug;
      this.runningMates = this.options.runningMates;
      this.template     = Handlebars.compile(App.templates.RunningMateListTemplate);

      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    /**
     * Prepare template context.
     *
     * @memberof App.views.RunningMateListView#
     */
    prepare: function() {
      this.runningMates = this.collection.findByCandidate(this.slug);
      console.log(this.runningMates.toJSON());
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.RunningMateListView#
     */
    render: function() {
      this.$el.html(this.template({runningMates: this.runningMates.toJSON()}));
    }
  });

  /**
   * Candidate Program View.
   *
   * @class
   * @memberof App.views
   * @augments Backbone.View
   * @param {Object} options The view options.
   * @param {String} options.slug The candidate's slug.
   * @param {App.collection.ProgramCollection} options.collection The collection instance.
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
      this.projects = this.collection.candidateProjects(this.slug);
      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateProgramView#
     */
    render: function() {
      this.$el.html(this.template({projects: this.projects}));
    }
  });

  /**
   * Candidate List View.
   *
   * Subviews:
   *
   * - {@link App.views.CandidateCardView}
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {App.collections.CandidateCollection} options.collection The collection instance.
   */
  App.views.CandidateListView = Backbone.View.extend(
    /** @lends App.views.CandidateListView.prototype */ {

    tagName: 'div',
    className: 'candidate-list',

    initialize: function(options) {
      this.options = options || {};
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
        var showButton = model.get('programUrl') ? true : false;
        var view = new App.views.CandidateCardView({model: model, showButton: showButton});
        this.$el.append(view.el);
      }.bind(this));
    }
  });

  /**
   * Home View.
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
   * Candidate Detail View.
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
   * @param {App.collections.CandidateCollection} options.collection The collection instance.
   * @param {App.collections.ProgramCollection} options.programs The collection instance.
   * @param {App.collections.RunningMateCollection} options.runningMates The collection instance.
   *
   */
  App.views.CandidateDetailView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-detail',

    initialize: function(options) {

      this.options = _.extend({
        slug         : null,
        programs     : new App.collections.ProgramCollection(),
        runningMates : new App.collections.RunningMateCollection()
      }, options);

      this.slug         = this.options.slug;
      this.programs     = this.options.programs;
      this.runningMates = this.options.runningMates;
      this.template     = Handlebars.compile(App.templates.CandidateDetailTemplate);

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

      this.cardView = new App.views.CandidateCardView({
        model      : this.model,
        showButton : false
      });

      this.programView = new App.views.CandidateProgramView({
        collection : this.programs,
        slug       : this.slug
      });

      this.runningMateListView = new App.views.RunningMateListView({
        collection : this.runningMates,
        slug       : this.slug
      });

      this.render();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.CandidateView#
     */
    render: function() {
      this.$el.html(this.template({candidate: this.model.toJSON()}));
      this.$el.find('.candidate-detail-running-mates').html(this.runningMateListView.el);
      this.$el.find('.candidate-detail-card').html(this.cardView.el);
      this.$el.find('.candidate-detail-program').html(this.programView.el);
    }
  });

  /**
   * Theme Detail View.
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {String} options.slug The theme slug.
   * @param {App.collection.ThemeCollection} options.themes The collection instance.
   * @param {App.collection.ProgramCollection} options.programs The collection instance.
   */
  App.views.ThemeDetailView = Backbone.View.extend(
    /** @lends App.views.ThemeDetailView.prototype */{

    tagName: 'div',
    className: 'theme-detail',

    initialize: function(options) {
      this.options = _.extend({slug: null, programs: null}, options);
      this.slug = this.options.slug;
      this.programs = this.options.programs;
      this.template = Handlebars.compile(App.templates.ThemeDetailTemplate);
      this.theme = null;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    /**
     * Prepares template context.
     *
     * @memberof App.views.ThemeDetailView#
     */
    prepare: function() {
      this.theme = this.collection.findWhere({slug: this.slug});
      if (!this.theme) return this.notFound();
      this.programs.fetch({success: function(collection) {
        this.groupedPrograms = this.programs.findByThemeAndGroupByCandidate(this.slug);
        this.render();
      }.bind(this)});
    },

    /**
     * Informs user if theme does not exist.
     *
     * @memberof App.views.ThemeDetailView#
     */
    notFound: function() {
      this.$el.html("Désolé, ce thème n'existe pas.");
    },

    /**
     * Renders view.
     *
     * @memberof App.views.ThemeDetailView#
     */
    render: function() {
      this.$el.html(this.template({
        theme: this.theme.toJSON(),
        programs: this.groupedPrograms
      }));
    }
  });

  /**
   * Theme List View.
   *
   * @class
   * @memberof App.views
   * @param {Object} options The view options.
   * @param {App.collections.ThemeCollection} options.collection The collection instance.
   */
  App.views.ThemeListView = Backbone.View.extend(
    /** @lends App.views.ThemeListView.prototype */ {

    tagName: 'div',
    className: 'theme-list',

    initialize: function(options) {
      this.options = options || {};
      this.template = Handlebars.compile(App.templates.ThemeListTemplate);
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    /**
     * Renders view.
     *
     * @memberof App.views.ThemeListView#
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
      'candidats/:slug' : 'candidateDetailController',
      'themes'          : 'themeListController',
      'themes/:slug'    : 'themeDetailController',
      'a-propos'        : 'aboutController'
    },

    initialize: function() {
      this.themes       = new App.collections.ThemeCollection();
      this.candidates   = new App.collections.CandidateCollection();
      this.runningMates = new App.collections.RunningMateCollection();
      this.programs     = new App.collections.ProgramCollection();
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
     * The Candidate Detail Controller.
     *
     * @memberof App.Router#
     * @param {String} slug The candidate slug.
     */
    candidateDetailController: function(slug) {
      var view = new App.views.CandidateDetailView({
        slug         : slug,
        collection   : this.candidates,
        programs     : this.programs,
        runningMates : this.runningMates
      });
      this.content.html(view.el);
    },

    /**
     * Theme Detail Controller.
     *
     * @memberof App.Router#
     * @param {String} slug The theme slug.
     */
    themeDetailController: function(slug) {
      var view = new App.views.ThemeDetailView({
        collection : this.themes,
        slug       : slug,
        programs   : this.programs
      });
      this.content.html(view.el);
    },

    /**
     * Theme List Controller.
     *
     * @memberof App.Router#
     */
    themeListController: function() {
      var view = new App.views.ThemeListView({collection: this.themes});
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

})(jQuery, _, Backbone, Handlebars, markdown);
