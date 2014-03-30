define([

  'chai',
  'handlebars',
  'App.views.CandidateCard',
  'App.collections.Candidate',
  'App.models.Candidate',
  'text!../fixtures/candidates.json'

], function(
  chai,
  Handlebars,
  View,
  Collection,
  Model,
  candidatesFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  candidatesFixtures = JSON.parse(candidatesFixtures);

  describe('App.views', function() {

    describe('App.views.CandidateCardTest', function() {
      describe('#initialize', function() {
        it('should properly set candidate model', function() {
          var col       = new Collection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          expect(view.candidate).to.be.an.instanceof(Model);
          expect(view.candidate).to.equal(candidate);
        });
        it('should properly set showDetailLink boolean to false by default', function() {
          var col       = new Collection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          expect(view.showDetailLink).to.be.false;
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper template context', function() {
          var col       = new Collection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view      = new View({candidate: candidate});
          var context   = view.getTemplateContext();
          expect(context).to.have.keys(['config', 'candidate', 'showDetailLink']);
          expect(context.config).to.be.an.object;
          expect(context.candidate).to.deep.equal(candidate.toJSON());
          expect(context.showDetailLink).to.be.a.boolean;
          expect(context.showDetailLink).to.be.false;
        });
        it('should have the mandatory config.baseUrl variable in context', function() {
          var col = new Collection(candidatesFixtures);
          var candidate = col.findWhere({id: 'marc-orsatti'});
          var view = new View({candidate: candidate});
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
      });
    });
  });
});
