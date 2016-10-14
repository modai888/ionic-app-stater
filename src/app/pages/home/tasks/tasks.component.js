;(function (angular, undefined) {
    'use strict';
    appModule('app.home')
        .directive('tasks', function () {
            return {
                restrict: 'AE',
                replace:true,
                templateUrl: 'app/pages/home/tasks/tasks.html'
            }
        });
})(angular);