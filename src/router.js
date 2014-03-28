define([

  'backbone',
  'App.controllers.home',
  'App.controllers.candidateList',
  'App.controllers.candidateDetailProgram',
  'App.controllers.candidateDetailList',
  'App.controllers.themeList',
  'App.controllers.themeDetail',
  'App.controllers.officeList',
  'App.controllers.about'

], function(
  Backbone,
  home,
  candidateList,
  candidateDetailProgram,
  candidateDetailList,
  themeList,
  themeDetail,
  officeList,
  about) {

  'use strict';

  return Backbone.Router.extend({
    routes: {
      ''                        : home,
      'candidats'               : candidateList,
      'candidats/:id/liste'     : candidateDetailList,
      'candidats/:id/programme' : candidateDetailProgram,
      'themes'                  : themeList,
      'themes/:id'              : themeDetail,
      'bureaux'                 : officeList,
      'a-propos'                : about
    }
  });
});
