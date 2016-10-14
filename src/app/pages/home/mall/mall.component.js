;(function (angular, undefined) {
    'use strict';
    appModule('app.home')
        .directive('mall', function () {
            return {
                restrict: 'AE',
                replace:true,
                templateUrl: 'app/pages/home/mall/mall.html'
            }
        });
})(angular);