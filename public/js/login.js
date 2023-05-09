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

async function submitForm(e) {
    e.preventDefault(); // empêche le rechargement de la page
    const submit = document.querySelector('button[type="submit"]');
    const type = submit.getAttribute("id");
    const form = document.querySelector('form[name="login-form"]');
    const email = form.elements['email'].value;
    const pass = form.elements['pass'].value;
    const small = document.getElementById("message-help");
    var message = "";
    if (type == "signin") {
        const response = await api(email, pass, '/api/users/login');
        if(response.error){
            message = response.error? response.error : "erreur inconnue";
        } else {
            // comment faire après pour valider le token auprès du back ?
            // console.log('response', response);
            window.location.href = '/api/users/profil';
        }
    } else if (type == "signup") {
        const response = await api(email, pass, '/api/users/signup');
        if(response.error){
            message = response.error? response.error : "erreur inconnue";
        } else {
            message = response.message + " Vous pouvez vous connecter";
            form.reset();
        }
    }
    small.textContent = message;
}

async function api(email, pass, api) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
      method: 'POST',
    //   credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        email,
        pass
      }),
      headers
    };
    const response = await fetch(api, options);
    const respJson = response.json();
    return respJson;
}