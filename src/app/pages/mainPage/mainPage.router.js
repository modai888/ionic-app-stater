;(function() {
"use strict";

appModule('app.mainPage')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.auth.main', {
        url: "/main",
        abstract: true,
        views: {
          'menuContent@app': {
            templateUrl: "app/pages/mainPage/tabs.html"
          }
        }
      })
      // Note: each tab has its own nav history stack
      .state('app.auth.main.dash', {
        url: '/dash',
        views: {
          'main-dash': {
            templateUrl: 'app/pages/mainPage/dash.html',
            controller: 'DashCtrl as vm'
          }
        }
      })
      .state('app.auth.main.chats', {
        url: '/chats',
        views: {
          'main-chats': {
            templateUrl: 'app/pages/mainPage/chats.html',
            controller: 'ChatsCtrl as vm'
          }
        }
      })
      .state('app.auth.main.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'main-chats': {
            templateUrl: 'app/pages/mainPage/chatDetail.html',
            controller: 'ChatDetailCtrl as vm'
          }
        }
      })
      .state('app.auth.main.account', {
        url: '/account',
        views: {
          'main-account': {
            templateUrl: 'app/pages/mainPage/account.html',
            controller: 'AccountCtrl as vm'
          }
        }
      });
  })
;
}());
