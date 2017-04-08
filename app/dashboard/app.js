'use strict';

define([
    'angular',
    'c3',
    './dashboardControllerInit'
,    './dashboardController',
    './dashboardService',
    'applicationConstants/constants',
], function(angular, c3, rootControllerInit, rootController) {
    var module =  angular.module('myApp.rootController', [
        'socialdashboard.root.service',
        'socialdashboard.constants'
    ]);
    console.log(c3);
        module.run(rootControllerInit);
        module.controller('rootController', rootController);
});

