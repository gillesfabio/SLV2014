define([

  'backbone',
  'App.controllers.home',
  'App.controllers.candidateList',
  'App.controllers.candidateDetail',
  'App.controllers.themeList',
  'App.controllers.themeDetail',
  'App.controllers.officeList',
  'App.controllers.about'

], function(
  Backbone,
  home,
  candidateList,
  candidateDetail,
  themeList,
  themeDetail,
  officeList,
  about) {

  'use strict';

  return Backbone.Router.extend({
    routes: {
      ''              : home,
      'candidats'     : candidateList,
      'candidats/:id' : candidateDetail,
      'themes'        : themeList,
      'themes/:id'    : themeDetail,
      'bureaux'       : officeList,
      'a-propos'      : about
    }
  });
});
