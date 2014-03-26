define([

  'chai',
  'App.collections.List'

], function(chai, ListCollection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {
    describe('App.collections.ListTest', function() {

      describe('#findByCandidate', function() {
        it('should return models for a given candidate ID', function(done) {
          var col = new ListCollection();
          col.fetch({
            success: function() {
              var models = col.findByCandidate('francoise-benne');
              expect(models).to.be.an.instanceof(ListCollection);
              expect(models.models).to.have.length.above(2);
              done();
            }
          });
        });
        it('should return an empty collection if the given candidate does not exist', function(done) {
          var col = new ListCollection();
          col.fetch({
            success: function() {
              var models = col.findByCandidate('john-doe');
              expect(models).to.be.an.instanceof(ListCollection);
              expect(models.models).to.have.length(0);
              done();
            }
          });
        });
      });
    });
  });
});
