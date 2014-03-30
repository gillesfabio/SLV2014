define([

  'chai',
  'App.views.OfficeResultList'

], function(chai, View) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.OfficeResultListTest', function() {

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'round', 'results', 'candidateStats']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
      });
    });
  });
});
