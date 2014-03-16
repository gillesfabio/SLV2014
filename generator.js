'use strict';

var fs    = require('fs');
var path  = require('path');
var _     = require('lodash');
var YAML  = require('yamljs');

var rawData = {};
var data = {
  themes       : [],
  candidates   : [],
  runningMates : [],
  programs     : []
};

function getFilename(file) {
  return file.substr(0, file.lastIndexOf('.'));
}

function getExtension(file) {
  var ext = path.extname(file || '').split('.');
  return ext[ext.length - 1];
}

function formatCandidates() {
  Object.keys(rawData).forEach(function(key) {
    var candidate = rawData[key];
    data.candidates.push(candidate.profil);
  });
}

function formatRunningMates() {
  Object.keys(rawData).forEach(function(key) {
    var candidate = rawData[key];
    if (candidate.colistiers) {
      candidate.colistiers.forEach(function(colistier) {
        colistier.candidate = candidate.profil;
        data.runningMates.push(colistier);
      });
    }
  });
}

function formatPrograms() {
  Object.keys(rawData).forEach(function(key) {
    var candidate = rawData[key];
    if (candidate.programme) {
      var program = {};
      program.candidate = candidate.profil;
      program.projects = [];
      Object.keys(candidate.programme).forEach(function(key) {
        var theme = _.find(data.themes, function(obj) { return obj.id === key; });
        candidate.programme[key].forEach(function(rawProject) {
          var project = {};
          project.theme = theme;
          project.description = rawProject;
          program.projects.push(project);
        });
      });
      data.programs.push(program);
    }
  });
}

function buildCandidates() {
  var basedir = path.join(__dirname, 'data', 'candidates');
  fs.readdirSync(basedir).forEach(function(dir) {
    var stat = fs.statSync(path.join(basedir, dir));
    if (stat.isDirectory()) {
      rawData[dir] = {};
      fs.readdirSync(path.join(basedir, dir)).forEach(function(file) {
        var ext = getExtension(file);
        var name = getFilename(file);
        if (ext === 'yaml') rawData[dir][name] = YAML.load(path.join(basedir, dir, file));
      });
    }
  });
}

function buildThemes() {
  var file = path.join(__dirname, 'data', 'themes', 'themes.yaml');
  if (fs.existsSync(file)) data.themes = YAML.load(file);
}

function buildData() {
  buildThemes();
  buildCandidates();
  formatCandidates();
  formatRunningMates();
  formatPrograms();
  return data;
}

module.exports.buildData = buildData;
