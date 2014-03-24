define([

  'chai',
  'App.views.ResultList',
  'App.collections.Result'

], function(chai, View, ResultCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.ResultListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.round).to.equal(1);
          expect(view.results).to.be.an.instanceof(ResultCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should properly set template context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.contain.keys(['config']);
        });
        it('should properly set the mandatory config.baseUrl', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should properly set results for a given round', function() {
          var col = new ResultCollection([
            {round: 1, candidates: []},
            {round: 2, candidates: []}
          ]);
          var view = new View({round: 2, results: col});
          var context = view.getTemplateContext();
          expect(context.results).to.deep.equal({round: 2, candidates: []});
        });
      });
    });
  });
});
