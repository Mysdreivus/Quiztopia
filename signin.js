function  signUp() {
    location.href="signup.html";
}

function signin() {
    alert("Entered signin");
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
                        // var databaseRef = firebase.database().ref("users/" + user.uid);
                        window.location.href = "home.html";
                        alert("Welcome!");
                        /*
                        var f_name = databaseRef.ref("/fname");
                        var l_name = databaseRef.ref("/lname");
                        alert("First name: " + f_name);
                        alert("Welcome " + f_name + " " + l_name);
                        */
                    }
                });
            }
        });
}

