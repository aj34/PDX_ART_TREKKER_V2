'use strict';

// Google async initializer needs global function, so we use $window
angular.module('PdxArtTrekker.mapInitializer', [])
.factory('mapInitializer', function( $window, $q ){

  var asyncUrl = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=',
      mapsDefer = $q.defer();

  // Callback function - resolving promise after maps successfully loaded
  $window.googleMapsInitialized = mapsDefer.resolve;

  // Async loader
  var asyncLoad = function( asyncUrl, callbackName ) {
    var script = document.createElement('script');
    script.src = asyncUrl + callbackName;
    document.body.appendChild(script);
  };

  // Start loading google maps
  asyncLoad( asyncUrl, 'googleMapsInitialized' );

  // Usage: Initializer.mapsInitialized.then(callback)
  return {
    mapsInitialized : mapsDefer.promise
  };
});
