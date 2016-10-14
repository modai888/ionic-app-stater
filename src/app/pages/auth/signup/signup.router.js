;(function() {
"use strict";

appModule('app.auth.signup')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/pages/auth/signup/signup.html',
        controller: 'SignupCtrl as vm'
      });
  });
}());
