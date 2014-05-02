'use strict';

/* Services */

angular.module('flickrDupFinderServices', ['ngResource'])
  .factory('Flickr', ['$window', '$log', '$resource', '$http', function($window, $log, $resource, $http) {
    var key = 'cF4gOblEUpueTtsL44-gVjZeeXM';
    $window.OAuth.initialize(key, {cache: true});
    var resource;
    $window.OAuth.popup('flickr', {state: 'state'}, function(error, result) {
      if(error){ $log.log('OAuth.popup error: ', error); };
      var oauthio_endpoint = 'https://oauth.io/request/flickr/services/rest/';
      var oauthio = 'k=' + key;
      oauthio += '&oauthv=1';
      function kv_result(key) {
        return '&'+key+'='+encodeURIComponent(result[key])
      }
      oauthio += kv_result('oauth_token');
      oauthio += kv_result('oauth_token_secret');
      oauthio += kv_result('code');
      $http.defaults.headers.common = {oauthio: oauthio};
      resource = $resource('https://oauth.io/request/flickr/services/rest/',
                           {
                             method: "flickr.photos.search",
                             format: "json",
                             user_id: "me",
                             per_page: 10,
                             //text: "vision:outdoor",
                             //tags: "vision:outdoor,vision:outdoor=099",
                             //machine_tags: "outdoor",
                             extras: "date_upload,date_taken,tags",
                             nojsoncallback: 1
                           });
    });
    return resource;
  }]);
