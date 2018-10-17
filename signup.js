function signUpCreate() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    var createdUser = true;
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

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            alert(error.message);
            createdUser = false;
        })
        .then(function () {
            if (createdUser) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        alert("User email is: " + user.email);
                        location.href = "home.html";
                    }
                });
            }
        });
}

function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}