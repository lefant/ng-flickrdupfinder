'use strict';

require('angular-resource');

module.exports = angular.module(
  'flickrDupFinderServices',
  ['ngResource', require('./config').name, require('./oauth-shim').name])
  .service(
    'Flickr',
    ['$log', '$resource', '$http', '$q', '$location', 'OAuth', 'OAUTHD_URL', 'APP_PUBLIC_KEY',
     function(
       $log, $resource, $http, $q, $location, OAuth, OAUTHD_URL, APP_PUBLIC_KEY) {
       OAuth.initialize(APP_PUBLIC_KEY, {cache: true});
       OAuth.setOAuthdURL(OAUTHD_URL);
       var resource = $q.defer();
       function doneHandler(result) {
         var key = APP_PUBLIC_KEY;
         var oauthio = 'k=' + key;
         oauthio += '&oauthv=1';
         function kv_result(key) {
           return '&'+key+'='+encodeURIComponent(result[key]);
         }
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

       var oauthCallback = OAuth.callback('flickr');
       if (oauthCallback) {
         oauthCallback.done(doneHandler).fail(function(callbackError) {
           $log.debug('OAuth.callback error: ', callbackError);
         });
       } else {
         // the callback url must be routed through .otherwise in the app router
         OAuth.redirect('flickr', $location.absUrl());
       }
       return resource.promise;
     }]);
