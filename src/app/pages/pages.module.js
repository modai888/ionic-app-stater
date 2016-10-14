;(function (angular, undefined) {
    'use strict';

    angular.module('app.pages', [
        // controllers and routers
        'app.home', 'app.task',
        'app.intro', 'app.auth.signup', 'app.auth.login', 'app.auth.forgotPassword', 'app.auth.changePassword',
        'app.mainPage', 'app.manage'
    ])


})(angular);