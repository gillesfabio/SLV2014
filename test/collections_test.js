/*global chai, sinon, afterEach, beforeEach, describe, it */
/* jshint expr:true */

'use strict';

var expect = chai.expect;

describe('App.collections', function() {

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('App.collections.RunningMate', function() {
    describe('#findByCandidate', function() {
      it('should return models for a given candidate ID', function() {
        expect(true).to.be.true;
      });
    });
  });

  describe('App.collections.Program', function() {
    describe('#findByCandidate', function() {
      it('should return models for a given candidate ID', function() {
        expect(true).to.be.true;
      });
    });
    describe('#findByTheme', function() {
      it('should return models for a given theme ID', function() {
        expect(true).to.be.true;
      });
    });
    describe('#findByThemeAndGroupByCandidate', function() {
      it('should return models for a given theme ID and group them by candidate', function() {
        expect(true).to.be.true;
      });
    });
    describe('#candidateProjects', function() {
      it('should only return program projects for a given candidate ID', function() {
        expect(true).to.be.true;
      });
    });
  });
});
