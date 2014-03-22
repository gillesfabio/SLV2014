define([

  'chai',
  'App.views.PollingPlaceList',
  'App.collections.PollingPlace'

], function(chai, View, PollingPlaceCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.PollingPlaceListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.pollingPlaces).to.be.an.instanceof(PollingPlaceCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'pollingPlaces']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set pollingPlaces in context', function(done) {
          var col = new PollingPlaceCollection();
          col.fetch({
            success: function() {
              var view = new View({pollingPlaces: col});
              var context = view.getTemplateContext();
              expect(context.pollingPlaces).to.deep.equal(col.toJSON());
              done();
            }
          });
        });
      });
    });
  });
});
