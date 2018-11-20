function  signUp() {
    location.href="signup.html";
}

function signin() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    var signedIn = true;
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
            alert(error);
            signedIn = false;
        })
        .then(function () {
            if (signedIn) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        if (user.emailVerified) {
                            window.location.href = "../HTML/home.html";
                        }
                        else {
                            alert("Please verfiy your email!");
                        }
                    }
                });
            }
        });
}

