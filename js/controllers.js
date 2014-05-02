'use strict';

angular.module('flickrDupFinderControllers',
               ['flickrDupFinderServices', 'underscore'])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', '_',
     function($scope, $log, Flickr, _) {
       Flickr.get({tags: "screens"}, function(result){
         $scope.results = result.photos.photo;
       });
       Flickr.get({tags: "flickrdupfinder"}, function(result){
         $scope.specials = result.photos.photo;
       });

       $scope.toggleTag = function(photo) {
         if (_.contains(photo.tags.split(" "), 'flickrdupfinder')) {
           Flickr.get({
             method: 'flickr.photos.getInfo',
             photo_id: photo.id,
             tags: 'flickrdupfinder'
           }, function(info) {
             var tag = _.find(info.photo.tags.tag,
                              function(tag) {
                                return tag.raw === 'flickrdupfinder';
                              });
             Flickr.get({
               method: 'flickr.photos.removeTag',
               photo_id: photo.id,
               tag_id: tag.id
             });
           });
         } else {
           Flickr.get({
             photo_id: photo.id,
             method: 'flickr.photos.addTags',
             tags: 'flickrdupfinder'
           });
         }
       };
     }]);
