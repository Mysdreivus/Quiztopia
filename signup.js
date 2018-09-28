function signUpCreate() {
    var email = document.getElementById("email_field");
    var password = document.getElementById("pwd_field");
    var user_name = document.getElementById("user_name");
    alert("Email is " + email.getAttribute());
    alert("User name is " + user_name.get());

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert("The password is too weak.");
        }
        else {
            alert(error.message);
        }
        console.log(error);
    });
    alert("Created a new user!");
}