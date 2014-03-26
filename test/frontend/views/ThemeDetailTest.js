define([

  'chai',
  'App.views.ThemeDetail',
  'App.collections.Theme',
  'App.collections.Program',
  'App.models.Theme'

], function(chai, View, ThemeCollection, ProgramCollection, ThemeModel) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.ThemeDetailTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.theme).to.be.an.instanceof(ThemeModel);
          expect(view.programs).to.be.an.instanceof(ProgramCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'theme', 'programs']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set the theme model in context', function(done) {
          var col = new ThemeCollection();
          col.fetch({
            success: function() {
              var theme   = col.findWhere({id: 'solidarite'});
              var view    = new View({theme: theme});
              var context = view.getTemplateContext();
              expect(context.theme).to.deep.equal(theme.toJSON());
              done();
            }
          });
        });
        it('should set programs in context', function(done) {
          var col      = new ThemeCollection();
          var programs = new ProgramCollection();
          col.fetch({
            success: function() {
              var theme = col.findWhere({id: 'solidarite'});
              programs.fetch({
                success: function() {
                  var obj     = programs.findByThemeAndGroupByCandidate(theme.get('id'));
                  var view    = new View({theme: theme, programs: programs});
                  var context = view.getTemplateContext();
                  expect(context.programs).to.deep.equal(obj);
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
