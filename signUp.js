function signUpCreate() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    var user_name = document.getElementById("user_name");

    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("User Name: " + user_name);

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    alert("Checking for validity of the password!");
    if (!isPwdValid(password)) {
        alert("Error:\n" +
            "A password\n" +
            "* must be at least six characters\n" +
            "* contains at least one lowercase character\n" +
            "* contains at least one upper case character\n");
        return;
    }

    // Sign in with email and pass.
    // [START createwithemail]
    alert("Creating a new user");
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

// matches a string of six or more characters
// contains at least one digit
// at least one lowercase character
// at least one upper case character
function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}