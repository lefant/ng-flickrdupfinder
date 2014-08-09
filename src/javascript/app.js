'use strict';

require('angular-route');

angular.module('flickrDupFinder', ['ngRoute', require('./controllers').name])
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
