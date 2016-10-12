;(function (angular, undefined) {
    'use strict';

    angular.module('app')
        .config(function ($ionicConfigProvider) {

            // http://forum.ionicframework.com/t/change-hide-ion-nav-back-button-text/5260/14
            // remove back button text, use unicode em space characters to increase touch target area size of back button
            $ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');

            // NOTE: we put the tabs at the top for both Android and iOS
            $ionicConfigProvider.tabs.position("top");

            //$ionicConfigProvider.navBar.alignTitle('center');
            //
            //$ionicConfigProvider.navBar.positionPrimaryButtons('left');
            //$ionicConfigProvider.navBar.positionSecondaryButtons('right');
        })

        .config(function ($logProvider, APP) {

            // switch off debug logging in production
            $logProvider.debugEnabled(APP.devMode); // default is true
        })

        .config(function ($compileProvider, APP) {

            // switch off AngularJS debug info in production for better performance
            $compileProvider.debugInfoEnabled(APP.devMode);
        })

        .config(function ($translateProvider) {
            $translateProvider
                .useStaticFilesLoader({
                    prefix: 'js/locales/',
                    suffix: '.json'
                })
                .registerAvailableLanguageKeys(['en'], {
                    'en': 'en', 'en_GB': 'en', 'en_US': 'en'
                })
                .preferredLanguage('en')
                .fallbackLanguage('en')
                .useSanitizeValueStrategy('escapeParameters');
        })

        .factory('$exceptionHandler', function ($log) {

            // global AngularJS exception handler, see:
            // http://blog.pdsullivan.com/posts/2015/02/19/ionicframework-googleanalytics-log-errors.html
            return function (exception, cause) {
                $log.error("error: " + exception + ', caused by "' + cause + '", stack: ' + exception.stack);
            };
        })

})(angular);