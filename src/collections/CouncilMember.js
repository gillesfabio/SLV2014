define([

  'backbone',
  'App.config',
  'App.models.CouncilMember'

], function(Backbone, config, CouncilMemberModel) {

  'use strict';

  return Backbone.Collection.extend({

    model : CouncilMemberModel,
    url   : config.data.councilMembers

  });
});
