'use strict';

angular.module('PdxArtTrekker.placeDetailsController', [])
.controller('PlaceDetailsCtrl', function( $scope,
                                          $stateParams,
                                          placesService,
                                          mapMarkerManager,
                                          CONSTANTS ){

  var self = this;

  // hide the tabs on the details page
  $scope.$root.hideTabs = true;

  $scope.mapOptions = {lat: CONSTANTS.PdxLat, lng: CONSTANTS.PdxLng, zoom: 15, draggable: false };

  $scope.mapCreated = function( map ) {
    self.map = map;

    placesService.getPlaceById( $stateParams.id ).then( function( place ){
      self.place = place;

      self.place.marker = mapMarkerManager.getMarker( place.types[0] );

      mapMarkerManager.setMarkerOnMap( self.map, place.geometry.location, place.name, place.types[0], null );
      self.map.setCenter( place.geometry.location );
    });
  };

  this.openWebsite = function( url ) {
    window.open(encodeURI(url), '_system', 'location=yes');
  };
});



