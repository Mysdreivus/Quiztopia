var Cookies={set:function(b,c,a){b=[encodeURIComponent(b)+"="+encodeURIComponent(c)];a&&("expiry"in a&&("number"==typeof a.expiry&&(a.expiry=new Date(1E3*a.expiry+ +new Date)),b.push("expires="+a.expiry.toGMTString())),"domain"in a&&b.push("domain="+a.domain),"path"in a&&b.push("path="+a.path),"secure"in a&&a.secure&&b.push("secure"));document.cookie=b.join("; ")},get:function(b,c){for(var a=[],e=document.cookie.split(/; */),d=0;d<e.length;d++){var f=e[d].split("=");f[0]==encodeURIComponent(b)&&a.push(decodeURIComponent(f[1].replace(/\+/g,"%20")))}return c?a:a[0]},clear:function(b,c){c||(c={});c.expiry=-86400;this.set(b,"",c)}};
window.onload = function () {
    // Getting information from cookie
    let name = Cookies.get('name');
    let author = Cookies.get('author');
    let category = Cookies.get('category');
    let description = Cookies.get('description');
    let id = Cookies.get('id');
    updateUI(name, author, category, description, id);
    document.getElementById('start-button').addEventListener('click', function () {
        Cookies.set('id', id);
        location.href = "../HTML/take_quiz.html";
    });

    document.getElementById('home-button').addEventListener('click', function () {
        location.href = "../HTML/home.html";
    });

};

function updateUI(name, author, category, description) {
    document.getElementById('quiz-name').innerHTML = name;
    document.getElementById('author-name').innerHTML = "By " + author;
    document.getElementById('category-name').innerHTML = "Genre: " + category;
    document.getElementById('description').innerHTML = description;
}
