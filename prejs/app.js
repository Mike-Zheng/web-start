var app = angular.module("ProjectApp", ['mgo-mousetrap', 'LocalStorageModule']);


app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('NTU-ICAN-PLAYER');
});

app.controller("ProjectController", function($scope, $timeout, $location, $http, PlayerFactory, localStorageService) {


    $scope.init = function() {
        // PlayerFactory.loadVolume().then(function(data) {
        //     console.log(data);
        //     $scope.slider.value = data;
        // });
    };


    function loadSearch() {
        console.log("讀取上次搜尋狀態..");
        if (localStorageService.isSupported) {
            return getLocalStorge('NTU-ICAN-PLAYER-SEARCH');
        }

    }

    function saveSearch(musicLists) {
        if (localStorageService.isSupported) {

            setLocalStorge('NTU-ICAN-PLAYER-SEARCH', musicLists)
        }
    }


    function broadCast(message, isMarquee) {

        $scope.broadCasting = true;

        $scope.broadCast = message;
        $timeout(function() {
            $scope.broadCasting = false;
            $scope.broadCast = "";
        }, 3000);

    }


});

app.factory('PlayerFactory', function($q, $http) {


    var _factory = {};
    _factory.play = function(id) {
        var defer = $q.defer();
        $http.get("http://140.112.26.236:80/music?id=" + id)
            .then(function(response) {
                _factory.data = response.data;
                defer.resolve(_factory.data);
            }, function(response) {
                alert("");
                defer.reject(_factory.data);
            });
        return defer.promise;
    };


    _factory.loadVolume = function() {
        var defer = $q.defer();
        $http.get("http://140.112.26.236:80/get_volume")
            .then(function(response) {
                _factory.data = response.data;
                defer.resolve(_factory.data);
            }, function(response) {
                alert("");
                defer.reject(_factory.data);
            });
        return defer.promise;
    };

    _factory.setVolume = function(range) {
        var defer = $q.defer();
        $http.get("http://140.112.26.236:80/set_volume?volume=" + range)
            .then(function(response) {
                _factory.data = response.data;
                defer.resolve(_factory.data);
            }, function(response) {
                alert("");
                defer.reject(_factory.data);
            });
        return defer.promise;
    };
    _factory.pause = function() {
        var defer = $q.defer();
        $http.get("http://140.112.26.236:80/pause_and_play")
            .then(function(response) {
                _factory.data = response.data;
                defer.resolve(_factory.data);
            }, function(response) {
                alert("");
                defer.reject(_factory.data);
            });
        return defer.promise;
    };

    return _factory;
});

// app.factory('googleService', function($q, $http) {

//     var _factory = {};


//     _factory.youtubeSearch = function(query) {
//         var deferred = $q.defer();

//         gapi.client.load('youtube', 'v3', function() {
//             gapi.client.setApiKey('AIzaSyCRwMuGP50aOvrptyXRZtveE50faOLb8R0');
//             var request = gapi.client.youtube.search.list({
//                 part: 'snippet,id',
//                 q: query,
//                 type: 'video',
//                 maxResults: 24
//             });
//             request.execute(function(response) {

//                 deferred.resolve(response.result);
//             });
//         });
//         return deferred.promise;
//     };
//     _factory.youtubeSearchWithContent = function(query) {
//         var deferred = $q.defer();

//         gapi.client.load('youtube', 'v3', function() {
//             gapi.client.setApiKey('AIzaSyCRwMuGP50aOvrptyXRZtveE50faOLb8R0');
//             var request = gapi.client.youtube.search.list({
//                 part: 'snippet,id',
//                 q: query,
//                 type: 'video',
//                 maxResults: 24
//             });
//             request.execute(function(response) {
//                 var searchResults = { items: [] };
//                 response.result.items.forEach(function(data, i) {
//                     var url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + data.id.videoId + "&key=AIzaSyCRwMuGP50aOvrptyXRZtveE50faOLb8R0&part=snippet,contentDetails";
//                     $.ajax({
//                         async: false,
//                         type: 'GET',
//                         url: url1,
//                         success: function(data) {
//                             if (data.items.length > 0) {
//                                 console.log(data.items[0]);
//                                 // var output = getResults(data.items[0]);
//                                 searchResults.items.push(data.items[0]);
//                                 // $('#results').append(output);
//                             }
//                         }
//                     });
//                 });

//                 // deferred.resolve(response.result);
//                 deferred.resolve(searchResults);

//             });
//         });

//         return deferred.promise;
//     };



//     return _factory;
// });

app.directive('pressEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.pressEnter);
                });

                event.preventDefault();
            }
        });
    };
});
