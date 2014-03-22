define([

  'chai',
  'App.views.Home',
  'App.collections.Candidate'

], function(chai, View, CandidateCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.HomeTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.candidates).to.be.an.instanceof(CandidateCollection);
          expect(view).to.have.ownProperty('tsRound1', 'tsRound2', 'dates');
          expect(view.dates).to.have.ownProperty('round1', 'round2');
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys([
            'config',
            'elected',
            'candidatesRound1',
            'hasRound2',
            'candidatesRound2'
          ]);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set the elected candidate if there is one (and other variables should be consistent)', function() {
          var models = [
            {scoreRound1: 51},
            {scoreRound1: 21},
            {scoreRound1: 29}
          ];
          var candidates = new CandidateCollection(models);
          var view       = new View({candidates: candidates});
          var context    = view.getTemplateContext();
          expect(context.elected).to.deep.equal({scoreRound1: 51});
          expect(context.candidatesRound1).to.have.length(3);
          expect(context.hasRound2).to.be.false;
          expect(context.candidatesRound2).to.be.empty;
        });
        it('should not set the elected candidate if there is no elected one (and other variables should be consistent)', function() {
          var models = [
            {scoreRound1: 28},
            {scoreRound1: 21},
            {scoreRound1: 29}
          ];
          var candidates = new CandidateCollection(models);
          var view       = new View({candidates: candidates});
          var context    = view.getTemplateContext();
          expect(context.elected).to.be.empty;
          expect(context.candidatesRound1).to.have.length(3);
          expect(context.hasRound2).to.be.true;
          expect(context.candidatesRound2).to.be.empty;
        });
        it('should set the elected candidate when round 2 is done (and other variables should be consistent)', function() {
          var models = [
            {scoreRound1: 28, scoreRound2: 60},
            {scoreRound1: 21, scoreRound2: 40},
            {scoreRound1: 29, scoreRound2: null}
          ];
          var candidates = new CandidateCollection(models);
          var view       = new View({candidates: candidates});
          var context    = view.getTemplateContext();
          expect(context.elected).to.deep.equal({scoreRound1: 28, scoreRound2: 60});
          expect(context.candidatesRound1).to.have.length(3);
          expect(context.hasRound2).to.be.true;
          expect(context.candidatesRound2).to.have.length(2);
        });
      });
    });
  });
});
