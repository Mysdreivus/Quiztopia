function updateUI() {
    alert("Entered updateUI");
    /*
    let databaseRef = firebase.database().ref("Sports");
    // alert("databaseRef type: " + databaseRef.child("Football").key);
    databaseRef.once('value', function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
            alert("Quiz name: " + databaseRef.key)
            childSnapshot = childSnapshot.val();
            alert("Description: " + childSnapshot.description);
            let questions = childSnapshot.questions;
            alert("Question 1 : " + questions.question_1.question);
        });
    });
    */
    let quizzesRef = firebase.database().ref("quizzes");
    quizzesRef.limitToLast(2).once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                alert("key" + childSnapshot.key);
                let quizName = childSnapshot.val().name;
                let quizDescription = childSnapshot.val().description;
                alert("quizName: " + quizName);
            })
        });
};

/*
function getData(startKey) {
    let itemCount = 2;
    let quizList = [];
    let allQuizRef = firebase.database().ref("/quizzes/History");
    alert(allQuizRef.key);

    if (startKey) allQuizRef.startAt(startKey);

    return new Promise(function (resolve, reject) {
        quizzesRef.limitToLast(itemCount).once('value').then(function (snapshot) {
            let quizzes = snapshot.val();
            if (quizzes) {
                quizList = Object.keys(quizzes).map(function (key) {
                    quizzes[key].key = key;
                    return quizzes[key];
                })
                    .filter(function (quizzes) {
                        return quizzes.visible;
                    });
                resolve(quizList);
            }
    });
}
*/