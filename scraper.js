'use strict';

var fs = require('fs');
var casper = require('casper').create();

var CANDIDATES_IDS = [
  ['marc-orsatti', 'Marc Orsatti'],
  ['marc-moschetti', 'Marc Moschetti'],
  ['joseph-segura', 'Joseph Segura'],
  ['lionel-prados', 'Lionel Prados'],
  ['henri-revel', 'Henri Revel'],
  ['francoise-benne', 'Françoise Benne']
];

var LISTS_URLS = {
  r1: [
    ['marc-orsatti', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L001.html'],
    ['marc-moschetti', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L002.html'],
    ['joseph-segura', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L003.html'],
    ['lionel-prados', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L004.html'],
    ['henri-revel', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L005.html'],
    ['francoise-benne', 'http://elections.interieur.gouv.fr/MN2014/006/C1006123L006.html']
  ]
};

var ROUNDS_URLS = [
  [1, 'http://elections.interieur.gouv.fr/MN2014/006/006123.html']
];

var data = {
  r1: {
    lists: {},
    results: {}
  },
  r2: {
    lists: {},
    results: {}
  }
};

var rawData = {
  r1: {
    lists: {},
    results: {}
  },
  r2: {
    lists: {},
    results: {}
  }
};

casper.start().each(LISTS_URLS.r1, function(self, url) {
  self.thenOpen(url[1], function() {
    rawData.r1.lists[url[0]] = this.evaluate(function () {
      function getTds(q) {
        var elements = document.querySelectorAll(q);
        return Array.prototype.map.call(elements, function(e) {
          return e.outerText;
        });
      }
      return getTds('table.tableau-composition-liste td');
    });
  });
});

casper.each(ROUNDS_URLS, function(self, url) {
  self.thenOpen(url[1], function() {
    rawData.r1.results = this.evaluate(function () {
      function getTds(q) {
        var elements = document.querySelectorAll(q);
        return Array.prototype.map.call(elements, function(e) {
          return e.outerText;
        });
      }
      return getTds('table.tableau-resultats-listes td');
    });
  });
});

casper.run(function() {
  formatLists();
  formatResults();
  fs.write('scrap-data.json', JSON.stringify({data: data}, undefined, 2), 'w');
  this.exit();
});

function formatLists() {
  var lists = rawData.r1.lists;
  Object.keys(lists).forEach(function(key) {
    var rawList = lists[key];
    var chunck  = 2;
    var list    = [];
    for (var i = 0; i < rawList.length; i += chunck) {
      var raw      = rawList.slice(i, i + chunck);
      var rawName  = raw[0];
      var name     = rawName.split(' - ')[1];
      var position = rawName.split(' - ')[0];
      list.push({
        name     : name,
        position : parseInt(position, 10),
        cc       : (raw[1].toLowerCase() === 'oui') ? true : false
      });
    }
    data.r1.lists[key] = list;
  });
}

function formatResults() {
  var results = rawData.r1.results;
  var chunck  = 6;
  for (var i = 0; i < results.length; i += chunck) {
    var raw  = results.slice(i, i+chunck);
    var name = raw[0];
    for (var ii = 0; ii < CANDIDATES_IDS.length; ii++) {
      var candidate = CANDIDATES_IDS[ii];
      var re        = new RegExp(candidate[1], 'gi');
      var matches   = re.exec(name);
      if (matches && matches.length > 0) {
        name = candidate[0];
        break;
      }
    }
    var result = {
      votes         : raw[1],
      registeredPct : raw[2],
      expressedPct  : raw[3],
      cmCount       : raw[4],
      ccCount       : raw[5]
    };
    data.r1.results[name] = result;
  }
}
