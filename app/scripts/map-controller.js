'use strict';

angular.module('PdxArtTrekker.mapController', [])
.controller('MapCtrl', function( $scope,
                                 artService,
                                 placesService,
                                 $ionicLoading,
                                 mapMarkerManager,
                                 $compile,
                                 CONSTANTS, $timeout ) {
  var self = this;
  this.model = {
    isArtShowing: true,
    isPlacesShowing: true
  };

  $scope.mapOptions = { lat: CONSTANTS.PdxLat, lng: CONSTANTS.PdxLng, zoom: 14, draggable: true };

  $ionicLoading.show({
    template: 'Loading...',
    hideOnStateChange: true
  });

  $scope.mapCreated = function( map ) {
    self.map = map;
  };

  $scope.$on('mapTilesLoaded', function() {
    mapMarkerManager.mapGeoLocation(self.map, true);


    placesService.getAllPlaces( self.map ).then(function( data ) {
      angular.forEach( data, function( place ) {
        if ( _.contains(place.types, "store")) {
          // don't map stores
        } else {
          mapMarkerManager.createPlaceMarker( self.map, place );
        }
      })
    });
    console.log("map tiles done", new Date());

    function mapArt() {
      for (var start = 0, end = 100 ; end < CONSTANTS.TotalArtItems; ) {
        var i = 0;
        artService.getArtByKeyFromFirebase( start, end ).then(function( data ) {
          artService.addDataToArtworks( data );

//          console.log("chunk", new Date(), data)

          function callAtTimeout( data ) {
//            console.log("Timeout occurred");



            /*          function callAtTimeout2( art ) {
             console.log("Timeout2 occurred");
             self.createArtMarker( art );
             console.log ("created marker")
             };*/


            angular.forEach( data, function( art ) {
//            $timeout( function() { callAtTimeout2(art); }, 1 * j );
              mapMarkerManager.createArtMarker( self.map, art );
//              console.log ("i want to make a marker")


            });
          }

          callAtTimeout(data);

//          $timeout( function() {callAtTimeout(data);  }, 5000 * i );
//          console.log ("i am", i)
          i = i+ 1;

          //       $timeout( function() { callAtTimeout(data, i); }, 1000 * i );
        });
        start = start + 100;
        end = end + 100;
        $ionicLoading.hide();


      }
    }

    $timeout( function() { mapArt(); }, 2000 );


/*     artService.getAllArtFromFirebase().then( function( data ) {
       console.log("get all", new Date())
       console.log (data)

       function callAtTimeout( data ) {
         console.log("Timeout occurred");
         angular.forEach( data, function( art ) {
           self.createArtMarker( art );
           console.log ("created marker")
         });
       };

       $timeout( function() { callAtTimeout(data.slice(0, 50)); }, 5000 * i );

     });*/


/*    artService.getAllArtFromJson().then(function (data) {
      var i = 0;
      function callAtTimeout(data) {
        console.log("Timeout occurred");
        angular.forEach( data, function( art ) {
          self.createArtMarker( art );
        });
      };
      $timeout(function() {callAtTimeout(data);}, 3000, false);
    });*/
  });



  this.toggleArtMarkers = function() {
    angular.forEach( mapMarkerManager.artMarkers, function( marker ) {
      marker.setVisible( self.model.isArtShowing );
    });
  };

  this.togglePlacesMarkers = function() {
    angular.forEach( mapMarkerManager.placesMarkers, function( marker ) {
      marker.setVisible( self.model.isPlacesShowing );
    });
  };

});





/*    for (var start = 0, end = 99 ; end < CONSTANTS.TotalArtItems; ) {

 artService.getArtByKeyFromFirebase( start, end ).then(function( data ) {
 artService.addDataToArtworks( data )

 angular.forEach( data, function( art ) {
 self.createArtMarker( art );
 });
 });
 start = start + 100;
 end = end + 100;
 $ionicLoading.hide();   /// think about if we really want this here
 }*/

/*    for (var key = 0; key < CONSTANTS.TotalArtItems; key++ ) {
 artService.getArtByKeyFromFirebase( key ).then(function( data ) {
 self.createArtMarker( data );
 });
 }*/

/*    artService.getAllArtFromFirebase().then( function( data ) {
 angular.forEach( data, function( art ) {
 self.createArtMarker( art );

 });
 })*/
