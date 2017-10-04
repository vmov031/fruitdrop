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
if (sessionStorage.getItem("user")) {
  user = $.parseJSON(sessionStorage.getItem("user"));
  $("#profile-pic").attr("src", user.photoURL);
  $("#profile-name").text(user.displayName);
}

function login() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
    console.log(result);
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    user = result.user;
    sessionStorage.setItem("user", JSON.stringify(user));
    // ...
  }).catch(function(error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.location.href = "profile.html";
    }
  });

}


$("#test").on("click", function() {
  login();

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
  firebase.database().ref("listings").child(user.uid).push({
    item: item,
    quantity: quantity,
    street: street,
    zipCode: zipCode,
    date: date
  })
  $('#addListing').modal('hide');
});

// Display user's listings in profile
if (user) {
  firebase.database().ref("listings").child(user.uid).on("child_added", function(childSnapshot) {
    $("#listings").append("<tr><td>" + childSnapshot.val().item +
      "</td><td>" + childSnapshot.val().quantity +
      "</td><td>" + childSnapshot.val().street + " " + childSnapshot.val().zipCode +
      "</td><td>" + childSnapshot.val().date + "</td></tr>");
  });
}
