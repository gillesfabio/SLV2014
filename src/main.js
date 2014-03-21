requirejs.config({
  baseUrl: '.',
  paths: {
    // Vendor
    'text'              : 'vendor/requirejs-text/text',
    'jquery'            : 'vendor/jquery/dist/jquery',
    'backbone'          : 'vendor/backbone/backbone',
    'underscore'        : 'vendor/underscore/underscore',
    'underscore.string' : 'vendor/underscore.string/lib/underscore.string',
    'handlebars'        : 'vendor/handlebars/handlebars',
    'markdown'          : 'vendor/markdown/lib/markdown',
    'countdown'         : 'vendor/countdownjs/countdown',
    'modernizr'         : 'vendor/modernizr/modernizr',
    'foundation'        : 'vendor/foundation/js/foundation.min',

    // App models
    'App.models.Candidate'         : 'src/models/Candidate',
    'App.models.PollingPlace'      : 'src/models/PollingPlace',
    'App.models.Program'           : 'src/models/Program',
    'App.models.RunningMate'       : 'src/models/RunningMate',
    'App.models.Theme'             : 'src/models/Theme',

    // App collections
    'App.collections.Candidate'    : 'src/collections/Candidate',
    'App.collections.PollingPlace' : 'src/collections/PollingPlace',
    'App.collections.Program'      : 'src/collections/Program',
    'App.collections.RunningMate'  : 'src/collections/RunningMate',
    'App.collections.Theme'        : 'src/collections/Theme',

    // App views
    'App.views.CandidateCard'    : 'src/views/CandidateCard',
    'App.views.CandidateDetail'  : 'src/views/CandidateDetail',
    'App.views.CandidateList'    : 'src/views/CandidateList',
    'App.views.CandidateProgram' : 'src/views/CandidateProgram',
    'App.views.Home'             : 'src/views/Home',
    'App.views.PollingPlaceList' : 'src/views/PollingPlaceList',
    'App.views.RunningMateList'  : 'src/views/RunningMateList',
    'App.views.ThemeDetail'      : 'src/views/ThemeDetail',
    'App.views.ThemeList'        : 'src/views/ThemeList',

    // App controllers
    'App.controllers.about'            : 'src/controllers/about',
    'App.controllers.candidateDetail'  : 'src/controllers/candidateDetail',
    'App.controllers.candidateList'    : 'src/controllers/candidateList',
    'App.controllers.home'             : 'src/controllers/home',
    'App.controllers.pollingPlaceList' : 'src/controllers/pollingPlaceList',
    'App.controllers.themeDetail'      : 'src/controllers/themeDetail',
    'App.controllers.themeList'        : 'src/controllers/themeList',

    // App config
    'App.config': 'src/config',

    // App helpers
    'App.helpers': 'src/helpers',

    // Router
    'App.Router': 'src/router'
  },

  shim: {
    'backbone': {
      deps    : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'underscore.string': {
      deps    : ['underscore'],
      exports : '_'
    },
    'handlebars': {
      deps    : ['jquery'],
      exports : 'Handlebars'
    },
    'markdown': {
      deps    : ['jquery'],
      exports : 'markdown'
    },
    'countdown': {
      deps    : ['jquery'],
      exports : 'countdown'
    },
    'modernizr': {
      exports: 'Modernizr'
    },
    'foundation': {
      deps    : ['jquery', 'modernizr'],
      exports : 'Foundation'
    }
  }
});

requirejs([

  'jquery',
  'backbone',
  'App.Router',
  'modernizr',
  'foundation',
  'handlebars',
  'App.helpers'

], function($, Backbone, Router) {

  'use strict';

  $(document).foundation();

  $(function() {
    $('.top-bar ul.right li').click(function() {
      $('.top-bar').removeClass('expanded');
    });
    var router = new Router();
    Backbone.history.start({root: window.APP_BASE_URL});
  });
});
