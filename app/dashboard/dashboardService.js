/**
 * Created by tirupathirao on 3/2/2017.
 */
'use strict';
define([
    'angular',
    'angularRoute'
], function(angular) {
    angular.module('socialdashboard.root.service',[])
       .service('facebookAuth', [
       'uriConstants',
       'facebookPostsData',
        function(uriConstants, facebookPostsData) {
        var login = function() {
            FB.getLoginStatus(function(res) {
                console.log(res);
                if (res.status === 'connected') {
                    isUserLoggedIn = true;
                    facebookPostsData.getUserInfo();
                    facebookPostsData.getUserPosts(uriConstants.listOfPosts);
                }
                else {
                FB.login(function (response) {
                    if (response.authResponse) {
                        console.log('Welcome!  Fetching your information.... ');
                    } else {
                        /!*TODO: show error message : need permission to see dashabord*!/
                    }
                }, { scope: 'user_posts' });
                }
            });
        };

        var logout = function() {
            var _self = this;
            FB.logout(function(response) {

            });
        };

        var isUserLoggedIn = function () {
            FB.getLoginStatus(function(res) {
                if (res.status === 'connected') {
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        return {
            login: login,
            logout: logout,
            isUserLoggedIn: isUserLoggedIn
        }
    }]);
});

