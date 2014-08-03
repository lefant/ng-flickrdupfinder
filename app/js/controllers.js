'use strict';

angular.module('flickrDupFinderControllers',
               ['flickrDupFinderServices', 'underscore'])
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
         $log.debug("addTag: ", photo);
         Flickr.get({
           photo_id: photo.id,
           method: 'flickr.photos.addTags'
         }, function() {
           photo.duplicate = true;
           $scope.specials[photo.id] = photo;
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
               delete $scope.specials[photo.id];
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

       Flickr.get({tags: "flickrdupfinder"}, function(specialResult) {
         $scope.specials = _.indexBy(specialResult.photos.photo, 'id');
         Flickr.get({tags: "screens", per_page: 10}, function(plainResult) {
           var allResults = _.map(plainResult.photos.photo, checkTag);
           var groups = _.groupBy(allResults, fingerprint);
           var groups2 = _.object(_.filter(_.pairs(groups), atLeastTwo));
           $scope.groups = groups2;
         });
       });
     }]);
