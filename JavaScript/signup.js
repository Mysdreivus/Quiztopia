function signUpCreate() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    var createdUser = true;
    var database = firebase.database();
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
    alert("Email and password: " +  email + password);
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            alert(error.message);
            createdUser = false;
        })
        .then(function () {
            if (createdUser) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        alert("Entered user");
                        alert("User id is: " + user.uid);
                        // getting additional user information
                        var first_name = document.getElementById("fname").value;
                        var last_name = document.getElementById("lname").value;
                        var user_id = user.uid;
                        // path to the root object
                        var databaseRe= firebase.database().ref().child('users/' + user_id);
                        databaseRe.set({
                                fname: first_name,
                                lname: last_name,
                                email: email,
                                points: 0,
                                quizIds: {
                                    quizId: '',
                                    category: ''
                                }
                        });
                        location.href = "../HTML/home.html";
                    }
                });
            }
        });
}

function isPwdValid(pwd) {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pwd);
}