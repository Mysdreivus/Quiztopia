// creates a new user
let email, password, createdUser, first_name, last_name, user_id;
// database reference
let databaseRef = firebase.database();

function signUpCreate() {
    createdUser = true;
    getInfo();

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
        .catch(function (error1) {
            alert(error1.message);
            createdUser = false;
        })
        .then(function () {
            if (createdUser) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        // sending verfication email
                        user.sendEmailVerification()
                            .then(function () {
                            // verfication email sent
                            })
                            .then(function () {
                                user_id = user.uid;
                                updateUserInfo(user_id);
                            })
                            .then(() => {
                                initializeLeaderboard(user_id);
                            })
                    }
                });
            }
        });
}

// updates users personal info
function updateUserInfo(user_id) {
    // putting user information in firebase
    databaseRef.ref('users/' + user_id).set({
        personalInfo: {
            email: email,
            fname: first_name,
            lname: last_name,
            points: 0
        }
    });
}

// initializes user points in the leaderboard
function initializeLeaderboard(user_id) {
    databaseRef.ref('leaderboard').once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                databaseRef.ref().child("leaderboard/" + childSnapshot.key + "/"
                    + user_id).set(0);
            });
            return;
        })
        .then(() => {
            // redirect to homepage
            location.href = "../HTML/signin.html";
        });
}
// gets user info
function getInfo() {
    email = document.getElementById("email_field").value;
    password = document.getElementById("pwd_field").value;
    first_name = document.getElementById("fname").value;
    last_name = document.getElementById("lname").value;
}


// checks password validation
function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}