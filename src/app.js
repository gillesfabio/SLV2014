(function($, _, Backbone, Handlebars, markdown, countdown) {

  /*jshint unused:false */
  'use strict';

  // ---------------------------------------------------------------------------
  // Namespace
  // ---------------------------------------------------------------------------

  var App = window.App = {
    dataURL: window.APP_BASE_URL + 'data/data.json',
    templates: {},
    models: {},
    collections: {},
    views: {},
    controllers: {}
  };

  // ---------------------------------------------------------------------------
  // Templates
  // ---------------------------------------------------------------------------

  App.templates.home = Handlebars.compile($('#home-template').html());
  App.templates.about = Handlebars.compile($('#about-template').html());
  App.templates.candidateCard = Handlebars.compile($('#candidate-card-template').html());
  App.templates.runningMateList = Handlebars.compile($('#running-mate-list-template').html());
  App.templates.candidateProgram = Handlebars.compile($('#candidate-program-template').html());
  App.templates.candidateList = Handlebars.compile($('#candidate-list-template').html());
  App.templates.candidateDetail = Handlebars.compile($('#candidate-detail-template').html());
  App.templates.themeDetail = Handlebars.compile($('#theme-detail-template').html());
  App.templates.themeList = Handlebars.compile($('#theme-list-template').html());
  App.templates.pollingPlaceList = Handlebars.compile($('#polling-place-list-template').html());

  //----------------------------------------------------------------------------
  // Template Helpers
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('md2html', function(md) {
    return new Handlebars.SafeString(markdown.toHTML(md));
  });

  Handlebars.registerHelper('formatAddress', function(address) {
    address = address.replace(/\n/g, '<br>');
    return new Handlebars.SafeString(address);
  });

  Handlebars.registerHelper('gmapsLink', function(search) {
    var url = [
      'http://maps.google.com/?q=',
      'France+06700+Saint-Laurent-du-Var+',
      encodeURIComponent(search)
    ];
    return new Handlebars.SafeString(url.join(''));
  });

  Handlebars.registerHelper('lastname', function(id) {
    if (id) return id.split('-')[1];
  });

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  App.models.Theme = Backbone.Model.extend({});
  App.models.PollingPlace = Backbone.Model.extend({});
  App.models.Candidate = Backbone.Model.extend({});
  App.models.RunningMate = Backbone.Model.extend({});
  App.models.Program = Backbone.Model.extend({});

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  App.collections.Theme = Backbone.Collection.extend({
    model: App.models.Theme,
    url: App.dataURL,
    parse: function(res) { return res.themes; }
  });

  App.collections.PollingPlace = Backbone.Collection.extend({
    model: App.models.PollingPlace,
    url: App.dataURL,
    parse: function(res) { return res.pollingPlaces; }
  });

  App.collections.Candidate = Backbone.Collection.extend({

    model: App.models.Candidate,
    url: App.dataURL,

    parse: function(res) {
      return res.candidates;
    },

    hasRound2: function() {
      return this.filter(function(model) {
        if (model.get('scoreRound1')) return model.get('scoreRound1') > 50;
      }).length > 0;
    },

    round2: function() {
      if (!this.hasRound2()) return;
      var prop = 'scoreRound2';
      var models = this.chain().filter(function(model) {
        return model.get(prop);
      }).sortBy(function(model) {
        return model.get(prop);
      }).value().reverse();
      if (models.length >= 2) models = models.slice(0, 2);
      return new this.constructor(models);
    }
  });

  App.collections.RunningMate = Backbone.Collection.extend({

    model: App.models.RunningMate,
    url: App.dataURL,

    parse: function(res) {
      return res.runningMates;
    },

    findByCandidate: function(id) {
      var models = this.filter(function(model) {
        return model.get('candidate').id === id;
      });
      return new this.constructor(models);
    }
  });

  App.collections.Program = Backbone.Collection.extend({

    model: App.models.Program,
    url: App.dataURL,

    parse: function(res) {
      return res.programs;
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
      return new this.constructor(models);
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
  // Views
  // ---------------------------------------------------------------------------

  App.views.CandidateCard = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-card',

    initialize: function(options) {
      this.options = _.extend({
        candidate: new App.models.Candidate(),
        showDetailLink: false
      }, options);
      this.candidate = this.options.candidate;
      this.showDetailLink = this.options.showDetailLink;
      this.template = App.templates.candidateCard;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        candidate: this.candidate.toJSON(),
        showDetailLink: this.showDetailLink
      }));
    }
  });

  App.views.CandidateProgram = Backbone.View.extend({

    tagName: 'div',
    className: 'candidate-program',

    initialize: function(options) {
      this.options = _.extend({
        programs: new App.collections.Program(),
        candidate: new App.models.Candidate()
      }, options);
      this.programs = this.options.programs;
      this.candidate = this.options.candidate;
      this.template = App.templates.candidateProgram;
      this.listenTo(this.programs, 'sync', this.render);
      this.programs.fetch();
    },

    render: function() {
      this.$el.html(this.template({
        projects: this.programs.candidateProjects(this.candidate.get('id'))
      }));
    }
  });

  App.views.RunningMateList = Backbone.View.extend({

    tagName: 'div',
    className: 'running-mate-list',

    initialize: function(options) {
      this.options = _.extend({
        runningMates: new App.collections.RunningMate(),
        candidate: new App.models.Candidate()
      }, options);
      this.candidate = this.options.candidate;
      this.runningMates = this.options.runningMates;
      this.template = App.templates.runningMateList;
      this.listenTo(this.runningMates, 'sync', this.render);
      this.runningMates.fetch();
    },

    render: function() {
      var runningMates = this.runningMates.findByCandidate(this.candidate.get('id'));
      this.$el.html(this.template({runningMates: runningMates.toJSON()}));
    }
  });

  App.views.CandidateList = Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-list',

    initialize: function(options) {
      this.options = _.extend({
        candidates: new App.collections.Candidate()
      }, options);
      this.candidates = this.options.candidates;
      this.template = App.templates.candidateList;
      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    render: function() {
      this.$el.html(this.template());
      this.candidates = new App.collections.Candidate(this.candidates.shuffle());
      this.candidates.each(function(candidate) {
        var view = new App.views.CandidateCard({
          tagName: 'li',
          candidate: candidate,
          showDetailLink: candidate.get('programUrl') ? true : false
        });
        this.$el.find('.candidate-list-container').append(view.el);
      }.bind(this));
    }
  });

  App.views.CandidateDetail = Backbone.View.extend({

    tagName   : 'div',
    className : 'candidate-detail',

    initialize: function(options) {
      this.options = _.extend({
        candidate: new App.models.Candidate(),
        programs: new App.collections.Program(),
        runningMates: new App.collections.RunningMate()
      }, options);

      this.candidate = this.options.candidate;
      this.programs = this.options.programs;
      this.runningMates = this.options.runningMates;
      this.template = App.templates.candidateDetail;
      this.setSubviews();
      this.render();
    },

    setSubviews: function() {
      this.candidateCardView = new App.views.CandidateCard({
        candidate: this.candidate,
        showDetailLink: false
      });
      this.programView = new App.views.CandidateProgram({
        programs: this.programs,
        candidate: this.candidate
      });
      this.runningMateListView = new App.views.RunningMateList({
        runningMates: this.runningMates,
        candidate: this.candidate
      });
    },

    render: function() {
      this.$el.html(this.template({candidate: this.candidate.toJSON()}));
      this.$el.find('.candidate-detail-running-mates').html(this.runningMateListView.el);
      this.$el.find('.candidate-detail-card').html(this.candidateCardView.el);
      this.$el.find('.candidate-detail-program').html(this.programView.el);
    }
  });

  App.views.ThemeList = Backbone.View.extend({

    tagName   : 'div',
    className : 'theme-list',

    initialize: function(options) {
      this.options = _.extend({
        themes: new App.collections.Theme()
      }, options);
      this.themes = this.options.themes;
      this.template = App.templates.themeList;
      this.listenTo(this.themes, 'sync', this.render);
      this.themes.fetch();
    },

    render: function() {
      this.$el.html(this.template(this.themes.toJSON()));
    }
  });

  App.views.ThemeDetail = Backbone.View.extend({

    tagName   : 'div',
    className : 'theme-detail',

    initialize: function(options) {
      this.options = _.extend({
        theme: new App.models.Theme(),
        programs: new App.collections.Program()
      }, options);
      this.theme = this.options.theme;
      this.programs = this.options.programs;
      this.template = App.templates.themeDetail;
      this.listenTo(this.programs, 'sync', this.render);
      this.programs.fetch();
    },

    render: function() {
      var programs = this.programs.findByThemeAndGroupByCandidate(this.theme.get('id'));
      this.$el.html(this.template({
        theme: this.theme.toJSON(),
        programs: programs
      }));
    }
  });

  App.views.Home = Backbone.View.extend({

    tagName: 'div',
    id: 'home',

    initialize: function(options) {
      this.options = _.extend({candidates: new App.collections.Candidate()}, options);
      this.candidates = this.options.candidates;
      this.template = App.templates.home;
      this.tsRound1 = null;
      this.tsRound2 = null;
      this.dates = {
        round1: new Date(2014, 2, 23),
        round2: new Date(2014, 2, 30)
      };
      this.clearTimers();
      this.listenTo(this.candidates, 'sync', this.render);
      this.candidates.fetch();
    },

    clearTimers: function() {
      window.clearInterval(this.tsRound1);
      window.clearInterval(this.tsRound2);
    },

    renderTimers: function() {
      this.tsRound1 = countdown(this.dates.round1, function(ts) {
        this.renderCountDown(ts, 'round1');
      }.bind(this));
      this.tsRound2 = countdown(this.dates.round2, function(ts) {
        this.renderCountDown(ts, 'round2');
      }.bind(this));
    },

    renderCountDown: function(ts, round) {
      var output = [];
      var units = {
        'days'    : 'jour',
        'hours'   : 'heure',
        'minutes' : 'minute'
      };
      Object.keys(units).forEach(function(key) {
        var word = units[key];
        if (ts[key]) {
          word = (ts[key] > 1) ? word + 's' : word;
          output.push(_.str.sprintf('%d %s', ts[key], word));
        }
      }.bind(this));
      this.$el.find(_.str.sprintf('.countdown-%s', round)).html(output.join(', '));
    },

    render: function() {
      var elected, candidatesRound2;
      elected = this.candidates.findWhere({elected: true});
      elected = elected ? elected.toJSON() : null;
      candidatesRound2 = this.candidates.round2();
      candidatesRound2 = candidatesRound2 ? candidatesRound2.toJSON() : null;
      this.$el.html(this.template({
        elected: elected,
        candidatesRound1: new App.collections.Candidate(this.candidates.shuffle()).toJSON(),
        hasRound2: this.candidates.hasRound2(),
        candidatesRound2: candidatesRound2
      }));
      this.renderTimers();
    }
  });

  App.views.PollingPlaceList = Backbone.View.extend({

    tagName   : 'div',
    className : 'polling-place-list',

    initialize: function(options) {
      this.options = _.extend({
        pollingPlaces: new App.collections.PollingPlace()
      }, options);
      this.pollingPlaces = this.options.pollingPlaces;
      this.template = App.templates.pollingPlaceList;
      this.listenTo(this.pollingPlaces, 'sync', this.render);
      this.pollingPlaces.fetch();
    },

    render: function() {
      this.$el.html(this.template({
        pollingPlaces: this.pollingPlaces.toJSON()
      }));
    }
  });

  // ---------------------------------------------------------------------------
  // Controllers
  // ---------------------------------------------------------------------------

  App.controllers.home = function() {
    var view = new App.views.Home();
    $('#content').html(view.el);
  };

  App.controllers.candidateList = function(collection) {
    var view = new App.views.CandidateList();
    $('#content').html(view.el);
  };

  App.controllers.candidateDetail = function(id) {
    var $content = $('#content');
    var candidates = new App.collections.Candidate();
    candidates.fetch({
      success: function(candidates) {
        var view  = new App.views.CandidateDetail({
          candidate: candidates.findWhere({id: id}),
          programs: new App.collections.Program(),
          runningMates: new App.collections.RunningMate()
        });
        $content.html(view.el);
      },
      error: function(error) {
        console.error(error);
        $content.html("Désolé, une erreur est survenue.");
      }
    });
  };

  App.controllers.themeList = function() {
    var view = new App.views.ThemeList({themes: new App.collections.Theme()});
    $('#content').html(view.el);
  };

  App.controllers.themeDetail = function(id) {
    var $content = $('#content');
    var themes = new App.collections.Theme();
    themes.fetch({
      success: function(themes) {
        var view = new App.views.ThemeDetail({theme: themes.findWhere({id: id})});
        $content.html(view.el);
      },
      error: function(error) {
        console.error(error);
        $content.html("Désolé, une erreur est survenue.");
      }
    });
  };

  App.controllers.pollingPlaceList = function() {
    var view = new App.views.PollingPlaceList({
      pollingPlaces: new App.collections.PollingPlace()
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
      '': App.controllers.home,
      'candidats': App.controllers.candidateList,
      'candidats/:id' : App.controllers.candidateDetail,
      'themes': App.controllers.themeList,
      'themes/:id': App.controllers.themeDetail,
      'bureaux': App.controllers.pollingPlaceList,
      'a-propos': App.controllers.about
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
    $('.top-bar ul.right li').click(function() {
      $('.top-bar').removeClass('expanded');
    });
    var router = new App.Router();
    Backbone.history.start({root: window.APP_BASE_URL});
  });

})(jQuery, _, Backbone, Handlebars, markdown, countdown);
