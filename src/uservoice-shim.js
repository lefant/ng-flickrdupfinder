'use strict';

module.exports = angular.module('UserVoice', [])
  .factory('UserVoice', ['$window', '$log', function($window, $log) {
    $window.UserVoice = $window.UserVoice || [];

    (function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/3js0Qddw9DhiKWh87R2Qnw.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})();

    // Set colors
    $window.UserVoice.push(['set', {
      accent_color: '#6aba2e',
      trigger_color: 'white',
      trigger_background_color: 'rgba(46, 49, 51, 0.6)'
    }]);
    // Add default trigger to the top-left corner of the window:
    $window.UserVoice.push(['addTrigger', { mode: 'contact', trigger_position: 'top-left' }]);

    return $window.UserVoice;
}]);
