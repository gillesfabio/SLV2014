define([

  'chai',
  'App.collections.Program',
  'App.models.Program'

], function(chai, ProgramCollection, ProgramModel) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {

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
