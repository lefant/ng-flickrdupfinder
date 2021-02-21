import angular from 'angular'

require('angular-resource')
require('angular-route')
require('angular-ui-bootstrap/src/pagination/pagination')

const OAuth = require('oauth-js')

const OAUTHD_URL = 'https://oauthd-lefant.herokuapp.com'
const APP_PUBLIC_KEY = '4UET5aV8f_Np4Eam-BCfQ8zvNzI'

//require('./uservoice-shim')

angular
  .module('flickrDupFinder', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap.pagination',
  ])
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
  .controller('startCtrl', [
    '$http',
    'OAUTHD_URL',
    '$log',
    function ($http, $log) {
      $http.get(OAUTHD_URL + '/auth/flickr').success(function (success) {
        $log.debug('oauthd ping successful:', success)
      })
    },
  ])
  .controller('photoCtrl', [
    '$scope',
    '$log',
    'Flickr',
    // 'UserVoice',
    function ($scope, $log, Flickr, UserVoice = []) {
      var _ = require('lodash')
      var specialTag = 'flickrdupfinder'
      $scope.itemsPerPage = 16
      $scope.maxSize = 10

      $scope.toggleTag = function (photo) {
        if (photo.duplicate) {
          removeTag(photo)
        } else {
          addTag(photo)
        }
      }

      function addTag(photo) {
        photo.inFlight = true
        Flickr.get(
          {
            method: 'flickr.photos.addTags',
            photo_id: photo.id,
            tags: specialTag,
          },
          function () {
            photo.duplicate = true
            photo.inFlight = false
          }
        )
      }

      function removeTag(photo) {
        photo.inFlight = true
        Flickr.get(
          {
            method: 'flickr.photos.getInfo',
            photo_id: photo.id,
          },
          function (info) {
            var tag = _.find(info.photo.tags.tag, function (tag) {
              return tag.raw === specialTag
            })
            if (tag) {
              Flickr.get(
                {
                  method: 'flickr.photos.removeTag',
                  photo_id: photo.id,
                  tag_id: tag.id,
                },
                function () {
                  photo.duplicate = false
                  photo.inFlight = false
                }
              )
            } else {
              photo.inFlight = false
            }
          }
        )
      }

      $scope.autoTag = function () {
        _.map($scope.visibleGroups, function (group) {
          _.map(_.rest(group), addTag)
        })
      }

      function hasMaxDateTakenGranularity(photo) {
        return true
        //return photo.datetakengranularity == "0";
      }

      function updateDuplicateState(photo) {
        photo['duplicate'] = _.contains(photo.tags.split(/ /), specialTag)
        return photo
      }

      function fingerprint(photo) {
        return photo.datetaken + '##' + photo.title.replace(/-[0-9]$/, '')
      }

      function atLeastTwo(group) {
        return group.length > 1
      }

      function groupDuplicates(photos) {
        var groups = _.groupBy(photos, fingerprint)
        var groups2 = _.filter(groups, atLeastTwo)
        $scope.groups = groups2
        updateVisibleGroups()
      }

      function getPage(page, photosAcc) {
        $scope.page = page
        var getPageRetry = function (retries) {
          Flickr.get(
            {
              method: 'flickr.photos.search',
              page: page,
              per_page: 500,
              sort: 'date-taken-asc',
            },
            function (result) {
              $scope.totalPages = result.photos.pages
              var resultPhotos = result.photos.photo
              var filteredResultPhotos = _.filter(
                resultPhotos,
                hasMaxDateTakenGranularity
              )
              var updatedResultPhotos = _.map(
                filteredResultPhotos,
                updateDuplicateState
              )
              var photosAcc2 = photosAcc.concat(updatedResultPhotos)
              if (page < result.photos.pages) {
                getPage(page + 1, photosAcc2)
              } else {
                $scope.initialDownload = false
              }
              groupDuplicates(photosAcc2)
            },
            function (error) {
              $log.debug('getPage error:', error)
              if (retries < 3) {
                $log.debug('getPage retries:', retries)
                getPageRetry(retries + 1)
              }
            }
          )
        }
        getPageRetry(0)
      }

      function updateVisibleGroups() {
        $scope.totalItems = _.size($scope.groups)
        var first = ($scope.currentPage - 1) * $scope.itemsPerPage
        var last = $scope.currentPage * $scope.itemsPerPage
        $scope.visibleGroups = _.pick(
          $scope.groups,
          _.keys($scope.groups).slice(first, last)
        )
      }

      var id = ''
      var name = ''
      var startTime = Date.now()
      Flickr.get(
        {
          method: 'flickr.test.login',
        },
        function (data) {
          $log.debug('flickr.test.login', data.user)
          UserVoice.push([
            'identify',
            {
              id: data.user.id,
              name: data.user.username._content,
            },
          ])
          UserVoice.push(['autoprompt', {}])
          id = data.user.id
          name = data.user.username._content
        }
      )

      $scope.pageChanged = function () {
        updateVisibleGroups()
      }

      $scope.totalItems = 0
      $scope.currentPage = 1
      $scope.initialDownload = true
      getPage(1, [])
    },
  ])
  .config([
    '$locationProvider',
    '$routeProvider',
    function ($locationProvider, $routeProvider) {
      //probably breaks things due to oauth redirect landing page hack below
      //$locationProvider.html5Mode(true);

      // the oauth redirect callback page must be matched with .otherwise
      $routeProvider
        .when('/', {
          templateUrl: 'partials/start.html',
          controller: 'startCtrl',
        })
        .otherwise({
          templateUrl: 'partials/photos.html',
          controller: 'photoCtrl',
          resolve: { Flickr: 'Flickr' },
        })
    },
  ])
