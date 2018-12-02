let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
const dataRef = firebase.database();
const maxUsers = 4;
let userId;
let idx = 0;        // keeps track of users in the array
let inIdx = 0;
const playerIds = ['1', '2', '3', '4'];
const challengeIds = ['11', '12', '13', '14'];
let users = [];
let incomingChallenges = [];
let userName = null;
let nameIdMap = {};
let challengeIdMap = {};

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        // if the user is authenticated
        if (user) {
            userId = user.uid;
            dataRef.ref("users/" + user.uid + "/personalInfo").once('value').then((info) => {
                info = info.val();
                userName = info.fname + " " + info.lname;
                return;
            })
                .then(async () => {
                    let data = await getIncomingChallenges(user.uid);
                    data.forEach(function (datae) {
                        incomingChallenges.push(datae);
                    });
                })
                .then(() => main())
                .catch((error) => alert(error.message));
        }
        else {
            JSalert();
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
        // TODO: Fix this
        // check if the idx is near the end of array
        updateChallengeUI(users.slice(idx, idx+ maxUsers));
        updateAcceptChallengeUI(incomingChallenges.slice(inIdx, idx + maxUsers));
    }
    else {
        JSalert();
    }
}

// gets list of incoming challenges
async function getIncomingChallenges(uid) {
    return dataRef.ref("users/" + uid + "/incomingChallenges").once('value')
        .then(function (challenges) {
            return challenges;
        })
}

// updates the users whom you can challenge
function updateChallengeUI(slicedUsers) {
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

// TODO: Fix this
// updates the incoming challenges list
function updateAcceptChallengeUI(slicedChallenges) {
    for (var i = 0; i < slicedChallenges.length; i++) {
        let challenge = slicedChallenges[i];
        let key = challenge.key;
        challenge = challenge.val();
        let challenger = challenge.challenger;
        let quiz = challenge.quiz;

        document.getElementById(challengeIds[i]).innerHTML = "<p><b>" + quiz.name + "</b> By " + challenger;
        challengeIdMap[challengeIds[i]] =key;
    }
    inIdx += maxUsers;
}

// TODO: Fix this
function searchUser() {
}

// gets users from the database
async function getUsers() {
    return dataRef.ref("users").once('value')
        .then((info) => {
            return info;
        });
}

// sends challenge to the opponent
const challenge =  async (divId) => {
    // let opponentName = document.getElementById(divId).innerText;
    let opponentId = nameIdMap[divId];
    // get quizzes from database
    let quizzes = await getQuizzes();
    // get random quiz
    let ranQuiz = randomQuiz(quizzes);
    sendChallenge(ranQuiz, opponentId);
}

// inserts into opponents incoming challenges node
async function sendChallenge(ranQuiz, id) {
    return dataRef.ref("users/" + id + "/incomingChallenges/").child(ranQuiz[0]).set({
            challenger: userName,
            quiz: ranQuiz[1]
        });
}

// gets quizzes from the database
async function getQuizzes() {
    return dataRef.ref("categories").once('value')
        .then(function (snapshot) {
            return snapshot.val()
        });
}

// gets random quiz from quizzes node
var randomQuiz = function (obj) {
    var keys = Object.keys(obj);
    let i = keys.length * Math.random() << 0;
    obj = obj[keys[i]];
    keys = Object.keys(obj);
    i = keys.length * Math.random() << 0;
    return [keys[i], obj[keys[i]]];
};

// accepts challenege and delete the challenge from incoming challenges
function acceptChallenge(divId) {
    Cookies.set('id', challengeIdMap[divId]);
    dataRef.ref("users/" + userId + "/incomingChallenges").child(challengeIdMap[divId]).remove()
        .then(() => location.href = "../HTML/take_quiz.html")
        .catch((error) => alert(error.message));
}