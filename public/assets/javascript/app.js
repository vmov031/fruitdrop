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

$(document).ready(function() {

    function login() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log(result);
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            user = result.user;
            //sessionStorage.setItem("user", JSON.stringify(user));
        }).catch(function(error) {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
        // Redirect to profile page after login
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                window.location = "profile.html";
            }
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = firebase.auth().currentUser;
            $("#profile-pic").attr("src", currentUser.photoURL);
            $("#profile-name").text(currentUser.displayName);
            $("#email").html(currentUser.email);
            $("#button2").html("<a class='nav-link' id='profile-link' href='#'>Profile</a>");
            
            firebase.database().ref("bio").child(currentUser.uid).on("child_added", function(childSnapshot){
            $("#bio").text(childSnapshot.val().bio);
            $("#personal-link").html(childSnapshot.val().personal).attr("href", "http://" + childSnapshot.val().personal);
            })

            // Display user's listings in profile
            firebase.database().ref("listings").child(currentUser.uid).on("child_added", function(childSnapshot) {
                $("#listings").append("<tr><td>" + childSnapshot.val().item +
                    "</td><td>" + childSnapshot.val().quantity +
                    "</td><td>" + childSnapshot.val().street + " " + childSnapshot.val().zipCode +
                    "</td><td>" + childSnapshot.val().date + "</td></tr>");
            });
        }
    });

    function logout() {
        firebase.auth().signOut().then(function() {
            window.location = "index.html";
        }).catch(function(error) {
            console.log(error);
        });
    }

    $("#login").on("click", function() {
        login();
    });

    $("#logout").on("click", function() {
        logout();
    });

    // Navigate to profile page
    $(document).on("click", "#profile-link", function(event) {
        window.location = "profile.html";
    });

    // Display form to add listing
    $("#add").on("click", function() {
        $('#addListing').modal('show');
    });

    // Submit form to add listing
    $(document).on("click", "#submit-add", function(event) {
        event.preventDefault();

        // Get the input values
        var item = $("#item").val();
        var quantity = $("#quantity").val();
        var street = $("#street").val();
        var zipCode = $("#zip-code").val();
        var date = $("#date").val();
        // Input to firebase under user's unique ID
        firebase.database().ref("listings").child(currentUser.uid).push({
            item: item,
            quantity: quantity,
            street: street,
            zipCode: zipCode,
            date: date
        })
        $('#addListing').modal('hide');
    });
});

// Display form to edit profile
    $("#edit-profile").on("click", function(){
       $("#profile-new").modal("show");
    });
// Submit form to update profile
    $(document).on("click", "#submit-profile", function(event){
        event.preventDefault();

        var bio = $("#user-bio").val().trim();
        var personalSite = $("#personal").val().trim();

        firebase.database().ref("bio").child(currentUser.uid).push({
            bio: bio,
            personal: personalSite
        })
        $("#profile-new").modal("hide");
    });
