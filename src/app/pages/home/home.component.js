;(function (angular, undefined) {
    'use strict';
    appModule('app.home')
        .directive('home', function () {
            return {
                restrict: 'AE',
                replace:true,
                templateUrl: 'app/pages/home/shell.html',
                controller: 'HomeController as vm'
            }
        });
})(angular);