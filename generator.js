'use strict';

var fs    = require('fs');
var path  = require('path');
var util  = require('util');
var async = require('async');
var _     = require('lodash');
var YAML  = require('yamljs');

function getFilename(file) {
  return file.substr(0, file.lastIndexOf('.'));
}

function getExtension(file) {
  var ext = path.extname(file || '').split('.');
  return ext[ext.length - 1];
}

function formatCandidates(data, rawData, callback) {
  Object.keys(rawData).forEach(function(key) {
    var candidate = rawData[key];
    data.candidates.push(candidate.profil);
  });
  callback(null, data, rawData);
}

function formatRunningMates(data, rawData, callback) {
  Object.keys(rawData).forEach(function(key) {
    var candidate = rawData[key];
    if (candidate.colistiers) {
      candidate.colistiers.forEach(function(colistier) {
        colistier.candidate = candidate.profil;
        data.runningMates.push(colistier);
      });
    }
  });
  callback(null, data, rawData);
}

function formatPrograms(data, rawData, callback) {
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
  callback(null, data);
}

function buildCandidates(basedir, data, callback) {
  var rawData = {};
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
  callback(null, data, rawData);
}

function buildThemes(basedir, data, callback) {
  var file = path.join(basedir, 'themes.yaml');
  if (fs.existsSync(file)) data.themes = YAML.load(file);
  callback(null, data);
}

function initData(callback) {
  callback(null, {
    themes       : [],
    candidates   : [],
    runningMates : [],
    programs     : []
  });
}

function buildData(callback) {
  var basedir       = path.join(__dirname, 'data');
  var candidatesDir = path.join(basedir, 'candidates');
  var themesDir     = path.join(basedir, 'themes');
  [candidatesDir, themesDir].forEach(function(dir) {
    if (!fs.existsSync(dir)) throw new Error(util.format("%s does not exist.", dir));
  });
  async.waterfall([
    initData,
    buildThemes.bind(null, themesDir),
    buildCandidates.bind(null, candidatesDir),
    formatCandidates,
    formatRunningMates,
    formatPrograms,
  ], function(err, result) {
    return callback(err, result);
  });
}

module.exports.buildData = buildData;
