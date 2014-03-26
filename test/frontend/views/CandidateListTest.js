define([

  'chai',
  'App.views.CandidateList',
  'App.collections.Candidate'

], function(chai, View, CandidateCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.CandidateListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.candidates).to.be.an.instanceof(CandidateCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should properly set template context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config']);
        });
        it('should properly set the mandatory config.baseUrl', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
      });
    });
  });
});
