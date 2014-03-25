define([

  'chai',
  'App.collections.Result'

], function(chai, Collection) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.collections', function() {
    describe('App.collections.ResultTest', function() {

      describe('#findByRound', function() {
        it('should return model of a given round', function() {
          var col = new Collection([
            {round: 1},
            {round: 2},
            {round: 3},
          ]);
          expect(col.findByRound(2).toJSON()).to.deep.equal({round: 2});
        });
        it('should return undefined if round does not exist', function() {
          var col = new Collection([
            {round: 1},
            {round: 2},
            {round: 3}
          ]);
          expect(col.findByRound(8)).to.be.undefined;
        });
        it('should return undefined if round does not exist', function() {
          var col = new Collection([
            {round: 1},
            {round: 2},
            {round: 3}
          ]);
          expect(col.findByRound(8)).to.be.undefined;
        });
      });

      describe('#isRoundDone', function() {
        it('should return false if all candidates do not have a percentage/count values', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: null, count: null},
                {percentage: 23, count: null},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.isRoundDone(1)).to.be.false;
        });
        it('should return true if all candidates do have a percentage/count values', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 29, count: 22},
                {percentage: 23, count: 19},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.isRoundDone(1)).to.be.true;
        });
      });

      describe('#noRound2', function() {
        it('should return true if any candidate has more than 50% of votes', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 50.1, count: 11},
                {percentage: 23, count: 11},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.noRound2()).to.be.true;
        });
        it('should return false if no candidate has been elected with the absolute majority', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 44, count: 11},
                {percentage: 23, count: 11},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.noRound2()).to.be.false;
        });
      });

      describe('#hasRound2', function() {
        it('should return false if any candidate has more than 50% of votes', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 50.1, count: 11},
                {percentage: 23, count: 11},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.hasRound2()).to.be.false;
        });
        it('should return true if no candidate has been elected with the absolute majority', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 49, count: 11},
                {percentage: 23, count: 11},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.hasRound2()).to.be.true;
        });
      });

      describe('#isRound1Done', function() {
        it('should return false if all candidates do not have a percentage/count values', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: null, count: null},
                {percentage: 23, count: null},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.isRound1Done()).to.be.false;
        });
        it('should return true if all candidates do have a percentage/count values', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 23, count: 239},
                {percentage: 23, count: 239},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.isRound1Done()).to.be.true;
        });
      });

      describe('#isRound2Done', function() {
        it('should return false if round 1 is not done yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: null, count: null},
                {percentage: 23, count: null},
                {percentage: 12, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: null, count: null},
                {percentage: null, count: null}
              ]
            }
          ]);
          expect(col.isRound2Done()).to.be.false;
        });
        it('should return false if round 1 is done but need a round 2', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 23, count: null},
                {percentage: 23, count: null},
                {percentage: 12, count: null}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: null, count: null},
                {percentage: null, count: null}
              ]
            }
          ]);
          expect(col.isRound2Done()).to.be.false;
        });
        it('should return false if round 1 is done and a candidate has been elected', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 50.3, count: null},
                {percentage: 23, count: null},
                {percentage: 12, count: null}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: null, count: null},
                {percentage: null, count: null}
              ]
            }
          ]);
          expect(col.isRound2Done()).to.be.false;
        });
        it('should return false if round 1 is done and round 2 is not complete yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 23, count: 12},
                {percentage: 23, count: 12},
                {percentage: 12, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: 23, count: 12},
                {percentage: 12, count: 24}
              ]
            }

          ]);
          expect(col.isRound2Done()).to.be.false;
        });
        it('should return true if round 1 and round 2 are done', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 23, count: 12},
                {percentage: 23, count: 12},
                {percentage: 12, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: 44, count: 34},
                {percentage: 23, count: 11},
                {percentage: 12, count: 24}
              ]
            }
          ]);
          expect(col.isRound2Done()).to.be.true;
        });
      });

      describe('#getMaxCandidateForRound', function() {
        it('should return the candidate who has the max percentage for the given round', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.getMaxCandidateForRound(1)).to.deep.equal({percentage: 49, count: 24});
        });
        it('should return the candidate who has the max percentage for the given round even with null values', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: null, count: null},
                {percentage: 21, count: 11},
                {percentage: 10, count: 24}
              ]
            }
          ]);
          expect(col.getMaxCandidateForRound(1)).to.deep.equal({percentage: 21, count: 11});
        });
      });

      describe('#hasElected', function() {
        it('should return false if no candidate has been elected on round 1', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.hasElected()).to.be.false;
        });
        it('should return false if round 1 is not done yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: null, count: null},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.hasElected()).to.be.false;
        });
        it('should return true if round 1 is done and a candidate has more than 50% of votes', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 23, count: 11},
                {percentage: 8, count: 11},
                {percentage: 50.8, count: 24}
              ]
            }
          ]);
          expect(col.hasElected()).to.be.true;
        });
        it('should return false if no candidate has been elected on round 1 and round 2 is not complete yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.hasElected()).to.be.false;
        });
        it('should return true if round 1 and 2 are done', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: 44, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.hasElected()).to.be.true;
        });
      });

      describe('#getElected', function() {
        it('should return undefined if no candidate has been elected on round 1', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.getElected()).to.be.undefined;
        });
        it('should return undefined if round 1 is not done yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: null, count: null},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.getElected()).to.be.undefined;
        });
        it('should return the elected candidate if round 1 is done with an absolute majority', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 30, count: 11},
                {percentage: 50.4, count: 22},
                {percentage: 10, count: 24}
              ]
            }
          ]);
          expect(col.getElected()).to.deep.equal({percentage: 50.4, count: 22});
        });
        it('should return undefined if round 1 is done and round 2 is not done yet', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: null, count: null},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.getElected()).to.be.undefined;
        });
        it('should return the elected candidate if round 1 and round 2 are done', function() {
          var col = new Collection([
            {
              round: 1,
              candidates: [
                {percentage: 21, count: 11},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            },
            {
              round: 2,
              candidates: [
                {percentage: 22, count: 20},
                {percentage: 8, count: 11},
                {percentage: 49, count: 24}
              ]
            }
          ]);
          expect(col.getElected()).to.deep.equal({percentage: 49, count: 24});
        });
      });
    });
  });
});
