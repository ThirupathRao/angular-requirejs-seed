'use strict';

define([
    'angular',
    'angularRoute',
    'home/HomeController',
    'home/homeService',
    'applicationConstants/constants'
], function(angular, angularRoute, HomeController) {
    var module =  angular.module('myApp.home', [
        'socialdashboard.home.service',
        'socialdashboard.constants'
    ]);
    module.controller('HomeController', HomeController);
});

