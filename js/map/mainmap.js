/* global team,$,google,CustomMarker,CustomCluster */

/**
 * CleverMap
 * (c) 2015, CleverTech
 *
 */

$(function() {

  console.log('map run');

  var markers = [];

  // the data that I have are strings, they should be floats
  for (var j = 0; j < team.length; j++) {
    var teamMember = team[j];
    if (teamMember.lat) teamMember.lat = parseFloat(teamMember.lat);
    if (teamMember.lng) teamMember.lng = parseFloat(teamMember.lng);
  }

  /**
   * Initialize map.
   */
  function initialize() {

    // the lat/longs that I have are strings, they need to be numbers
    // debugger;
    var mapOptions = {
      zoom: 2,
      center: {lat: -34.397, lng: 150.644},
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scrollwheel: false,
      minZoom: 3,
      maxZoom: 15
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // map.setCenter({lat: -34.397, lng: 150.644});

    var bound = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow({
      maxWidth: 400
    });

    var hash = window.hash = {};

    // group by coordinates ("lat,lng") to avoid stacking
    for (var i = 0; i < team.length; i++) {
      var latLng = team[i];

      var key = latLng.lat + ',' + latLng.lng;
      if (!hash[key]) {
        hash[key] = {
          lat: latLng.lat,
          lng: latLng.lng,
          items: []
        };
      }
      hash[key].items.push(latLng);
    }

    function pluck(array, prop) {
      return array.map(function(item) {
        return item[prop];
      });
    }

    function sortBy(array, prop) {
      var order = 1;
      if (prop[0] === '-') {
        order = -1;
        prop = prop.slice(1);
      }

      function compare(a, b) {
        if (a[prop] < b[prop])
          return order * -1;
        if (a[prop] > b[prop])
          return order * 1;
        return 0;
      }
      return array.sort(compare);
    }

    function getMarkerTooltip(items) {
      var item = items[0];
      var tooltip = $('#map-marker-tooltip').clone().show();

      tooltip.find('.avatar').attr('src', item.gravatarURL);
      tooltip.find('.name').html(item.shortName);
      tooltip.find('.role').html(item.role || '');
      tooltip.find('.location').html(item.country);
      tooltip.find('.bio').html(item.bio);

      return tooltip.get(0);
    }

    function getClusterTooltip(items) {
      items = pluck(items, 'tooltip');
      var sortedItems = sortBy(items, 'name');
      var tooltip = $('#map-cluster-tooltip').clone().show();
      var list = tooltip.find('ul');
      list.empty();

      for (var i = 0; i < sortedItems.length; i++) { // eslint-disable-line no-shadow
        list.append('<li class="ttItem" data-id="' + sortedItems[i].id + '"><a href="#"><img class="avatar" src=' + sortedItems[i].gravatarURL + '/><div><h1 class="name">' +
          sortedItems[i].name + '</h1><h2 class="title">' +
          sortedItems[i].role + '</h2><span class="next-arrow"></span></div></a></li>');
      }

      list.on('click', '.ttItem a', function() {
        var $el = $(this);
        var itemId = $el.closest('.ttItem').attr('data-id');
        var item = null;

        Object.keys(hash).some(function(key) { // eslint-disable-line no-shadow
          if (hash[key].items[0].id === itemId) {
            item = hash[key].items[0];
            return true;
          }
        });

        $('.marker').removeClass('marker-selected');

        // showSidebar(true, item);
      });

      return tooltip.get(0);
    }

    // TODO: do I even need this?
    function isOnline(obj) {
      var workingHours = [];

      // consider time as an array if it's an object.

      for (var i = 0; i < obj.items.length; i++) { // eslint-disable-line no-shadow
        if (Object.prototype.toString.call(obj.items[i].workingHours) === '[object Array]') {

          for (var j = 0; j < obj.items[i].workingHours.length; j++) {
            workingHours.push(obj.items[i].workingHours[j]);
          }
        } else {
          workingHours.push(obj.items[i].workingHours);
        }
      }

      var estDate = new Date();
      var estHour = estDate.getUTCHours() - 5;

      if (estHour < 0)
        estHour = 24 - estHour;

      for (var i = 0; i < workingHours.length; i++) {
        if (workingHours[i].start <= estHour && workingHours[i].end > estHour) {
          return true;
        }
      }

      return false;
    }

    // function showSidebar(visible, person) {
    //   if (!person) return;
    //
    //   if (visible) {
    //     $('.sidebar').show(300);
    //   } else {
    //     $('.sidebar').hide(300);
    //   }
    //
    //   $('.sidebar .name').html(person.name || '');
    //   $('.sidebar .avatar').attr('src', person.gravatarURL || '');
    //   $('.sidebar .title').html(person.role || '');
    //   $('.sidebar .text-1').html(person.bio || '');
    //   $('.sidebar .location').html((person.city ? person.city + ', ' : '') + (person.country || ''));
    //
    //   $('.sidebar .close').click(function() {
    //     $('.sidebar').hide(300);
    //     $('.marker').removeClass('marker-selected');
    //   });
    // }

    var markersList = new Array();

    function setMarkers(mode) {

      for (var i = 0; i < markers.length; i++) { // eslint-disable-line no-shadow
        markers[i].setMap(null);
      }

      markers.length = 0;

      Object.keys(hash).forEach(function(key) { // eslint-disable-line no-shadow
        var latLng = hash[key]; // eslint-disable-line no-shadow
        var onlineFilter = true;

        if (mode === 'online') {
          onlineFilter = isOnline(latLng);
        }

        if (latLng && latLng.lat && latLng.lng && onlineFilter) {
          var myLatlng = new google.maps.LatLng(latLng.lat, latLng.lng);
          bound.extend(myLatlng);

          var marker = new CustomMarker(myLatlng, map, {
            gravatarURL: latLng.items[0].gravatarURL || '',
            name: latLng.items[0].shortName || '',
            role: latLng.items[0].role || '',
            id: latLng.items[0].id
          }, {});

          var infowindow = new google.maps.InfoWindow({ // eslint-disable-line no-shadow
            pixelOffset: new google.maps.Size(0, -10),
            padding: 0,
            maxWidth: 320
          });

          markers.push(marker);
          markersList.push(marker);

          // swap out infowindow content and open it
          google.maps.event.addListener(marker, 'mouseover', (function(marker, content, infowindow) { // eslint-disable-line no-shadow
            return function() {
              if (!$('.sidebar').is(':visible')) {
                infowindow.setContent(content);
                infowindow.open(map, marker);
              } else {
                $(this.div).siblings('.marker').removeClass('marker-selected');
                $(this.div).addClass('marker-selected');

                // showSidebar(true, latLng.items[0]);
              }
            };
          })(marker, getMarkerTooltip(latLng.items), infowindow));

          google.maps.event.addListener(marker, 'mouseout', (function(infowindow) { // eslint-disable-line no-shadow
            return function() {
              infowindow.close();
            };
          })(infowindow));

          google.maps.event.addListener(marker, 'click', function() {
            // restore original style for all the markers
            // $(this.div).siblings('.marker').removeClass('marker-selected');
            // $(this.div).addClass('marker-selected');

            infowindow.close();

            // showSidebar(true, latLng.items[0]);
          });

          // To add the marker to the map, call setMap();
          marker.setMap(map);
        }

        markersList.push(marker);
      });
    }

    setMarkers('all');

    // clustering testing
    var mcOptions = {
      gridSize: 50,
      maxZoom: 15
    };
    var mc = new CustomCluster(map, markersList, mcOptions);

    mc.setStyles([{
      textColor: '#fff',
      width: 40,
      height: 40,
      url: 'images/icons/pin-orange.svg'
    }]);

    map.setCenter(bound.getCenter());

    var infowindow = new google.maps.InfoWindow({ // eslint-disable-line no-redeclare
      padding: 0,
      maxWidth: 320
    });

    google.maps.event.addListener(mc, 'mouseover', function(c) {
      var offsetX = -25;
      if (c.markers_.length > 10) {
        offsetX += 15;
      }

      infowindow.setOptions({
        pixelOffset: new google.maps.Size(offsetX, -38)
      });
      infowindow.setPosition(c.clusterIcon_.center_);
      infowindow.setContent(getClusterTooltip(c.markers_));
      infowindow.open(map, c.clusterIcon_);

      var $infoParentEl = $('.gm-style-iw').parent();
      var infoHeight = $infoParentEl.height();
      $infoParentEl.height(infoHeight + 22);

      $infoParentEl.one('mouseenter', function() {
        $infoParentEl.one('click', function() {
          infowindow.close();
        });

        $infoParentEl.one('mouseleave', function() {
          infowindow.close();
        });
      });
    });
    google.maps.event.addListener(mc, 'mouseout', function() {
      var $infoParentEl = $('.gm-style-iw').parent();
      try {
        if (!$infoParentEl || !$infoParentEl.is(':hover')) {
          infowindow.close();
        }
      } catch (e) {
        infowindow.close();
      }
    });
    google.maps.event.addListener(mc, 'click', function() {
      infowindow.close();
    });

    var stylesArray = [{
      featureType: 'all',
      elementType: 'all',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'water',
      elementType: 'labels',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{
        visibility: 'simplified'
      }, {
        color: '#ffffff'
      }]
    }, {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{
        visibility: 'simplified'
      }, {
        color: '#D6D9E1'
      }]
    }];

    map.setOptions({
      styles: stylesArray
    });

  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
