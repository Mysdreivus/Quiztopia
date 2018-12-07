// creates a new user
let email, password, createdUser, first_name, last_name, user_id;
// database reference
let databaseRef = firebase.database();

function signInGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        user_id = user["uid"];
        email = user["email"];
        first_name = user["displayName"];
        last_name = "";
        var ref = firebase.database().ref(`users/${user_id}`);
        return ref.once("value")
        .then(function(snapshot) {
            if(snapshot.val() !== null) { // The account already exists...
                console.log(snapshot.val());
                return firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        if (user.emailVerified) {
                            window.location.href = "../HTML/home.html";
                        }
                        else {
                            swal("Error!", "Please verify your email!", "error");
                        }
                    }
                });
            }
            else { // Creating new account...
                let addNode = databaseRef.ref(`users/${user_id}`).set({ // Add to the users node...
                    personalInfo: {
                        email: email,
                        fname: first_name,
                        lname: last_name,
                        points: 0
                    }
                });
                // let addToLeaderboard = databaseRef.ref('leaderboard').once('value')
                // .then(function (snapshot) {
                //     let operations = [];
                //     snapshot.forEach(function (childSnapshot) {
                //         console.log(childSnapshot.length);
                //         let op = databaseRef.ref().child("leaderboard/" + childSnapshot.key + "/"
                //             + user_id).set(0);
                //         operations.push(op);
                //     });
                //     return Promise.all(operations);
                // });
                return Promise.all([addNode]).then(() => {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            if (user.emailVerified) {
                                 window.location.href = "../HTML/home.html";
                            }
                            else {
                                swal("Error!", "Please verify your email!", "error");
                            }
                        }
                    });
                });
            }
        }).catch(function(error) {
            swal("Error!", error.message, "error");
        });
      }).catch(function(error) {
          swal("Error!", error.message, "error");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
}

function  signUp() {
    location.href="signup.html";
}

function signin() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    var signedIn = true;
    if (email.length < 4) {
        swal('Error!', 'Please enter an email address.', 'error');
        return;
    }
    if (password.length < 1) {
        swal('Error!', 'Please enter a password.', 'error');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            swal("Error!", error.message, "error");
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
                            swal("Error!", "Please verify your email!", 'error');
                        }
                    }
                });
            }
        });
}

function goToForgetPassword() {
    location.href = "../HTML/forgetPassword.html";
}