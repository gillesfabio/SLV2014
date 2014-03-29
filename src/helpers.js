define([

  'underscore',
  'handlebars',
  'markdown',

], function(_, Handlebars, markdown) {

  'use strict';

  Handlebars.registerHelper('md2html', function(md) {
    return new Handlebars.SafeString(markdown.toHTML(md));
  });

  Handlebars.registerHelper('formatAddress', function(address) {
    address = address.replace(/\n/g, '<br>');
    return new Handlebars.SafeString(address);
  });

  Handlebars.registerHelper('gmapsLink', function(search) {
    var url = [
      'http://maps.google.com/?q=',
      'France+06700+Saint-Laurent-du-Var+',
      encodeURIComponent(search)
    ];
    return new Handlebars.SafeString(url.join(''));
  });

  Handlebars.registerHelper('lastname', function(id) {
    if (id) return id.split('-')[1];
  });

  Handlebars.registerHelper('withSortedCandidates', function(context, options) {
    return options.fn(_.sortBy(context, function(m) { return -m.count; }));
  });

});
