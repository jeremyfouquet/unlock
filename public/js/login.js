function signup() {
    const type = "signup";
    verification_password(type);
    change_button(type);
}

function signin() {
    const type = "signin";
    verification_password(type);
    change_button(type);
}

function verification_password(type) {
    var pass1 = document.getElementById("pass1")
    var pass2 = document.getElementById("pass2");
    if (type == "signin") {
        pass2.removeAttribute("required");
        pass2.setCustomValidity('');
    } else if (type == "signup") {
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
    if (type == "signin") {
        submit = document.getElementById("signin");
        btn = document.getElementById("signup");
    } else if (type == "signup") {
        submit = document.getElementById("signup");
        btn = document.getElementById("signin");
    }
    submit.setAttribute('type', 'submit');
    btn.setAttribute('type', 'button');
}

function submitForm(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const submit = document.querySelector('button[type="submit"]');
    const type = submit.getAttribute("id");
    if (type == "signin") {
        // action="http://localhost:3000/api/users/login" method="POST"
    } else if (type == "signup") {
        // action="http://localhost:3000/api/users/signup" method="POST"
    }
}