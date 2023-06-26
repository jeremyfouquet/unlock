/****************************************************************************
  Nom ......... : error.js
  Rôle ........ : Ficher contenant les routes appelés par l'application
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/

const express = require('express');
const router = express.Router();

const errorControllers = require('../controllers/error');

router.get('/', errorControllers.getpage);

module.exports = router;