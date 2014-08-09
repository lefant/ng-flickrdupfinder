'use strict';

require('angular-route');

require('./controllers');

angular.module('flickrDupFinder', ['ngRoute', 'flickrDupFinderControllers'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/photos', {
        templateUrl: 'partials/photos.html',
        controller: 'photoCtrl',
        resolve: { 'Flickr': 'Flickr' }
      })
    .otherwise({
      redirectTo: '/photos'
    });
  }]);
