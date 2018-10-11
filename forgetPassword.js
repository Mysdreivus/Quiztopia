function forgetPassword() {
    var email = document.getElementById("email_field_reset").value;
    // alert("Email is: " + email);
    // alert("Email type is: " + typeof email);
    if (email.length < 11) {
        console.log('Please enter an email address');
    }
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Email sent
        console.log("Password reset email is sent.")
    }).catch(function (error) {
        // An error happened
        alert(error.message);
    });
}