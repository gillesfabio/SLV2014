define([

  'chai',
  'App.views.RunningMateList',
  'App.collections.RunningMate',
  'App.collections.Candidate',
  'App.models.Candidate'

], function(
  chai,
  View,
  RunningMateCollection,
  CandidateCollection,
  CandidateModel) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.RunningMateListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.candidate).to.be.an.instanceof(CandidateModel);
          expect(view.runningMates).to.be.an.instanceof(RunningMateCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'runningMates']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set runningMates in context', function(done) {
          var col = new RunningMateCollection();
          var candidates = new CandidateCollection();
          candidates.fetch({
            success: function() {
              var candidate = candidates.findWhere({id: 'marc-orsatti'});
              col.fetch({
                success: function() {
                  var models  = col.findByCandidate(candidate.get('id'));
                  var view    = new View({candidate: candidate, runningMates: col});
                  var context = view.getTemplateContext();
                  expect(context.runningMates).to.deep.equal(models.toJSON());
                  done();
                }
              });
            }
          });
        });
      });
    });
  });
});
