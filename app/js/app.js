'use strict';

angular.module('flickrDupFinder', [
  'ngRoute',
  'flickrDupFinderServices',
  'flickrDupFinderControllers'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/photos', {
        templateUrl: 'partials/photos.html',
        controller: 'photoCtrl'
      })
    .otherwise({
      redirectTo: '/photos'
    });
  }]);


angular.module('underscore', []).factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});
