define([

  'chai',
  'handlebars',
  'App.views.CandidateCard',
  'App.collections.Candidate',
  'App.models.Candidate',
  'App.helpers'

], function(chai, Handlebars, View, Collection, Model) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {

    describe('App.views.CandidateCardTest', function() {
      describe('#initialize', function() {
        it('should properly set candidate model', function(done) {
          var col = new Collection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              expect(view.candidate).to.be.an.instanceof(Model);
              expect(view.candidate).to.equal(candidate);
              done();
            }
          });
        });
        it('should properly set showDetailLink boolean to false by default', function(done) {
          var col = new Collection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              expect(view.showDetailLink).to.be.false;
              done();
            }
          });
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper template context', function(done) {
          var col = new Collection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              var context = view.getTemplateContext();
              expect(context).to.have.keys(['config', 'candidate', 'showDetailLink']);
              expect(context.config).to.be.an.object;
              expect(context.candidate).to.deep.equal(candidate.toJSON());
              expect(context.showDetailLink).to.be.a.boolean;
              expect(context.showDetailLink).to.be.false;
              done();
            }
          });
        });
        it('should have the mandatory config.baseUrl variable in context', function(done) {
          var col = new Collection();
          col.fetch({
            success: function() {
              var candidate = col.findWhere({id: 'marc-orsatti'});
              var view = new View({candidate: candidate});
              var context = view.getTemplateContext();
              expect(context.config).to.contain.keys('baseUrl');
              done();
            }
          });
        });
      });
    });
  });
});
