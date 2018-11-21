window.onload = function () {
    // Getting information from localStorage...
    let qid = localStorage.getItem("quizID");
    let uid = localStorage.getItem("userID");
    localStorage.setItem("quizID", -1);    
    localStorage.setItem("userID", -1); 
    
    // Retrieve info from Firebase & setup content...
    setupUI(uid, qid);
}

const setupUI = async (uid, qid) => {
    let q = await getQuiz(uid, qid);
    console.log(q);
    let name = q["name"];
    let category = q["category"];
    let description = q["description"];
    let questions = [];
    // TODO... For each question in q[questions]... assign each question... & update UI...
    document.getElementById("quiz_name").value = name;
    document.getElementById("quiz_description").value = description;
    let select = document.getElementById("category");
    // https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
    for(var i, j = 0; i = select.options[j]; j++) {
        if(i.value == category) {
            select.selectedIndex = j;
            break;
        }
    }
    

}
  

async function getQuiz(uid, qid) {
    var db = firebase.database();
    return db.ref(`users/${uid}/quizzesCreated/${qid}`).once("value").then(function(snap){ // TODO -> Det if the root is this node or go directly to the category...
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
        alert("Found user");
        let userId = user.uid;
        submitQuizHelper(userId).then(
            function() {
                alert("Created the quiz!");
                window.location.href = "../HTML/myQuizzes.html";
            }
        );
    }
    else {
        alert("User is null");
        window.location.href = "signin.html";
    }
}

function submitQuizHelper(userId) {
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

    let quiz_name = document.getElementById("quiz_name").value;
    let category = document.getElementById("category").value;
    let quiz_description = document.getElementById("quiz_description").value;

    alert("User id is: " + userId + "\nQuiz name is: " + quiz_name + "\nQuiz description is: " + quiz_description
        + "\nCategory name is: " + category);

    alert("Going to add these information to firbase");
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
        name: quiz_name,
        category: category,
        description: quiz_description,
        owner: userId,
        questions: questions
    };

    let quizCreatedData = {
        name: quiz_name,
        category: category,
        description: quiz_description,
        owner: userId
    };


    // Pushing information to quizzes as well as keep the quiz information under user information as well
    let updateKey = firebase.database().ref().child("quizzes").push().key;
    alert("the key is: " + updateKey);

    // TODO: push doesn't work without a value
    let checkDone = false;
    let updates = {};
    updates["/quizzes/" + updateKey] = data;
    firebase.database().ref().update(updates).then(function () {
            firebase.database().ref("/users/" + userId + "/quizzesCreated/").child(updateKey).set(quizCreatedData)
                .then(function () {
                        firebase.database().ref().child("categories/" + category + "/" + updateKey).set(quizCreatedData)
                            .then(function() {
                                    alert("Updated stuffs in firebase!");
                        }
                    );
                }
            );
        }
    );
    alert("Entered end of submitQuizHelper");
}