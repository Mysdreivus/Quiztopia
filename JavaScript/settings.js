const dataRef = firebase.database();
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            alert("user signed in");
            // User is signed in 
        }
        else {
            JSalert();
        }
    })
}

function changePassword() {
    let user = firebase.auth().currentUser;
    if (user) {
        let match = true;
        while (match) {
            let password1 = document.getElementById("change-password-1").value;
            let password2 = document.getElementById("change-password-2").value;

            if (password1 === password2) {
                if (isPwdValid(password2)) {
                    match = false;
                    user.updatePassword(password2)
                        .then(function () {
                            swal("Congratulations!", "Password updated!", "success");
                            return;
                    })
                        .catch((error) => swal("Oops!", error.message, "error"));
                }
                else {
                    swal("Oops!", "A password\n" +
                        "* must be at least six characters\n" +
                        "* contains at least one lowercase character\n" +
                        "* contains at least one upper case character\n", "error");
                }
            }
            else {
                swal("Oops!", "Passwords do not match!", "error");
            }
            alert("Match value is: " + match);
            if (!match) {
                break;
            }
        }
        document.getElementById("change-password-1").value = null;
        document.getElementById("change-password-2").value = null;
    }
    else {
        JSalert();
    }
}

// checks password validation
function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}