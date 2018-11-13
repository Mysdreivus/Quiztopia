//code.iamkate.com
var Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        updateHomeUI(user);
    });
}

// TODO: EventListener needs to be added for each quiz 
function updateHomeUI(user) {
    if (user) {
        let databaseRef = firebase.database();
        let quizInfoMap = {};
        let quizIds = ['quiz-id-1', 'quiz-id-2', 'quiz-id-3', 'quiz-id-4', 'quiz-id-5'/*, 'quiz-id-6'*/];
        let quizNames = [['quiz-name-1', 'author-1', 'desc-1'], ['quiz-name-2', 'author-2', 'desc-2']
            , ['quiz-name-3', 'author-3', 'desc-3'], ['quiz-name-4', 'author-4', 'desc-4']
            , ['quiz-name-5', 'author-5', 'desc-5']];
        let index = 0;

        databaseRef.ref("users/" + user.uid + "/personalInfo").once("value")
            .then(function (snapshot) {
                // update UI of welcoming user
                let personalInfo = snapshot.val();
                let userName = personalInfo.fname + " " + personalInfo.lname;
                document.getElementById("usr-name").innerHTML = "Welcome " + userName;
            });

        databaseRef.ref("users/" + user.uid + "/toBeTaken").once("value")
            .then(function (snapshot) {
                // get information of the quiz and update the UI with it
                snapshot.forEach(function (childSnapShot) {
                    let quizInformation = childSnapShot.val();
                    document.getElementById(quizNames[index][0]).innerHTML = quizInformation.name;
                    document.getElementById(quizNames[index][2]).innerHTML = quizInformation.description;
                    document.getElementById(quizNames[index][1]).innerHTML = quizInformation.owner;
                    quizInfoMap[quizIds[index]] = {
                        name: quizInformation.name
                        , description: quizInformation.description
                        , owner: quizInformation.owner
                        , category: quizInformation.category
                    };
                    document.getElementById(quizIds[index]).addEventListener('click', function () {
                        Cookies.set('name', quizInformation.name);
                        Cookies.set('description', quizInformation.description);
                        Cookies.set('author', quizInformation.owner);
                        Cookies.set('category', quizInformation.category);
                        Cookies.set('id', childSnapShot.key);
                        location.href = "../HTML/startQuiz.html";
                    });
                    index += 1;
                });
            });
    }
}

function logout() {
    firebase.auth().signOut().then(function () {
        location.href = "../HTML/signin.html";
    }).catch(function (error) {
        alert(error);
    })

}