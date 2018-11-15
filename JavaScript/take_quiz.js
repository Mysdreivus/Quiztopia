let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
let user = null;
let answers = [];
// TODO: these 3 arrays needs to be updated in final push
let questionIds = ['question_1'];
let options = [['option1_1', 'option1_2', 'option1_3', 'option1_4']];
let optionsVal = [['val1_1', 'val1_2', 'val1_3']];
let numOptions = 4;
let quizId = null;
let quizName = null;
let quizAuthor = null;
let quizCategory = null;

let dataRef = firebase.database();

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (x) {
        user = x;
        updateUI();
        // TODO: need to start timer after this
        // noinspection JSAnnotator
        document.getElementById("timer").innerHTML = 10 + ":" + 00;
        startTimer();
    })
}

// starts timer for the quiz
function startTimer() {
    let presentTime = document.getElementById("timer").innerHTML.split(/[:]+/);
    let min = presentTime[0];
    let sec = checkSecond(presentTime[1] - 1);
    if (sec == 59) {
        min = min - 1;
    }
    if (min < 0) {
        // TODO: timeout. User should be no longer able to submit the quiz.
        alert("You are out of time. Submitting the progress you have made so far");
        submitQuiz();
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
    quizId = Cookies.get('id');
    quizName = Cookies.get('name');
    quizAuthor = Cookies.get('author');
    quizCategory = Cookies.get('category');

    document.getElementById('quiz-title').innerHTML = quizName;
    document.getElementById('quiz-author').innerHTML = "By " + quizAuthor;
    document.getElementById('quiz-category').innerHTML = "Category: " + quizCategory;

    // disabling Reveal Answer button in the beginning
    document.getElementById('reveal-ans-button').disabled = 1;

    let idx = 0;

    // displaying questions
    dataRef.ref("quizzes/" + quizId + "/questions").once('value')
        .catch(function (error) {
            alert(error);
        })
        .then(function (snapshot) {
            snapshot.forEach(function (childsnapshot) {
                let reqData = childsnapshot.val();
                document.getElementById(questionIds[idx]).innerHTML = reqData.question;
                // shuffled the array here
                options[idx] = shuffle(options[idx]);

                document.getElementById(options[idx][0]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][0] + ">" + reqData.correct_answer;
                document.getElementById(options[idx][1]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][1] + ">" + reqData.wrong_answers1;
                document.getElementById(options[idx][2]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][2] + ">" + reqData.wrong_answers2;
                document.getElementById(options[idx][3]).innerHTML = "<input type=\"radio\" name=\"answer\"" + idx+1 + " id=" + optionsVal[idx][3] + ">" + reqData.wrong_answers3;

                // set the value of the buttons
                document.getElementById(optionsVal[idx][0]).value = reqData.correct_answer;
                document.getElementById(optionsVal[idx][1]).value = reqData.wrong_answers1;
                document.getElementById(optionsVal[idx][2]).value = reqData.wrong_answers2;
                document.getElementById(optionsVal[idx][3]).value = reqData.wrong_answers3;

                // put the value of correct answer
                answers.push(reqData.correct_answer);
            });
        });
}

// checks the answer and submits the result to firebase
function submitQuiz() {
    let categoryPoints = null;
    let totalPoints = null;
    dataRef.ref("leaderboard/" + quizCategory + "/" + user.uid).once('value', function (data) {
        categoryPoints = data.val();
    })
        .catch(function (error) {
            alert(error.message);
        })
        .then(function () {
            dataRef.ref("leaderboard/Overall/" + user.uid).once('value', function (data) {
                totalPoints = data.val();
            })
                .catch(function (error) {
                    alert(error.message);
                })
                .then(function () {
                    let points = calculatePoints(categoryPoints, totalPoints);
                    categoryPoints = points[0];
                    totalPoints = points[1];

                    // update quizzes taken
                    dataRef.ref("users/" + user.uid + "/quizzesTaken").child(quizId).set(true)
                        .catch(function (error) {
                            alert(error.message);
                        })
                        .then(function () {
                            dataRef.ref("leaderboard/" + quizCategory).child(user.uid).set(categoryPoints)
                                .catch(function (error) {
                                    alert(error.message);
                                })
                                .then(function () {
                                    // update overall points
                                    dataRef.ref("leaderboard/Overall").child(user.uid).set(totalPoints)
                                        .catch(function (error) {
                                            alert(error.message);
                                        })
                                        .then(function () {
                                            document.getElementById('reveal-ans-button').enabled = 1;
                                            document.getElementById('submit-button').disabled = 1;
                                            alert("After:\nTotal points is: " + totalPoints + "\nTotal Category points is: " + categoryPoints);
                                            updateUI();
                                        });
                                    // TODO: After completing quiz, stop the timer
                                    // TODO: Something needs to be there to display user their score
                                    // TODO: Might want to have reveal answer after this
                                });
                        });
                });
        });
}

// calculates the points the user got
function calculatePoints(categoryPoints, totalPoints) {
    for (let i=0; i<questionIds.length; i++) {
        for (let j=0; j<numOptions; j++) {
            if (document.getElementById(optionsVal[i][j]).checked) {
                if (document.getElementById(optionsVal[i][j]).value === answers[i]) {
                    categoryPoints += 1;
                    totalPoints += 1;
                }
                // TODO: Not sure what to do if the answer is wrong
                break;
            }
        }
    }
    return [categoryPoints, totalPoints];
}
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

function revealAnswer() {
    alert("called revealAnswer()");
}