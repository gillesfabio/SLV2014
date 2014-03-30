define([

  'chai',
  'App.views.OfficeResultList',
  'App.collections.OfficeResult',
  'text!../fixtures/officesResults.json'

], function(
  chai,
  View,
  OfficeResultCollection,
  officesResultsFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  officesResultsFixtures = JSON.parse(officesResultsFixtures);

  describe('App.views', function() {
    describe('App.views.OfficeResultListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.round).to.equal(1);
          expect(view.results).to.be.an.instanceof(OfficeResultCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var col     = new OfficeResultCollection(officesResultsFixtures);
          var view    = new View({results: col, round: 2});
          var context = view.getTemplateContext();
          expect(context).to.have.keys([
            'config',
            'round',
            'results',
            'candidateStats'
          ]);
          expect(context.round).to.equal(2);
          expect(context.results).to.deep.equal(col.findByRound(2).toJSON());
          expect(context.candidateStats).to.deep.equal(col.findByRound(2).getCandidateTopFlopStats());
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
      });
    });
  });
});
