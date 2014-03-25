define([

  'chai',
  'App.collections.Result'

], function(chai, Collection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  function getCandidateIDs(model) {
    if (model) return _.map(model.get('candidates'), function(c) { return c.candidate.id; });
  }

  describe('App.models', function() {
    describe('App.models.ResultTest', function() {

      describe('#sortCandidatesByResult', function() {
        it('should sort candidates by R1 results if there is no R2', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {candidate: {id: 'john'}, percentage: 21, count: 11},
                {candidate: {id: 'martin'}, percentage: 51, count: 11},
                {candidate: {id: 'steve'}, percentage: 49, count: 24}
              ]
            }
          ]);
          var m = col.findByRound(1).sortCandidatesByResult();
          var candidates = getCandidateIDs(m);
          expect(candidates).to.deep.equal(['martin', 'steve', 'john']);
        });
        it('should sort candidates by R1 results if R2 is not done yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {candidate: {id: 'john'}, percentage: 21, count: 11},
                {candidate: {id: 'martin'}, percentage: 8, count: 11},
                {candidate: {id: 'steve'}, percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {candidate: {id: 'john'}, percentage: null, count: 20},
                {candidate: {id: 'martin'}, percentage: 8, count: 11},
                {candidate: {id: 'steve'}, percentage: 49, count: 24}
              ]
            }
          ]);
          var m = col.findByRound(2).sortCandidatesByResult();
          var candidates = getCandidateIDs(m);
          expect(candidates).to.deep.equal(['steve', 'john', 'martin']);
        });
        it('should sort candidates by R2 results if R2 is done', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {candidate: {id: 'john'}, percentage: 21, count: 11},
                {candidate: {id: 'martin'}, percentage: 8, count: 11},
                {candidate: {id: 'steve'}, percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {candidate: {id: 'john'}, percentage: 3, count: 20},
                {candidate: {id: 'martin'}, percentage: 48, count: 11},
                {candidate: {id: 'steve'}, percentage: 12, count: 24}
              ]
            }
          ]);
          var m = col.findByRound(2).sortCandidatesByResult();
          var candidates = getCandidateIDs(m);
          expect(candidates).to.deep.equal(['martin', 'steve', 'john']);
        });
      });
    });
  });
});
