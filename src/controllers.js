module.exports = angular
  .module('flickrDupFinderControllers', [
    'ui.bootstrap.pagination',
    'flickrDupFinderConfig',
    'flickrDupFinderServices',
    'UserVoice',
  ])
  .controller('startCtrl', [
    '$http',
    'OAUTHD_URL',
    '$log',
    function ($http, OAUTHD_URL, $log) {
      $http.get(OAUTHD_URL + '/auth/flickr').success(function (success) {
        $log.debug('oauthd ping successful:', success)
      })
    },
  ])
  .controller('photoCtrl', [
    '$scope',
    '$log',
    'Flickr',
    'UserVoice',
    function ($scope, $log, Flickr, UserVoice) {
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
