var app = angular.module('starter', ['ionic', 'ngCordova'])
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



var drawingColor = "#000000";
var lineThickness = 1;

  function changeColor() {
    var color = document.getElementById("color-palette").value;
    if (color === "black") {
      drawingColor = "#000000";
    } else if (color === "white") {
      drawingColor = "#ffffff";
    } else if (color === "blue") {
      drawingColor = "#0050ff";
    } else if (color === "red") {
      drawingColor = "#ff0000";
    } else if (color === "yellow") {
      drawingColor = "#fff600";
    } else if (color === "green") {
      drawingColor = "#32ff00";
    } else if (color === "orange") {
      drawingColor = "#ff8c00";
    } else if (color === "purple") {
      drawingColor = "#b200ff";
    } else if (color === "space cadet blue") {
      drawingColor = "#1D2951 ";
    } else if (color === "ugly green") {
      drawingColor = "#00CC00 "; // ugly green
    } else if (color === "hot pink") {
      drawingColor = "#ff00cb "; // hot-pink
    } else if (color === "autumn orange") {
      drawingColor = "#ff4300 "; //autumn-orange
    } else if (color === "robin egg blue") {
      drawingColor = "#7fe1ff "; //robin egg blue
    } else if (color === "royal purple") {
      drawingColor = "#6d3dff "; //royal purple
    } else if (color === "indigo") {
      drawingColor = "#000a6b "; //indigo
    } else if (color === "chocolate") {
      drawingColor = "#381c00 "; // chocolate
    } else if (color === "grey") {
      drawingColor = "#727272 "; // grey
    }
  }
  function changeLineWidth() {
    var lineWidth = document.getElementById("line-width").value;
    if (lineWidth === "1") {
      lineThickness = 1;
    } else if (lineWidth === "2") {
      lineThickness = 2;
    } else if (lineWidth === "3") {
      lineThickness = 3;
    } else if (lineWidth === "4") {
      lineThickness = 4;
    } else if (lineWidth === "5") {
      lineThickness = 5;
    } else if (lineWidth === "6") {
      lineThickness = 6;
    } else if (lineWidth === "7") {
      lineThickness = 7;
    } else if (lineWidth === "8") {
      lineThickness = 8;
    } else if (lineWidth === "9") {
      lineThickness = 9;
    } else if (lineWidth === "10") {
      lineThickness = 10;
    }
  }
function removePictureEventListener(){
  var pictureDiv = angular.element( document.querySelector( '.picture-overlay' ) );
  pictureDiv.remove();
}


// var addMarker = navigator.geolocation.getCurrentPosition(function(position) {
//       var marker = new google.maps.Marker({position:
//           {lat: position.coords.latitude,
//           lng: position.coords.longitude},
//           map: map});
//     });
app.controller('CameraCtrl', function($scope, $cordovaCamera, $cordovaGeolocation, $http) {
  //= require drawing.js
  $scope.disabled = true;
  $scope.show = false;
  $scope.myClass = ['list', 'card', 'picture'];
  var pictureData;
  var coordData;
  // $scope.pictureUrl = "http://placehold.it/300x500";
  $scope.takePicture = function() {
    // $scope.class = "top";
    $scope.disabled = true;
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(data) {
        // console.log("camera data " + angular.toJson(data));
        pictureData = 'data:image/jpeg;base64,' + data;
        // console.log(pictureData)
        $scope.show = true;

        $scope.pictureUrl = pictureData;
        getCoords().then(function(position) {
          coordData = {lat: position.coords.latitude, long: position.coords.longitude};
          // console.log(coordData)
          $scope.disabled = false;
          //enable the button
        }), function(error) {
          // error for coords
        }
      }, function(error) {
        console.log("camera error " + angular.toJson(data));
      });
  };
  var getCoords = function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    return $cordovaGeolocation.getCurrentPosition(posOptions)
  }
  function canvasSave(){
    return canvasData = canvas.toDataUrl();
  }
  $scope.savePicture = function(){
    canvasData = canvas.toDataURL();
    // canvasSave();
    // ADD A SAVING TAG
    // var url = 'http://172.16.0.12:3000/pictures'
    var url = 'https://radiant-savannah-52082.herokuapp.com/pictures'
    $http({
    method: 'POST',
    url: url,
    data: {params: {pictureData: pictureData, coordData: coordData, canvasData: canvasData}}
    }).then(function successCallback(response) {
      // console.log("in successCallback")
      // $scope.class = "bot";
      clearCanvas();
      $scope.show = false;
      $scope.disabled = true;
      // respond with a success toast
      // $scope.testAjax = response.data.url;
    }, function errorCallback(response) {
      console.log(response);
    });
  }
