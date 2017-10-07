    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCFPYDY47Q6bxwSlbIS7PFpGKFmIId0ZhU",
        authDomain: "fruit-drop-1506557698689.firebaseapp.com",
        databaseURL: "https://fruit-drop-1506557698689.firebaseio.com",
        projectId: "fruit-drop-1506557698689",
        storageBucket: "fruit-drop-1506557698689.appspot.com",
        messagingSenderId: "425209410204"
    };
    firebase.initializeApp(config);

    var provider = new firebase.auth.GoogleAuthProvider();
    var user;
    var currentUser;
    // Map Page
    // Credit: https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
    var geocoder;

    function initMap() {
        geocoder = new google.maps.Geocoder();
        var map;


        var myLatlng1 = new google.maps.LatLng(34.0522, -118.2437);
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            zoom: 10,
            center: myLatlng1,
            mapTypeId: 'roadmap'
        };

        // Display a map on the page
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map.setTilt(45);

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            });
        }

        // Get the addresses from Firebase and push to an array
        var addresses = [];
        var infoMaker = [];
        var dataMaker = [];

        
        firebase.database().ref("listings").on("child_added", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

                dataMaker.push(childSnapshot.val());

                var add = childSnapshot.child("street").val() + " " + childSnapshot.child("zipCode").val();
                add.key = childSnapshot.key;
                addresses.push(add);

                var fruit = childSnapshot.child("item").val()
                // Info Window Content
                var infoWindowContent = ['<div class="info_content">' +
                    '<h3>' + fruit + '</h3>' +
                    '<p>Get your ' + fruit + ' here!</p>' + '</div>'
                ]
                infoMaker.push(infoWindowContent);

            });
            codeAddress();
        });
    //     console.log(dataMaker);


    //     var infoWindow = new google.maps.InfoWindow();
    //     function displayMarkers() {
    //         // this variable sets the map bounds and zoom level according to markers position
    //         var bounds = new google.maps.LatLngBounds();
    //         // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
    //         for (var i = 0; i < addresses.length; i++){

    //          geocoder.geocode( { 'address': addresses[i]}, function(results, status) {
    //             if (status != google.maps.GeocoderStatus.OK) {
    //                 alert("Geocode was not successful for the following reason: " + status);
    //                 return false;
    //             }
    //             for (var i in results) { // loop through results
    //                 marker = new google.maps.Marker({
    //                     position: results[i].geometry.location,
    //                     map: map,
    //                 });  
    //             }

    //         google.maps.event.addListener(marker, 'click', function() {
            
    //           // including content to the infowindow
    //           infoWindow.setContent(dataMaker[i].item);

    //           // opening the infowindow in the current map and at the current marker location
    //           infoWindow.open(map, marker);
    //         });

    //         // Finally the bounds variable is used to set the map bounds
    //         // with API’s fitBounds() function
    //         // map.fitBounds(bounds);
    //     });
    //      }
    // }        // Push addresses in Firebase to show up as markers on Google Maps
                                                

        function codeAddress() {



            for(i = 0; i < addresses.length; i++) {       
                geocoder.geocode( { 'address': addresses[i]}, function(results, status) {
                    if (status != google.maps.GeocoderStatus.OK) {
                        alert("Geocode was not successful for the following reason: " + status);
                        return false;
                    }
                    for (var i in results) { // loop through results
                        var marker = new google.maps.Marker({
                            position: results[i].geometry.location,
                            map: map,
                        });  
                    }
                                    attachMessage(marker, infoMaker[i][0]);

                });
            } 
        }
        function attachMessage(marker, infoMakers) {
            var infoWindow = new google.maps.InfoWindow({
                content: infoMakers
            });

            marker.addListener('click', function() {
              infoWindow.open(marker.get('map'), marker);
            });
        }
        //     for (i = 0; i < infoMaker.length; i++) {
        //         google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //             return function() {
        //                 infoWindow.setContent(infoMaker[i][0]);
        //                 infoWindow.open(map, marker);
        //                 }
        //             })(marker, i));  
        //     }
        //             console.log(marker);
        // }


        // // Multiple Markers
        // var markers = [
        //     ['Los Angeles, CA', 34.0522, -118.2437],
        //     ['Burbank, CA', 34.1808, -118.3090]
        // ];

        // // Info Window Content
        // var infoWindowContent = [
        //     ['<div class="info_content">' +
        //         '<h3>Los Angeles, CA</h3>' +
        //         '<p>Get your avocados here!</p>' + '</div>'
        //     ],
        //     ['<div class="info_content">' +
        //         '<h3>Burbank, CA</h3>' +
        //         '<p>I have oranges!</p>' +
        //         '</div>'
        //     ]
        // ];
        // console.log(infoWindowContent);

        // console.log(markers);

        // // Display multiple markers on a map
        // var infoWindow = new google.maps.InfoWindow(),
        //     marker, i;

        // // Loop through our array of markers & place each one on the map  
        // for (i = 0; i < markers.length; i++) {
        //     var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        //     bounds.extend(position);
        //     marker = new google.maps.Marker({
        //         position: position,
        //         map: map,
        //         title: markers[i][0]
        //     });

        //     // Allow each marker to have an info window    
        //     google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //         return function() {
        //             infoWindow.setContent(infoWindowContent[i][0]);
        //             infoWindow.open(map, marker);
        //         }
        //     })(marker, i));

        //     // Automatically center the map fitting all markers on the screen
        //     map.fitBounds(bounds);
        // }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        });
    }