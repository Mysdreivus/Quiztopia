function  signUp() {
    location.href="signup.html";
}

function login() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    window.alert("email " + email);
    window.alert("password " + password);

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 1) {
        alert('Please enter a password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/wrong-password') {
            alert('Wrong password');
        } else {
            alert(errorMessage)
        }
        console.log(error);
    });
}
