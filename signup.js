function signUpCreate() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    if (email.length < 11) {
        alert('Please enter an email address.');
        return;
    }
    if (!isPwdValid(password)) {
        alert("Error:\n" +
            "A password\n" +
            "* must be at least six characters\n" +
            "* contains at least one lowercase character\n" +
            "* contains at least one upper case character\n");
        return;
    }
    var user;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert("The password is too weak.");
            }
            else {
                alert(error.message);
            }
        })
        .then(function () {
            window.location.href="home.html";
        })
    ;
}

// matches a string of six or more characters
// contains at least one digit
// at least one lowercase character
// at least one upper case character
function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}