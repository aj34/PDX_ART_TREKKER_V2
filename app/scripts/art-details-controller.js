'use strict';

angular.module('PdxArtTrekker.artDetailsController', [])
.controller('ArtDetailsCtrl', function( $scope,
                                       $stateParams,
                                       artService,
                                       mapMarkerManager,
                                       favoritesManager,
                                       CONSTANTS,
                                       $ionicLoading ) {

  var self = this;

  // hide the tabs on the details page
  $scope.$root.hideTabs = true;

  $scope.mapOptions = {lat: CONSTANTS.PdxLat, lng: CONSTANTS.PdxLng, zoom: 15, draggable: false };

  $scope.mapCreated = function( map ) {
    self.map = map;
  };

  artService.getArtById( $stateParams.id ).then( function( art ) {
      self.art = art;
      console.log (art);

      self.art.marker = mapMarkerManager.getMarker( art.discipline );

      self.isFavorite = favoritesManager.isFavorite( art.record_id );

      var location = new google.maps.LatLng( art.lat, art.lng );

      mapMarkerManager.setMarkerOnMap( self.map, location, art.title, art.discipline, null );
      self.map.setCenter( new google.maps.LatLng( art.lat, art.lng ) );
    }
  );

  this.toggleFab = function() {
    if ( this.isFavorite ) {
      favoritesManager.delete( this.art.record_id );
    } else {
      favoritesManager.set( this.art.record_id );
    }

    var toastMsg = ( !this.isFavorite ) ? 'Added to Favorites': 'Removed from Favorites';

    $ionicLoading.show({
      template: toastMsg,
      noBackdrop: true,
      duration: 1500,
      hideOnStateChange: true
    });

    this.isFavorite = favoritesManager.isFavorite( this.art.record_id );
  };
});



