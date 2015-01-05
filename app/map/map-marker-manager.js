'use strict';

angular.module( 'PdxArtTrekker.mapMarkerManager', [] )
.factory( 'mapMarkerManager', function( CONSTANTS, $q ) {
  var infoBubble;
  var openInfoBubble;

  function _getMarkerType( markerType ) {

    var marker = 'yellow';

//    console.log (markerType)

    if (markerType !== null){
      switch ( markerType.toLowerCase() ){
        case 'sculpture':
        case 'fountain':
          marker = 'blue';
          break;
        case 'painting':
        case 'mixed media':
        case 'photography':
        case 'video':
          marker = 'green';
          break;
        case 'architectural integration':
        case 'mural':
        case 'mosaic':
        case 'ceramic':
        case 'ceramics':
        case 'fiber':
        case 'printmaking':
          marker = 'pink';
          break;

//          marker = 'green_inside';
//          break;

//          marker = 'blue_inside';
//          break;

//          marker = 'pink_inside';
//          break;
        case 'museum':
          marker = 'blue_pin';
          break;
        case 'art_gallery':
          marker = 'pink_pin';
          break;
        default:
          marker = 'green_pin';
      }
    }
    return marker;
  }

  return {
    placesMarkers: [],
    artMarkers: [],

    createArtMarker: function( map, art ){
      var content ="<a href='#/tab/map/art/" + art.record_id + "'>" +
        "<div class='marker'><img src=" + art.image_url + " width='auto' height='100'/>" +
        "<p>" + art.title + "</p></div></a>";

      var location = new google.maps.LatLng( art.lat, art.lng );

      var marker = this.setMarkerOnMap( map, location, art.title, art.discipline, content );
      this.artMarkers.push( marker );
     },


    createPlaceMarker: function( map, place ) {
      var content;

      // using href instead of ui-sref because place_id contains chars and did not seem to work with ui-router
      if ( place.photos && place.photos.length > 0 ) {
        content = "<a href='#/tab/map/place/" + place.place_id + "'>" +
        "<div class='marker'><img src=" + place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150}) + " width='auto' height='100'/>" +
        "<p>" + place.name + "</p></div></a>";
      } else {
        content = "<a href='#/tab/map/place/" + place.place_id + "'>" +
        "<div class='placesNoPhotoMarker'><p>" + place.name + "</p></div></a>";
      }

      var marker = this.setMarkerOnMap( map, place.geometry.location, place.name, place.types[0], content );
      this.placesMarkers.push( marker );
    },

    // place an art marker
    setMarkerOnMap: function( map, location, title, markerType, content ) {
      var marker;
      var markerOptions = {
        position: location,
        map: map,
        title: title,
        icon: this.getMarker( markerType )
      };

      if (markerOptions.icon === 'images/orange.png') {
        console.log (content, title)
      }

      infoBubble = new InfoBubble({
        map: map,
        shadowStyle: 1,
        padding: 0,
        backgroundColor: 'rgb(108, 122, 128)',
        borderRadius: 3,
        borderWidth: 0,
        borderColor: 'rgb(108, 122, 128)',
        disableAutoPan: true,
        hideCloseButton: false
      });

      marker = new google.maps.Marker(markerOptions);

      if ( content !== null ) {
        google.maps.event.addListener(marker, 'click', function () {
          infoBubble.close();
          infoBubble.setContent( content );
          infoBubble.open( map, marker );
          openInfoBubble = infoBubble;
        });
      }

      return marker;
    },

    closeInfoBubble: function() {
      if ( openInfoBubble ) {
        openInfoBubble.close();
      }
    },

    getGeoLocation: function( showError ) {
      var deferred = $q.defer();

      var location = {
        lat: CONSTANTS.PdxLat,
        lng: CONSTANTS.PdxLng
      }

      if (navigator.geolocation) {
        var options = { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };

        navigator.geolocation.getCurrentPosition( function( pos ) {
          location.lat = pos.coords.latitude;
          location.lng = pos.coords.longitude;
          deferred.resolve( location );
        }, function() {
          if ( showError ) {
            alert('Unable to get Geolocation. We will use Downtown Portland as your current location.');
          }
          deferred.resolve( location );
        }, options );
      } else {
        if ( showError ) {
          alert('Geolocation is not supported. We will use Downtown Portland as your current location.');
        }
        deferred.resolve( location );
      }

      return deferred.promise;
    },

    mapGeoLocation: function( map, showError ) {
      var markerOptions = {
        map: map,
        title: 'You are here!'
      };

      this.getGeoLocation( showError).then( function( loc ){
        markerOptions.position = new google.maps.LatLng( loc.lat, loc.lng );
        new google.maps.Marker(markerOptions);
      });
    },

    getMarker: function( makerType ) {
      if ( makerType ) {
        return 'images/' + _getMarkerType( makerType ) + '.png';
      }
    }
  };
});

