'use strict';

define([
	'angular',
	'angularRoute',
	'routes',
    'dashboard/app',
	'home/app',
    'applicationConstants/constants'
], function(angular, angularRoute, routes) {
	var module =  angular.module('myApp', [
		'ngRoute',
        'socialdashboard.constants',
		'myApp.home',
		'myApp.rootController'
    ]);
	module.config(routes);
});

