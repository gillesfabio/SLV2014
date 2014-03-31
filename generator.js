'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');
var _    = require('lodash');
var YAML = require('yamljs');
var fse  = require('fs-extra');

var BUILD_DIR    = path.join(__dirname, 'build', 'data');
var DATA_DIR     = path.join(__dirname, 'data');

var Generator = module.exports = function Generator() {
  this.data = {
    themes         : [],
    offices        : [],
    officesResults : [],
    candidates     : [],
    programs       : [],
    lists          : [],
    results        : [],
    councilMembers : []
  };
};

Generator.prototype.buildThemes = function() {
  this.data.themes = YAML.load(path.join(DATA_DIR, 'themes.yaml'));
};

Generator.prototype.buildOffices = function() {
  var offices = YAML.load(path.join(DATA_DIR, 'offices.yaml'));
  Object.keys(offices).forEach(function(key) {
    var obj        = {};
    var raw        = offices[key];
    obj.number     = parseInt(key, 10);
    obj.name       = raw.name;
    obj.address    = raw.address;
    obj.opening    = raw.opening;
    obj.gmapSearch = raw.gmapSearch;
    this.data.offices.push(obj);
  }.bind(this));
};

Generator.prototype.buildOfficesResults = function() {
  var offices = YAML.load(path.join(DATA_DIR, 'offices-results.yaml'));
  Object.keys(offices).forEach(function(office) {
    var obj = {};
    var raw = offices[office];
    Object.keys(raw).forEach(function(round) {
      var roundData = raw[round];
      obj.office     = _.find(this.data.offices, {number: parseInt(office, 10)});
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
  this.data.candidates = YAML.load(path.join(DATA_DIR, 'candidates.yaml'));
};

Generator.prototype.buildPrograms = function() {
  var dir = path.join(DATA_DIR, 'programs');
  fs.readdirSync(dir).forEach(function(file) {
    file              = path.join(DATA_DIR, 'programs', file);
    var id            = path.basename(file).split('.')[0];
    var yaml          = YAML.load(file);
    var program       = {};
    program.candidate = _.find(this.data.candidates, function(obj) {
      return obj.id === id;
    });
    program.projects  = [];
    Object.keys(yaml).forEach(function(key) {
      var theme = _.find(this.data.themes, function(obj) {
        return obj.id === key;
      });
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
  var lists = YAML.load(path.join(DATA_DIR, 'lists.yaml'));
  _.each(lists, function(list) {
    list.candidate  = _.find(this.data.candidates, function(m) {
      return m.id === list.candidate;
    });
    list.mergedFrom = _.find(this.data.candidates, function(m) {
      return m.id === list.mergedFrom;
    });
    this.data.lists.push(list);
  }, this);
};

Generator.prototype.buildCouncilMembers = function() {
  var members = YAML.load(path.join(DATA_DIR, 'council.yaml'));
  _.each(members, function(member) {
    member.list = _.find(this.data.candidates, function(m) {
      return m.id === member.list;
    });
    this.data.councilMembers.push(member);
  }, this);
};

Generator.prototype.buildResults = function() {
  var results = YAML.load(path.join(DATA_DIR, 'results.yaml'));
  _.each(results, function(round) {
    var candidates = [];
    _.each(round.candidates, function(candidate) {
      candidate.candidate = _.find(this.data.candidates, function(m) {
        return m.id === candidate.candidate;
      });
      candidates.push(candidate);
    }, this);
    round.candidates = candidates;
    this.data.results.push(round);
  }, this);
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
  this.buildCouncilMembers();
  this.buildResults();
  this.buildOfficesResults();
  this.createFiles();
};
