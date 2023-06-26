/**
  Nom ......... : error.js
  Rôle ........ : Ficher contenant les controllers appelés par les routes '/routes/error.js'
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
/**
 * @module controller/error
 * @description Ficher contenant les controllers appelés par les routes '/routes/error.js'
 * @author Thibaut Decressonniere
 * @requires path
 */
const path = require('path')

/**
 * Renvoie vers la page d'erreur 404
 * @name getHome
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
  * @function
 */
exports.getpage = (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../views/404.html'));
};