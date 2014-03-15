(function($, _, Backbone, Handlebars, markdown, jsPDF) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  var App = window.App = {
    dataURL     : window.APP_BASE_URL + 'data.json',
    templates   : {},
    models      : {},
    collections : {},
    views       : {},
    controllers : {}
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  App.templates.candidateCard    = Handlebars.compile($('#candidate-card-template').html());
  App.templates.runningMateList  = Handlebars.compile($('#running-mate-list-template').html());
  App.templates.candidateProgram = Handlebars.compile($('#candidate-program-template').html());
  App.templates.candidateList    = Handlebars.compile($('#candidate-list-template').html());
  App.templates.candidateDetail  = Handlebars.compile($('#candidate-detail-template').html());
  App.templates.themeDetail      = Handlebars.compile($('#theme-detail-template').html());
  App.templates.themeList        = Handlebars.compile($('#theme-list-template').html());
  App.templates.about            = Handlebars.compile($('#about-template').html());

  //----------------------------------------------------------------------------
  // Template Helpers
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('md2html', function(md) {
    return new Handlebars.SafeString(markdown.toHTML(md));
  });

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  App.models.Theme       = Backbone.Model.extend({});
  App.models.Candidate   = Backbone.Model.extend({});
  App.models.RunningMate = Backbone.Model.extend({});
  App.models.Program     = Backbone.Model.extend({});

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  App.collections.Theme = Backbone.Collection.extend({

    model: App.models.Theme,
    url: App.dataURL,

    parse: function(res) {
      return res.themes;
    }
  });

  App.collections.Candidate = Backbone.Collection.extend({

    model: App.models.Candidate,
    url: App.dataURL,

    parse: function(res) {
      return res.candidates;
    }
  });

  App.collections.RunningMate = Backbone.Collection.extend({

    model: App.models.RunningMate,
    url: App.dataURL,

    parse: function(res) {
      return res.runningMates;
    },

    findByCandidate: function(id) {
      var models = this.filter(function(model) { return model.get('candidate').id === id; });
      return new App.collections.RunningMate(models);
    }
  });

  App.collections.Program = Backbone.Collection.extend({

    model: App.models.Program,
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
      return new App.collections.Program(models);
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

  App.collections.candidates   = new App.collections.Candidate();
  App.collections.runningMates = new App.collections.RunningMate();
  App.collections.programs     = new App.collections.Program();
  App.collections.themes       = new App.collections.Theme();

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  App.views.CandidateCard = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-card',

    initialize: function(options) {
      this.options = _.extend({showDetailLink: false}, options);
      this.showDetailLink = options.showDetailLink;
      this.template = App.templates.candidateCard;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        model: this.model.toJSON(),
        showDetailLink: this.showDetailLink
      }));
    }
  });

  App.views.RunningMateList = Backbone.View.extend({

    tagName: 'div',
    className: 'running-mate-list',

    initialize: function(options) {
      this.options = _.extend({
        modelId: null,
        runningMates: new App.collections.RunningMate()
      }, options);
      this.modelId      = this.options.modelId;
      this.runningMates = this.options.runningMates;
      this.template     = App.templates.runningMateList;
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

  App.views.CandidateProgram = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options  = _.extend({modelId: null}, options);
      this.modelId  = this.options.modelId;
      this.template = App.templates.candidateProgram;
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

  App.views.CandidateList = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-list',

    initialize: function(options) {
      this.options = options || {};
      this.template = App.templates.candidateList;
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    render: function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.collection.each(function(model) {
        var view = new App.views.CandidateCard({
          tagName: 'li',
          model: model,
          showDetailLink: model.get('programUrl') ? true : false
        });
        this.$el.find('.candidate-list-container').append(view.el);
      }.bind(this));
    }
  });

  App.views.CandidateDetail = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-detail',

    events: {
      'click a.makePDF': 'makePDF'
    },

    initialize: function(options) {
      this.options = _.extend({
        modelId: null,
        programs: new App.collections.Program(),
        runningMates: new App.collections.RunningMate()
      }, options);
      this.modelId      = this.options.modelId;
      this.programs     = this.options.programs;
      this.runningMates = this.options.runningMates;
      this.template     = App.templates.candidateDetail;
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
      this.model               = this.collection.findWhere({id: this.modelId});
      this.candidateCardView   = new App.views.CandidateCard({model: this.model, showDetailLink: false});
      this.programView         = new App.views.CandidateProgram({collection: this.programs, modelId: this.modelId});
      this.runningMateListView = new App.views.RunningMateList({collection : this.runningMates, modelId: this.modelId});
      this.render();
    },

    render: function() {
      this.$el.html(this.template({candidate: this.model.toJSON()}));
      this.$el.find('.candidate-detail-running-mates').html(this.runningMateListView.el);
      this.$el.find('.candidate-detail-card').html(this.candidateCardView.el);
      this.$el.find('.candidate-detail-program').html(this.programView.el);
    }
  });

  App.views.ThemeDetail = Backbone.View.extend({

    tagName: 'div',
    className: 'theme-detail',

    initialize: function(options) {
      this.options  = _.extend({modelId: null, programs: null}, options);
      this.modelId  = this.options.modelId;
      this.programs = this.options.programs;
      this.template = App.templates.themeDetail;
      this.theme    = null;
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
        theme    : this.theme.toJSON(),
        programs : this.groupedPrograms
      }));
    }
  });

  App.views.ThemeList = Backbone.View.extend({

    tagName: 'div',
    className: 'theme-list',

    initialize: function(options) {
      this.options  = options || {};
      this.template = App.templates.themeList;
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

  App.controllers.candidateList = function(collection) {
      var view = new App.views.CandidateList({collection: App.collections.candidates});
      $('#content').html(view.el);
  };

  App.controllers.candidateDetail = function(id) {
    var view = new App.views.CandidateDetail({
      modelId      : id,
      collection   : App.collections.candidates,
      programs     : App.collections.programs,
      runningMates : App.collections.runningMates
    });
    $('#content').html(view.el);
  };

  App.controllers.themeList = function() {
    var view = new App.views.ThemeList({collection: App.collections.themes});
    $('#content').html(view.el);
  };

  App.controllers.themeDetail = function(id) {
    var view = new App.views.ThemeDetail({
      collection : App.collections.themes,
      modelId    : id,
      programs   : App.collections.programs
    });
    $('#content').html(view.el);
  };

  App.controllers.about = function() {
    $('#content').html(App.templates.about);
  };

  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  App.Router = Backbone.Router.extend({
    routes: {
      ''              : App.controllers.candidateList,
      'candidats'     : App.controllers.candidateList,
      'candidats/:id' : App.controllers.candidateDetail,
      'themes'        : App.controllers.themeList,
      'themes/:id'    : App.controllers.themeDetail,
      'a-propos'      : App.controllers.about
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

})(jQuery, _, Backbone, Handlebars, markdown, jsPDF);
