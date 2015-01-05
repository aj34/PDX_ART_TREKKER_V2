'use strict';

angular.module( 'PdxArtTrekker.placesService', [] )
.factory( 'placesService', function( $q, CONSTANTS, $window ) {

  var _defaults = {
    radius: 8000,
    types: [ 'museum','art_gallery' ],
    location: null,
    map: null,
    placeId: null,
    nearbySearchErr: 'Unable to find nearby places',
    placeDetailsErr: 'Unable to find place details',
    nearbySearchApiFnCall: 'nearbySearch',
    placeDetailsApiFnCall: 'getDetails'
  };

  function _commonAPI( args ) {
    var req = angular.copy( _defaults, {} );
    angular.extend( req, args );
    var deferred = $q.defer();
    var service;
    var allPlaces = [];

    function callback( results, status, pagination ) {
      if ( status === google.maps.places.PlacesServiceStatus.OK ){
        if ( req.apiFnCall === _defaults.nearbySearchApiFnCall ){
          allPlaces = allPlaces.concat( results );
          if ( pagination.hasNextPage ) {
            setTimeout( function () {
              pagination.nextPage();
            }, 100 );
          } else{
            return deferred.resolve( allPlaces );
          }
        }else{
          return deferred.resolve( results );
        }
      } else{
        return deferred.reject( req.errorMsg );
      }
    }

    service = new google.maps.places.PlacesService( req.map );
    service[req.apiFnCall]( req, callback );

    return deferred.promise;
  }

  return {

    getAllPlaces: function ( map ) {
      if ( map ) {
        var args = {};

        angular.extend( _defaults, args );
        args.map = map;
        args.location = new google.maps.LatLng( CONSTANTS.PdxLat, CONSTANTS.PdxLng );
        args.errorMsg = _defaults.nearbySearchErr;
        args.apiFnCall = _defaults.nearbySearchApiFnCall;
        return _commonAPI( args );
      }
    },

    getPlaceById: function( id ) {
      var args = {};

      angular.extend( _defaults, args );
      args.placeId = id;
      args.map = $window.document.createElement('div');
      args.errorMsg = _defaults.placeDetailsErr;
      args.apiFnCall = _defaults.placeDetailsApiFnCall;
      return _commonAPI( args );
    }
  };
});

