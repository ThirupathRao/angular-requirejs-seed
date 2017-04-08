'use strict';
define([
    'angular',
    'angularRoute'
], function(angular) {
    angular.module('socialdashboard.constants',[])
        .service('uriConstants', function () {
            var MaxPostLimit = 50;
            var MaxReactionLimit = 1000;
            var MaxCommentsLimit = 1000;
            return {
                listOfPosts : 'me/posts?limit=' + MaxPostLimit + '&total_count&fields=story,id,created_time,reactions.limit(' + MaxReactionLimit + ').summary(true){id,name,type},sharedposts.limit(' + MaxPostLimit + ').summary(true){id,name},comments.limit(' + MaxCommentsLimit + ').summary(true){from,message}'
            }
    });
});

