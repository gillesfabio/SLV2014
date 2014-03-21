define([

  'jquery',
  'handlebars',
  'text!src/templates/about.hbs'

], function($, Handlebars, template) {

  'use strict';

  var controller = function() {
    template = Handlebars.compile(template);
    $('#content').html(template);
  };

  return controller;

});
