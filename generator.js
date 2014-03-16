'use strict';

var fs    = require('fs');
var path  = require('path');
var _     = require('lodash');
var YAML  = require('yamljs');

var Generator = module.exports = function Generator() {
  this.data = {
    themes       : [],
    candidates   : [],
    runningMates : [],
    programs     : []
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

Generator.prototype.formatCandidates = function formatCandidates() {
  Object.keys(this.rawData).forEach(function(key) {
    var candidate = this.rawData[key];
    this.data.candidates.push(candidate.profil);
  }.bind(this));
};

Generator.prototype.formatRunningMates = function formatRunningMates() {
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

Generator.prototype.formatPrograms = function formatPrograms() {
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

Generator.prototype.buildCandidates = function buildCandidates() {
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

Generator.prototype.buildThemes = function buildThemes() {
  var file = path.join(__dirname, 'data', 'themes', 'themes.yaml');
  if (fs.existsSync(file)) this.data.themes = YAML.load(file);
};

Generator.prototype.build = function build() {
  this.buildThemes();
  this.buildCandidates();
  this.formatCandidates();
  this.formatRunningMates();
  this.formatPrograms();
  return this.data;
};
