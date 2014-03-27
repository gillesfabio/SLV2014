'use strict';

var _ = require('lodash');

// URL/IDs http://elections.interieur.gouv.fr/
var SERVER_URLCONF = {
  BASE           : 'http://elections.interieur.gouv.fr/MN2014',
  DEPT_ID        : '006',
  CITY_ID        : '006123',
  LISTS_R1_ARG   : 'C1',
  LISTS_R2_ARG   : 'C2',
  CANDIDATES_POS : [
    [1, 'marc-orsatti'],
    [2, 'marc-moschetti'],
    [3, 'joseph-segura'],
    [4, 'lionel-prados'],
    [5, 'henri-revel'],
    [6, 'francoise-benne']
  ]
};

var SERVER_URLS = {

  DEPT_URL: [
    SERVER_URLCONF.BASE,
    SERVER_URLCONF.DEPT_ID
  ].join('/') + '.html',

  CITY_URL: [
    SERVER_URLCONF.BASE,
    SERVER_URLCONF.DEPT_ID,
    SERVER_URLCONF.CITY_ID
  ].join('/') + '.html',

  LISTS_R1_BASE_URL: [
    SERVER_URLCONF.BASE,
    SERVER_URLCONF.DEPT_ID,
    SERVER_URLCONF.LISTS_R1_ARG + SERVER_URLCONF.CITY_ID
  ].join('/'),

  LISTS_R2_BASE_URL: [
    SERVER_URLCONF.BASE,
    SERVER_URLCONF.DEPT_ID,
    SERVER_URLCONF.LISTS_R2_ARG + SERVER_URLCONF.CITY_ID
  ].join('/')
};

var LISTS_URLS = (function() {
  var makeList = function(r, c) {
    return [c[1], SERVER_URLS['LISTS_R' + r + '_BASE_URL'] + 'L00' + c[0] + '.html'];
  };
  return {
    R1: _.map(SERVER_URLCONF.CANDIDATES_POS, makeList.bind(null, 1)),
    R2: _.map(SERVER_URLCONF.CANDIDATES_POS, makeList.bind(null, 2))
  };
})();

var ROUNDS_URLS = [
  [1, SERVER_URLS.CITY_URL]
];

var CANDIDATES_IDS = [
  ['marc-orsatti', 'Marc Orsatti'],
  ['marc-moschetti', 'Marc Moschetti'],
  ['joseph-segura', 'Joseph Segura'],
  ['lionel-prados', 'Lionel Prados'],
  ['henri-revel', 'Henri Revel'],
  ['francoise-benne', 'Françoise Benne']
];

module.exports = {
  POPULATION_COUNT : 29942,
  SERVER_URLCONF   : SERVER_URLCONF,
  SERVER_URLS      : SERVER_URLS,
  LISTS_URLS       : LISTS_URLS,
  CANDIDATES_IDS   : CANDIDATES_IDS,
  ROUNDS_URLS      : ROUNDS_URLS
};
