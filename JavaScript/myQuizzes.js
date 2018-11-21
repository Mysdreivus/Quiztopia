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



var currentPage = 1;
const quizzesPerPage = 5; // TODO -> The team decided we'll use 5...
var deleted = false;
var deletedID;

let userID = "fl1sqcZj32cGmeOXXKYr4pJaUBg2"; // TODO -> Make it generic so it works for every user...

const refreshUI = async () => {
    let q = await getUserQuizzes("fl1sqcZj32cGmeOXXKYr4pJaUBg2");
    console.log("finished reading quizzes: ", q);
    if(deleted) { // Delete from the front-end (Cloud Function could take some milis...)
        console.log("Must remove quiz with ID = ", deletedID);
        for(x in q) {
            console.log(x);
            if(q[x]["quizID"] === deletedID) {
                var index = q.indexOf(x);
                console.log("index = ", index, " value: ", q[index]);
                q.splice(index, 1); // Remove that element...
            }
        }
        deleted = false;
    }

    while((currentPage !== 0) && (q.length <= (currentPage - 1) * quizzesPerPage)){ // If all the quizzes of a page have been deleted...
        currentPage--;
    }

    let p = fillQuizzesInPage(q, currentPage); // Update UI...
    console.log("finished filling screen: ", q);
}
  
  refreshUI();

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

async function getUserQuizzes(uid) {
    let userQuizzes = [];
    var db = firebase.database();
    return db.ref(`users/${uid}/quizzesCreated`).once("value").then(function(snap){
        if(snap.val() !== null) {
            var keys = Object.keys(snap.val());
            for(q in keys){
                var key = keys[q];
                console.log(key);
                quiz = snap.val()[key];
                quiz = {"quizID" : key, "quizName" : quiz['name'], "category" : quiz['category'], "description" : quiz['description']};
                userQuizzes.push(quiz);
            }
            console.log("USERQUIZZES: ", userQuizzes);
            console.log(userQuizzes.length);
            return userQuizzes;
        } else {
            return [];
        }
    });
}


function fillQuizzesInPage(q, page) {
    let first = ((page - 1) * quizzesPerPage); // First quiz index...
    let last = first + quizzesPerPage;
    last = (last > q.length) ? q.length : last;
    let spotIDs = ["quizBox1", "quizBox2", "quizBox3", "quizBox4", "quizBox5"];

    // Clear each container...
    for(spot in spotIDs) {
        let s = document.getElementById(spotIDs[spot]);
        s.innerHTML = "";
    }

    if(q.length === 0) { // If no quizzes...
        let s = document.getElementById("quizBox1");
        s.innerHTML = "<h3>No quizzes created so far.</h3>";
        return;
    }

    let buttons = document.getElementById("next_prev");
    buttons.innerHTML = "";

    if(page > 1) { // Not it the first page...
        let prevText = document.createTextNode("Prev");
        let prev = document.createElement("button");
        prev.appendChild(prevText);
        prev.onclick = function() {
            currentPage--;
            fillQuizzesInPage(q, currentPage);
        };
        buttons.appendChild(prev);
    }
    let lastPage = q.length / quizzesPerPage;
    if(page < lastPage) { // Not in last page...
        let nextText = document.createTextNode("Next");
        let next = document.createElement("button");
        next.appendChild(nextText);
        next.onclick = function() {
            currentPage++;
            fillQuizzesInPage(q, currentPage);
        };
        buttons.appendChild(next);
    }

    for(first; first < last; first++) { // Generate each QuizEntry (HTML...)
        displayQuizEntry(spotIDs, first, quizzesPerPage, q)
    }
}

function displayQuizEntry(spots, index, qPerPage, entries) {
    let s = document.getElementById(spots[index % qPerPage]);
    let name = document.createElement("h3");
    let nameText = document.createTextNode("Quiz Name: ".concat(entries[index]["quizName"])); 
    name.appendChild(nameText); 
    let category = document.createElement("h5");
    let categoryText = document.createTextNode("Category: ".concat(entries[index]["category"]));
    category.appendChild(categoryText);
    let description = document.createElement("h5");
    let descriptionText = document.createTextNode("Description: ".concat(entries[index]["description"]));
    description.appendChild(descriptionText);
    s.appendChild(name);
    s.appendChild(category);
    s.appendChild(description);
    // TODO -> Update!!!
    let div = document.createElement("div");
    let del = document.createElement("button");
    let buttonText = document.createTextNode("Delete");
    let edit = document.createElement("button");
    let editText = document.createTextNode("Edit");
    edit.appendChild(editText);
    edit.onclick = function() {
        updateQuiz(userID, entries[index]["quizID"]);
    };
    div.appendChild(edit);
    del.appendChild(buttonText);
    del.onclick = function() {
        console.log(entries[index]);
        deleteQuiz(userID, entries[index]["quizID"]);
    };
    div.appendChild(del);
    s.appendChild(div);
}

function updateQuiz(user, qid) {
    console.log("User: ", user, " QID: ", qid);
    localStorage.setItem("quizID", qid);    
    localStorage.setItem("userID", user);    
    location.href = "../HTML/update_quiz.html";
}

function deleteQuiz(user, qid) {
    console.log("User: ", user, " QID: ", qid);
    firebase.database().ref(`users/${user}/quizzesCreated/${qid}/active`).set(false);
    deletedID = qid;
    deleted = true;
    refreshUI();
}


function createQuiz() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user)
            window.location.href = "../HTML/create_quiz.html";
    })
}

