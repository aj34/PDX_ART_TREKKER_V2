'use strict';

angular.module( 'PdxArtTrekker.mapCreateDirective' , [])
.directive( 'map', function( mapInitializer, $rootScope ) {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&',
      mapOptions: '='
    },
    link: function( $scope, $element ) {
      function initialize() {

        var styles = [
          {"featureType":"administrative", "stylers":[{"visibility":"off"}]},
          {"featureType":"poi","stylers":[{"visibility":"simplified"}]},
          {"featureType":"road","stylers":[{"visibility":"simplified"}]},
          {"featureType":"water","stylers":[{"visibility":"simplified"}]},
          {"featureType":"transit","stylers":[{"visibility":"simplified"}]},
          {"featureType":"landscape","stylers":[{"visibility":"simplified"}]},
          {"featureType":"road.highway","stylers":[{"visibility":"off"}]},
          {"featureType":"road.local","stylers":[{"visibility":"on"}]},
          {"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},
          {"featureType":"road.arterial","stylers":[{"visibility":"off"}]},
          {"featureType":"water","stylers":[{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]},{},
          {"featureType":"road.highway","stylers":[{"weight":0.6},{"saturation":-85},{"lightness":61}]},
          {"featureType":"road"},{},
          {"featureType":"landscape","stylers":[{"hue":"#8a6de9"},{"saturation":74},{"lightness":100}]}
        ];

        var styles2 = [
          {"featureType":"all","elementType":"labels.text","stylers":[{"color":"#000000"},{"visibility":"simplified"}]},
          {"featureType":"all","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},
          {"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"},{"visibility":"simplified"}]},
          {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#000000"},{"visibility":"off"}]},
          {"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#ff0000"}]},
          {"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},
          {"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#9b30f2"}]},
          {"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#7620bd"}]},
          {"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.man_made","elementType":"labels","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},
          {"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"}]},
          {"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},
          {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#c4c6f4"}]},
          {"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#d3d4f3"}]},
          {"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#000000"},{"weight":"0.01"}]},
          {"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"weight":"0.01"}]},
          {"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"water","elementType":"all","stylers":[{"color":"#eeeeff"},{"visibility":"on"}]}];

        var mapOptions = {
          center: new google.maps.LatLng($scope.mapOptions.lat, $scope.mapOptions.lng),
          zoom: $scope.mapOptions.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          draggable: $scope.mapOptions.draggable
//          styles: styles


        };

        var map = new google.maps.Map( $element[0], mapOptions );

        $scope.onCreate({map: map});

        google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
//          $rootScope.$broadcast('mapTilesLoaded');
        });

        google.maps.event.addListenerOnce(map, 'idle', function(){
          $rootScope.$broadcast('mapTilesLoaded');
        });
      }

      // call the map init service to async load the map
      mapInitializer.mapsInitialized.then(function(){
        initialize();
      });
    }
  };
});
