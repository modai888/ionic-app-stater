;(function () {
    "use strict";

    appModule('app.home')
        .controller('HomeController', function HomeController(Chats) {
            var vm = this;

            vm.chats = Chats.all();
        });
}());
