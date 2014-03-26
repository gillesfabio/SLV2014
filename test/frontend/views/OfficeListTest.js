define([

  'chai',
  'App.views.OfficeList',
  'App.collections.Office'

], function(chai, View, OfficeCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {
    describe('App.views.OfficeListTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.offices).to.be.an.instanceof(OfficeCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'offices']);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should set offices in context', function(done) {
          var col = new OfficeCollection();
          col.fetch({
            success: function() {
              var view    = new View({offices: col});
              var context = view.getTemplateContext();
              expect(context.offices).to.deep.equal(col.toJSON());
              done();
            }
          });
        });
      });
    });
  });
});
