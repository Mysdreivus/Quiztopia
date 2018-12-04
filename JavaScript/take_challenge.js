let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
let user;
let answers = [];
const numQuestions = 5;      // TODO: use this when there are 6 questions
// TODO: these 3 arrays needs to be updated in final push
let questionIds = ['question_1'];
let options = [['option1_1', 'option1_2', 'option1_3', 'option1_4']];
let optionsVal = [['val1_1', 'val1_2', 'val1_3', 'val1_4']];

const numOptions = 4;
const possiblePts = 6;
let quizId = null;

// TODO: new
let challengeType = null;
let challengePoints = null;
let opponentScore = null;
let totalScore = null;
let opponentId = null;
let opChallegneScore = null;
let opOverallScore = null;
let pointsReceived = null;
// TODO: ######

let quizName = null;
let quizAuthor = null;
let quizCategory = null;
let dataRef = firebase.database();

window.onbeforeunload = function(e) {
    swal({
        title: "Quiz Already Taken",
        text: "You have already taken this quiz. Redirecting to home page.",
        type: "warning"
    })
        .then(() => location.href = "../HTML/home.html")
        .catch((error) => swal("Oops!", error.message, "error"));
};


// method is called when the page is loaded
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (x) {
        user = x;

        // TODO: change for take_challenge
        challengeType = Cookies.get('challenge_type');
        opponentId = Cookies.get('opponentId');
        if (challengeType === 'accepted_challenges') {
            opChallegneScore = Cookies.get('challenge_score');
            opOverallScore = Cookies.get('overall_score');
        }
        // TODO: ######

        quizId = Cookies.get('id');

        updateUI();

        // starts the timer
        // noinspection JSAnnotator
        document.getElementById("timer").innerHTML = 3 + ":" + 00;
        startTimer();
    })
}

// starts timer for the quiz
function startTimer() {
    let presentTime = document.getElementById("timer").innerHTML.split(/[:]+/);
    let min = presentTime[0];
    let sec = checkSecond(presentTime[1] - 1);
    if (sec === 59) {
        min = min - 1;
    }

    // if time is up
    if (min < 0) {
        // checking if the user has already submitted or not
        // if not
        if ((document.getElementById("submit-button").disabled)) {
            swal({
                title: "Time Up",
                text: "You are out of time. Submitting the progress you have made so far",
                type: "warning"
            })
                .then(() => submitQuiz())
                .catch((error) => swal("Oops!", error.message, "error"));
            return;
            // TODO: from here as well should be directed to poppin container
        }
    }
    else {
        if (document.getElementById("submit-button").disabled) {
            return;
        }
    }
    document.getElementById("timer").innerHTML = min + ":" + sec;
    setTimeout(startTimer, 1000);
}

//  second conversion function
function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"};
    return sec;
}

// updates the UI after receiving information from firebase
function updateUI() {

    // get quiz information from cookie and update it
    quizName = Cookies.get('name');
    quizAuthor = Cookies.get('author');
    quizCategory = Cookies.get('category');
    // TODO: New
    challengeType = Cookies.get('challenge_type');

    document.getElementById('quiz-title').innerHTML = quizName;
    document.getElementById('quiz-author').innerHTML = "By " + quizAuthor;
    document.getElementById('quiz-category').innerHTML = "Category: " + quizCategory;

    // disabling Reveal Answer button in the beginning
    // document.getElementById('reveal-ans-button').disabled = true;

    let idx = 0;

    // displaying questions
    dataRef.ref("quizzes/" + quizId + "/questions").once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childsnapshot) {
                let reqData = childsnapshot.val();
                document.getElementById(questionIds[idx]).innerText = reqData.question;

                // shuffled the array here
                options[idx] = shuffle(options[idx]);

                // setting inner HTML for the otpions
                document.getElementById(options[idx][0]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][0] + ">" + reqData.correct_answer;
                document.getElementById(options[idx][1]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][1] + ">" + reqData.wrong_answers1;
                document.getElementById(options[idx][2]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][2] + ">" + reqData.wrong_answers2;
                document.getElementById(options[idx][3]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][3] + ">" + reqData.wrong_answers3;

                // set the value of the buttons
                document.getElementById(optionsVal[idx][0]).value = reqData.correct_answer;
                document.getElementById(optionsVal[idx][1]).value = reqData.wrong_answers1;
                document.getElementById(optionsVal[idx][2]).value = reqData.wrong_answers2;
                document.getElementById(optionsVal[idx][3]).value = reqData.wrong_answers3;

                // store the value of correct answer
                answers.push(reqData.correct_answer);
            });
        })
        .then(() => {
            // TODO: database calls to retrieve information
            return dataRef.ref("leaderboard/Challenges/" + user.uid).once('value')
                .then((data) => {
                    challengePoints = data.val();
                    return;
                })
        })
        .then(() => {
            // TODO: database call to retrieve overall score
            return dataRef.ref("leaderboard/Overall/" + user.uid).once('value')
                .then((score) => {
                    totalScore = score.val();
                    return;
                });
        })
        .catch((error) => swal("Oops!", error.message, "error"));
}

