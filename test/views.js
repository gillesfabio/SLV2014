define([

  'chai',
  'sinon'

], function(chai, sinon) {

  /* jshint expr:true */

  'use strict';

  var expect = chai.expect;

  describe('App.views', function() {

    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('App.views.CandidateCard', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.CandidateProgram', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.RunningMateList', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.CandidateList', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.CandidateDetail', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.ThemeList', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });

    describe('App.views.ThemeDetail', function() {
      it('should be true', function() {
        expect(true).to.be.true;
      });
    });
  });

});
