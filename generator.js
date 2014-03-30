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
    themes         : [],
    offices        : [],
    officesResults : [],
    candidates     : [],
    programs       : [],
    lists          : [],
    results        : []
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
    obj.number     = parseInt(key, 10);
    obj.name       = raw.name;
    obj.address    = raw.address;
    obj.opening    = raw.opening;
    obj.gmapSearch = raw.gmapSearch;
    this.data.offices.push(obj);
  }.bind(this));
};

Generator.prototype.buildOfficesResults = function() {
  var file = path.join(DATA_DIR, 'offices-results.yaml');
  var offices = YAML.load(file);
  Object.keys(offices).forEach(function(office) {
    var obj = {};
    var raw = offices[office];
    Object.keys(raw).forEach(function(round) {
      var roundData = raw[round];
      obj.office     = _.find(this.data.offices, {number: office});
      obj.round      = (round === 'r1') ? 1 : 2;
      obj.registered = roundData.registered;
      obj.voters     = roundData.voters;
      obj.expressed  = roundData.expressed;
      obj.candidates = [];
      Object.keys(roundData.candidates).forEach(function(id) {
        var result        = {};
        var candidate     = _.find(this.data.candidates, {id: id});
        result.candidate  = candidate;
        result.percentage = parseFloat(roundData.candidates[id].percentage);
        result.count      = parseInt(roundData.candidates[id].count, 10);
        obj.candidates.push(result);
      }, this);
    }, this);
    this.data.officesResults.push(obj);
  }, this);
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
      if (lists[id].length > 0) {
        lists[id].forEach(function(rawMate) {
          var mate        = {};
          mate.round      = round[0];
          mate.candidate  = _.find(this.data.candidates, function(obj) { return obj.id === id; });
          mate.name       = rawMate.name;
          mate.position   = rawMate.position;
          mate.cc         = rawMate.cc;
          mate.mergedFrom = null;
          this.data.lists.push(mate);
        }.bind(this));
      }
    }.bind(this));
  }.bind(this));
};

Generator.prototype.overrideLists = function() {
  var group = function group(round) {
    return _.chain(this.data.lists)
    .filter({round: round})
    .groupBy(function(m) { return m.candidate.id; })
    .mapValues(function(m) { return _.map(m, function(i) { return i.name; }); })
    .value();
  }.bind(this);
  var r1 = group(1);
  var r2 = group(2);
  var diffs = {};
  Object.keys(r2).forEach(function(key) {
    var r2mates = r2[key];
    var r1mates = r1[key];
    var diff = _.difference(r2mates, r1mates);
    if (diff.length) diffs[key] = diff;
  }, this);
  Object.keys(diffs).forEach(function(key) {
    diffs[key].forEach(function(mate) {
      var older = _.find(this.data.lists, function(m) { return (m.round === 1 && m.name === mate); });
      var newer = _.find(this.data.lists, function(m) { return (m.round === 2 && m.name === mate); });
      newer.mergedFrom = _.find(this.data.candidates, {id: older.candidate.id});
      this.data.lists = _.without(this.data.lists, newer);
      this.data.lists.push(newer);
    }, this);
  }, this);
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
  this.overrideLists();
  this.buildResults();
  this.overrideResults();
  this.buildOfficesResults();
  this.createFiles();
};
