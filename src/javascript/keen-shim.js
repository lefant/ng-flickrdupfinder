'use strict';

module.exports = angular.module('Keen', [])
  .factory('Keen', ['$window', function($window) {

    // Configure an instance for your project
    var client = new $window.Keen({
      projectId: "5546348b90e4bd7daf2bb4c1",
      writeKey: "1b9b62d28469ce07e4548132bbc1ac9c18d390dd61adfd4a52426ae7d4521d4b176545b2ab74c1900dd1be7424a22383a6c82519c0299c9b8eac61219fbec83d3deaa8177a8b723cbc9c6d93f9e83948a7d8706378fa6c221b9de876c78a9c21debe772488ecaed0acf1ca2c8b263ee0"
    });
    return client;
}]);
