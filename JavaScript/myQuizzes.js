let userID;
let spotIDs = ["quizBox1", "quizBox2", "quizBox3", "quizBox4", "quizBox5"];
let quizNameIds = ['quiz-name-1', 'quiz-name-2', 'quiz-name-3', 'quiz-name-4', 'quiz-name-5'];
let descIds = ['desc-1', 'desc-2', 'desc-3', 'desc-4', 'desc-5'];
let categoryIds = ["category-1", "category-2", "category-3", "category-4", "category-5"];

let currentPage = 1;
const quizzesPerPage = 5; // TODO -> The team decided we'll use 5...
let deleted = false;
let deletedID;
let q;

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // updateUI(user.uid);
            userID = user.uid;
            refreshUI();
        }
        else {
            JSalert();
        }
    });
}

// TODO: This method needs to be fixed
const refreshUI = async () => {
    // get user quizzes
    q = await getUserQuizzes();
    if(deleted) { // Delete from the front-end (Cloud Function could take some milis...)
        for(let x in q) {
            if(q[x]["quizID"] === deletedID) {
                q.splice(x, 1); // Remove that element...
            }
        }
        deleted = false;
    }
    while((currentPage !== 0) && (q.length <= (currentPage - 1) * quizzesPerPage)){ // If all the quizzes of a page have been deleted...
        currentPage--;
    }

    fillQuizzesInPage(q, currentPage); // Update UI...
}

// returns quizzes list created by the user
async function getUserQuizzes() {
    let userQuizzes = [];
    let db = firebase.database();
    return db.ref(`users/${userID}/quizzesCreated`).once("value").then(function(snap){
        if(snap.val() !== null) {
            var keys = Object.keys(snap.val());
            for(q in keys){
                var key = keys[q];
                console.log(key);
                let quiz = snap.val()[key];
                quiz = {"quizID" : key, "quizName" : quiz['name'], "category" : quiz['category'], "description" : quiz['description']};
                userQuizzes.push(quiz);
            }
            return userQuizzes;
        } else {
            return [];
        }
    });
}

//
// @param1 array list of quiz information
// @param2 int page number
function fillQuizzesInPage(q, page) {
    // empty the divs
    emptyDivs();
    let first = ((page - 1) * quizzesPerPage); // First quiz index...
    let last = first + quizzesPerPage;
    last = (last > q.length) ? q.length : last;
    let count = 0;
    for(first; first < last; first++) { // Generate each QuizEntry (HTML...)
        displayQuizEntry(spotIDs, first, quizzesPerPage, q, count);
        count++;
    }
}

// sets inner HTML to be empty string
function emptyDivs() {
    for (let i =0; i < spotIDs.length; i++) {
        document.getElementById(quizNameIds[i]).innerHTML = '';
        document.getElementById(descIds[i]).innerHTML = '';
        document.getElementById(categoryIds[i]).innerHTML = '';
    }
}

// @param1 array of spotIds
// @param2 int
// @param3 int
// @param4 array of quiz information
function displayQuizEntry(spots, index, qPerPage, entries, i) {
    // let s = document.getElementById(spots[index % qPerPage]);

    // TODO: henchhing's changes
    document.getElementById(quizNameIds[i]).innerHTML = entries[index]["quizName"];
    document.getElementById(descIds[i]).innerHTML = entries[index]["description"];
    document.getElementById(categoryIds[i]).innerHTML = entries[index]["category"];

    // attaching event listener
    attachListener(spotIDs[i], entries[index]["quizID"]);
}

// attaches listener to each quiz
function attachListener(id, quizID) {
    document.getElementById(id).addEventListener('click', function () {
        swal({
            text: "Select one of the folllowing task to do!",
            buttons: {
                Edit: true,
                Delete: "delete"
            }
        })
            .then( val => {
                if (val === "Edit") {
                    updateQuiz(userID, quizID);
                }
                if (val === "Delete") {
                    deleteQuiz(userID, quizID);
                }
            });
    });
}

// stores quiz as well as user id in local storage
// redirects user to update quiz page
function updateQuiz(user, qid) {
    localStorage.setItem("quizID", qid);    
    localStorage.setItem("userID", user);    
    location.href = "../HTML/update_quiz.html";
}

// sets the active field of the quiz in quizzes Created to false
// cloud function does rest of the job
// sets deleted to be false
// refreses the UI once again
function deleteQuiz(useralert, qid) {
    firebase.database().ref(`users/${user}/quizzesCreated/${qid}/active`).set(false)
        .then(() => {
            deletedID = qid;
            deleted = true;
            refreshUI();
        })
        .then((error) => swal("Oops!", error.message, "error"));;
}

// redirects user to create quiz page
function createQuiz() {
    window.location.href = "../HTML/create_quiz.html";
}

// logout function that pops up a confirmation box
function logout() {
    swal({
        title: "Sign Out",
        text: "You will be redirected to Sign in screen.",
        type: "warning",
        buttons: {
            cancel: true,
            confirm: "Sign out"
        }
    })
        .then( val => {
            if (val){
                firebase.auth().signOut().then(function () {
                    location.href = "../HTML/signin.html";
                })
                    .then((error) => swal("Oops!", error.message, "error"));
            }
        });
}

// alerts user about the  authentication error and redirects to sign in page
function JSalert() {
    swal({
        title: "Authentication Error",
        text: "Redirecting to Login Page!",
        type: "warning"
    })
        .then(() => location.href = "../HTML/signin.html")
        .then((error) => swal("Oops!", error.message, "error"));;
}

function next() {
    let lastPage = q.length / quizzesPerPage;
    // creating next button if it's the last page
    if(currentPage < lastPage) { // Not in last page...
        currentPage++;
        fillQuizzesInPage(q, currentPage);
    }
    else {
        swal("Oops!", "You can't go next than this!", "error");
    }
}

function Previous() {
    if(currentPage > 1) {
        currentPage--;
        fillQuizzesInPage(q, currentPage);
    }
    else {
        swal("Oops!", "You can't go previous than this!", "error");
    }
}
