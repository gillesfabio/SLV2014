define([

  'chai',
  'App.collections.List',
  'text!../fixtures/lists.json'

], function(
  chai,
  Collection,
  fixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  fixtures = JSON.parse(fixtures);

  describe('App.collections', function() {
    describe('App.collections.ListTest', function() {

      describe('#findByCandidate', function() {
        it('should return models for a given candidate', function() {
          var col = new Collection(fixtures);
          var models = col.findByCandidate('henri-revel');
          var ids = models.chain().map(function(m) { return m.get('candidate').id; }).uniq().value();
          expect(ids).to.deep.equal(["henri-revel"]);
          expect(models.size()).to.equal(70);
        });
      });

      describe('#mergeDiff', function() {
        it('should return merge diff', function() {
          var col = new Collection(fixtures);
          var models = col.findByCandidate('henri-revel');
          expect(models.mergeDiff()).to.include.members([
            "Marc MOSCHETTI",
            "Christophe COANUS"
          ]);

          models = col.findByCandidate('joseph-segura');
          expect(models.mergeDiff()).to.include.members([
            "Brigitte LIZEE-JUAN",
            "Françoise BENNE",
            "Danielle HEBERT",
            "Marie-Fance CORVEST",
            "Patrice JACQUESSON",
            "Jean-Pascal DEY",
            "Geneviève TELMON",
            "René ESTEVE",
            "Laura ROLFO"
          ]);

          models = col.findByCandidate('marc-orsatti');
          expect(models.mergeDiff()).to.be.empty;
        });
      });

      describe('#hasMerged', function() {
        var col = new Collection(fixtures);
        var models = col.findByCandidate('marc-moschetti');
        expect(models.hasMerged()).to.be.false;

        models = col.findByCandidate('henri-revel');
        expect(models.hasMerged()).to.be.true;

        models = col.findByCandidate('marc-orsatti');
        expect(models.hasMerged()).to.be.false;
      });

      describe('#initial', function() {
        it('should return initial list', function() {
          var col     = new Collection(fixtures);
          var models  = col.findByCandidate('joseph-segura');
          var initial = models.initial();
          var rounds  = initial.map(function(m) { return m.get('round'); });
          var expectedRounds = Array.apply(null, new Array(initial.size())).map(function() { return 1; });
          expect(rounds).to.deep.equal(expectedRounds);
        });
      });

      describe('#merged', function() {
        it('should return merged list', function() {
          var col     = new Collection(fixtures);
          var models  = col.findByCandidate('joseph-segura');
          var initial = models.merged();
          var rounds  = initial.map(function(m) { return m.get('round'); });
          var expectedRounds = Array.apply(null, new Array(initial.size())).map(function() { return 2; });
          expect(rounds).to.deep.equal(expectedRounds);
        });
      });

    });
  });
});
