'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');
var _    = require('lodash');
var YAML = require('yamljs');
var fse  = require('fs-extra');

var BUILD_DIR    = path.join(__dirname, 'build', 'data');
var DATA_DIR     = path.join(__dirname, 'data');
var SCRAPER_JSON = path.join(__dirname, 'scrap-data.json');

var Generator = module.exports = function Generator() {
  this.data = {
    themes     : [],
    offices    : [],
    candidates : [],
    programs   : [],
    lists      : [],
    results    : []
  };
};

Generator.prototype.buildThemes = function() {
  var file = path.join(DATA_DIR, 'themes.yaml');
  this.data.themes = YAML.load(file);
};

Generator.prototype.buildOffices = function() {
  var file = path.join(DATA_DIR, 'offices.yaml');
  var yaml = YAML.load(file);
  Object.keys(yaml).forEach(function(key) {
    var obj        = {};
    var raw        = yaml[key];
    obj.number     = key;
    obj.address    = raw.address;
    obj.opening    = raw.opening;
    obj.gmapSearch = raw.gmapSearch;
    this.data.offices.push(obj);
  }.bind(this));
};

Generator.prototype.buildCandidates = function() {
  var file = path.join(DATA_DIR, 'candidates.yaml');
  this.data.candidates = YAML.load(file);
};

Generator.prototype.buildPrograms = function() {
  var dir = path.join(DATA_DIR, 'programs');
  fs.readdirSync(dir).forEach(function(file) {
    file              = path.join(DATA_DIR, 'programs', file);
    var id            = path.basename(file).split('.')[0];
    var yaml          = YAML.load(file);
    var program       = {};
    program.candidate = _.find(this.data.candidates, function(obj) { return obj.id === id; });
    program.projects  = [];
    Object.keys(yaml).forEach(function(key) {
      var theme    = _.find(this.data.themes, function(obj) { return obj.id === key; });
      var projects = yaml[key];
      projects.forEach(function(rawProject) {
        var project         = {};
        project.theme       = theme;
        project.description = rawProject;
        program.projects.push(project);
      });
    }.bind(this));
    this.data.programs.push(program);
  }.bind(this));
};

Generator.prototype.buildLists = function() {
  var file   = fs.readFileSync(SCRAPER_JSON);
  var data   = JSON.parse(file)['data'];
  var rounds = [
    [1, data.r1.lists],
    [2, data.r2.lists]
  ];
  rounds.forEach(function(round) {
    var lists = round[1];
    Object.keys(lists).forEach(function(id) {
      lists[id].forEach(function(rawMate) {
        var mate       = {};
        mate.round     = round[0];
        mate.candidate = _.find(this.data.candidates, function(obj) { return obj.id === id; });
        mate.name      = rawMate.name;
        mate.position  = rawMate.position;
        mate.cc        = rawMate.cc;
        this.data.lists.push(mate);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

Generator.prototype.buildResults = function() {
  var file = fs.readFileSync(SCRAPER_JSON);
  var data = JSON.parse(file)['data'];
  var rounds = [
    [1, data.r1.results],
    [2, data.r2.results]
  ];
  rounds.forEach(function(round) {
    var results    = round[1];
    var obj        = {};
    obj.round      = round[0];
    obj.stats      = results.stats;
    obj.candidates = [];
    if (results.candidates) {
      Object.keys(results.candidates).forEach(function(id) {
        var raw              = results.candidates[id];
        var candidate        = {};
        candidate.candidate  = _.find(this.data.candidates, function(obj) { return obj.id === id; });
        candidate.count      = raw.count;
        candidate.percentage = raw.percentage;
        candidate.cmSeats    = raw.cmSeats;
        candidate.ccSeats    = raw.ccSeats;
        obj.candidates.push(candidate);
      }, this);
    }
    this.data.results.push(obj);
  }, this);
};

Generator.prototype.overrideResults = function() {
  var results   = this.data.results;
  var overrides = YAML.load(path.join(DATA_DIR, 'results.yaml'));
  overrides.forEach(function(override) {
    override.candidates.forEach(function(candidate) {
      candidate.candidate = _.find(this.data.candidates, {id: candidate.candidate});
    }, this);
  }, this);
  var indexes = [];
  var found = function(r) { return _.find(overrides, function(o) { return o.round === r.round; }); };
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (found(result)) indexes.push(i);
  }
  indexes.forEach(function(i) { results.splice(results.indexOf(i), 1); }, this);
  overrides.forEach(function(override) { results.push(override); }, this);
};

Generator.prototype.createFiles = function() {
  var entities = Object.keys(this.data);
  entities.forEach(function(entity) {
    if (!fs.existsSync(BUILD_DIR)) fse.mkdirsSync(BUILD_DIR);
    var file = path.join(BUILD_DIR, util.format('%s.json', entity));
    fs.writeFileSync(file, JSON.stringify(this.data[entity], undefined, 2));
  }.bind(this));
};

Generator.prototype.build = function() {
  this.buildThemes();
  this.buildOffices();
  this.buildCandidates();
  this.buildPrograms();
  this.buildLists();
  this.buildResults();
  this.overrideResults();
  this.createFiles();
};
