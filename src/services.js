const OAuth = require('oauth-js')

const OAUTHD_URL = 'https://oauthd-lefant.herokuapp.com'
const APP_PUBLIC_KEY = '4UET5aV8f_Np4Eam-BCfQ8zvNzI'

module.exports = angular
  .module('flickrDupFinderServices', ['ngResource'])
  .service('Flickr', [
    '$log',
    '$resource',
    '$http',
    '$q',
    '$location',
    function ($log, $resource, $http, $q, $location) {
      if ($location.hash() === '') {
        $location.path('/photos')
      } //so redirect to absUrl() works
      OAuth.initialize(APP_PUBLIC_KEY, { cache: true })
      OAuth.setOAuthdURL(OAUTHD_URL)
      var resource = $q.defer()
      function doneHandler(result) {
        var key = APP_PUBLIC_KEY
        var oauthio = 'k=' + key
        oauthio += '&oauthv=1'
        function kv_result(key) {
          return '&' + key + '=' + encodeURIComponent(result[key])
        }
        oauthio += kv_result('oauth_token')
        oauthio += kv_result('oauth_token_secret')
        oauthio += kv_result('code')
        $http.defaults.headers.common = { oauthio: oauthio }
        resource.resolve(
          $resource(OAUTHD_URL + '/request/flickr/services/rest/', {
            method: 'flickr.photos.search',
            format: 'json',
            user_id: 'me',
            per_page: 10,
            sort: 'date-taken-asc',
            //text: "vision:outdoor",
            //tags: "vision:outdoor,vision:outdoor=099",
            //machine_tags: "outdoor",
            extras: 'date_upload,date_taken,tags',
            nojsoncallback: 1,
          })
        )
      }

      var oauthCallback = OAuth.callback('flickr')
      if (oauthCallback) {
        oauthCallback.done(doneHandler).fail(function (callbackError) {
          $log.debug('OAuth.callback error: ', callbackError)
        })
      } else {
        // the callback url must be routed through .otherwise in the app router
        OAuth.redirect('flickr', $location.absUrl())
      }
      return resource.promise
    },
  ])
