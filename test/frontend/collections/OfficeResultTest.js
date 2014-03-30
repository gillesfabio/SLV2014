define([

  'underscore',
  'chai',
  'App.collections.OfficeResult',
  'text!/../fixtures/officesResults.json'

], function(
  _,
  chai,
  Collection,
  fixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;
  fixtures = JSON.parse(fixtures);

  describe('App.collections', function() {
    describe('App.collections.OfficeResultTest', function() {

      describe('#comparator', function() {
        it('should return models sorted by "office.number" property by default', function() {
          var col = new Collection(fixtures);
          var numbers = col.chain()
            .map(function(m) { return m.get('office').number; }).uniq().value();
          expect(numbers).to.deep.equal(_.range(1, 22));
        });
      });

      describe('#findByRound', function() {
        it('should return models for a given round', function() {
          var col      = new Collection(fixtures);
          var models   = col.findByRound(1);
          var size     = models.size();
          var rounds   = models.map(function(m) { return m.get('round'); });
          var expected = Array.apply(null, new Array(size)).map(function(){return 1;});
          expect(rounds).to.deep.equal(expected);

          col      = new Collection(fixtures);
          models   = col.findByRound(2);
          size     = models.size();
          rounds   = models.map(function(m) { return m.get('round'); });
          expected = Array.apply(null, new Array(size)).map(function(){return 2;});
          expect(rounds).to.deep.equal(expected);
        });
      });

      describe('#getCandidateTopFlopStats', function() {
        it('should return proper top flop stats', function() {
          var col = new Collection(fixtures);
          var models = col.findByRound(1);
          var candidate;
          models = models.getCandidateTopFlopStats();
          candidate = _.find(models, function(m) { return m.candidate.id === 'henri-revel'; });
          expect(candidate.candidate.id).to.equal('henri-revel');
          expect(candidate.max.office.number).to.equal(15);
          expect(candidate.max.percentage).to.equal(36.44);
          expect(candidate.max.count).to.equal(273);
          expect(candidate.min.office.number).to.equal(3);
          expect(candidate.min.percentage).to.equal(24.44);
          expect(candidate.min.count).to.equal(121);

          candidate = _.find(models, function(m) { return m.candidate.id === 'marc-orsatti'; });
          expect(candidate.candidate.id).to.equal('marc-orsatti');
          expect(candidate.max.office.number).to.equal(15);
          expect(candidate.max.percentage).to.equal(15.8);
          expect(candidate.max.count).to.equal(118);
          expect(candidate.min.office.number).to.equal(20);
          expect(candidate.min.percentage).to.equal(5.7);
          expect(candidate.min.count).to.equal(29);
        });
      });

    });
  });
});
