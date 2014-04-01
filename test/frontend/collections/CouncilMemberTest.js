define([

  'chai',
  'App.collections.CouncilMember',
  'text!../fixtures/councilMembers.json'

], function(
  chai,
  Collection,
  fixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  fixtures = JSON.parse(fixtures);

  describe('App.collections', function() {
    describe('App.collections.CouncilMemberTest', function() {

      describe('#cc', function() {
        it('should return only community council elected members ', function() {
          var col    = new Collection(fixtures);
          var values = _.chain(col.cc().toJSON()).pluck('cc').uniq().value();
          expect(values).to.have.length(1);
          expect(values[0]).to.equal.true;
        });
      });

      describe('#groupBySeats', function() {
        it('should return members grouped by number of seats at municipal council', function() {
          var col    = new Collection(fixtures);
          col        = col.groupBySeats();
          var keys   = Object.keys(col);
          var values = _.values(col);
          expect(keys[0]).to.equal('Joseph Segura');
          expect(values[0]).to.have.length(26);
          expect(keys[1]).to.equal('Henri Revel');
          expect(values[1]).to.have.length(6);
          expect(keys[2]).to.equal('Lionel Prados');
          expect(values[2]).to.have.length(2);
          expect(keys[3]).to.equal('Marc Orsatti');
          expect(values[3]).to.have.length(1);
        });
      });
    });
  });
});
