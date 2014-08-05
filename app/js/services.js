'use strict';

/* Services */

angular.module('flickrDupFinderServices', ['ngResource'])
  .service(
    'Flickr',
    ['$window', '$log', '$resource', '$http', '$location',
     function($window, $log, $resource, $http, $location) {
       var oauthd_url = 'http://nisse.lefant.net:6284';
       var key = 'foRRKXfQipy7kziBuWDhh1Ibs_k';   // nisse
       //var key = 'cF4gOblEUpueTtsL44-gVjZeeXM'; // oauth.io
       $window.OAuth.initialize(key, {cache: true});
       $window.OAuth.setOAuthdURL(oauthd_url);
       var resource;
       $window.OAuth.popup('flickr').done(function(result) {
         var oauthio = 'k=' + key;
         oauthio += '&oauthv=1';
         function kv_result(key) { return '&'+key+'='+encodeURIComponent(result[key]); }
         oauthio += kv_result('oauth_token');
         oauthio += kv_result('oauth_token_secret');
         oauthio += kv_result('code');
         $http.defaults.headers.common = {oauthio: oauthio};
         resource = $resource(oauthd_url + '/request/flickr/services/rest/',
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


       }).fail(function(error) {
         $log.log('OAuth.popup error: ', error);
       });
       return resource;
     }]);
