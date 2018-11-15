// creates a new user
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
    let databaseRef = firebase.database();
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error1) {
            alert(error1.message);
            createdUser = false;
        })
        .then(function () {
            if (createdUser) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        let first_name = document.getElementById("fname").value;
                        let last_name = document.getElementById("lname").value;
                        let user_id = user.uid;

                        // putting user information in firebase
                        databaseRef.ref('users/' + user_id).set({
                            personalInfo: {
                                email: email,
                                fname: first_name,
                                lname: last_name,
                                points: 0
                            }
                        })
                            .catch(function (error2) {
                                alert(error2.message);
                            })
                            .then( function() {
                                databaseRef.ref('leaderboard').once('value')
                                    .catch(function (error3) {
                                        alert(error3.message);
                                    })
                                    .then(function (snapshot) {
                                        alert("1st key is: " + snapshot.key);
                                        snapshot.forEach(function (childSnapshot) {
                                            alert("key is: " + childSnapshot.key);
                                            databaseRef.ref().child("leaderboard/" + childSnapshot.key + "/"
                                                + user_id).set(0);
                                        });
                                    })
                                    .catch(function (error4) {
                                        alert(error4.message);
                                    })
                                    .then(function () {
                                        location.href = "../HTML/home.html";
                                    });
                            });
                    }
                });
            }
        });
}


// checks password validation
function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}