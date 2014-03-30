define([

  'jquery',
  'chai',
  'App.views.CandidateDetailProgram',
  'App.views.CandidateCard',
  'App.models.Candidate',
  'App.collections.Candidate',
  'App.collections.Program',
  'text!../fixtures/candidates.json'

], function(
  $,
  chai,
  View,
  CandidateCardView,
  CandidateModel,
  CandidateCollection,
  ProgramCollection,
  candidatesFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  candidatesFixtures = JSON.parse(candidatesFixtures);

  describe('App.views', function() {
    describe('App.views.CandidateDetailProgramTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.candidate).to.be.an.instanceof(CandidateModel);
          expect(view.programs).to.be.an.instanceof(ProgramCollection);
        });
        it('should properly set subviews', function() {
          var col       = new CandidateCollection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          expect(view.candidateCardView).to.an.instanceof(CandidateCardView);
          expect(view.candidateCardView.candidate).to.deep.equal(candidate);
          expect(view.candidateCardView.showDetailLink).to.be.false;
        });
      });

      describe('#getTemplateContext', function() {
        it('should have a proper context', function() {
          var col       = new CandidateCollection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          var context   = view.getTemplateContext();
          expect(context).to.have.keys([
            'config',
            'candidate',
            'projects'
          ]);
        });
        it('should properly set the candidate model in context', function() {
          var col       = new CandidateCollection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          var context   = view.getTemplateContext();
          expect(context.candidate).to.deep.equal(candidate.toJSON());
        });
        it('should properly set the mandatory config.baseUrl', function() {
          var col       = new CandidateCollection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          var context   = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
      });
    });
  });
});
