'use strict';

angular.module('PdxArtTrekker.galleryController', [])
.controller('GalleryCtrl', function( $scope,
                                     artService,
                                     placesService,
                                     favoritesManager,
                                     $ionicLoading,
                                     $ionicPopup,
                                     $ionicSideMenuDelegate,
                                     $stateParams,
                                     $ionicScrollDelegate,
                                     $state,
                                     $ionicActionSheet ) {
  var self = this;
  this.model = {
    showDeleteButton: false,
    title: 'Gallery',
    artworks: [],
    moreDataCanBeLoaded: true
  };

  var _allArt = [];
  var _counter = 0;

  $ionicLoading.show({
    template: 'Loading...',
    hideOnStateChange: true
  });



  var _gallerySetup = function() {
    var type = $stateParams.type;
    self.model.showDeleteButton = false;

    console.log("gallery setup called");



    if (type === 'all') {
      if ( _allArt.length === 0 ){
        artService.getAllArtFromJson().then( function( data ) {
          _allArt = data;
          self.model.artworks = _allArt.slice(0, 20);
          _counter = 20;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      self.model.title = 'All Art Gallery';

    } else if ( type === 'fav') {
      self.model.artworks = artService.getArtFavs( favoritesManager.getAllArt() );
      self.model.showDeleteButton = true;
      self.model.title = 'Favorites Gallery';
      self.model.moreDataCanBeLoaded = false;
    } else if ( type === 'places' ) {

    }
    $ionicLoading.hide();
  };



  $scope.$on('$stateChangeSuccess', function() {
    _gallerySetup();
    $ionicScrollDelegate.scrollTop();

    console.log("on change status");
  });

  this.loadMore = function() {
    console.log('Loading more!');

    if (this.model.artworks.length === 0 ) {
      _gallerySetup();
      return;
    }

    for (var i= _counter; i< 20 + _counter; i++) {
      this.model.artworks.push(_allArt[i]);
    }

    _counter = _counter + 20;

    console.log (self.model.artworks);
    if ( this.model.artworks.length === 480 ) {
      this.model.moreDataCanBeLoaded = false;
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.resize');
  };




  this.onHold = function( id ) {
    console.log("long press");

    var isFavorite = favoritesManager.isFavorite( id );
    var favButtonText = (!isFavorite) ? 'Add to Favorites' : 'Remove from Favorites';
    var type = $stateParams.type;

    // Show the action sheet
    var actionSheet = $ionicActionSheet.show({
      buttons: [
        { text: favButtonText },
        { text: 'Show Details' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
        // cancel is a no-op
      },
      buttonClicked: function( index ) {
        if ( index === 0 ) {
          if ( isFavorite ) {
            favoritesManager.delete( id );
          } else {
            favoritesManager.set( id ) ;
          }

          if ( type === 'fav' ) {
            self.model.artworks = artService.getArtFavs( favoritesManager.getAllArt() );
          }

        } else {
          $state.go( 'tab.gallery-detail', {id: id} );
        }

        return true;
      }
    });
  };

  this.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  this.onTap = function( id ) {
    console.log("tap")
    $state.go( 'tab.gallery-detail', {id: id} );
  };

  this.showConfirmDeleteFavs = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete',
      template: 'Remove all of your favorites?',
      okType: 'button-royal'
    });
    confirmPopup.then(function( res ) {
      if( res ) {
        favoritesManager.deleteAll();
        self.model.artworks = artService.getArtFavs( favoritesManager.getAllArt() );
      } else {
        // no-op
      }
    });
  };
});

