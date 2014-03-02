(function($, _, Backbone, Handlebars) {

  'use strict';

  /**
   * The homepage.
   */
  function home() {
    console.log('home');
  }

  function candidate(slug) {
    console.log(slug);
  }

  /**
   * Application routes.
   */
  var routes = {
    '': 'home',
    'candidate/:slug': 'candidate'
  };

  /**
   * Application router.
   */
  var Router = Backbone.Router.extend({routes: routes});

  // Foundation
  $(document).foundation();

  // DOM Ready
  $(function() {
    var router = new Router();
    router.on('route:home', home);
    router.on('route:candidate', candidate);
    Backbone.history.start({pushState: true});
  });

})(jQuery, _, Backbone, Handlebars);
