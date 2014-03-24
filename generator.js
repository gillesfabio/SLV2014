'use strict';

var fs    = require('fs');
var path  = require('path');
var _     = require('lodash');
var YAML  = require('yamljs');

var Generator = module.exports = function Generator() {
  this.data = {
    themes        : [],
    pollingPlaces : [],
    candidates    : [],
    runningMates  : [],
    programs      : []
  };
  this.rawData = {};
};

Generator.getFilename = function getFilename(file) {
  return file.substr(0, file.lastIndexOf('.'));
};

Generator.getExtension = function getExtension(file) {
  var ext = path.extname(file || '').split('.');
  return ext[ext.length - 1];
};

Generator.prototype.formatCandidates = function() {
  Object.keys(this.rawData).forEach(function(key) {
    var candidate = this.rawData[key];
    this.data.candidates.push(candidate.profil);
  }.bind(this));
};

Generator.prototype.formatRunningMates = function() {
  Object.keys(this.rawData).forEach(function(key) {
    var candidate = this.rawData[key];
    if (candidate.colistiers) {
      candidate.colistiers.forEach(function(colistier) {
        colistier.candidate = candidate.profil;
        this.data.runningMates.push(colistier);
      }.bind(this));
    }
  }.bind(this));
};

Generator.prototype.formatPrograms = function() {
  Object.keys(this.rawData).forEach(function(key) {
    var candidate = this.rawData[key];
    if (candidate.programme) {
      var program = {};
      program.candidate = candidate.profil;
      program.projects = [];
      Object.keys(candidate.programme).forEach(function(key) {
        var theme = _.find(this.data.themes, function(obj) { return obj.id === key; });
        candidate.programme[key].forEach(function(rawProject) {
          var project = {};
          project.theme = theme;
          project.description = rawProject;
          program.projects.push(project);
        });
      }.bind(this));
      this.data.programs.push(program);
    }
  }.bind(this));
};

Generator.prototype.candidates = function() {
  var basedir = path.join(__dirname, 'data', 'candidates');
  fs.readdirSync(basedir).forEach(function(dir) {
    var stat = fs.statSync(path.join(basedir, dir));
    if (stat.isDirectory()) {
      this.rawData[dir] = {};
      fs.readdirSync(path.join(basedir, dir)).forEach(function(file) {
        var ext = Generator.getExtension(file);
        var name = Generator.getFilename(file);
        if (ext === 'yaml') {
          this.rawData[dir][name] = YAML.load(path.join(basedir, dir, file));
        }
      }.bind(this));
    }
  }.bind(this));
};

Generator.prototype.themes = function() {
  var file = path.join(__dirname, 'data', 'themes.yaml');
  if (fs.existsSync(file)) this.data.themes = YAML.load(file);
};

Generator.prototype.results = function() {
  var file = path.join(__dirname, 'data', 'results.yaml');
  var items = YAML.load(file);
  this.data.results = [];
  items.forEach(function(raw) {
    var obj = _.clone(raw);
    obj.candidates = [];
    raw.candidates.forEach(function(candidate) {
      var o = _.clone(candidate);
      o.candidate = _.find(this.data.candidates, {id: candidate.candidate});
      obj.candidates.push(o);
    }.bind(this));
    this.data.results.push(obj);
  }.bind(this));
};

Generator.prototype.pollingPlaces = function() {
  var file = path.join(__dirname, 'data', 'polling-places.yaml');
  var yaml = YAML.load(file);
  Object.keys(yaml).forEach(function(key) {
    var obj = {};
    var raw = yaml[key];
    obj.number = key;
    obj.address = raw.address;
    obj.opening = raw.opening;
    obj.gmapSearch = raw.gmapSearch;
    this.data.pollingPlaces.push(obj);
  }.bind(this));
};

Generator.prototype.build = function() {

  this.themes();
  this.pollingPlaces();
  this.candidates();

  this.formatCandidates();
  this.formatRunningMates();
  this.formatPrograms();

  this.results();

  return this.data;
};
