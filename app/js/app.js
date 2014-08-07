'use strict';

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
    $routeProvider
      .when('/', {
        template: 'redirecting to flickr.com for authorization...',
        controller: 'redirectCtrl'
      })
    .otherwise({
      redirectTo: '/'
    });
  }]);


angular.module('flickrDupFinderConfig', [])
  .constant('OAUTHD_URL', 'http://nisse.lefant.net:6284')
  .constant('APP_PUBLIC_KEY', 'foRRKXfQipy7kziBuWDhh1Ibs_k') //nisse
  //.constant('APP_PUBLIC_KEY', 'cF4gOblEUpueTtsL44_k') //oauth.io


angular.module('underscore', []).factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});
