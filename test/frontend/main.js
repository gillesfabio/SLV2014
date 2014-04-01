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

    // Vendor test
    'mocha' : 'vendor/mocha/mocha',
    'chai'  : 'vendor/chai/chai',
    'sinon' : 'vendor/sinonjs/sinon',

    // App models
    'App.models.Candidate'     : 'src/models/Candidate',
    'App.models.Result'        : 'src/models/Result',
    'App.models.Office'        : 'src/models/Office',
    'App.models.OfficeResult'  : 'src/models/OfficeResult',
    'App.models.Program'       : 'src/models/Program',
    'App.models.List'          : 'src/models/List',
    'App.models.Theme'         : 'src/models/Theme',
    'App.models.CouncilMember' : 'src/models/CouncilMember',

    // App collections
    'App.collections.Candidate'     : 'src/collections/Candidate',
    'App.collections.Result'        : 'src/collections/Result',
    'App.collections.Office'        : 'src/collections/Office',
    'App.collections.OfficeResult'  : 'src/collections/OfficeResult',
    'App.collections.Program'       : 'src/collections/Program',
    'App.collections.List'          : 'src/collections/List',
    'App.collections.Theme'         : 'src/collections/Theme',
    'App.collections.CouncilMember' : 'src/collections/CouncilMember',

    // App views
    'App.views.CandidateCard'          : 'src/views/CandidateCard',
    'App.views.CandidateDetailProgram' : 'src/views/CandidateDetailProgram',
    'App.views.CandidateDetailList'    : 'src/views/CandidateDetailList',
    'App.views.Home'                   : 'src/views/Home',
    'App.views.ResultList'             : 'src/views/ResultList',
    'App.views.Elected'                : 'src/views/Elected',
    'App.views.OfficeList'             : 'src/views/OfficeList',
    'App.views.OfficeResultList'       : 'src/views/OfficeResultList',
    'App.views.ThemeDetail'            : 'src/views/ThemeDetail',
    'App.views.ThemeList'              : 'src/views/ThemeList',
    'App.views.Council'                : 'src/views/Council',

    // App controllers
    'App.controllers.about'                  : 'src/controllers/about',
    'App.controllers.candidateDetailProgram' : 'src/controllers/candidateDetailProgram',
    'App.controllers.candidateDetailList'    : 'src/controllers/candidateDetailList',
    'App.controllers.home'                   : 'src/controllers/home',
    'App.controllers.officeList'             : 'src/controllers/officeList',
    'App.controllers.officeResultList'       : 'src/controllers/officeResultList',
    'App.controllers.themeDetail'            : 'src/controllers/themeDetail',
    'App.controllers.themeList'              : 'src/controllers/themeList',
    'App.controllers.council'                : 'src/controllers/council',

    // App misc
    'App.config'  : 'src/config',
    'App.helpers' : 'src/helpers',
    'App.Router'  : 'src/router',

    // Tests: collections
    'App.collections.ResultTest'        : 'test/frontend/collections/ResultTest',
    'App.collections.ProgramTest'       : 'test/frontend/collections/ProgramTest',
    'App.collections.ListTest'          : 'test/frontend/collections/ListTest',
    'App.collections.OfficeResultTest'  : 'test/frontend/collections/OfficeResultTest',
    'App.collections.CouncilMemberTest' : 'test/frontend/collections/CouncilMemberTest',

    // Tests: models
    'App.models.ResultTest': 'test/frontend/models/ResultTest',

    // Tests: views
    'App.views.CandidateCardTest'          : 'test/frontend/views/CandidateCardTest',
    'App.views.CandidateDetailProgramTest' : 'test/frontend/views/CandidateDetailProgramTest',
    'App.views.CandidateDetailListTest'    : 'test/frontend/views/CandidateDetailListTest',
    'App.views.HomeTest'                   : 'test/frontend/views/HomeTest',
    'App.views.ResultListTest'             : 'test/frontend/views/ResultListTest',
    'App.views.ElectedTest'                : 'test/frontend/views/ElectedTest',
    'App.views.OfficeListTest'             : 'test/frontend/views/OfficeListTest',
    'App.views.OfficeResultListTest'       : 'test/frontend/views/OfficeResultListTest',
    'App.views.ThemeDetailTest'            : 'test/frontend/views/ThemeDetailTest',
    'App.views.ThemeListTest'              : 'test/frontend/views/ThemeListTest',
    'App.views.CouncilTest'                : 'test/frontend/views/CouncilTest'
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
    },
    'swag': {
      deps    : ['handlebars'],
      exports : 'Swag'
    }
  }
});

requirejs([

  'mocha',
  'chai',
  'handlebars',
  'swag',
  'text!src/templates/_candidate-result.hbs',
  'text!src/templates/_office-result.hbs'

], function(
  mocha,
  chai,
  Handlebars,
  Swag,
  candidateResultTemplate,
  officeResultTemplate) {

  'use strict';

  // Handlebars extensions
  Swag.registerHelpers(Handlebars);

  // Handlebars partials
  Handlebars.registerPartial('candidateResult', candidateResultTemplate);
  Handlebars.registerPartial('officeResult', officeResultTemplate);

  chai.config.includeStack = true;
  mocha.setup('bdd');

  window.APP_BASE_URL = '/';

  require([

    'App.helpers',

    'App.collections.ResultTest',
    'App.collections.ProgramTest',
    'App.collections.ListTest',
    'App.collections.OfficeResultTest',
    'App.collections.CouncilMemberTest',

    'App.models.ResultTest',

    'App.views.CandidateCardTest',
    'App.views.CandidateDetailProgramTest',
    'App.views.CandidateDetailListTest',
    'App.views.HomeTest',
    'App.views.ResultListTest',
    'App.views.ElectedTest',
    'App.views.OfficeListTest',
    'App.views.OfficeResultListTest',
    'App.views.ThemeDetailTest',
    'App.views.ThemeListTest',
    'App.views.CouncilTest'

  ], function() {

    mocha.run();

  });

});
