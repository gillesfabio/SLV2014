'use strict';

function formatJSON(obj) {
  var formatted = {
    themes       : [],
    candidates   : [],
    runningMates : obj.runningMates,
    programs     : obj.programs
  };
  Object.keys(obj.themes).forEach(function(key) {
    formatted.themes.push(obj.themes[key]);
  });
  Object.keys(obj.candidates).forEach(function(key) {
    formatted.candidates.push(obj.candidates[key]);
  });
  return JSON.stringify(formatted, null, 2);
}

module.exports = {
  formatJSON: formatJSON
};
