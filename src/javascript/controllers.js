'use strict';

require('./../../bower_components/ui.bootstrap/src/pagination/pagination');

module.exports = angular.module(
  'flickrDupFinderControllers',
  ['ui.bootstrap.pagination', require('./services').name])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', function($scope, $log, Flickr) {
       var _ = require('underscore');
       var specialTag = 'flickrdupfinder';

       $scope.toggleTag = function(photo) {
         if (photo.duplicate) {
           removeTag(photo);
         } else {
           addTag(photo);
         }
       };

       function addTag(photo) {
         Flickr.get({
           photo_id: photo.id,
           method: 'flickr.photos.addTags',
           tags: specialTag
         }, function() {
           photo.duplicate = true;
           $scope.taggedDuplicate[photo.id] = photo;
         });
       };

       function removeTag(photo) {
         Flickr.get({
           method: 'flickr.photos.getInfo',
           photo_id: photo.id
         }, function(info) {
           var tag = _.find(info.photo.tags.tag,
                            function(tag) {
                              return tag.raw === specialTag;
                            });
           if (tag) {
             Flickr.get({
               method: 'flickr.photos.removeTag',
               photo_id: photo.id,
               tag_id: tag.id
             }, function() {
               photo.duplicate = false;
               $scope.groups[fingerprint(photo)][photo.id] = photo;
               delete $scope.taggedDuplicate[photo.id];
             });
           }
         });
       };

       function checkTag(photo) {
         photo['duplicate'] = _.contains(photo.tags.split(/ /), specialTag);
         return photo;
       }

       function fingerprint(photo) {
         return photo.title.replace(/-[0-9]$/, '') + '##' + photo.datetaken;
       }

       function atLeastTwo(group) {
         return group[1].length > 1;
       }

       function dateTakenIsMostGranular(photo) {
         return true;
         //return photo.datetakengranularity == "0";
       }

       Flickr.get({tags: specialTag}, function(result) {
         var checkedResults = _.map(result.photos.photo, checkTag);
         $scope.taggedDuplicate = _.indexBy(checkedResults, 'id');
       });

       function groupDuplicates(results) {
         var results2 = _.filter(results, dateTakenIsMostGranular);
         var results3 = _.map(results2, checkTag);
         var groups = _.groupBy(results3, fingerprint);
         var groups2 = _.object(_.filter(_.pairs(groups), atLeastTwo));
         $scope.groups = groups2;
         updateVisibleGroups()
       }

       function getPage(page, photosAcc) {
         $scope.page = page;
         Flickr.get({page: page, per_page: 500}, function(result) {
           $scope.totalPages = result.photos.pages;
           var photosAcc2 = photosAcc.concat(result.photos.photo);
           if (page < result.photos.pages) {
             getPage(page + 1, photosAcc2);
           } else {
             $scope.initialDownload = false;
           }
           groupDuplicates(photosAcc2);
         });
       }


      function updateVisibleGroups() {
        $scope.totalItems = _.size($scope.groups);
        var first = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var last = $scope.currentPage * $scope.itemsPerPage;
        $scope.visibleGroups = _.pick($scope.groups, _.keys($scope.groups).slice(first, last));
        $log.debug('updateVisibleGroups totalItems: ', $scope.totalItems);
        $log.debug('updateVisibleGroups currentPage: ', $scope.currentPage);
        $log.debug('updateVisibleGroups itemsPerPage: ', $scope.itemsPerPage);
        $log.debug('updateVisibleGroups first: ', first);
        $log.debug('updateVisibleGroups last: ', last);
        $log.debug('updateVisibleGroups groups: ', $scope.groups);
        $log.debug('updateVisibleGroups visibleGroups: ', $scope.visibleGroups);
      }

      $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
        updateVisibleGroups()
      };

      $scope.totalItems = 0;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;
      $scope.maxSize = 10;

       $scope.initialDownload = true;
       getPage(1, []);
     }]);
