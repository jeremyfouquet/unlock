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