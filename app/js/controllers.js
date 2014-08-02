'use strict';

angular.module('flickrDupFinderControllers',
               ['flickrDupFinderServices', 'underscore'])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', '_',
     function($scope, $log, Flickr, _) {
       $scope.addTag = function(photo) {
         Flickr.get({
           photo_id: photo.id,
           method: 'flickr.photos.addTags',
           tags: 'flickrdupfinder'
         });
         delete $scope.results[photo.id];
         $scope.specials[photo.id] = photo;
       };

       $scope.removeTag = function(photo) {
         Flickr.get({
           method: 'flickr.photos.getInfo',
           photo_id: photo.id,
           tags: 'flickrdupfinder'
         }, function(info) {
           var tag = _.find(info.photo.tags.tag,
                            function(tag) {
                              return tag.raw === 'flickrdupfinder';
                            });
           if (tag) {
             Flickr.get({
               method: 'flickr.photos.removeTag',
               photo_id: photo.id,
               tag_id: tag.id
             });
           }
         });
         delete $scope.specials[photo.id];
         $scope.results[photo.id] = photo;
       };

       function objectifyResult(result) {
         function prefixId(photo) {
           return [photo.id, photo];
         }
         var prefixedResult = _.map(result, prefixId);
         return _.object(prefixedResult);
       }

       Flickr.get({tags: "flickrdupfinder"}, function(specialResult) {
         $scope.specials = objectifyResult(specialResult.photos.photo);
         Flickr.get({tags: "screens", per_page: 10}, function(plainResult) {
           var allResults = objectifyResult(plainResult.photos.photo);
           $scope.results = _.omit(allResults, _.keys($scope.specials));
         });
       });
     }]);
