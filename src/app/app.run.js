;(function (angular, undefined) {
    'use strict';

    angular.module('app')
        .run(function ($ionicPlatform, $ionicPopup, $ionicSideMenuDelegate, $ionicHistory, $state, $rootScope, $translate,
                       $log, $timeout, $cordovaDevice, loggingDecorator, Application, APP, UserService,
                       FirebaseConfiguration) {

            loggingDecorator.decorate($log);

            if (FirebaseConfiguration.debug === true) {
                Firebase.enableLogging(function (logMessage) {
                    //$log.log(new Date().toISOString() + ': ' + logMessage);
                    $log.log('FB: ' + logMessage);
                });
            }

            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {

                    $log.debug('$stateChangeError, to: ' + JSON.stringify(toState) + ' error: ' + JSON.stringify(error));
                });

            function isValidUser() {
                if (!UserService.isUserLoggedIn()) {
                    return false;
                }

                //
                // TO DO: we might check for the user role here, e.g:
                //
                // var userRole = UserService.getUserRole();
                //
                // Then if the page we want to go to requires a specific role (e.g. "admin") then we might block access (by
                // returning 'false' if the user does not have that role, see this page which explains the technique:
                //
                // www.jvandemo.com/how-to-use-areas-and-border-states-to-control-access-in-an-angular-application-with-ui-router
                //

                //
                // Sample code to illustrate this (commented out for now):
                //

                //var userType = UserService.getUserType();
                //
                //// if the userType is not known (not specified, or user data not loaded yet), then say that the user is 'valid'
                //if (!userType) {
                //  $log.log('User type not yet known');
                //  return true;
                //}
                //
                //// userType should start with "admin"
                //var userTypeValid = userType.match(/admin/);
                //
                //$log.log("userType = '" + userType + "' userTypeValid = " + userTypeValid);
                //
                //return userTypeValid;

                return true;
            }

            function checkValidUser() {

                if (!isValidUser()) {
                    $log.debug('APP - no valid user, redirect to login');

                    // redirect to login page
                    $timeout(function () {
                        $state.go('login', {});
                    }, 0);

                    return false;
                }

                return true;
            }

            // www.jvandemo.com/how-to-use-areas-and-border-states-to-control-access-in-an-angular-application-with-ui-router/
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // when state name matches 'app.auth.*' then login is required
                if (toState.name && toState.name.match(/^app\.auth\./)) {

                    if (!isValidUser()) {

                        // cancel state change
                        event.preventDefault();

                        // redirect to login page
                        return $state.go('login', {});
                    }
                }
            });

            $rootScope.$on(UserService.loadUserDataSuccess(), function (event, userData) {
                $log.info('APP - user data loaded, userRole: ' + userData.userRole);

                // store the userRole back into the user object
                UserService.setUserRole(userData.userRole);

                // check valid user now that the user data has been loaded (so the user's role is know)
                checkValidUser();
            });

            $rootScope.$on(UserService.loadUserDataError(), function (event, error) {
                $log.error("APP - error loading user data");

                // check valid user now that the user data has been loaded (so the user's role is know)
                checkValidUser();
            });

            $ionicPlatform.ready(function () {
                $log.info('IONIC PLATFORM READY');

                Application.setIonicPlatformReady(true);

                // hide or show the accessory bar by default (set the value to false to show the accessory bar above the keyboard
                // for form inputs - see: https://github.com/driftyco/ionic-plugin-keyboard/issues/97 and
                // http://forum.ionicframework.com/t/ionic-select-is-missing-the-top-confirm-part-in-ios/30538
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                }
                if (window.StatusBar) {   // org.apache.cordova.statusbar required
                    StatusBar.styleLightContent();   //StatusBar.styleDefault();   // ?
                }

                // Add the ability to close the side menu by swiping to te right, see:
                // http://forum.ionicframework.com/t/bug-ionic-beta-14-cant-close-sidemenu-with-swipe/14236/17
                document.addEventListener('touchstart', function (event) {
                    if ($ionicSideMenuDelegate.isOpenLeft()) {
                        event.preventDefault();
                    }
                });

                Application.registerBackbuttonHandler();
                Application.init();

                checkDeviceReady();

                Application.gotoStartPage($state);
            });

            function checkDeviceReady() {

                if (window.cordova) {
                    document.addEventListener("deviceready", function () {
                        $log.info("checkDeviceReady: device is ready");

                        Application.setDeviceReady(true);

                        var device = $cordovaDevice.getDevice();
                        $log.info("DEVICE: " + JSON.stringify(device));

                        //if (device && device.uuid) {
                        //  loggingService.setDeviceId(device.uuid);
                        //}
                    }, false);
                }
            }

        });

})(angular);