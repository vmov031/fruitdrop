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

function login() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(result);
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
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
}
$("#test").on("click", function(){
    login();
});