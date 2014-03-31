define([

  'jquery',
  'App.views.Council',
  'App.collections.CouncilMember'

], function($, CouncilView, CouncilMemberCollection) {

  'use strict';

  var controller = function() {
    var view = new CouncilView({councilMembers: new CouncilMemberCollection()});
    $('#content').html(view.el);
  };

  return controller;

});
