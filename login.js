function  signUp() {
    location.href="signup.html";
}

function login() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pwd_field").value;
    window.alert("email " + email);
    window.alert("password " + password);
}
