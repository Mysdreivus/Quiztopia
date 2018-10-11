function  signUp() {
    location.href="signup.html";
}

function signin() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 1) {
        alert('Please enter a password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
            alert('Wrong password');
        } else {
            alert(errorMessage);
        }
        return;
        });
    var user = firebase.auth().currentUser;
    if (user) {
        window.location.href = "home.html";
    }
}

