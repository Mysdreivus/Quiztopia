// TODO: attach a link to each player name so as to take the player to other player's profile

let overall = "Overall";
// TODO: we are not using it for now
let playerIds = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6', 'player-7', 'player-8', 'player-9', 'player-10'];
let playerPointIds = ['player-1-point', 'player-2-point', 'player-3-point', 'player-4-point', 'player-5-point', 'player-6-point'
                        , 'player-7-point', 'player-8-point', 'player-9-point', 'player-10-point'];
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
    });
}

// updates the UI of the page
function updateUI(category) {
    dataRef.ref('leaderboard/' + category).orderByValue().limitToLast(10).once('value')
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
        })
        .catch((error) => swal("Oops!", error.message, "error"));
}