'use strict';

angular.module('PdxArtTrekker.mainController', [])
.controller('MainCtrl', function( $state,
                                  $rootScope,
                                  $scope,
                                  mapMarkerManager ) {
  $rootScope.$on('$stateChangeStart',
    function(/*event, toState, toParams, fromState, fromParams*/){
      $scope.$root.hideTabs = false;

      // close any open info bubbles
      mapMarkerManager.closeInfoBubble();
    }
  );

});
