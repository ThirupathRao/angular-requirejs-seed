'use strict';
define([
    'angular',
    'angularRoute',
], function(angular) {
        return ['$rootScope', '$window', 'facebookAuth',
        function($rootScope, $window, facebookAuth) {
            $rootScope.user = {};
            $window.fbAsyncInit = function() {
                FB.init({
                    appId: '675268885993336',
                    channelUrl: '../channel.html',
                    status: true,
                    cookie: true,
                    xfbml: true
                });
                FB.Event.subscribe('auth.authResponseChange', function(res) {
                    if (res.status === 'connected') {
                      //  facebookAuth.login();
                    }
                    else {

                    }
                });
            };
            (function(d){
                var js,
                    id = 'facebook-jssdk',
                    ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement('script');
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            }(document));
        }];
});

1