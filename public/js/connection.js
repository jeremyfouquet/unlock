
function submitForm(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const submit = document.querySelector('button[type="submit"]');
    const type = submit.getAttribute("id");
    if (type == "connection-submit") {
        // action="http://localhost:3000/api/users/login" method="POST"
    } else if (type == "inscription-submit") {
        // action="http://localhost:3000/api/users/signup" method="POST"
    }

}

function verification_password(type) {
    var pass1 = document.getElementById("pass1")
    var pass2 = document.getElementById("pass2");
    if (type == "connection") {
        pass2.removeAttribute("required");
        pass2.setCustomValidity('');
    } else if (type == "inscription") {
        pass2.setAttribute("required", "");
        if(pass1.value != pass2.value) {
            pass2.setCustomValidity('Les mots de passe ne sont pas identiques !');
        } else {
            pass2.setCustomValidity('');
        }
    }
}

function change_button(type) {
    var submit;
    var btn;
    if (type == "connection") {
        submit = document.getElementById("connection-submit");
        btn = document.getElementById("inscription-submit");
    } else if (type == "inscription") {
        submit = document.getElementById("inscription-submit");
        btn = document.getElementById("connection-submit");
    }
    submit.setAttribute('type', 'submit');
    btn.setAttribute('type', 'button');
}

function inscription() {
    const type = "inscription";
    verification_password(type);
    change_button(type);
}

function connection() {
    const type = "connection";
    verification_password(type);
    change_button(type);
}