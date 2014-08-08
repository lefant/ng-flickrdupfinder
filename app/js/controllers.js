'use strict';

require('angular');

require('./services');

angular.module('underscore', []).factory('_', ['$window', '$log', function($window, $log) {
  require('underscore');
  $log.debug('underscore: ', $window._);
  return $window._;
}]);

angular.module('flickrDupFinderControllers', ['flickrDupFinderServices', 'underscore'])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', '_',
     function($scope, $log, Flickr, _) {
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
       $scope.initialDownload = true;
       getPage(1, []);
     }]);
