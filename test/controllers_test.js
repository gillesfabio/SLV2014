/*global chai, sinon, afterEach, beforeEach, describe, it */
/* jshint expr:true */

'use strict';

var expect = chai.expect;

describe('App.controllers', function() {

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('App.controllers.candidateList', function() {
    it('should be true', function() {
      expect(true).to.be.true;
    });
  });

  describe('App.controllers.candidateDetail', function() {
    it('should be true', function() {
      expect(true).to.be.true;
    });
  });

  describe('App.controllers.themeList', function() {
    it('should be true', function() {
      expect(true).to.be.true;
    });
  });

  describe('App.controllers.themeDetail', function() {
    it('should be true', function() {
      expect(true).to.be.true;
    });
  });

  describe('App.controllers.about', function() {
    it('should be true', function() {
      expect(true).to.be.true;
    });
  });
});
