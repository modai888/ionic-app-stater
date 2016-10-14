;(function (angular, undefined) {
    'use strict';

    angular.module('app')
        .config(function ($stateProvider) {

            // top level routes (all other routes are defined within their own module)
            $stateProvider
                .state('app', {
                    url: "/app",
                    // abstract: true,
                    // templateUrl: "app/pages/menu/menu.html"
                    template: "<ion-nav-view name='menuContent'></ion-nav-view>"
                })

                .state('app.home', {
                    url: '/home',
                    views: {
                        'menuContent@app': {
                            templateUrl:'app/pages/home/shell.html',
                            controller:'HomeController as vm'
                        }
                    }
                })

                .state('app.task', {
                    url: '/task/:id',
                    views: {
                        'menuContent@app': {
                            templateUrl: 'app/pages/tasks/task.html',
                            controller: 'TaskController as vm'
                        }
                    }
                })


                .state('app.auth', {
                    url: "/auth",
                    abstract: true,
                    template: '<ion-view/>'
                });
        })
})(angular);