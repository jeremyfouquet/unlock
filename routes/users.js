const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const usersControllers = require('../controllers/users');

router.get('/', usersControllers.getPage);
router.get('/profil' , auth, usersControllers.profil);
router.post('/signup',  usersControllers.signup);
router.post('/login' , usersControllers.login);
router.post('/logout', usersControllers.logout);

module.exports = router;