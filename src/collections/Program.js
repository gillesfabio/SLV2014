define([

  'App.config',
  'App.models.Program',
  'backbone'

], function(config, ProgramModel, Backbone) {

  'use strict';

  return Backbone.Collection.extend({

    model : ProgramModel,
    url   : config.data.programs,

    parse: function(res) {
      return res.programs;
    },

    findByCandidate: function(id) {
      return this.find(function(model) {
        if (model.get('candidate')) return model.get('candidate').id === id;
      });
    },

    findByTheme: function(id) {
      var models = [];
      this.each(function(model) {
        var projects = _.filter(model.get('projects'), function(project) {
          return project.theme.id === id;
        });
        if (projects.length > 0) {
          model.attributes.projects = projects;
          models.push(model);
        }
      });
      return new this.constructor(models);
    },

    findByThemeAndGroupByCandidate: function(id) {
      var models = this.findByTheme(id);
      models = new this.constructor(models.shuffle());
      models = models.groupBy(function(m) { return m.get('candidate').name; });
      Object.keys(models).forEach(function(key) {
        models[key] = models[key][0].toJSON();
      });
      return models;
    },

    candidateProjects: function(id) {
      var model = this.findByCandidate(id);
      if (!model) return;
      var projects = model.get('projects');
      return _.groupBy(projects, function(obj) { return obj.theme.name; });
    }
  });
});
