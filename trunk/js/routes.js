angular.module('wechat.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("tab", {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html",
        })
        .state('tab.law', {
            url: '/law',
            views: {
                'tab-law': {
                    templateUrl: 'templates/tab-law.html',
                    controller: "lawCtrl"
                }
            }
        })
        .state('lawList', {
            url: '/lawList/:lawId',
            templateUrl: "templates/law-list.html",
            controller: "lawListCtrl"
        })
        .state('lawDetail', {
            url: '/lawDetail/:lawId/:questionId',
            templateUrl: "templates/law-detail.html",
            controller: "lawDetailCtrl"
        })
        .state('tab.composite', {
            url: '/composite',
            views: {
                'tab-composite': {
                    templateUrl: 'templates/tab-composite.html',
                    controller: "compositeCtrl"
                }
            }
        })
        .state('compositeList', {
            url: '/compositeList/:compositeId',
            templateUrl: "templates/composite-list.html",
            controller: "compositeListCtrl"
        })
        .state('compositeDetail', {
            url: '/compositeDetail/:compositeId/:questionId',
            templateUrl: "templates/composite-detail.html",
            controller: "compositeDetailCtrl"
        })
        .state('tab.cas', {
            url: '/cas',
            views: {
                'tab-cas': {
                    templateUrl: 'templates/tab-cas.html',
                    controller: "casCtrl"
                }
            }
        })
        .state('casList', {
            url: '/casList/:casId',
            templateUrl: "templates/cas-list.html",
            controller: "casListCtrl"
        })
        .state('casDetail', {
            url: '/casDetail/:casId/:questionId',
            templateUrl: "templates/cas-detail.html",
            controller: "casDetailCtrl"
        });

    $urlRouterProvider.otherwise("/tab/composite");
});