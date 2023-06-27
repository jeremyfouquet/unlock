/****************************************************************************
  Nom ......... : users.js
  Rôle ........ : Ficher contenant les routes appelés par l'application
  Auteurs ..... : Thibaut Decressonniere
  Version ..... : V1.0 du 24/04/2023
  Licence ..... : réalisé dans le cadre du projet 'réalisation de programme'
*****************************************************************************/
/**
 * @module routes/users
 * @description Ficher contenant les routes appelés par l'application
 * @author Thibaut Decressonniere
 * @requires express
 * @requires /controllers/users
 */

const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users');

router.get('/', usersControllers.getPage);
router.get('/me', usersControllers.getMe);
router.get('/profil', usersControllers.getProfil);
router.post('/signup',  usersControllers.signup);
router.post('/login' , usersControllers.login);
router.delete('/delete', usersControllers.deleteAccount);
router.put('/updatePSWD', usersControllers.updatePSWD);
router.post('/logout', usersControllers.logout);
router.put('/incrementWin', usersControllers.incrementWin);
router.put('/incrementLoose', usersControllers.incrementLoose);

module.exports = router;