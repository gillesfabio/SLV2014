define([

  'jquery',
  'chai',
  'App.views.CandidateDetail',
  'App.views.CandidateCard',
  'App.views.CandidateProgram',
  'App.views.RunningMateList',
  'App.models.Candidate',
  'App.collections.Candidate',
  'App.collections.Program',
  'App.collections.RunningMate'

], function(
  $,
  chai,
  View,
  CandidateCardView,
  CandidateProgramView,
  RunningMateListView,
  CandidateModel,
  CandidateCollection,
  ProgramCollection,
  RunningMateCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.CandidateDetailTest', function() {
      describe('#initialize', function() {
        it('should properly set defaults', function(done) {
          var col = new CandidateCollection();
          col.fetch({
            success: function() {
              var view = new View();
              expect(view.candidate).to.be.an.instanceof(CandidateModel);
              expect(view.programs).to.be.an.instanceof(ProgramCollection);
              expect(view.runningMates).to.be.an.instanceof(RunningMateCollection);
              done();
            }
          });
        });
        it('should properly set subviews', function(done) {
          var col = new CandidateCollection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              expect(view.candidateCardView).to.an.instanceof(CandidateCardView);
              expect(view.candidateCardView.candidate).to.deep.equal(candidate);
              expect(view.candidateCardView.showDetailLink).to.be.false;
              expect(view.candidateProgramView).to.be.an.instanceof(CandidateProgramView);
              expect(view.candidateProgramView.candidate).to.deep.equal(candidate);
              expect(view.candidateProgramView.programs).to.be.an.instanceof(ProgramCollection);
              expect(view.runningMateListView).to.be.an.instanceof(RunningMateListView);
              expect(view.runningMateListView.candidate).to.deep.equal(candidate);
              expect(view.runningMateListView.runningMates).to.be.an.instanceof(RunningMateCollection);
              done();
            }
          });
        });
      });

      describe('#getTemplateContext', function() {
        it('should have a proper context', function(done) {
          var col = new CandidateCollection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              var context = view.getTemplateContext();
              expect(context).to.have.keys(['config', 'candidate']);
              done();
            }
          });
        });
        it('should properly set the candidate model in context', function(done) {
          var col = new CandidateCollection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              var context = view.getTemplateContext();
              expect(context.candidate).to.deep.equal(candidate.toJSON());
              done();
            }
          });
        });
        it('should properly set the mandatory config.baseUrl', function(done) {
          var col = new CandidateCollection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              var context = view.getTemplateContext();
              expect(context.config).to.contain.keys('baseUrl');
              done();
            }
          });
        });
      });
    });
  });
});
