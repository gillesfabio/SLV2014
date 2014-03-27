'use strict';

var fs       = require('fs');
var casper   = require('casper').create();
var settings = require('./settings');

console.log(JSON.stringify(settings.ROUNDS_URLS, undefined, 2));

var data = {
  r1: {
    lists   : {},
    results : {}
  },
  r2: {
    lists   : {},
    results : {}
  }
};

var rawData = {
  r1: {
    lists   : {},
    results : {},
    stats   : {}
  },
  r2: {
    lists   : {},
    results : {},
    stats   : {}
  }
};

// Lists: ROUND 1
casper.start().each(settings.LISTS_URLS.R1, function(self, url) {
  self.thenOpen(url[1], function() {
    rawData.r1.lists[url[0]] = this.evaluate(function(getTds) {
      return getTds(document, 'table.tableau-composition-liste td');
    }, getTds);
  });
});

// Results: ALL ROUNDS
casper.each(settings.ROUNDS_URLS, function(self, url) {
  self.thenOpen(url[1], function() {
    rawData['r' + url[0]].stats = this.evaluate(function(getTds) {
      return getTds(document, 'table.tableau-mentions td');
    }, getTds);
    rawData['r' + url[0]].results = this.evaluate(function(getTds) {
      return getTds(document, 'table.tableau-resultats-listes td');
    }, getTds);
  });
});

casper.run(function() {
  formatLists([1]);
  formatResults([1]);
  fs.write('scrap-data.json', JSON.stringify({data: data}, undefined, 2), 'w');
  this.exit();
});

function getTds(document, q) {
  var elements = document.querySelectorAll(q);
  return Array.prototype.map.call(elements, function(e) {
    return e.outerText;
  });
}

function getCandidateID(name) {
  for (var i = 0; i < settings.CANDIDATES_IDS.length; i++) {
    var candidate = settings.CANDIDATES_IDS[i];
    var re        = new RegExp(name, 'gi');
    var matches   = re.exec(candidate[1]);
    if (matches && matches.length > 0) return candidate[0];
  }
}

function isCandidate(name) {
  var candidate = getCandidateID(name);
  if (candidate) return true;
  return false;
}

function formatLists(rounds) {
  rounds.forEach(function(round) {
    var lists = rawData['r' + round].lists;
    Object.keys(lists).forEach(function(key) {
      var rawList = lists[key];
      var chunck  = 2;
      var list    = [];
      for (var i = 0; i < rawList.length; i += chunck) {
        var raw      = rawList.slice(i, i + chunck);
        var rawName  = raw[0];
        var name     = rawName.split(' - ')[1];
        var position = rawName.split(' - ')[0];
        name = name.split(' ').slice(1).join(' '); // Remove civility
        if (isCandidate(name)) continue;
        list.push({
          name     : name,
          position : parseInt(position, 10),
          cc       : (raw[1].toLowerCase() === 'oui') ? true : false
        });
      }
      data['r' + round].lists[key] = list;
    });
  });
}

function getStats(round) {
  var results = rawData['r' + round].stats;
  var chunck  = 4;
  var stats = {
    registered  : {},
    abstentions : {},
    voters      : {},
    expressed   : {},
    nota        : {}
  };
  for (var i = 0; i < results.length; i += chunck) {
    var raw           = results.slice(i, i+chunck);
    var title         = raw[0].toLowerCase();
    var count         = parseInt(raw[1].replace(' ', ''), 10);
    var registeredPct = parseFloat(raw[2].replace(',', '.'));
    var votersPct     = parseFloat(raw[3].replace(',', '.'));
    switch (title) {
      case 'inscrits':
        stats.registered.count = count;
        stats.registered.percentage = 100 * count / settings.POPULATION_COUNT;
        break;
      case 'abstentions':
        stats.abstentions.count = count;
        stats.abstentions.percentage = registeredPct;
        break;
      case 'votants':
        stats.voters.count = count;
        stats.voters.percentage = registeredPct;
        break;
      case 'blancs ou nuls':
        stats.nota.count = count;
        stats.nota.percentage = votersPct;
        break;
      case 'exprimés':
        stats.expressed.count = count;
        stats.expressed.percentage = registeredPct;
        break;
    }
  }
  return stats;
}

function formatResults(rounds) {
  rounds.forEach(function(round) {
    var rawResults = rawData['r' + round].results;
    var results    = data['r' + round].results;
    var chunck     = 6;
    results.stats = getStats(round);
    results.candidates = {};
    for (var i = 0; i < rawResults.length; i += chunck) {
      var raw  = rawResults.slice(i, i + chunck);
      var name = raw[0];
      var parts = name.split(' ');
      name = parts.slice(1, parts.length - 1).join(' ');
      name = getCandidateID(name);
      var result = {
        count      : parseInt(raw[1].replace(' ', ''), 10),
        percentage : parseFloat(raw[3].replace(',', '.')),
        cmSeats    : parseInt(raw[4].replace(' ', ''), 10),
        ccSeats    : parseInt(raw[5].replace(' ', ''), 10)
      };
      results.candidates[name] = result;
    }
  });
}
