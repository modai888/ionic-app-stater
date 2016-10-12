;(function (angular, undefined) {
    'use strict';

    angular.module('app', [
        'app.config',
        'app.core',
        // generic services
        'app.util', 'app.firebase', 'app.hooks', 'app.user', 'app.oauthUtil', 'app.image',
        // controllers and routers
        'app.intro', 'app.auth.signup', 'app.auth.login', 'app.auth.forgotPassword', 'app.auth.changePassword',
        'app.mainPage', 'app.manage',
        // ANGULAR-TEMPLATECACHE
        'templates'
    ]);

})(angular);