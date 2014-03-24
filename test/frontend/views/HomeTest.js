define([

  'chai',
  'App.views.Home',
  'App.collections.Result'

], function(chai, View, ResultCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.HomeTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.results).to.be.an.instanceof(ResultCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config']);
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
