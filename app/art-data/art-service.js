'use strict';

angular.module( 'PdxArtTrekker.artService', [] )
.factory( 'artService', function( $firebase, $q, $http, CONSTANTS ) {
  var _ref = new Firebase('https://pdxarttrekker.firebaseio.com/');//.limitToFirst(50);
  var _sync = $firebase(_ref);

  var _toRad = function( degree ) {
    var rad = degree* Math.PI/ 180;
    return rad;
  };

  var _distance =  function( lat1, lon1, lat2, lon2 ) {
    var Rm = 3961; // Radius pf the earth in miles
    var dLat = _toRad(lat2-lat1);  // Javascript functions in radians
    var dLon = _toRad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(_toRad(lat1)) * Math.cos(_toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var m = Rm * c; // Distance in miles
    return m;
  };

  var _largeImageURL = function( url ) {
    var imageURL = url;

    console.log(url);

    if ( url ) {
      var index = url.indexOf('thumb.jpg');

      if ( index > -1 ) {
        // remove the thumb from the url
        imageURL = imageURL.slice( 0, imageURL.length - 9 ) + '.jpg';
      }
    }

    return imageURL;
  };


  return {
    artworks: null,

    getAllArtFromJson: function() {
      var self = this,
          deferred = $q.defer();

      if ( !self.artworks ) {
        self.artworks = CONSTANTS.AllArt;
        deferred.resolve( self.artworks );
      } else {
        deferred.resolve( self.artworks );
      }

      return deferred.promise;
    },


    getAllArt: function () {
      if ( !this.artworks ) {
//        console.log(new Date());
        this.artworks = _sync.$asArray();
//        console.log(new Date());
      }
      return this.artworks;
    },

    addDataToArtworks: function( data ) {
      var self = this;

      if ( !this.artworks ) {
        this.artworks = [];
      }
      angular.forEach( data, function( art ) {
        self.artworks.push( art );
      });
    },

    // async gets items from firebase db only once
    getAllArtFromFirebase: function() {
      var self = this,
          deferred = $q.defer();

      if( !self.artworks || self.artworks.length === 0 ) {
        _ref.orderByKey().once( "value", function( artData ) {
          console.log("got art from Fire", artData.val());
          deferred.resolve( artData.val() );
          self.artworks =  artData.val();
        }), function( error ){
          deferred.reject( [] );
        };
      } else {
        console.log ("did not do anything had my data ")
        deferred.resolve( self.artworks );
      }

      return deferred.promise;
    },


    getArtByKeyFromFirebase: function( start, end )  {
      var self = this,
          deferred = $q.defer();
      console.log (start , end );
      _ref.orderByKey().startAt( start.toString() ).endAt( end.toString() ).once( "value", function( artData ) {
//        console.log ( artData.val() );
        deferred.resolve( artData.val() );
      }), function( error ){
        deferred.reject( null );
      };

      return deferred.promise;
    },

    // this gets items from our cache
    getArtById: function( id ) {
      var self = this,
          deferred = $q.defer();

      self.getAllArtFromJson().then( function( data ) {
        console.log (data)
        var index = _.findIndex( data, {'record_id': parseInt(id)});

        if ( index !== -1 ) {
          var art = data[ index ];
          // get a larger thumbnail url
          art.image_url_large = _largeImageURL( art.image_url );
          deferred.resolve( art );
        } else {
          deferred.reject( null );
        }
      });

      return deferred.promise;
    },

    getArtNearby: function( currentLat, currentLng ) {
      var artNearby = [];

      this.getAllArtFromJson().then( function( data ) {
        var lat2 = parseFloat( currentLat );
        var lon2 = parseFloat( currentLng );
        var artArray = [];

        angular.forEach( data, function( art ) {
          var artInfo = new Object();

          var lat1 = parseFloat( art.lat );
          var lon1 = parseFloat( art.lng );

          if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
            // no-op
          } else {
            artInfo.distance = Math.round(_distance(lat1, lon1, lat2, lon2) * 1000) / 1000;
          }
          artInfo.title = art.title;
          artInfo.artist = art.artist;
          artInfo.image_url = art.image_url;
          artInfo.record_id = art.record_id;
          artArray.push( artInfo );
        });

        artArray.sort(function (a, b) {
          if (a.distance < b.distance) {
            return -1;
          }
          else if (a.distance > b.distance) {
            return 1;
          }
          else {
            return 0;
          }
        });

        _.assign( artNearby, artArray.slice(0, 50) );
      });

      return artNearby;
    },

    getArtFavs: function( favArtIds ) {
      var favArtworks = [];

      this.getAllArtFromJson().then( function( data ) {
        var artArray = [];
        angular.forEach( favArtIds, function( id ) {
          var index = _.findIndex( data, {'record_id': parseInt(id)});
          if ( index !== -1 ) {
            artArray.push( data[index] );
          }
        });

        _.assign( favArtworks, artArray );
      });

      return favArtworks;
    }
  };
});

