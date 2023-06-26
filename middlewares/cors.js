/****************************************************************************
  Nom ......... : cors.js
  Rôle ........ : Ficher contenant un middleware permettant de traité les erreurs CORS
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
/**
 * @module middleware/cors
 * @description Ficher contenant un middleware permettant de traité les erreurs CORS
 * @author Thibaut Decressonniere
 */

/**
 * @param {Object} req : requete venant du frontend
 * @param {Object} res : requete venant du backend
 * @param {Object} next: passe au prochain middleware
 * @function
 */
module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
};