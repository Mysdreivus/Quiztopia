let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
const dataRef = firebase.database();
const maxChallenges = 10;
let userId;
let idx = 0;        // keeps track of users in the array
const numIds = ['num-1', 'num-2', 'num-3', 'num-4', 'num-5', 'num-6', 'num-7', 'num-8', 'num-9', 'num-10'];
const playerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const buttonIds = ['button-1', 'button-2', "button-3", "button-4", "button-5", "button-6", "button-7", "button-8", "button-9", "button-10"];
let users = [];
let incomingChallenges = [];
let userName = null;
let nameIdMap = {};
let challengeIdMap = {};
let ownerIdMap = {};
let tabName;

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
                .then(()=> {
                    tabName = "challenge_player";
                    mainController(tabName);
                })
                .catch((error) => swal("Oops!", error.message, "error"));
        }
        else {
            JSalert();
        }
    });
}

function mainController(s) {
    emptyDivs();
    if (s === "challenge_player") {
        tabName = s;
        return main();
    }
    else if (s === "incoming_challenges") {
        tabName = s;
        return mainIncoming();
    }
    /*
    else if (s === "accepted_challenges") {
        tabName = s;
        getAcceptedChallenges(userId);
    }
    */
}
const main =  async () => {
    idx = 0;
    let user = firebase.auth().currentUser;
    if (user) {
        let databaseUsers = await getUsers();
        databaseUsers.forEach(function (user) {
            users.push(user);
        });
        // TODO: Fix this
        // check if the idx is near the end of array
        updateChallengeUI(users.slice(idx, idx+ maxChallenges));
        // updateAcceptChallengeUI(incomingChallenges.slice(inIdx, idx + maxUsers));
    }
    else {
        JSalert();
    }
}

const mainIncoming = async () => {
    idx = 0;
    let rawInChallenges = await getIncomingChallenges(userId);
    rawInChallenges.forEach(function (challenge) {
        incomingChallenges.push(challenge);
    });
    if (incomingChallenges.length >= maxChallenges) {
        updateIncomingChallengeUI(incomingChallenges, slice(idx, idx+maxChallenges));
        idx += maxChallenges;
    }
    else {
        updateIncomingChallengeUI(incomingChallenges.slice(idx, incomingChallenges.length));
        idx += incomingChallenges.length;
    }
}

// gets list of incoming challenges
async function getIncomingChallenges(uid) {
    return dataRef.ref("users/" + uid + "/incomingChallenges").once('value')
        .then(function (challenges) {
            return challenges;
        });
}

// TODO: Fix this
// updates the incoming challenges list
function updateIncomingChallengeUI(slicedChallenges) {
    for (var i = 0; i < slicedChallenges.length; i++) {
        let challenge = slicedChallenges[i];
        let key = challenge.key;

        challenge = challenge.val();
        let challengerId = challenge.challengerId;
        let challenger = challenge.challenger;
        let quiz = challenge.quiz;

        var buttonId = buttonIds[i];
        var playerId = playerIds[i];
        document.getElementById(playerId).innerHTML = "<p><b>" + quiz.name + "</b> By " + challenger;
        document.getElementById(numIds[i]).innerHTML = i + 1;
        document.getElementById(buttonId).innerHTML = "Accept Challenge";
        setEventListener2(key, challengerId, buttonId, playerId);
        // TODO: Fix this
        // challengeIdMap[challengeIds[i]] =key;
        // ownerIdMap[challengeIds[i]] = challengerId;
    }
}

function setEventListener2(key, challengerId, buttonId, playerId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        // Cookies.set('id', challengeIdMap[playerId]);
        Cookies.set('id', key);
        // Cookies.set('opponentId', ownerIdMap[playerId]);
        Cookies.set('opponentId', challengerId);
        Cookies.set('challenge_type', tabName);
        dataRef.ref("users/" + userId + "/incomingChallenges").child(key).remove()
            .then(() => {
                location.href = "../HTML/take_quiz.html"
            })
            .catch((error) => alert(error.message));
    });
}

async function getAcceptedChallenges(uid) {

}

// updates the users whom you can challenge
function updateChallengeUI(slicedUsers) {
    var j = 0;
    for (var i = 0; i < slicedUsers.length; i++) {
        let userInfo = slicedUsers[i];
        let id = userInfo.key;
        if (id !== userId) {
            userInfo = userInfo.val();
            userInfo = userInfo.personalInfo;
            let userName = userInfo.fname + " " + userInfo.lname;
            nameIdMap[userName] = id;

            document.getElementById(playerIds[j]).innerText = userName;
            document.getElementById(numIds[j]).innerText = j+1;
            document.getElementById(buttonIds[j]).innerText = "Challenge";
            setEventListener(playerIds[j], buttonIds[j]);
            j += 1;
        }
    }
    idx = idx+maxUsers;
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
    let opponentName = document.getElementById(divId).innerText;
    let opponentId = nameIdMap[opponentName];
    // get quizzes from database
    let quizzes = await getQuizzes();
    // get random quiz
    let ranQuiz = randomQuiz(quizzes);
    let sent = sendChallenge(ranQuiz, opponentId);
    if (sent) {
        swal("Success!", "Your challenge is sent.", "success");
    }
}

// inserts into opponents incoming challenges node
async function sendChallenge(ranQuiz, id) {
    return dataRef.ref("users/" + id + "/incomingChallenges/").child(ranQuiz[0]).set({
        challengerId: userId,
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


/*
// accepts challenege and delete the challenge from incoming challenges
// TODO: challenge_type needs to be set
// TODO: if tabName accepted set two values in cookies
function acceptChallenge(divId) {
    Cookies.set('id', challengeIdMap[divId]);
    Cookies.set('opponentId', ownerIdMap[divId]);
    Cookies.set('challenge_type', tabName);
    dataRef.ref("users/" + userId + "/incomingChallenges").child(challengeIdMap[divId]).remove()
        .then(() => location.href = "../HTML/take_quiz.html")
        .catch((error) => alert(error.message));
}
*/

// sets event listener for each quiz card
function setEventListener(playerId, buttonId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        challenge(playerId);
    });
}

// assigns empty html value to each div
function emptyDivs() {
    var length = Object.keys(nameIdMap).length;

    for (var i =0; i < length; i++) {
        document.getElementById(playerIds[i]).innerText = null;
        document.getElementById(numIds[i]).innerText =  null;
        document.getElementById(buttonIds[i]).innerText = null;
    }
}
