'use strict';

var fs = require('fs');

function createJSON(obj, output) {
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
  var json = JSON.stringify(formatted, null, 2);
  var file = fs.openSync(output, 'w+');
  fs.writeSync(file, json);
  fs.closeSync(file);
}

module.exports = {
  createJSON: createJSON
};
