window.onload = function () {
    /*
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            updateUI(user.uid);
        }
    });
    */
    // updateUI();
}


function updateUI() {
    let quizNameList = ['quiz_name_1', 'quiz_name_2'];
    let quizDescriptionList = ['quiz_description_1', 'quiz_description_2'];
    let quizzesRef = firebase.database().ref("/quizzes/Literature");
    let i = 0;
    quizzesRef.limitToLast(2).once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let quizName = childSnapshot.val().name;
                let quizDescription = childSnapshot.val().description;
                alert("quizName: " + quizName);
                document.getElementById(quizNameList[i]).innerHTML = quizName;
                document.getElementById(quizDescriptionList[i]).innerHTML = quizDescription;
                i += 1;
            });
        });
};

/*
function updateUI(userId) {
    alert("User id is: " + userId);
    let quizzesRef = firebase.database().ref("/quizzes/Literature");
    alert("key is: " + quizzesRef.key);
    quizzesRef.limitToLast(2).once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                alert("key " + childSnapshot.key);
                let quizName = childSnapshot.val().name;
                let quizDescription = childSnapshot.val().description;
                alert("quizName: " + quizName);
                document.getElementById('quiz-name-1').innerText = quizName;
                document.getElementById('quiz-description-1').innerText = quizDescription
            })
        });
};
*/

function createQuiz() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user)
            window.location.href = "../HTML/create_quiz.html";
    })
}

