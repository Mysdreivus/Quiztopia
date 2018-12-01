// TODO: check if the user sends blank input
let dataRef = firebase.database();
// TODO: uncomment this for the final push
let questionIds = ["question_1" /*, "question_2", "question_3", "question_4", "question_5", "question_6"
                        ,"question_7", "question_8", "question_9", "question_10" */];

let correctAnswerIds = ["correct_answer_1" /*, "correct_answer_2", "correct_answer_3", "correct_answer_4"
                            ,"correct_answer_5", "correct_answer_6", "correct_answer_7", "correct_answer_8"
                            ,"correct_answer_9", "correct_answer_10" */];

let wrongAnswersIds = [["wrong_answer1_1", "wrong_answer1_2", "wrong_answer1_3"]
    /*
                        ,["wrong_answer2_1", "wrong_answer2_2", "wrong_answer2_3"]
                        ,["wrong_answer3_1", "wrong_answer3_2", "wrong_answer3_3"]
                        ,["wrong_answer4_1", "wrong_answer4_2", "wrong_answer4_3"]
                        ,["wrong_answer5_1", "wrong_answer5_2", "wrong_answer5_3"]
                        ,["wrong_answer6_1", "wrong_answer6_2", "wrong_answer6_3"]
                        ,["wrong_answer7_1", "wrong_answer7_2", "wrong_answer7_3"]
                        ,["wrong_answer8_1", "wrong_answer8_2", "wrong_answer8_3"]
                        ,["wrong_answer9_1", "wrong_answer9_2", "wrong_answer9_3"]
                        ,["wrong_answer10_1", "wrong_answer10_2", "wrong_answer10_3"]
                        */];

function submitQuiz() {
    // see if the user is authenticated
    let user = firebase.auth().currentUser;

    if (user) {
        let userId = user.uid;
        // get user personal information
        dataRef.ref("users/"+ userId + "/personalInfo").once('value')
            .then(function (info) {
                info = info.val();
                let author = info.fname + " " + info.lname;
                return author;
            })
            .then((author) => submitQuizHelper(userId, author))
            .catch((error) => swal("Oops!", error.message, "error"));
    }
    else {
        JSalert();
    }
}

function submitQuizHelper(userId, author) {
    // get user input
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

    // structure input data to upload to firebase
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
        author: author,
        owner: userId
    };


    // Pushing information to quizzes as well as keep the quiz information under user information as well
    let updateKey = firebase.database().ref().child("quizzes").push().key;

    let updates = {};
    updates["/quizzes/" + updateKey] = data;

    // uploading data in the firebase
    dataRef.ref().update(updates)
        .then(() => dataRef.ref("/users/" + userId + "/quizzesCreated/").child(updateKey).set(quizCreatedData))
        .then(() => dataRef.ref().child("categories/" + category + "/" + updateKey).set(quizCreatedData))
        .then(() => dataRef.ref().child("categories/Random/" + updateKey).set(quizCreatedData))
        .then(function() {
            location.href = "../HTML/myQuizzes.html";
        })
        .catch((error) => swal("Oops!", error.message, "error"));
}