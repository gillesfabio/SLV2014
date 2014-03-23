define([

  'chai',
  'App.collections.Candidate'

], function(chai, CandidateCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {

    describe('App.collections.Candidate', function() {

      describe('#isRound1Done', function() {
        it('should return false if round1 is not done', function() {
          var models = [
            {scoreRound1: null},
            {scoreRound1: null},
            {scoreRound1: 6}
          ];
          var col = new CandidateCollection(models);
          expect(col.isRound1Done()).to.be.false;
        });
        it('should return true if round1 is done', function() {
          var models = [
            {scoreRound1: 20},
            {scoreRound1: 20},
            {scoreRound1: 6}
          ];
          var col = new CandidateCollection(models);
          expect(col.isRound1Done()).to.be.true;
        });
      });

      describe('#isRound2Done', function() {
        it('should return true if round1 is done and a candidate has been elected with the absolute majority', function() {
          var models = [
            {scoreRound1: 50.1, scoreRound2: null},
            {scoreRound1: 12, scoreRound2: null},
            {scoreRound1: 6, scoreRound2: null}
          ];
          var col = new CandidateCollection(models);
          expect(col.isRound2Done()).to.be.true;
        });
        it('should return true if at least two candidates have a score', function() {
          var models = [
            {scoreRound1: 20, scoreRound2: 45},
            {scoreRound1: 20, scoreRound2: 20},
            {scoreRound1: 6, scoreRound2: null}
          ];
          var col = new CandidateCollection(models);
          expect(col.isRound2Done()).to.be.true;
        });
        it('should return false if round1 is not done', function() {
          var models = [
            {scoreRound1: null, scoreRound2: null},
            {scoreRound1: 20, scoreRound2: null},
            {scoreRound1: 6, scoreRound2: null}
          ];
          var col = new CandidateCollection(models);
          expect(col.isRound2Done()).to.be.false;
        });
      });

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

      describe('#round1', function() {
        it('should return candidates sorted by scoreRound1 by default', function() {
          var col = new CandidateCollection([
            {scoreRound1: 11},
            {scoreRound1: 23},
            {scoreRound1: 44},
            {scoreRound1: 8.2},
            {scoreRound1: 1.20}
          ]);
          var models = col.round1();
          expect(models.models[0].get('scoreRound1')).to.equal(44);
          expect(models.models[1].get('scoreRound1')).to.equal(23);
          expect(models.models[2].get('scoreRound1')).to.equal(11);
          expect(models.models[3].get('scoreRound1')).to.equal(8.2);
          expect(models.models[4].get('scoreRound1')).to.equal(1.20);
        });
        it('should return candidates in suffle order if shuffle argument is true', function() {
          var col = new CandidateCollection([
            {scoreRound1: 44},
            {scoreRound1: 12},
            {scoreRound1: 22},
            {scoreRound1: 32},
            {scoreRound1: 2}
          ]);
          var expectedScores = [44, 32, 22, 12, 2];
          var getScores = function(model) { return model.get('scoreRound1'); };
          var models = col.round1();
          var scores = models.map(getScores);
          expect(scores).eql(expectedScores);
          models = col.round1({shuffle: true});
          scores = models.map(getScores);
          expect(scores).to.not.eql(expectedScores);
        });
      });

      describe('#round2', function() {
        it('should return falsy if there is no round 2', function() {
          var models = [
            {scoreRound1: 51},
            {scoreRound1: 25},
            {scoreRound1: 24}
          ];
          var col = new CandidateCollection(models);
          expect(col.round2()).to.not.be.ok;
        });
        it('should return candidates with more than 10% of votes if there is a round 2', function() {
          var models = [
            {scoreRound1: 48, scoreRound2: null},
            {scoreRound1: 33, scoreRound2: null},
            {scoreRound1: 25, scoreRound2: null},
            {scoreRound1: 10.20, scoreRound2: null},
            {scoreRound1: 10.43, scoreRound2: null},
            {scoreRound1: 3.43, scoreRound2: null},
            {scoreRound1: 8.50, scoreRound2: null}
          ];
          var col = new CandidateCollection(models);
          models = col.round2();
          expect(models).to.be.an.instanceof(CandidateCollection);
          expect(models.size()).to.equal(5);
          expect(models.models[0].get('scoreRound1')).to.equal(48);
          expect(models.models[1].get('scoreRound1')).to.equal(33);
          expect(models.models[2].get('scoreRound1')).to.equal(25);
          expect(models.models[3].get('scoreRound1')).to.equal(10.43);
          expect(models.models[4].get('scoreRound1')).to.equal(10.20);
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
