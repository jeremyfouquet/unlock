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

function inscription() {
    const type = "signup";
    verification_password(type);
    change_button(type);
}

function login() {
    const type = "signin";
    verification_password(type);
    change_button(type);
}

async function submitLoginForm(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const submit = document.querySelector('button[type="submit"]');
    const type = submit.getAttribute("id");
    const form = document.querySelector('form[name="login-form"]');
    const email = form.elements['email'].value;
    const pass = form.elements['pass'].value;
    const body = JSON.stringify({
        email,
        pass
    });
    const small = document.getElementById("message-help");
    var message = "";
    if (type == "signin") {
        const response = await api('/api/users/login', 'POST', body);
        if(response.error){
            message = response.error? response.error : "erreur inconnue";
        } else {
            window.location.href = '/api/users/profil';
        }
    } else if (type == "signup") {
        const response = await api('/api/users/signup', 'POST', body);
        if(response.error){
            message = response.error? response.error : "erreur inconnue";
        } else {
            message = response.message + " Vous pouvez vous connecter";
            form.reset();
        }
    }
    small.textContent = message;
}

async function api(api, method, body) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var options = {};
    options.method = method;
    options.mode= 'cors';
    if( typeof(body) != 'undefined' ){
        options.body = body;
    }
    options.headers = headers;
    const response = await fetch(api, options);
    const respJson = await response.json();
    return respJson;
}

module.exports = {
    verification_password,
    change_button,
    inscription,
    login,
    submitLoginForm,
    api
  };