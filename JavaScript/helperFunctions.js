// logout function that pops up a confirmation box
function logout() {
    swal({
        title: "Sign Out",
        text: "You will be redirected to Sign in screen.",
        type: "warning",
        buttons: {
            cancel: true,
            confirm: "Sign out"
        }
    })
        .then( val => {
            if (val){
                firebase.auth().signOut().then(function () {
                    location.href = "../HTML/signin.html";
                }).catch(function (error) {
                    alert(error);
                });
            }
        });
}

// alerts user about the  authentication error and redirects to sign in page
function JSalert() {
    swal({
        title: "Authentication Error",
        text: "Redirecting to Login Page!",
        type: "warning"
    })
        .then(() => location.href = "../HTML/signin.html");
}