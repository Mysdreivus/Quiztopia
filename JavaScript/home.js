let Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
let URL = "https://us-central1-quiztopia-35e04.cloudfunctions.net/getUntakenQuizzes";
let initialCategory = "Random";
let quizIds = ['quiz-id-1', 'quiz-id-2', 'quiz-id-3', 'quiz-id-4', 'quiz-id-5', 'quiz-id-6'];
let quizNames = [['quiz-name-1', 'author-1', 'desc-1'], ['quiz-name-2', 'author-2', 'desc-2']
    , ['quiz-name-3', 'author-3', 'desc-3'], ['quiz-name-4', 'author-4', 'desc-4']
    , ['quiz-name-5', 'author-5', 'desc-5'], ['quiz-name-6', 'author-6', 'desc-6']];

const NUM_LABELS_PER_QUIZ = 3;
let currentPage = 1;
const quizzesPerPage = quizIds.length;
let userId;

let data;
let databaseRef = firebase.database();

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        // if the user is authenticated
        if (user) {
            userId = user.uid;
            updateHomeUI(initialCategory, userId);
        }
        else {
            JSalert();
            // location.href = "../HTML/signin.html";
        }
    });
}

// updates UI
// @param1 string category name
// @param2 string user id
function updateHomeUI(category, userId) {
    welcomeUser(userId);

    // make JSON structure
    let dataToSend = {category: category, uid: userId};

    // retrieves quizzes from firebase and parses it
    data = getInfoFromHTTP(URL, dataToSend);

    // parse the data properly
    data = parseData(data);

    fillQuizzesInPage(data, currentPage);
}

// sets event listener for each quiz card
function setEventListener(quizInformation, index) {
    document.getElementById(quizIds[index]).addEventListener('click', function () {
        Cookies.set('name', quizInformation.name);
        Cookies.set('description', quizInformation.description);
        Cookies.set('author', quizInformation.author);
        Cookies.set('category', quizInformation.category);
        Cookies.set('id', quizInformation.quizID);
        location.href = "../HTML/startQuiz.html";
    });
}

// splits the string data into array of strings for parsing as JSON objects
function parseData(data) {
    let parsedData  = [];
    let i = 1;
    let j = i;
    while (j < data.length) {
        if ((data[j] === ",") && (data[j-1] === '}')) {
            parsedData.push(data.slice(i,j));
            j++;
            i=j;
        }
        else if ((data[j] === "0") && (data[j-1] === ",")) {
            parsedData.push(data.slice(i, j-1));
            break;
        }
        j++;
    }
    return parsedData;
}

// updates the quiz info UI
function updateQuizInfo(obj, idx) {
    document.getElementById(quizNames[idx][0]).innerHTML = obj.name;
    document.getElementById(quizNames[idx][2]).innerHTML = obj.description;
    document.getElementById(quizNames[idx][1]).innerHTML = obj.author;
}

// updates welcome user UI
function welcomeUser(userId) {
    databaseRef.ref("users/" + userId + "/personalInfo").once("value")
        .then(function (snapshot) {
            // update UI of welcoming user
            let personalInfo = snapshot.val();
            let userName = personalInfo.fname + " " + personalInfo.lname;
            document.getElementById("usr-name").innerHTML = "Welcome " + userName;
        });
}

// Getting untaken & not created quizzes from Firebase...
// Retrieve info from an URL & a dictionary of parameters...
function getInfoFromHTTP(url, params) {
    if(params != null) {
        let keys = Object.keys(params);
        // console.log(keys.length);
        if(keys.length > 0) {
            url = url.concat("?");
            
            let count = 0;
            for(key in keys) {
                url = url.concat(keys[key]).concat("=").concat(params[keys[key]]);
                if(count < keys.length - 1) {
                    url = url.concat("&");
                } count++;
            }
        }
    }
    // console.log(url);
    const request = new XMLHttpRequest();
    let response;
    request.open("GET", url, false);
    request.onload = function() {
        response = request.responseText;
    }
    request.send();
    // console.log(response);
    return response;
}

// shows next list of questions to the user
function next() {
    let lastPage = data.length / quizzesPerPage;
    // creating next button if it's the last page
    if(currentPage < lastPage) { // Not in last page...
        currentPage++;
        fillQuizzesInPage(q, currentPage);
    }
    else {
        swal("Oops!", "You can't go next than this!", "error");
    }
}

// show previous list of questions to the user
function prev() {
    if(currentPage > 1) {
        currentPage--;
        fillQuizzesInPage(q, currentPage);
    }
    else {
        swal("Oops!", "You can't go previous than this!", "error");
    }
}

// assigns empty html value to each div
function emptyDivs() {
    for (let i =0; i < quizNames.length; i++) {
        for(let j = 0; j < NUM_LABELS_PER_QUIZ; j++) {
            document.getElementById(quizNames[i][j]).innerHTML = '';
        }
    }
}

// @param1 array list of quiz information
// @param2 int page number
function fillQuizzesInPage(q, page) {
    // empty the divs
    // console.log(q);
    emptyDivs();
    let first = ((page - 1) * quizzesPerPage); // First quiz index...
    let last = first + quizzesPerPage;
    last = (last > q.length) ? q.length : last;
    let count = 0;
    for(first; first < last; first++) { // Generate each QuizEntry (HTML...)
        quizData = JSON.parse(q[first]);
        updateQuizInfo(quizData, first);
        setEventListener(quizData, first);
        count++;
    }
}

// Category OnClick Listeners...
// updates the UI with question from particular category
// @param1 string category name
function categoryOnClick(category) {
    updateHomeUI(category, userId);
}