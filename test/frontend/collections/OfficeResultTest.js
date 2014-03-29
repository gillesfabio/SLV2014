define([

  'chai',
  'App.collections.OfficeResult'

], function(chai, Collection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {
    describe('App.collections.OfficeResultTest', function() {

      var sampleModels = [
        {
          office     : {number: 1},
          registered : 600,
          votes      : 544,
          expressed  : 521,
          candidates: [
            {
              candidate  : {id: 'john-doe'},
              percentage : 35.5,
              count      : 320
            },
            {
              candidate  : {id: 'martin-dupont'},
              percentage : 30.2,
              count      : 200
            },
            {
              candidate  : {id: 'david-fish'},
              percentage : 22.5,
              count      : 120
            }
          ]
        },
        {
          office     : {number: 2},
          registered : 820,
          votes      : 610,
          expressed  : 583,
          candidates: [
            {
              candidate  : {id: 'john-doe'},
              percentage : 12.5,
              count      : 120
            },
            {
              candidate  : {id: 'martin-dupont'},
              percentage : 30.2,
              count      : 156
            },
            {
              candidate  : {id: 'david-fish'},
              percentage : 34.5,
              count      : 300
            }
          ]
        },
        {
          office     : {number: 3},
          registered : 1082,
          votes      : 765,
          expressed  : 730,
          candidates: [
            {
              candidate  : {id: 'john-doe'},
              percentage : 36.0,
              count      : 444
            },
            {
              candidate  : {id: 'martin-dupont'},
              percentage : 12.1,
              count      : 120
            },
            {
              candidate  : {id: 'david-fish'},
              percentage : 44.2,
              count      : 530
            }
          ]
        }
      ];

      describe('#bestOrWorstCandidateScore', function() {
        it('should return the best office result for a given candidate', function() {
          var col = new Collection(sampleModels);
          var best = col.bestOrWorstCandidateScore('best', 'david-fish').toJSON();
          expect(best.office.number).to.equal(3);

          col = new Collection(sampleModels);
          best = col.bestOrWorstCandidateScore('best', 'martin-dupont').toJSON();
          expect(best.office.number).to.equal(1);
        });
        it('should return the worst office result for a given candidate', function() {
          var col = new Collection(sampleModels);
          var best = col.bestOrWorstCandidateScore('worst', 'david-fish').toJSON();
          expect(best.office.number).to.equal(1);

          col = new Collection(sampleModels);
          best = col.bestOrWorstCandidateScore('worst', 'martin-dupont').toJSON();
          expect(best.office.number).to.equal(3);
        });
      });
    });
  });
});
