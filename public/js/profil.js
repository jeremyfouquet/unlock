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

/**
 * Récupère les informations du profil de l'utilisateur actuel.
 * 
 * @name getMe
 * @returns {void}
*/
window.addEventListener("load", async () => {
    await getMe();
});

async function getMe() {
    const response = await api('/api/users/me', 'GET');
    const inputMail = document.getElementById("mail-profil");
    const inputWin = document.getElementById("nb-win");
    const inputLoose = document.getElementById("nb-loose");
    if(inputMail && inputWin && inputLoose) {
        inputMail.value = response.email;
        inputWin.value = response.win;
        inputLoose.value = response.loose;
    }
}

/**
 * Déconnecte l'utilisateur actuel.
 * 
 * @name logout
 * @returns {void}
*/
async function logout() {
    const response = await api('/api/users/logout', 'POST');
    window.location.href = 'api/users/profil';
}

/**
 * Valide la correspondance des mots de passe.
 * 
 * @name validatePwd
 * @returns {void}
*/
function validatePwd() {
    var pass1 = document.getElementById("pass1");
    var pass2 = document.getElementById("pass2");
    if(pass1.value != pass2.value) {
        pass2.setCustomValidity('Les mots de passe ne sont pas identiques !');
    } else {
        pass2.setCustomValidity('');
    }
}

/**
 * Met à jour le mot de passe de l'utilisateur.
 * 
 * @name updatePwd
 * @param {Event} e - L'événement de soumission du formulaire.
 * @returns {void}
*/
async function updatePwd(e) {
    e.preventDefault(); 
    const pass = document.getElementById("pass1").value;
    const body = JSON.stringify({
        pass
    });
    const response = await api('/api/users/updatePSWD', 'PUT', body);
    var message;
    if(response.message){
        message = response.message;
        document.querySelector('form[name="pwd-form"]').reset();
    } else {
        message = "Erreur de mise à jour du mot de passe !";
    }
    document.getElementById("message-help").textContent = message;
}

/**
 * Supprime le profil de l'utilisateur.
 * 
 * @name deleteProfil
 * @param {Event} e - L'événement de soumission du formulaire.
 * @returns {void}
*/
async function deleteProfil(e) {
    e.preventDefault();
    const response = await api('/api/users/delete', 'DELETE');
    window.location.href = 'api/users/profil';
}