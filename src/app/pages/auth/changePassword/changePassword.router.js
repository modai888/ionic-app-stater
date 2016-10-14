;(function() {
"use strict";

appModule('app.auth.changePassword')
  .config(function ($stateProvider) {
    $stateProvider
      .state('changePassword', {
        url: '/changePassword?mode',
        templateUrl: 'app/pages/auth/changePassword/changePassword.html',
        controller: 'ChangePasswordCtrl as vm'
      });
  });
}());
