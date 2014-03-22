requirejs.config({

  baseUrl: '.',

  paths: {
    // Vendor
    'text'              : 'vendor/requirejs-text/text',
    'domReady'          : 'vendor/requirejs-domready/domReady',
    'jquery'            : 'vendor/jquery/dist/jquery',
    'backbone'          : 'vendor/backbone/backbone',
    'underscore'        : 'vendor/underscore/underscore',
    'underscore.string' : 'vendor/underscore.string/lib/underscore.string',
    'handlebars'        : 'vendor/handlebars/handlebars',
    'markdown'          : 'vendor/markdown/lib/markdown',
    'countdown'         : 'vendor/countdownjs/countdown',
    'modernizr'         : 'vendor/modernizr/modernizr',
    'foundation'        : 'vendor/foundation/js/foundation.min',

    // Vendor test
    'mocha' : 'vendor/mocha/mocha',
    'chai'  : 'vendor/chai/chai',
    'sinon' : 'vendor/sinonjs/sinon',

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

    // App misc
    'App.config'  : 'src/config',
    'App.helpers' : 'src/helpers',
    'App.Router'  : 'src/router',

    // Tests: collections
    'App.collections.CandidateTest'   : 'test/frontend/collections/CandidateTest',
    'App.collections.ProgramTest'     : 'test/frontend/collections/ProgramTest',
    'App.collections.RunningMateTest' : 'test/frontend/collections/RunningMateTest',

    // Tests: views
    'App.views.CandidateCardTest'    : 'test/frontend/views/CandidateCardTest',
    'App.views.CandidateDetailTest'  : 'test/frontend/views/CandidateDetailTest',
    'App.views.CandidateListTest'    : 'test/frontend/views/CandidateListTest',
    'App.views.CandidateProgramTest' : 'test/frontend/views/CandidateProgramTest',
    'App.views.HomeTest'             : 'test/frontend/views/HomeTest',
    'App.views.PollingPlaceListTest' : 'test/frontend/views/PollingPlaceListTest',
    'App.views.RunningMateListTest'  : 'test/frontend/views/RunningMateListTest',
    'App.views.ThemeDetailTest'      : 'test/frontend/views/ThemeDetailTest',
    'App.views.ThemeListTest'        : 'test/frontend/views/ThemeListTest'
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
    },
    'mocha': {
      exports: 'mocha'
    },
    'chai': {
      exports: 'chai'
    },
    'sinon': {
      exports: 'sinon'
    }
  }
});

requirejs(['mocha', 'chai'], function(mocha, chai) {

  'use strict';

  chai.config.includeStack = true;
  mocha.setup('bdd');

  window.APP_BASE_URL = '/';

  require([

    'App.collections.CandidateTest',
    'App.collections.ProgramTest',
    'App.collections.RunningMateTest',
    'App.views.CandidateCardTest',
    'App.views.CandidateDetailTest',
    'App.views.CandidateListTest',
    'App.views.CandidateProgramTest',
    'App.views.HomeTest',
    'App.views.PollingPlaceListTest',
    'App.views.RunningMateListTest',
    'App.views.ThemeDetailTest',
    'App.views.ThemeListTest'

  ], function() {

    mocha.run();

  });

});
