;(function (angular, undefined) {
    'use strict';

    angular.module('app')
        .config(function ($stateProvider) {

            // top level routes (all other routes are defined within their own module)
            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "js/app/menu/menu.html"
                })

                .state('app.auth', {
                    url: "/auth",
                    abstract: true,
                    template: '<ion-view/>'
                });
        })
})(angular);