define([

  'chai',
  'App.views.CandidateProgram',
  'App.collections.Program',
  'App.collections.Candidate',
  'App.models.Program',
  'App.models.Candidate'

], function(
  chai,
  View,
  ProgramCollection,
  CandidateCollection,
  ProgramModel,
  CandidateModel) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.CandidateProgramTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.programs).to.be.an.instanceof(ProgramCollection);
          expect(view.candidate).to.be.an.instanceof(CandidateModel);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'candidate', 'projects']);
        });
        it('should properly set candidate model in context', function(done) {
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
        it('should properly set projects in context', function(done) {
          var col = new CandidateCollection();
          var programs = new ProgramCollection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              programs.fetch({
                success: function() {
                  var view = new View({candidate: candidate, programs: programs});
                  var projects = programs.candidateProjects(candidate.get('id'));
                  var context = view.getTemplateContext();
                  expect(context.projects).to.deep.equal(projects);
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
