'use strict';

require('angular');
require('angular-route');

require('./services');
require('./controllers');

angular.module('flickrDupFinder', [
  'ngRoute',
  'flickrDupFinderServices',
  'flickrDupFinderControllers'])
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
