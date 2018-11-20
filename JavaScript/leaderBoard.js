// TODO: attach a link to each player name so as to take the player to other player's profile

let overall = "Overall";
// TODO: we are not using it for now
let numPlayers = 20;
let playerIds = ['player-1', 'player-2', 'player-3', 'player-4'];
let playerPointIds = ['player-1-point', 'player-2-point', 'player-3-point', 'player-4-point'];
let dataRef = firebase.database();
window.onload = function () {
    // initially user will see the overall leaderboard
    updateUI(overall);
}

// updates the UI of the page
function updateUI(category) {
    dataRef.ref('leaderboard/' + category).orderByValue().limitToLast(4).once('value')
        .then(data => {
            return data;
        })
        .then(data => {
            return updateHelper(data);
        });
}

// updates the point as well as call updsateName
function updateHelper(input) {
    let data = reverseOrderedData(input);
    for (let i = 0; i < data.length; i++) {
        // updating points
        document.getElementById(playerPointIds[i]).innerText = data[i][1];
        updateName(data[i][0], playerIds[i]);
    };
    return;
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
            document.getElementById(playerId).innerText = info.val().fname + " " + info.val().lname;
            return;
        });
}