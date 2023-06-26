/****************************************************************************
  Nom ......... : standart.js
  Rôle ........ : Ficher contenant les routes appelés par l'application
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

/**
 * @module routes/standard
 * @description Ficher contenant les routes appelés par l'application
 * @author Thibaut Decressonniere
 * @requires express
 * @requires /controllers/standard
 */

const express = require('express');
const router = express.Router();

const stdControllers = require('../controllers/standard');

router.get('/', stdControllers.getHome);
router.all('/connection/?', stdControllers.getBuildPage);
router.get('/connection/?', stdControllers.getPlaygroundPage);


module.exports = router;