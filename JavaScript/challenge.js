const dataRef = firebase.database();
const maxUsers = 5;
let idx = 0;        // keeps track of users in the array
const playerIds = ['1', '2', '3', '4', '5'];
let users = [];
let userName = null;
let nameIdMap = {};

window.onload = function () {
    alert("called");
    firebase.auth().onAuthStateChanged(function (user) {
        // if the user is authenticated
        if (user) {
            dataRef.ref("users/" + user.uid + "/personalInfo").once('value').then((info) => {
                info = info.val();
                userName = info.fname + " " + info.lname;
                return;
            })
                .then(() => main())
                .catch((error) => alert(error.message));
        }
        else {
            JSalert();
            // location.href = "../HTML/signin.html";
        }
    });
}

const main =  async () => {
    let user = firebase.auth().currentUser;
    if (user) {
        let databaseUsers = await getUsers();
        databaseUsers.forEach(function (user) {
            users.push(user);
        });
        updateUI(users.slice(idx, idx+ maxUsers));
    }
    else {
        JSalert();
    }
}

function updateUI(slicedUsers) {
    for (var i = 0; i < slicedUsers.length; i++) {
        let userInfo = slicedUsers[i];
        let userId = userInfo.key;
        userInfo = userInfo.val();
        userInfo = userInfo.personalInfo;
        let userName = userInfo.fname + " " + userInfo.lname;
        document.getElementById(playerIds[i]).innerText = userName;
        nameIdMap[userName] = userId;
    }
    idx = idx+maxUsers;
}

function serachUser() {
}

async function getUsers() {
    return dataRef.ref("users").once('value')
        .then((info) => {
            return info;
        });
}

const challenge =  async (divId) => {
    let opponentName = document.getElementById(divId).innerText;
    let opponentId = null;
    for (key in nameIdMap) {
        if (key === opponentName) {
            opponentId = nameIdMap[key];
        }
    }
    // get quizzes from database
    let quizzes = await getQuizzes();
    // get random quiz
    let ranQuiz = randomQuiz(quizzes);
    sendChallenge(ranQuiz, opponentId);

}

async function sendChallenge(ranQuiz, id) {
    return dataRef.ref("users/" + id + "/incomingChallenges/").child(ranQuiz[0]).set({
            challenger: userName,
            quiz: ranQuiz[1]
        });
}


async function getQuizzes() {
    return dataRef.ref("categories").once('value')
        .then(function (snapshot) {
            return snapshot.val()
        });
}

var randomQuiz = function (obj) {
    var keys = Object.keys(obj);
    let i = keys.length * Math.random() << 0;
    obj = obj[keys[i]];
    keys = Object.keys(obj);
    i = keys.length * Math.random() << 0;
    return [keys[i], obj[keys[i]]];
};