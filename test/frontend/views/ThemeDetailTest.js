define([

  'chai',
  'App.views.ThemeDetail',
  'App.collections.Theme',
  'App.collections.Program',
  'App.models.Theme',
  'text!../fixtures/themes.json',
  'text!../fixtures/programs.json'

], function(
  chai,
  View,
  ThemeCollection,
  ProgramCollection,
  ThemeModel,
  themesFixtures,
  programsFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  themesFixtures   = JSON.parse(themesFixtures);
  programsFixtures = JSON.parse(programsFixtures);

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
        it('should set the theme model in context', function() {
          var col = new ThemeCollection(themesFixtures);
          var theme   = col.findWhere({id: 'solidarite'});
          var view    = new View({theme: theme});
          var context = view.getTemplateContext();
          expect(context.theme).to.deep.equal(theme.toJSON());
        });
        it('should set programs in context', function() {
          var col      = new ThemeCollection(themesFixtures);
          var programs = new ProgramCollection(programsFixtures);
          var theme    = col.findWhere({id: 'solidarite'});
          var obj      = programs.findByThemeAndGroupByCandidate(theme.get('id'));
          var view     = new View({theme: theme, programs: programs});
          var context  = view.getTemplateContext();
          expect(context.programs).to.deep.equal(obj);
        });
      });
    });
  });
});
