/**
 * Created by tirupathirao on 3/2/2017.
 */
'use strict';
define([
    'angular',
    'angularRoute'
], function(angular) {
    angular.module('socialdashboard.home.service', [])
        .service('facebookPostsData',[
       'uriConstants',
       '$rootScope',
       function(uriConstants, $rootScope) {
            var posts = [];
            var friends = {};
            var reactions = {};
            var friendsCount = 0;
            var totalComments = 0;
            var totalReactions = 0;
            var postsYearCount = {data:[]};

            var getUserInfo = function() {
                var _self = this;
                FB.api('/me?fields=name'
                    , function(res) {
                        console.log(res);
                    });
            };
var sum = 0;
            var mergeArrays = function (array2) {
                //assuming array2 is sorted
                sum+=array2.length;
                if (array2 && array2.length) {
                    if (!posts.length) {
                        posts = array2;
                    } else {
                        var index = 0;
                        for(index = 0;index<posts.length;index++) {
                            if ((posts[index].reactions_total_count+posts[index].comments_total_count)<(array2[0].reactions_total_count+array2[0].comments_total_count)) {
                                posts.splice(index, 0, array2.shift());
                            }
                        }
                        if (array2.length) {
                            for(;array2.length;) {
                                posts.push(array2.shift());
                            }
                        }
                    }
                } else {
                    return 0;
                }
            };

            var getPostsLikes = function (url, data , id) {
                parsePostsLikes(data, id);
                if (url) {
                    FB.api(url
                        , function(res) {
                            if (res.paging && res.paging.next) {
                                getPostsLikes(res.paging.next, res, id);
                            }
                        });
                } else if (data && data.paging){
                    getPostsLikes(data.paging.next, undefined, id);
                } else {
                    //total friend after retrivng each post
                }
            };

            var parsePostsLikes = function (data, id) {
                if (data === undefined) {
                    return;
                } else if (data.data === undefined) {
                    return;
                }
                angular.forEach(data.data, function(value, key) {
                    updateFriendsList(value);
                    updateReactions(value.type);
                });
            };

            var updateReactions = function (type) {
              if (reactions[type])  {
                  reactions[type]++;
              } else {
                  reactions[type] = 1;
              }
            };

            var updateFriendsList = function (value) {
                if (friends[value.id]) {
                    friends[value.id]['total_reactions']++;
                    if (friends[value.id][value.type]) {
                        friends[value.id][value.type]++;
                    } else {
                        friends[value.id][value.type] = 1;
                    }
                } else {
                    friendsCount++;
                    friends[value.id] = {};
                    friends[value.id]['name'] = value.name;
                    friends[value.id]['total_reactions'] = 1;
                    friends[value.id][value.type] = 1;
                    friends[value.id]['comments'] = [];
                }
            };

            var getPostsComments = function (url, data, id) {
                parsePostsComments(data, id);
                if (url) {
                    FB.api(url
                        , function(res) {
                            if (res.paging && res.paging.next) {
                                getPostsComments(res.paging.next, res.data, id);
                            } else {
                            }
                        });
                } else if (data && data.paging){
                    getPostsLikes(data.paging.next, undefined, id);
                }
            };

            var parsePostsComments = function (data, id) {
                if (data === undefined) {
                    return;
                } else if (data.data === undefined) {
                    return;
                }
                angular.forEach(data.data, function(value, key) {
                    if (friends[value.id]) {
                        friends[value.id]['comments'].push(id);
                    } else {
                        friendsCount++;
                        friends[value.id] = {};
                        friends[value.id]['name'] = value.name;
                        friends[value.id]['comments'] = [id];
                        friends[value.id]['likes'] = [];
                    }
                });
            };

            var getUserPosts = function (url) {
                if (url) {
                    FB.api(url
                        , function(res) {
                            parseUserPosts(res.data);
                            if (res.paging && res.paging.next) {
                                    getUserPosts(res.paging.next);
                                    updateCharts();
                            } else {
                                updateCharts();
                            }
                        });
                }
            };

            var updateCharts = function () {
                $rootScope.$broadcast("updateCharts");
            };

            var parseUserPosts = function (data) {
                var tempPostData = [];
                angular.forEach(data, function(value, key) {
                    updatePostsCount(value);
                    updatePostsYearCount(value);
                    updatePosts(tempPostData, value);
                    getPostsLikes(null, value['reactions'], value.id);
                    getPostsComments(null, value['comments'], value.id)
                });
                tempPostData.sort(function (a,b) {
                   return b.reactions_total_count+b.comments_total_count - (a.reactions_total_count+a.comments_total_count)
                });
                mergeArrays(tempPostData);
                //console.log(posts);
            };

            var updatePostsYearCount = function (value) {
                var year = value.created_time.split("T")[0].split('-')[0];
                if (postsYearCount[year] !== undefined) {
                    postsYearCount.data[postsYearCount[year]].count++;
                } else {
                    postsYearCount[year]= postsYearCount.data.length;
                    postsYearCount.data.push({
                        year: year,
                        count:1
                    });
                }
            };

            var getPostsyearCount = function () {
              return postsYearCount;
            };

            var updatePostsCount = function (value) {
                totalReactions += value['reactions']['summary']['total_count'];
                totalComments += value['comments']['summary']['total_count'];
            };

            var updatePosts = function (tempPostData, value) {
                var post = {};
                post['id'] = value.id;
                post['created_time'] = value.created_time;
                post['story'] = value.story;
                post['reactions_total_count'] = value['reactions']['summary']['total_count'];
                post['comments_total_count'] = value['comments']['summary']['total_count'];
                tempPostData.push(post);
            };

            var getPostDetails = function (index) {
                if(posts[index]) {
                    FB.api(
                        "/" + posts[index].id + "?fields=id,caption,icon,link,message,name,permalink_url,picture,shares,status_type,type",
                        function (response) {
                            if (response && !response.error) {
                                posts[index]['postdetails'] = response;
                                FB.api(
                                    "/" + posts[index].id + "?fields=full_picture",
                                    function (response) {
                                        if (response && !response.error) {
                                            posts[index]['postdetails'].picture = response.full_picture;
                                            $rootScope.$broadcast("updatePostDetails", index, true);

                                        }
                                    }
                                );
                                $rootScope.$broadcast("updatePostDetails", index);
                            }
                        }
                    );
                }
            };

            var getUserFriends = function () {
              return friends;
            };

            var getCommentsCount = function () {
                return totalComments;
            };

            var getTotalReactionsCount = function () {
              return totalReactions;
            };

            var getReactions = function () {
              return reactions;
            };

            var getPostsCounts = function () {
              return posts.length;
            };

            var getPosts = function () {
              return posts;
            };

            var getFriendsCount = function () {
              return friendsCount;
            };

            return {
                getUserInfo: getUserInfo,
                getUserPosts: getUserPosts,
                getUserFriends: getUserFriends,
                getCommentsCount: getCommentsCount,
                getReactions: getReactions,
                getTotalReactionsCount : getTotalReactionsCount,
                getPostsCounts: getPostsCounts,
                getFriendsCount: getFriendsCount,
                getPostsyearCount: getPostsyearCount,
                getPosts: getPosts,
                getPostDetails: getPostDetails
            }
    }]);
});


