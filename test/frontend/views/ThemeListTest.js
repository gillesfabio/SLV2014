define([

  'chai',
  'App.views.ThemeList',
  'App.collections.Theme',
  'text!../fixtures/themes.json'

], function(
  chai,
  View,
  ThemeCollection,
  themesFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  themesFixtures = JSON.parse(themesFixtures);

  describe('App.views', function() {
    describe('App.views.ThemeListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.themes).to.be.an.instanceof(ThemeCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'themes']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set themes in context', function() {
          var col     = new ThemeCollection(themesFixtures);
          var view    = new View({themes: col});
          var context = view.getTemplateContext();
          expect(context.themes).to.deep.equal(col.toJSON());
        });
      });
    });
  });
});
