'use strict';
define([
    'angular',
    'c3',
    'angularRoute',
], function(angular, c3) {
    return [
        '$scope',
        'facebookAuth',
        'facebookPostsData',
        function($scope, facebookAuth, facebookPostsData) {
            var reactionsChartObj;
            var countChartObj;
            var fanbaseChartObj;
            var postsChartObj;
            var friendsChartObj;
            var postSelected = -1;

            $scope.$on('updateCharts', function(event, args){
                updateCountChart();
                updateFanbaseChart();
                updatePostsChart();
                updateReactionsChart();
                updateTopPosts();
            });//

            $scope.$on('updatePostDetails', function(event, index, isFullPicture){
                if (isFullPicture) {
                    var canvas=document.getElementById(index+"canvas");
                    var ctx=canvas.getContext("2d");
                    var cw=canvas.width;
                    var ch=canvas.height;

                    var img=new Image();
                    img.src=$scope.posts[index]['postdetails'].picture;
                    img.onload=function(){
                        var c1=scaleIt(img,1);
                        canvas.width=c1.width;
                        canvas.height=c1.height;
                        ctx.drawImage(c1,0,0,canvas.width, canvas.height);
                        var img1 = new Image();
                        img1.src = "./assests/colorframe.png";
                        img1.onload=function(){
                            ctx.drawImage(img1,0,0, canvas.width, canvas.height);
                        };
                    };


                    var  scaleIt = function(source,scaleFactor){
                        var c=document.createElement('canvas');
                        var ctx=c.getContext('2d');
                        var w=source.width*scaleFactor;
                        var h=source.height*scaleFactor;
                        c.width=w;
                        c.height=h;
                        ctx.drawImage(source,0,0,w,h);
                        return(c);
                    }
                }
            });


            $scope.selectImage = function($event){
                $event.target.name = "active-icon";
            };

            $scope.ToggleDiv = function(id1, id2) {
                d3.select('#'+id1) .style("opacity", "0");
                d3.select('#'+id2) .style("opacity", "1");
            };

            var generateCharts = function () {
                $scope.posts = [];
                generateReactionsChart({});//donut
                generateCountChart({});//bar chart
                generatePostsChart([]);//time series chart
                generateFanbaseChart([]);//line chart
//                generateFriendsChart();//bubble chart
            };


            $scope.selectPost = function (index) {
                $scope.postSelected = index;
                if (!$scope.posts[index]['postdetails']) {
                    facebookPostsData.getPostDetails(index);
                }
            };

            var updateTopPosts = function () {
                $scope.posts = facebookPostsData.getPosts();
                $scope.$apply();
            };
            var updateReactionsChart = function () {
                var data = facebookPostsData.getReactions();
                setTimeout(function () {
                    reactionsChartObj.load({
                        columns: [
                            ['LIKE', data.LIKE ? data.LIKE : 0],
                            ['LOVE', data.LOVE ? data.LOVE : 0],
                            ['HAHA', data.HAHA ? data.HAHA : 0],
                            ['WOW', data.WOW ? data.WOW : 0],
                            ['ANGRY', data.ANGRY ? data.ANGRY : 0],
                        ]
                    });
                },1500);
            };

            var generateReactionsChart = function (data) {
                reactionsChartObj = c3.generate({
                    bindto: '#Reactions_BarChart',
                    data: {
                        columns: [
                            ['LIKE', data.like ? data.like:0],
                            ['LOVE', data.love ? data.love:0],
                            ['HAHA', data.haha ? data.haha:0],
                            ['WOW', data.wow ? data.wow:0],
                            ['ANGRY', data.angry ? data.angry:0],
                        ],
                        type : 'donut'
                    },
                    donut: {
                        title: "Iris Petal Width"
                    }
                });
            };

            var updateCountChart = function () {
                setTimeout(function () {
                    countChartObj.load({
                        columns: [
                            ['Posts', facebookPostsData.getPostsCounts()],
                            ['Reactions', facebookPostsData.getTotalReactionsCount()],
                            ['Comments', facebookPostsData.getCommentsCount()],
                            ['Friends', facebookPostsData.getFriendsCount()]
                        ]
                    });
                },1500);
            };

            var generateCountChart = function (data) {
                countChartObj = c3.generate({
                    bindto : '#AllCounts_BarChart',
                    y: {
                        label: 'Metric is cut off yygg',
                        tick: {
                            count:3,
                            format: function(){return'fy'}
                        }
                    } ,
                    data: {
                        columns: [
                            ['Posts', data.posts?data.posts:0],
                            ['Reactions', data.likes?data.likes:0],
                            ['Comments', data.comments?data.comments:0],
                            ['Friends', data.friends?data.friends:0]
                        ],
                        types: {
                            Posts: 'bar',
                            Reactions: 'bar',
                            Comments: 'bar',
                            Friends: 'bar'
                        }
                    },
                    axis: {
                        rotated: true
                    }
                });
            };

            var updatePostsChart = function () {
                setTimeout(function () {
                    var data = facebookPostsData.getPostsyearCount();
                    data = data.data.slice(0).reverse();
                    postsChartObj.load({
                        json : data,
                        keys: {
                            x: 'year',
                            value: ["count"]
                        }
                    });
                },1500);
            };

            var generatePostsChart = function (data) {
                console.log(data);
                postsChartObj = c3.generate({
                    bindto : '#chart',
                    data: {
                        type : 'bar',
                        json: data,
                        keys: {
                            x: 'year',
                            value: ["count"]
                        }
                    },
                    axis: {
                        x: {
                            type: "category",
                            label: 'Total Posts count per year'
                        }
                    }
                });
            };


            var updateFanbaseChart = function () {
                setTimeout(function () {
                    var data = facebookPostsData.getPosts();
                    data = data.slice(0,50).reverse();
                    fanbaseChartObj.load({
                        json : data,
                        keys: {
                            value: ["reactions_total_count"]
                        },
                        types: {
                            reactions_total_count: 'area',
                        },
                        axis: {
                            x: {
                            }
                        }
                    });
                },1500);
            };

            var generateFanbaseChart = function (data) {
                fanbaseChartObj= c3.generate({
                    bindto : '#FanBase_LineChart',
                    data: {
                        json: data,
                        keys: {
                            value: ["reactions_total_count"]
                        }
                    },
                    axis: {
                        x: {
                        }
                    },
                    types: {
                        x: 'area',
                    }
                });
            };


            var generateFriendsChart = function () {
                var root = {
                    children: [
                        {"name": "Agglom1erativeCluster", "value": 3938},
                        {"name": "Com1munityStructure", "value": 3812},
                        {"name": "Hi1erarchicalCluster", "value": 6714},
                        {"name": "Me1rgeEdge", "value": 743}, {"name": "AgglomerativeCluster", "value": 3938},
                        {"name": "CommunityStructu1re", "value": 3812},
                        {"name": "HierarchicalClust1er", "value": 6714},
                        {"name": "MergeEd1ge", "value": 1},
                    ]
                };

                var diameter = 960,
                    format = d3.format(",d"),
                    color = d3.scale.category20c();

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([diameter, diameter])
                    .padding(1.5);

                var svg = d3.select("#Friends").append("svg")
                    .attr("viewBox","0 0 960 960")
                    .attr("perserveAspectRatio","xMinYMid")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("class", "bubble");

                var node = svg.selectAll(".node")
                    .data(bubble.nodes((root))
                        .filter(function(d) { return !d.children; }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                node.append("title")
                    .text(function(d) { return d.name + ": " + format(d.value); });

                node.append("circle")
                    .attr("r", function(d) { return d.r; })
                    .style("fill", function(d) {
                        var k = Math.floor(((Math.random() * 1000) + 1)*d.value);
                        console.log(k);
                        return color(k); });

                node.append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.name.substring(0, d.r / 3); });
//});

//d3.select(self.frameElement).style("height", diameter + "px");
                /*
                 var chart = $(".bubble"),
                 aspect = chart.width() / chart.height(),
                 container = chart.parent();
                 $(window).on("resize", function() {
                 var targetWidth = container.width();
                 chart.attr("width", targetWidth);
                 chart.attr("height", Math.round(targetWidth / aspect));
                 }).trigger("resize");*/
            };

            $scope.fbLogin = function () {
                facebookAuth.login();
            };

            generateCharts();
        }];
});

