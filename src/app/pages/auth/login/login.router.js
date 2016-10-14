;(function() {
"use strict";

appModule('app.auth.login')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/pages/auth/login/login.html',
        controller: 'LoginCtrl as vm'
      })
      .state('loggedout', {
        url: '/loggedout',
        templateUrl: 'app/pages/auth/login/loggedout.html',
        controller: 'LogoutCtrl as vm'
      });
  });
}());
