function forgetPassword() {
    var email = document.getElementById("email_field_reset").value;
    // alert("Email is: " + email);
    // alert("Email type is: " + typeof email);
    if (email.length < 11) {
        swal("Error!", 'Please enter an email address', "error");
    }
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () {
            location.href = "../HTML/signin.html";
        })
        .catch(function (error) {
            // An error happened
            swal("Error!", error.message, "error");
        });
}