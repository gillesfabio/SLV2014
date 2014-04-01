define([

  'chai',
  'App.views.Council',
  'App.collections.CouncilMember',
  'text!../fixtures/councilMembers.json'

], function(
  chai,
  View,
  CouncilMemberCollection,
  councilMembersFixtures) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  councilMembersFixtures = JSON.parse(councilMembersFixtures);

  describe('App.views', function() {
    describe('App.views.CouncilTest', function() {

      describe('#initialize', function() {
        it('should properly set defaults', function() {
          var view = new View();
          expect(view.councilMembers).to.be.an.instanceof(CouncilMemberCollection);
        });
      });

      describe('#getTemplateContext', function() {
        it('should return a proper context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context).to.have.keys([
            'config',
            'cmMembers',
            'ccMembers'
          ]);
        });
        it('should set the mandatory config.baseUrl variable in context', function() {
          var view    = new View();
          var context = view.getTemplateContext();
          expect(context.config).to.contain.keys('baseUrl');
        });
        it('should correctly set "cmMembers" in context', function() {
          var col     = new CouncilMemberCollection(councilMembersFixtures);
          var view    = new View({councilMembers: col});
          var context = view.getTemplateContext();
          expect(context.cmMembers).to.deep.equal(col.groupBySeats());
        });
        it('should correctly set "ccMembers" in context', function() {
          var col     = new CouncilMemberCollection(councilMembersFixtures);
          var view    = new View({councilMembers: col});
          var context = view.getTemplateContext();
          expect(context.ccMembers).to.deep.equal(col.cc().groupBySeats());
        });
      });
    });
  });
});
