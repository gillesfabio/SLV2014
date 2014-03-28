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
    'swag'              : 'vendor/swag/lib/swag',

    // App models
    'App.models.Candidate' : 'src/models/Candidate',
    'App.models.Result'    : 'src/models/Result',
    'App.models.Office'    : 'src/models/Office',
    'App.models.Program'   : 'src/models/Program',
    'App.models.List'      : 'src/models/List',
    'App.models.Theme'     : 'src/models/Theme',

    // App collections
    'App.collections.Candidate' : 'src/collections/Candidate',
    'App.collections.Result'    : 'src/collections/Result',
    'App.collections.Office'    : 'src/collections/Office',
    'App.collections.Program'   : 'src/collections/Program',
    'App.collections.List'      : 'src/collections/List',
    'App.collections.Theme'     : 'src/collections/Theme',

    // App views
    'App.views.CandidateCard'          : 'src/views/CandidateCard',
    'App.views.CandidateDetailProgram' : 'src/views/CandidateDetailProgram',
    'App.views.CandidateDetailList'    : 'src/views/CandidateDetailList',
    'App.views.CandidateList'          : 'src/views/CandidateList',
    'App.views.CandidateProgram'       : 'src/views/CandidateProgram',
    'App.views.Home'                   : 'src/views/Home',
    'App.views.ResultList'             : 'src/views/ResultList',
    'App.views.Elected'                : 'src/views/Elected',
    'App.views.OfficeList'             : 'src/views/OfficeList',
    'App.views.ThemeDetail'            : 'src/views/ThemeDetail',
    'App.views.ThemeList'              : 'src/views/ThemeList',

    // App controllers
    'App.controllers.about'                  : 'src/controllers/about',
    'App.controllers.candidateDetailList'    : 'src/controllers/candidateDetailList',
    'App.controllers.candidateDetailProgram' : 'src/controllers/candidateDetailProgram',
    'App.controllers.candidateList'          : 'src/controllers/candidateList',
    'App.controllers.home'                   : 'src/controllers/home',
    'App.controllers.officeList'             : 'src/controllers/officeList',
    'App.controllers.themeDetail'            : 'src/controllers/themeDetail',
    'App.controllers.themeList'              : 'src/controllers/themeList',

    // App
    'App.config'  : 'src/config',
    'App.helpers' : 'src/helpers',
    'App.Router'  : 'src/router'
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
    'swag': {
      deps    : ['handlebars'],
      exports : 'Swag'
    }
  }
});

requirejs([

  'domReady',
  'jquery',
  'backbone',
  'handlebars',
  'swag',
  'App.Router',
  'text!src/templates/_candidate-result.hbs',

  'modernizr',
  'foundation',
  'App.helpers'

], function(
  domReady,
  $,
  Backbone,
  Handlebars,
  Swag,
  Router,
  candidateResultPartial) {

  'use strict';

  // Handlebars extensions
  Swag.registerHelpers(Handlebars);

  // Handlebars partials
  Handlebars.registerPartial('candidateResult', candidateResultPartial);

  domReady(function() {
    $(document).foundation();
    $('.top-bar ul.right li').click(function() {
      $('.top-bar').removeClass('expanded');
    });
    var router = new Router();
    Backbone.history.start({root: window.APP_BASE_URL});
  });

});
