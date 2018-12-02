// TODO: attach a link to each player name so as to take the player to other player's profile

let overall = "Overall";
// TODO: we are not using it for now
let playerIds = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6', 'player-7', 'player-8', 'player-9', 'player-10'];
let playerPointIds = ['player-1-point', 'player-2-point', 'player-3-point', 'player-4-point', 'player-5-point', 'player-6-point'
                        , 'player-7-point', 'player-8-point', 'player-9-point', 'player-10-point'];
const rankIds = ['rank-1', 'rank-2', 'rank-3', 'rank-4', 'rank-5', 'rank-6', 'rank-7', 'rank-8', 'rank-9', 'rank-10'];

// TODO: New added
const maxUsers = 10;
let topPlayers = [];
let idx = 0;

let dataRef = firebase.database();
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        // if the user is authenticated
        if (user) {
            // initially user will see the overall leaderboard
            updateUI(overall);
        }
        else {
            JSalert();
        }
    })
        .catch((error) => swal("Oops!", error.message, "error"));
}

// updates the UI of the page
function updateUI(category) {
    idx = 0;
    document.getElementById('category').innerText = category;
    dataRef.ref('leaderboard/' + category).orderByValue().once('value')
        .then(data => {
            return data;
        })
        .then(data => {
            return updateHelper(data);
        })
        .catch((error) => swal("Oops!", error.message, "error"));
}

// updates the point as well as call updsateName
function updateHelper(input) {
    // TODO: changed
    // got list of top players
    topPlayers = reverseOrderedData(input);
    if ((idx + maxUsers) <= topPlayers.length) {
        showPlayers(topPlayers.slice(idx, idx + maxUsers));
        idx += maxUsers;
    }
    else {
        showPlayers(topPlayers);
        idx += topPlayers.length;
    }
    return;
}

function showPlayers(a) {
    for (var i = 0; i < a.length; i++) {
        document.getElementById(playerPointIds[i]).innerHTML = a[i][1];
        updateName(a[i][0], playerIds[i]);
        document.getElementById(rankIds[i]).innerHTML = idx + (i + 1);
    }
}
// reverses the ordered data from firebase to descending list
function reverseOrderedData(object) {
    let newObject = [];
    let keys = [];
    object.forEach(function (data) {
        keys.push(data.key);
    });
    object = object.val();
    for (let i = keys.length - 1; i >= 0; i--) {
        let value = object[keys[i]];
        newObject.push([keys[i], value]);
        // newObject[keys[i]]= value;
    }
    return newObject;
}

// updates name in the UI
function updateName(key, playerId) {
    dataRef.ref("users/" + key + "/personalInfo").once('value')
        .then(function (info) {
            // updating user name
            document.getElementById(playerId).innerHTML = info.val().fname + " " + info.val().lname;
            return;
        })
        .catch((error) => swal("Oops!", error.message, "error"));
}

function previous() {
    let x = idx - maxUsers;
    if (x <= 0) {
        swal("Oops!", "You can't go previous!", "error");
        return;
    }
    if ((idx - maxUsers) >= 0) {
        showPlayers(topPlayers.slice(idx - maxUsers, idx));
        idx -= maxUsers;
    }
    else {
        showPlayers(topPlayers.slice(0, idx));
        idx = 0;
    }
}

function next() {
    if (idx >= (topPlayers.length)) {
        swal("Oops!", "You can't go next!", "error");
        return;
    }
    if ((idx + maxUsers) <= topPlayers.length) {
        showPlayers(topPlayers.slice(idx, idx + maxUsers));
        idx += maxUsers;
    }
    else {
        showPlayers(topPlayers.slice(idx, topPlayers.length));
        idx = topPlayers.length - 1;
    }
}