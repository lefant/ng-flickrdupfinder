'use strict';

module.exports = angular.module('OAuth', [])
  .factory('OAuth', ['$window', '$log', function($window, $log) {
  require('oauth-js');
  return $window.OAuth;
}]);
