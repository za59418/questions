// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('wechat', ['ionic', 'wechat.controllers', 'wechat.routes',
    'wechat.services', 'wechat.directives', 'monospaced.elastic'
])

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])

.run(function ($ionicPlatform, $http, dateService, lawService, compositeService, casService) {

    var url = "";
    if (ionic.Platform.isAndroid()) {
        url = "/android_asset/www/";
    }

    // if (localStorage.getItem("messageID") === null) {

        $http.get(url + "data/json/composites.json").then(function (response) {
            compositeService.init(response.data.composites);
        });

        $http.get(url + "data/json/laws.json").then(function (response) {
            lawService.init(response.data.laws);
        });

        $http.get(url + "data/json/cass.json").then(function (response) {
            casService.init(response.data.cass);
        });

    // }
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)


        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
