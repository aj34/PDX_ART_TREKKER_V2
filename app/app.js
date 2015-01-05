'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('PdxArtTrekker', ['ionic', 'config', 'firebase', 'ngStorage',
  'PdxArtTrekker.artService', 'PdxArtTrekker.mapCreateDirective',
  'PdxArtTrekker.mapMarkerManager', 'PdxArtTrekker.mapInitializer', 'PdxArtTrekker.constants',
  'PdxArtTrekker.favoritesManager', 'PdxArtTrekker.placesService', 'PdxArtTrekker.listController',
  'PdxArtTrekker.mainController', 'PdxArtTrekker.galleryController', 'PdxArtTrekker.mapController',
  'PdxArtTrekker.artDetailsController', 'PdxArtTrekker.placeDetailsController'
])

.run(function( $ionicPlatform, artService ) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

//  artService.getAllArtFromFirebase();
/*    console.log (document)

    // not sure if this helps the action sheet to appear
    document.ontouchmove = function(event) {
      event.preventDefault();

      console.log ("HERE")
    };*/

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider ) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in scripts
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl as map'
        }
      }
    })
    .state('tab.map-art-detail', {
      url: '/map/art/:id',
      views: {
        'tab-map': {
          templateUrl: 'templates/art-detail.html',
          controller: 'ArtDetailsCtrl as m'
        }
      }
    })
    .state('tab.map-place-detail', {
      url: '/map/place/:id',
      views: {
        'tab-map': {
          templateUrl: 'templates/place-detail.html',
          controller: 'PlaceDetailsCtrl as p'
        }
      }
    })

    .state('tab.gallery', {
      url: '/galleries/:type',
      views: {
        'tab-gallery': {
          templateUrl: 'templates/tab-gallery.html',
          controller: 'GalleryCtrl as g'
        }
      }
    })
    .state('tab.gallery-detail', {
      url: '/gallery/:id',
      views: {
        'tab-gallery': {
          templateUrl: 'templates/art-detail.html',
          controller: 'ArtDetailsCtrl as m'
        }
      }
    })

    .state('tab.list', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListCtrl as list'
        }
      }
    })
    .state('tab.list-detail', {
      url: '/list/:id',
      views: {
        'tab-list': {
          templateUrl: 'templates/art-detail.html',
          controller: 'ArtDetailsCtrl as m'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.backButton.icon('ion-android-arrow-back').previousTitleText(false);
  $ionicConfigProvider.navBar.alignTitle('left');
  $ionicConfigProvider.tabs.style('striped').position('top');
});

