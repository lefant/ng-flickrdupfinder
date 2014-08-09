'use strict';

angular.module('OAuth', []).factory('OAuth', ['$window', '$log', function($window, $log) {
  // jquery from cdn via index.html for now
  // var jQuery = require('jquery');
  // global.jQuery = jQuery;
  require('oauth-js');
  return $window.OAuth;
}]);
