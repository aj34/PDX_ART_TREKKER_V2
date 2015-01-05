'use strict';

angular.module( 'PdxArtTrekker.favoritesManager', [] )
.factory( 'favoritesManager', function( $localStorage ) {
  return {

    getAllArt: function() {
      var favIds = [];
      angular.forEach( $localStorage, function( value, key ) {
        if ( value === 'artRecordId' ){
          this.push( key );
        }
      }, favIds);

      return favIds;
    },

    set: function( id ) {
      $localStorage[id] = 'artRecordId';
    },

    delete: function( id ) {
      delete $localStorage[id];
    },

    deleteAll: function() {
      $localStorage.$reset();
    },

    isFavorite: function( id ) {
      var index = -1;

      if ( id ) {
        var favIds = this.getAllArt();
        index = favIds.indexOf( id.toString() );
      }

      return index !== -1;
    }
  };
});