// checks the answer and submits the result to firebase
function submitQuiz() {
    let categoryPoints = null;

    // TODO: new changes
    // TODO: assume score of the other user is there
    // TODO:
    pointsReceived = calculatePoints();

    if (challengeType === 'accepted_challenges') {
        displayFinalResult(pointsReceived, opponentScore);
    }
    else if (challengeType === "incoming_challenges") {
        displayResult(pointsReceived);
    }
    else {
        displayResult(pointsReceived);
    }

    /*
    // get user category points from firebase
    dataRef.ref("leaderboard/" + quizCategory + "/" + user.uid).once('value', function (data) {
        categoryPoints = data.val();
    })
    */
}

// TODO: New stuff
function displayFinalResult(yourPt, oppPt) {
    if (yourPt > oppPt) {   // Win
        // update database
        dataRef.ref("leaderboard/Challenge").child(opponentId).set(opChallegneScore - 15)
            .then(() => {
                return dataRef.ref("leaderboard/Overall").child(opponentId).set(opOverallScore - 15);
            })
            .then(() => {
                return dataRef.ref("leaderboard/Overall").child(user.uid).set(opOverallScore + 15);
            })
            .then(() => {
                return dataRef.ref("leaderboard/Challenge").child(user.uid).set(opChallegneScore + 15);
            })
            .then(() => {
                swal({
                    title: "Congratulations",
                    text: "You won!\nYou scored " + yourPt + " out of " + possiblePts + "\nYour opponent scored " + oppPt + " out of " + possiblePts,
                    type: "success"
                });
                return;
            })
            .then(() => {
                    location.href = "../HTML/challenge.html";
            })
            .catch((error) => swal("Oops!", error.message, "error"));
    }
    else if (yourPt < oppPt) {
        // update database
        dataRef.ref("leaderboard/Challenge").child(opponentId).set(opChallegneScore - 15)
            .then(() => {
                return dataRef.ref("leaderboard/Overall").child(opponentId).set(opOverallScore - 15);
            })
            .then(() => {
                return dataRef.ref("leaderboard/Overall").child(user.uid).set(opOverallScore + 15);
            })
            .then(() => {
                return dataRef.ref("leaderboard/Challenge").child(user.uid).set(opChallegneScore + 15);
            })
            .then(() => {
                swal({
                    title: "Better Luck Next Time!",
                    text: "You lost\nYou scored " + yourPt + " out of " + possiblePts + "\nYour opponent scored " + oppPt + " out of " + possiblePts,
                    type: "error"
                });
                return;
            })
            .then(() => {
                location.href = "../HTML/challenge.html";
            })
            .catch((error) => swal("Oops!", error.message, "error"));
    }
    else {
        swal({
            title: "Tie",
            text: "It's a draw.\nBoth of you scored " + yourPt + " out of " + possiblePts
        })
            .then(() => {
                location.href = "../HTML/challenge.html";
            })
            .catch((error) => swal("Oops!", error.message, "error"));
    }

}

// TODO: New added stuffs to it
// displays the users result
// @param1 int points achieved by the user
function displayResult(points) {
    dataRef.ref("users/" + opponentId + "acceptedChallenges").child(user.uid).set(pointsReceived)
        .then(() => {
            swal({
                title: "Quiz Result",
                text: "You scored " + points + " out of " + possiblePts,
                type: "success"
            });
            return;
        })
        .then( () => {
            location.href = "../HTML/challenge.html";
        })
        .catch((error) =>  swal("Oops!", error.message, "error"));
}

// calculates the points the user got
function calculatePoints() {
    let ptsReceived = 0;
    for (let i=0; i<questionIds.length; i++) {
        for (let j=0; j<numOptions; j++) {
            if (document.getElementById(optionsVal[i][j]).checked) {
                if (document.getElementById(optionsVal[i][j]).value === answers[i]) {
                    ptsReceived++;
                }
                break;
            }
        }
    }
    return ptsReceived;
}

// shuffles the array
// @param1 array
// @return array of shuffled elements
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

// reveals answer to the user
function revealAnswer() {
    let options, val;
    for (let i = 0; i < optionsVal.length; i++) {
        options = optionsVal[i];
        for (let j = 0; j < numOptions; j++) {
            val = document.getElementById(options[j]).value;
            if (val === answers[i]) {
                document.getElementById(optionsVal[i][j]).checked = true;
            }
            else {
                document.getElementById(optionsVal[i][j]).checked = false;
            }
        }
    }
}



// TODO: when the user clicks on refresh page, he should be given a alert message saying quiz is already taken, and redirected to home page