/////////////////////////////////////////////////////// DRAWING JS //////////////////////////////////////////////////////////////////
  var canvasData;
  var canvas = document.getElementById("canvas");

  // canvas.width = 10;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var ctx = canvas.getContext("2d");
    // Set up mouse events for drawing
  var drawing = false;
  var mousePos = { x:0, y:0 };
  var lastPos = mousePos;
  canvas.addEventListener("mousedown", function (e) {
          drawing = true;
    lastPos = getMousePos(canvas, e);
  }, false);
  canvas.addEventListener("mouseup", function (e) {
    drawing = false;
  }, false);
  canvas.addEventListener("mousemove", function (e) {
    mousePos = getMousePos(canvas, e);
  }, false);
  // Get the position of the mouse relative to the canvas
  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }
  window.requestAnimFrame = (function (callback) {
          return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimaitonFrame ||
             function (callback) {
          window.setTimeout(callback, 1000/60);
             };
  })();
  function renderCanvas() {
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = lineThickness;
    if (drawing) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    } else {
      ctx.closePath();
    }
  }
  // Allow for animation
  (function drawLoop () {
    requestAnimFrame(drawLoop);
    renderCanvas();
  })();
  canvas.addEventListener("touchstart", function (e) {
          mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);
  canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  }, false);
  canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);
  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }
  // Prevent scrolling when touching the canvas
  document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, false);


  function clearCanvas() {
    canvas.width = canvas.width;
  }

  var eraseButton = document.getElementById("erase");

  eraseButton.addEventListener("click", function() {
    clearCanvas();
  });

  $scope.colors = ["black", "white", "blue", "red", "yellow", "green", "orange", "purple"];




/////////////////////////////////////////////////////// DRAWING JS //////////////////////////////////////////////////////////////////
});

app.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $http) {
  var map;
  var markers = [];
  var markerPos = [];


  $ionicPlatform.ready(function() {
      // $ionicLoading.show({
      //   template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      // });
    var posOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var myLatlng = new google.maps.LatLng(lat, lng);
      var mapOptions = { center: myLatlng, zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ff6cd2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]
       };
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      // var markers2 = [];
      // var markera = new google.maps.Marker({
      //           map: map,
      //           position: myLatlng,
      //           icon: 'https://s3.amazonaws.com/virtualgraffiti1/icons/16px-Bluedot.svg.png'
      //       });
      // markers2.push(markera)
      // markers2.forEach(function(marker){
      //  google.maps.event.addListener(marker, 'click', function() {
      //          console.log("hi!");
      //       });
      // })
      // var marker1 = new google.maps.Marker({position: {lat: 41.876389, lng: -87.65328}, map: map}); // DBC
      // var marker2 = new google.maps.Marker({position: {lat: 41.87717, lng: -87.6555}, map: map}); // Target
      // var marker3 = new google.maps.Marker({position: {lat: 41.876714, lng: -87.657297}, map: map}); // Wise Owl
      // var marker4 = new google.maps.Marker({position: {lat:41.875387, lng: -87.647541}, map: map}); // UIC-Halsted Blue Line
      // var marker5 = new google.maps.Marker({position: {lat: 41.87972, lng: -87.650478}, map: map}); // Dog park
      $scope.map = map;
      mapTest = map
      // $ionicLoading.hide();},
      // function(err) {
      //   $ionicLoading.hide();
      //   console.log(err);
      updateMarkers();
        window.setInterval(updatePosition, 3000);
        window.setInterval(updateMarkers, 60000);
      });
      function updatePosition(){
        for (var i = 0; i < markerPos.length; i++) {
              markerPos[i].setMap(null);
            }
        markerPos = [];
        var marker = new google.maps.Marker({
                map: map,
                position: myLatlng,
                icon: 'https://s3.amazonaws.com/virtualgraffiti1/icons/16px-Bluedot.svg.png'
            });
        markerPos.push(marker)
      }

      function updateMarkers(){
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          myLatlng = new google.maps.LatLng(lat, lng);
          getMarkers();
        }), function(error) {
          // error for coords
        };
        // https://radiant-savannah-52082.herokuapp.com/pictures
        // http://172.16.0.12:3000/
        function getMarkers(){
          $http({
          method: 'GET',
          url : 'https://radiant-savannah-52082.herokuapp.com/pictures?lat=' + lat + '&long=' + lng,
          }).then(function successCallback(response) {
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
            }
            markers = [];
            response.data.forEach(function(markerData){
              var marker = new google.maps.Marker({
              position:{
                lat: parseFloat(markerData.latitude), // to float
                lng: parseFloat(markerData.longitude)}, // to float
                imageUrl: markerData.image_url,
                drawnImageUrl: markerData.drawn_image_url,
                optimized: false,
                map: map
              });
              markers.push(marker)

            })
            markersEventListener();
          }, function errorCallback(response) {
            console.log(response);
          });
        }
        function markersEventListener(){
            markers.forEach(function(marker){
              google.maps.event.addListener(marker, 'click', function() {
                
                displayPicture(marker);
              });
             }) 
        }

        function displayPicture(marker){
          console.log(marker.imageUrl)
          console.log(marker.drawnImageUrl)
          var camDiv = angular.element( document.querySelector( '#camera' ) );
          camDiv.append('<div class="picture-overlay"><img class="main-img" src="http:' + marker.imageUrl + '"><img src="http:' + marker.drawnImageUrl + '"><div class="padding top-right"><button onclick="removePictureEventListener()" class="super small-me clear-button"><i class="icon ion-android-close"></i></button></div></div>')
        }
      
    }
  });
}); // end of mapController
