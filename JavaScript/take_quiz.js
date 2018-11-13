let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
let user = null;
let answers = [];
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
    })
}

function updateUI() {
    quizId = Cookies.get('id');
    quizName = Cookies.get('name');
    quizAuthor = Cookies.get('author');
    quizCategory = Cookies.get('category');

    document.getElementById('quiz-title').innerHTML = quizName;
    document.getElementById('quiz-author').innerHTML = "By " + quizAuthor;
    document.getElementById('quiz-category').innerHTML = "Category: " + quizCategory;

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

// This method checks the answer and submits the result to firebase
// TODO: need to update a lot of stuffs in firebase
function submitQuiz() {
    alert("Entered submitQuiz()");
    let categoryPoints = null;
    let totalPoints = null;
    dataRef.ref("leaderboard/" + quizCategory).once('value', function (data) {
        categoryPoints = data.val().user.uid;
    });
    alert("Category points : " + categoryPoints);
    dataRef.ref("leaderboard/Overall").once('value', function (data) {
        totalPoints = data.val().user.uid;
    });
    for (let i=0; i<questionIds.length; i++) {
        for (let j=0; j<numOptions; j++) {
            if (document.getElementById(optionsVal[i][j]).checked) {
                if (document.getElementById(optionsVal[i][j]).value === answers[i]) {
                    points += 1;
                    alert("Got the right value");
                }
                else {
                    alert("Got the wrong value");
                }
                break;
            }
        }
    }
    dataRef.ref("users/" + user.uid + "/quizzesTaken/").child(quizId).set(true);
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