let author = null;
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        // if the user is authenticated
        if (user) {
            userId = user.uid;
            // Getting information from localStorage...
            let qid = localStorage.getItem("quizID");
            let uid = localStorage.getItem("userID");
            localStorage.setItem("quizID", -1);
            localStorage.setItem("userID", -1);

            firebase.database().ref("users/"+ userId + "/personalInfo").once('value')
                .then(function (info) {
                    info = info.val();
                    author =  info.fname + " " + info.lname;
                    return;
                })
                .then(() => setupUI(userId, qid))  // Retrieve info from Firebase & setup content...
                .catch((error) => swal("Oops!", error.message, "error"));
        }
        else {
            JSalert();
            // location.href = "../HTML/signin.html";
        }
    });
}

const setupUI = async (uid, qid) => {
    let q = await getQuiz(uid, qid);

    // deleting the quiz
    deleteQuiz(uid, qid)
        .then(() => {
            let name = q["name"];
            let category = q["category"];
            let description = q["description"];
            let questions = q["questions"];
            document.getElementById("quiz_name").value = name;
            document.getElementById("quiz_description").value = description;
            let select = document.getElementById("category");
            // https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
            for(var i, j = 0; i = select.options[j]; j++) {
                if(i.value === category) {
                    select.selectedIndex = j;
                    break;
                }
            }

            let questionCount = 1;
            let wrongAnswerCount = 1;
            for(question in questions) {
                console.log(questions[question]);
                document.getElementById(question).value = questions[question]["question"];
                document.getElementById("correct_answer_".concat(questionCount)).value = questions[question]["correct_answer"];
                document.getElementById("wrong_answer".concat(questionCount)
                    .concat("_").concat(wrongAnswerCount++)).value = questions[question]["wrong_answers1"];
                document.getElementById("wrong_answer".concat(questionCount)
                    .concat("_").concat(wrongAnswerCount++)).value = questions[question]["wrong_answers2"];
                document.getElementById("wrong_answer".concat(questionCount)
                    .concat("_").concat(wrongAnswerCount++)).value = questions[question]["wrong_answers3"];
                questionCount++;
            }
        });
}
  

async function getQuiz(uid, qid) {
    var db = firebase.database();
    return db.ref(`quizzes/${qid}`).once("value").then(function(snap){
        if(snap.val() !== null) {
            return snap.val();
        } else {
            return null;
        }
    });
}

function submitQuiz() { // TODO -> Determine how it will be implemented...
    let user = firebase.auth().currentUser;
    if (user) {
        let userId = user.uid;
        submitQuizHelper(userId).then(
            // TODO: Fix this
            function() {
                swal("Success", "Updated the quiz!", "success");
                window.location.href = "../HTML/myQuizzes.html";
            }
        );
    }
    else {
        JSalert();
        window.location.href = "signin.html";
    }
}

function submitQuizHelper(userId) {
    let questionIds = ["question_1" , "question_2", "question_3", "question_4", "question_5"];

    let correctAnswerIds = ["correct_answer_1" , "correct_answer_2", "correct_answer_3", "correct_answer_4"
                            ,"correct_answer_5"];

    let wrongAnswersIds = [["wrong_answer1_1", "wrong_answer1_2", "wrong_answer1_3"]
                            ,["wrong_answer2_1", "wrong_answer2_2", "wrong_answer2_3"]
                            ,["wrong_answer3_1", "wrong_answer3_2", "wrong_answer3_3"]
                            ,["wrong_answer4_1", "wrong_answer4_2", "wrong_answer4_3"]
                            ,["wrong_answer5_1", "wrong_answer5_2", "wrong_answer5_3"]];

    let quiz_name = document.getElementById("quiz_name").value;
    let category = document.getElementById("category").value;
    let quiz_description = document.getElementById("quiz_description").value;

    let questions = {};

    for (let i = 0; i < questionIds.length; i++) {
        questions[questionIds[i]] = {
            question: document.getElementById(questionIds[i]).value,
            correct_answer: document.getElementById(correctAnswerIds[i]).value,
            wrong_answers1: document.getElementById(wrongAnswersIds[i][0]).value,
            wrong_answers2: document.getElementById(wrongAnswersIds[i][1]).value,
            wrong_answers3: document.getElementById(wrongAnswersIds[i][2]).value
        };
    }

    let data = {
        active: true,
        name: quiz_name,
        category: category,
        description: quiz_description,
        author: author,
        owner: userId,
        questions: questions
    };

    let quizCreatedData = {
        active: true,
        name: quiz_name,
        category: category,
        description: quiz_description,
        owner: userId
    };


    // Pushing information to quizzes as well as keep the quiz information under user information as well
    let updateKey = firebase.database().ref().child("quizzes").push().key;

    // TODO: push doesn't work without a value
    let updates = {};
    updates["/quizzes/" + updateKey] = data;
    firebase.database().ref().update(updates).then(() => {
            firebase.database().ref("/users/" + userId + "/quizzesCreated/").child(updateKey).set(quizCreatedData)
                .then(() => {
                        firebase.database().ref().child("categories/" + category + "/" + updateKey).set(quizCreatedData)
                            .then(() => {
                                swal("Success!", "You have successfully updated the quiz", "success");
                                location.href= "../HTML/myQuizzes.html";
                            })
                            .catch((error) => swal("Oops!", error.message, "error"))});
                });
}

// sets the active field of the quiz in quizzes Created to false
// cloud function does rest of the job
// sets deleted to be false
// refreses the UI once again
function deleteQuiz(user, qid) {
    return firebase.database().ref(`users/${user}/quizzesCreated/${qid}/active`).set(false)
        .catch((error) => swal("Oops!", error.message, "error"));
}