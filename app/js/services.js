'use strict';

angular.module('flickrDupFinderServices', ['ngResource', 'flickrDupFinderConfig'])
  .service(
    'Flickr',
    ['$window', '$log', '$resource', '$http', '$q', 'OAUTHD_URL', 'APP_PUBLIC_KEY',
     function($window, $log, $resource, $http, $q, OAUTHD_URL, APP_PUBLIC_KEY) {
       $window.OAuth.initialize(APP_PUBLIC_KEY, {cache: true});
       $window.OAuth.setOAuthdURL(OAUTHD_URL);
       var resource = $q.defer();
       function doneHandler(result) {
         var key = APP_PUBLIC_KEY;
         var oauthio = 'k=' + key;
         oauthio += '&oauthv=1';
         function kv_result(key) { return '&'+key+'='+encodeURIComponent(result[key]); }
         oauthio += kv_result('oauth_token');
         oauthio += kv_result('oauth_token_secret');
         oauthio += kv_result('code');
         $http.defaults.headers.common = {oauthio: oauthio};
         resource.resolve(
           $resource(
             OAUTHD_URL + '/request/flickr/services/rest/',
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
             }));
       }

       if ($window.OAuth.callback('flickr')) {
         $window.OAuth.callback('flickr').done(doneHandler).fail(function(callbackError) {
           $log.log('OAuth.callback error: ', callbackError);
         });
       } else {
         $window.OAuth.popup('flickr').done(doneHandler).fail(function(error) {
           $log.log('OAuth.popup error: ', error);
           resource.reject('OAuth.popup error: ' + error);
         });
       }
       return resource.promise;
     }]);
