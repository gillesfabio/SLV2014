define([

  'chai',
  'sinon',
  'App.collections.Candidate',
  'App.collections.RunningMate',
  'App.collections.Program',
  'App.models.Program'

], function(
  chai,
  sinon,
  CandidateCollection,
  RunningMateCollection,
  ProgramCollection,
  ProgramModel) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {

    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

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

    describe('App.collections.RunningMate', function() {

      describe('#findByCandidate', function() {
        it('should return models for a given candidate ID', function(done) {
          var col = new RunningMateCollection();
          col.fetch({
            success: function() {
              var models = col.findByCandidate('francoise-benne');
              expect(models).to.be.an.instanceof(RunningMateCollection);
              expect(models.models).to.have.length.above(2);
              done();
            }
          });
        });
        it('should return an empty collection if the given candidate does not exist', function(done) {
          var col = new RunningMateCollection();
          col.fetch({
            success: function() {
              var models = col.findByCandidate('john-doe');
              expect(models).to.be.an.instanceof(RunningMateCollection);
              expect(models.models).to.have.length(0);
              done();
            }
          });
        });
      });
    });

    describe('App.collections.Program', function() {

      describe('#findByCandidate', function() {
        it('should return model for a given candidate ID', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var model = col.findByCandidate('marc-orsatti');
              expect(model).to.be.an.instanceof(ProgramModel);
              expect(model.get('candidate')).to.be.ok;
              expect(model.get('projects')).to.have.length.above(1);
              done();
            }
          });
          expect(true).to.be.true;
        });
        it('should return undefined if candidate does not exist', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var model = col.findByCandidate('john-doe');
              expect(model).to.be.undefined;
              done();
            }
          });
        });
      });

      describe('#findByTheme', function() {
        it('should return models for a given theme ID', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.findByTheme('solidarite');
              expect(models).to.be.an.instanceof(ProgramCollection);
              expect(models.size()).to.be.above(1);
              models.each(function(model) {
                model.get('projects').forEach(function(project) {
                  expect(project.theme.id).to.equal('solidarite');
                });
              });
              done();
            }
          });
        });
        it('should return an empty collection if the given theme does not exist', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.findByTheme('foobar');
              expect(models).to.be.an.instanceof(ProgramCollection);
              expect(models.size()).to.equal(0);
              done();
            }
          });
        });
      });

      describe('#findByThemeAndGroupByCandidate', function() {
        it('should return models for a given theme ID and group them by candidate', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.findByThemeAndGroupByCandidate('solidarite');
              expect(models).to.contain.keys([
                'Lionel Prados',
                'Marc Orsatti',
                'Marc Moschetti'
              ]);
              Object.keys(models).forEach(function(key) {
                expect(models[key]).to.have.keys(['candidate', 'projects']);
              });
              done();
            }
          });
        });
        it('should return an empty object if theme does not exist', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.findByThemeAndGroupByCandidate('foobar');
              expect(models).to.be.empty;
              done();
            }
          });
        });
      });

      describe('#candidateProjects', function() {
        it('should only return program projects for a given candidate ID', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.candidateProjects('henri-revel');
              Object.keys(models).forEach(function(key) {
                expect(key).to.be.a.string;
                expect(models[key]).to.be.an.instanceof(Array);
              });
              done();
            }
          });
        });
        it('should return an empty object if candidate does not exist', function(done) {
          var col = new ProgramCollection();
          col.fetch({
            success: function() {
              var models = col.candidateProjects('john-doe');
              expect(models).to.be.empty;
              done();
            }
          });
        });
      });
    });
  });

});
