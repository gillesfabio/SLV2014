(function($, _, Backbone, Handlebars, markdown, jsPDF) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  var App = window.App = {
    dataURL: window.APP_BASE_URL + 'data.json',
    templates: {},
    models: {},
    collections: {},
    views: {}
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  App.templates.candidateCardTemplate = Handlebars.compile($('#candidate-card-template').html());
  App.templates.runningMateListTemplate = Handlebars.compile($('#running-mate-list-template').html());
  App.templates.candidateProgramTemplate = Handlebars.compile($('#candidate-program-template').html());
  App.templates.candidateListTemplate = Handlebars.compile($('#candidate-list-template').html());
  App.templates.candidateDetailTemplate = Handlebars.compile($('#candidate-detail-template').html());
  App.templates.themeDetailTemplate = Handlebars.compile($('#theme-detail-template').html());
  App.templates.themeListTemplate = Handlebars.compile($('#theme-list-template').html());
  App.templates.aboutTemplate = Handlebars.compile($('#about-template').html());


  //----------------------------------------------------------------------------
  // Template Helpers
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('md2html', function(md) {
    return new Handlebars.SafeString(markdown.toHTML(md));
  });

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  App.models.ThemeModel = Backbone.Model.extend({});
  App.models.CandidateModel = Backbone.Model.extend({});
  App.models.RunningMateModel = Backbone.Model.extend({});
  App.models.ProgramModel = Backbone.Model.extend({});

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  App.collections.ThemeCollection = Backbone.Collection.extend({

    model: App.models.ThemeModel,
    url: App.dataURL,

    parse: function(res) {
      return res.themes;
    }
  });

  App.collections.CandidateCollection = Backbone.Collection.extend({

    model: App.models.CandidateModel,
    url: App.dataURL,

    parse: function(res) {
      return res.candidates;
    }
  });

  App.collections.RunningMateCollection = Backbone.Collection.extend({

    model: App.models.RunningMateModel,
    url: App.dataURL,

    parse: function(res) {
      return res.runningMates;
    },

    findByCandidate: function(id) {
      var models = this.filter(function(model) { return model.get('candidate').id === id; });
      return new App.collections.RunningMateCollection(models);
    }
  });

  App.collections.ProgramCollection = Backbone.Collection.extend({

    model: App.models.ProgramModel,
    url: App.dataURL,

    parse: function(response) {
      return response.programs;
    },

    findByCandidate: function(id) {
      return this.find(function(model) {
        if (model.get('candidate')) return model.get('candidate').id === id;
      });
    },

    findByTheme: function(id) {
      var models = [];
      this.each(function(model) {
        var projects = _.filter(model.get('projects'), function(project) {
          return project.theme.id === id;
        });
        if (projects.length > 0) {
          model.attributes.projects = projects;
          models.push(model);
        }
      });
      return new App.collections.ProgramCollection(models);
    },

    findByThemeAndGroupByCandidate: function(id) {
      var models = this.findByTheme(id);
      models = models.groupBy(function(m) { return m.get('candidate').name; });
      Object.keys(models).forEach(function(key) {
        models[key] = models[key][0].toJSON();
      });
      return models;
    },

    candidateProjects: function(id) {
      var model = this.findByCandidate(id);
      if (!model) return;
      var projects = model.get('projects');
      return _.groupBy(projects, function(obj) { return obj.theme.name; });
    }
  });

  // ---------------------------------------------------------------------------
  // Collection instances
  // ---------------------------------------------------------------------------

  App.collections.candidates = new App.collections.CandidateCollection();
  App.collections.runningMates = new App.collections.RunningMateCollection();
  App.collections.programs = new App.collections.ProgramCollection();
  App.collections.themes = new App.collections.ThemeCollection();

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  App.views.CandidateCardView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-card',

    initialize: function(options) {
      this.options = _.extend({showDetailLink: false}, options);
      this.showDetailLink = options.showDetailLink;
      this.template = App.templates.candidateCardTemplate;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        model: this.model.toJSON(),
        showDetailLink: this.showDetailLink
      }));
    }
  });

  App.views.RunningMateListView = Backbone.View.extend({

    tagName: 'div',
    className: 'running-mate-list',

    initialize: function(options) {

      this.options = _.extend({
        modelId: null,
        runningMates: new App.collections.RunningMateCollection()
      }, options);

      this.modelId = this.options.modelId;
      this.runningMates = this.options.runningMates;
      this.template = App.templates.runningMateListTemplate;

      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    prepare: function() {
      this.runningMates = this.collection.findByCandidate(this.modelId);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({runningMates: this.runningMates.toJSON()}));
    }
  });

  App.views.CandidateProgramView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options = _.extend({modelId: null}, options);
      this.modelId = this.options.modelId;
      this.template = App.templates.candidateProgramTemplate;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    prepare: function() {
      this.projects = this.collection.candidateProjects(this.modelId);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({projects: this.projects}));
    }
  });

  App.views.CandidateListView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-list',

    initialize: function(options) {
      this.options = options || {};
      this.template = App.templates.candidateListTemplate;
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    render: function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.collection.each(function(model) {
        var view = new App.views.CandidateCardView({
          tagName: 'li',
          model: model,
          showDetailLink: model.get('programUrl') ? true : false
        });
        this.$el.find('.candidate-list-container').append(view.el);
      }.bind(this));
    }
  });

  App.views.CandidateDetailView = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-detail',

    events: {
      'click a.makePDF': 'makePDF'
    },

    initialize: function(options) {

      this.options = _.extend({
        modelId: null,
        programs: new App.collections.ProgramCollection(),
        runningMates: new App.collections.RunningMateCollection()
      }, options);

      this.modelId = this.options.modelId;
      this.programs = this.options.programs;
      this.runningMates = this.options.runningMates;
      this.template = App.templates.candidateDetailTemplate;

      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    makePDF: function() {
      /*jshint newcap: false */
      var doc = new jsPDF();
      doc.text(20, 20, 'This PDF has a title');
      doc.setProperties({
        title    : 'TITLE',
        subject  : 'SUBJECT',
        author   : 'AUTHOR',
        keywords : 'foo, bar, ok, hello, world',
        creator  : 'Gilles Fabio <gilles@gillesfabio.com>'
      });
      doc.save('programme.pdf');
    },

    prepare: function() {
      this.model = this.collection.findWhere({id: this.modelId});
      this.cardView = new App.views.CandidateCardView({
        model: this.model,
        showDetailLink: false
      });
      this.programView = new App.views.CandidateProgramView({
        collection: this.programs,
        modelId: this.modelId
      });
      this.runningMateListView = new App.views.RunningMateListView({
        collection : this.runningMates,
        modelId: this.modelId
      });
      this.render();
    },

    render: function() {
      this.$el.html(this.template({candidate: this.model.toJSON()}));
      this.$el.find('.candidate-detail-running-mates').html(this.runningMateListView.el);
      this.$el.find('.candidate-detail-card').html(this.cardView.el);
      this.$el.find('.candidate-detail-program').html(this.programView.el);
    }
  });

  App.views.ThemeDetailView = Backbone.View.extend({

    tagName: 'div',
    className: 'theme-detail',

    initialize: function(options) {
      this.options = _.extend({modelId: null, programs: null}, options);
      this.modelId = this.options.modelId;
      this.programs = this.options.programs;
      this.template = App.templates.themeDetailTemplate;
      this.theme = null;
      this.listenTo(this.collection, 'sync', this.prepare);
      this.collection.fetch();
    },

    prepare: function() {
      this.theme = this.collection.findWhere({id: this.modelId});
      if (!this.theme) return this.notFound();
      this.programs.fetch({success: function(collection) {
        this.groupedPrograms = this.programs.findByThemeAndGroupByCandidate(this.modelId);
        this.render();
      }.bind(this)});
    },

    notFound: function() {
      this.$el.html("Désolé, ce thème n'existe pas.");
    },

    render: function() {
      this.$el.html(this.template({
        theme: this.theme.toJSON(),
        programs: this.groupedPrograms
      }));
    }
  });

  App.views.ThemeListView = Backbone.View.extend({

    tagName: 'div',
    className: 'theme-list',

    initialize: function(options) {
      this.options = options || {};
      this.template = App.templates.themeListTemplate;
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));
    }
  });

  // ---------------------------------------------------------------------------
  // Controllers
  // ---------------------------------------------------------------------------

  function candidateListController(collection) {
      var view = new App.views.CandidateListView({collection: App.collections.candidates});
      $('#content').html(view.el);
  }

  function candidateDetailController(id) {
    var view = new App.views.CandidateDetailView({
      modelId: id,
      collection: App.collections.candidates,
      programs: App.collections.programs,
      runningMates: App.collections.runningMates
    });
    $('#content').html(view.el);
  }

  function themeListController() {
    var view = new App.views.ThemeListView({collection: App.collections.themes});
    $('#content').html(view.el);
  }

  function themeDetailController(id) {
    var view = new App.views.ThemeDetailView({
      collection: App.collections.themes,
      modelId: id,
      programs: App.collections.programs
    });
    $('#content').html(view.el);
  }

  function aboutController() {
    $('#content').html(App.templates.aboutTemplate);
  }

  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  App.Router = Backbone.Router.extend({
    routes: {
      ''              : 'candidateListController',
      'candidats'     : 'candidateListController',
      'candidats/:id' : 'candidateDetailController',
      'themes'        : 'themeListController',
      'themes/:id'    : 'themeDetailController',
      'a-propos'      : 'aboutController'
    },

    candidateListController   : candidateListController,
    candidateDetailController : candidateDetailController,
    themeDetailController     : themeDetailController,
    themeListController       : themeListController,
    aboutController           : aboutController
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

})(jQuery, _, Backbone, Handlebars, markdown, jsPDF);
