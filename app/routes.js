'use strict';
define([
    'angular',
    'angularRoute',
], function(angular) {
    return [
        '$routeProvider',
        function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: './home/home.html',
                controller: 'HomeController'
            })
            .when('/dashboard', {
                templateUrl: './dashboard/dashboard.html',
                controller: 'rootController'
            })
            .otherwise({redirectTo: '/'});
    }];
});

