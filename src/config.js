define(function() {

  'use strict';

  return {
    baseUrl       : window.APP_BASE_URL,
    dataUrl       : window.APP_BASE_URL + 'data/data.json', // backward compatibility
    enabledRounds : [1],
    data: {
      themes         : window.APP_BASE_URL + 'data/themes.json',
      offices        : window.APP_BASE_URL + 'data/offices.json',
      officesResults : window.APP_BASE_URL + 'data/officesResults.json',
      candidates     : window.APP_BASE_URL + 'data/candidates.json',
      programs       : window.APP_BASE_URL + 'data/programs.json',
      lists          : window.APP_BASE_URL + 'data/lists.json',
      results        : window.APP_BASE_URL + 'data/results.json',
      councilMembers : window.APP_BASE_URL + 'data/councilMembers.json'
    }
  };
});
