'use strict';

function formatJSON(obj) {
  var formatted = {
    categories: [],
    parties: [],
    candidates: [],
    programs: obj.programs
  };
  Object.keys(obj.categories).forEach(function(key) {
    formatted.categories.push(obj.categories[key]);
  });
  Object.keys(obj.parties).forEach(function(key) {
    formatted.parties.push(obj.parties[key]);
  });
  Object.keys(obj.candidates).forEach(function(key) {
    formatted.candidates.push(obj.candidates[key]);
  });
  return JSON.stringify(formatted, null, 2);
}

module.exports = {
  formatJSON: formatJSON
};
