define([

  'chai',
  'App.views.Elected',
  'App.collections.Result'

], function(chai, View, ResultCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.ElectedTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.results).to.be.an.instanceof(ResultCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should properly set template context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.contain.keys(['config', 'elected']);
        });
        it('should properly set the mandatory config.baseUrl', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should properly set elected candidate if one has been elected', function() {
          var results = new ResultCollection([
            {
              round: 1,
              candidates: [
                {candidate: 'john', percentage: 21, count: 11},
                {candidate: 'martin', percentage: 8, count: 11},
                {candidate: 'steve', percentage: 20, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {candidate: 'john', percentage: 22, count: 20},
                {candidate: 'martin', percentage: 8, count: 11},
                {candidate: 'steve', percentage: 49, count: 24}
              ]
            }
          ]);
          var view    = new View({results: results});
          var context = view.getTemplateContext();
          expect(context.elected).to.deep.equal({candidate: 'steve', percentage: 49, count: 24});
        });
        it('should properly set elected candidate to undefined if no candidate has been elected yet', function() {
          var results = new ResultCollection([
            {
              round: 1,
              candidates: [
                {candidate: 'john', percentage: 21, count: 11},
                {candidate: 'martin', percentage: 8, count: 11},
                {candidate: 'steve', percentage: 20, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {candidate: 'john', percentage: 22, count: 20},
                {candidate: 'martin', percentage: 8, count: 11},
                {candidate: 'steve', percentage: null, count: null}
              ]
            }
          ]);
          var view    = new View({results: results});
          var context = view.getTemplateContext();
          expect(context.elected).to.be.undefined;
        });
      });
    });
  });
});
