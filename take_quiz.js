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
    let quizzesRef = firebase.database().ref("")
};