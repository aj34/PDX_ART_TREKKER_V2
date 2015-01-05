'use strict';

angular.module('PdxArtTrekker.listController', [])
.controller('ListCtrl', function( $scope,
                                  $rootScope,
                                  artService,
                                  mapMarkerManager,
                                  $ionicLoading ) {

  var self = this;
  this.artworks = [];

  $ionicLoading.show({
    template: 'Loading...',
    noBackdrop: true
  });

  mapMarkerManager.getGeoLocation(false).then( function( loc ){
    self.artworks = artService.getArtNearby( loc.lat, loc.lng );
  });

  $scope.$watch (function() {
    return self.artworks;
  }, function ( newValue, oldValue ) {
    if ( newValue != oldValue ) {
      $ionicLoading.hide();
    }
  });
});


