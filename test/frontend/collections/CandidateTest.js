define([

  'chai',
  'App.collections.Candidate'

], function(chai, CandidateCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {

    describe('App.collections.Candidate', function() {

      describe('#hasRound2', function() {
        it('should return false if a candidate has 51% of votes', function() {
          var models = [
            {scoreRound1: 51},
            {scoreRound1: 43},
            {scoreRound1: 6}
          ];
          var col = new CandidateCollection(models);
          expect(col.hasRound2()).to.be.false;
        });
        it('should return true if no candidate has more than 50% of votes', function() {
          var models = [
            {scoreRound1: 25},
            {scoreRound1: 25},
            {scoreRound1: 25},
            {scoreRound1: 25}
          ];
          var col = new CandidateCollection(models);
          expect(col.hasRound2()).to.be.true;
        });
        it('should return false if a candidate has more than 50% of votes', function() {
          var models = [
            {scoreRound1: 50.2},
            {scoreRound1: 25},
            {scoreRound1: 24.8}
          ];
          var col = new CandidateCollection(models);
          expect(col.hasRound2()).to.be.false;
        });
        it('should return true if two candidates have 50% of votes', function() {
          var models = [
            {scoreRound1: 50},
            {scoreRound1: 50}
          ];
          var col = new CandidateCollection(models);
          expect(col.hasRound2()).to.be.true;
        });
      });
      describe('#round2', function() {
        it('should return an empty collection if there is no round 2', function() {
          var models = [
            {scoreRound1: 51},
            {scoreRound1: 25},
            {scoreRound1: 24}
          ];
          var col = new CandidateCollection(models);
          expect(col.round2()).to.be.an.instanceof(CandidateCollection);
          expect(col.round2().size()).to.equal(0);
        });
        it('should return only two models and the two max scores if there is a round 2', function() {
          var models = [
            {scoreRound1: 25, scoreRound2: 45},
            {scoreRound1: 25, scoreRound2: 40},
            {scoreRound1: 25, scoreRound2: 5}
          ];
          var col = new CandidateCollection(models);
          models = col.round2();
          expect(models).to.be.an.instanceof(CandidateCollection);
          expect(models.size()).to.equal(2);
          expect(models.models[0].get('scoreRound2')).to.equal(45);
          expect(models.models[1].get('scoreRound2')).to.equal(40);
        });
      });

      describe('#elected', function() {
        it('should return the elected candidate if there is no round 2 and if the candidate has 51% of votes', function() {
          var models = [
            {scoreRound1: 51},
            {scoreRound1: 25},
            {scoreRound1: 24}
          ];
          var col = new CandidateCollection(models);
          var elected = col.elected();
          expect(elected).to.be.ok;
          expect(elected.get('scoreRound1')).to.equal(51);
        });
        it('should return the elected candidate if there is no round 2 and if the candidate has more than 50% of votes', function() {
          var models = [
            {scoreRound1: 50.1},
            {scoreRound1: 25},
            {scoreRound1: 20}
          ];
          var col = new CandidateCollection(models);
          var elected = col.elected();
          expect(elected).to.be.ok;
          expect(elected.get('scoreRound1')).to.equal(50.1);
        });
        it('should return the elected candidate if there is a round 2', function() {
          var models = [
            {scoreRound1: 25, scoreRound2: 45},
            {scoreRound1: 25, scoreRound2: 40},
            {scoreRound1: 25, scoreRound2: 5}
          ];
          var col = new CandidateCollection(models);
          var elected = col.elected();
          expect(elected).to.be.ok;
          expect(elected.get('scoreRound2')).to.equal(45);
        });
      });
    });
  });
});
