/**
 * Vérifie la correspondance des mots de passe lors de la création ou de la connexion d'un compte utilisateur.
 * 
 * @name verification_password
 * @param {string} type - Le type d'opération ('signin' pour la connexion, 'signup' pour la création de compte).
 * @returns {void}
*/
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

/**
 * Change le type des boutons de soumission et d'annulation en fonction du type d'opération (connexion ou création de compte).
 * 
 * @name change_button
 * @param {string} type - Le type d'opération ('signin' pour la connexion, 'signup' pour la création de compte).
 * @returns {void}
*/
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

/**
 * Fonction appelée lors de la création d'un compte utilisateur.
 * 
 * @name inscription
 * @returns {void}
*/
function inscription() {
    const type = "signup";
    verification_password(type);
    change_button(type);
}

/**
 * Fonction appelée lors de la connexion d'un utilisateur existant.
 * 
 * @name login
 * @returns {void}
*/
function login() {
    const type = "signin";
    verification_password(type);
    change_button(type);
}

/**
 * Soumet le formulaire de connexion ou de création de compte.
 * 
 * @name submitLoginForm
 * @param {Event} e - L'événement de soumission du formulaire.
 * @returns {void}
*/
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

/**
 * Effectue un appel à l'API.
 * 
 * @name api
 * @param {string} api - L'URL de l'API à appeler.
 * @param {string} method - La méthode HTTP à utiliser.
 * @param {Object} body - Le corps de la requête (facultatif).
 * @returns {Object} - La réponse de l'API sous forme de JSON.
*/
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
