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
         }, function() {
           delete $scope.results[photo.id];
           $scope.specials[photo.id] = photo;
         });
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
             }, function() {
               delete $scope.specials[photo.id];
               $scope.results[photo.id] = photo;
             });
           }
         });
       };

       Flickr.get({tags: "flickrdupfinder"}, function(specialResult) {
         $scope.specials = _.indexBy(specialResult.photos.photo, 'id');
         Flickr.get({tags: "screens", per_page: 10}, function(plainResult) {
           var allResults = _.indexBy(plainResult.photos.photo, 'id');
           $scope.results = _.omit(allResults, _.keys($scope.specials));
         });
       });
     }]);
