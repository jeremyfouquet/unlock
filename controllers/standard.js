/****************************************************************************
  Nom ......... : standart.js
  Rôle ........ : Ficher contenant les controllers appelés par les routes '/routes/standart.js'
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
/**
 * @module controller/standart
 * @description Ficher contenant les controllers appelés par les routes '/routes/standart.js'
 * @author Thibaut Decressonniere
 * @requires path
 * @requires url
 * @requires ./data/games
 */


const path = require('path');
const games = require(path.join(process.cwd(), '/datas/games.json'));
const url = require('url');

/**
 * Renvoie vers la page d'accueil
 * @name getHome
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
 */
exports.getHome = (req, res) => {
        res.status(200).sendFile(path.join(process.cwd(), '/views/home.html'));
};

/**
 * Renvoie vers la page "Page en construction".
 * @name getPage
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @param { object } next: saut au prochain middleware.
 * @function
 */
exports.getBuildPage = (req, res, next) => {
    const query = url.parse(req.url,true).query;
    const game = games[query.game];
    if(game) {
      next();
    } else {
      res.sendFile(path.join(process.cwd(), '/views/buildingpage.html'));
    }
}

/**
 * Renvoie vers la page de terrain de jeu.
 * @name getPage
 * @param { object } req : la requête envoyé depuis le frontend
 * @param { object } res : la reponse envoyé depuis le backend
 * @function
 */
exports.getPlaygroundPage = (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/playground.html'));
};