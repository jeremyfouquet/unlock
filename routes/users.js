const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users');

router.get('/', usersControllers.getPage);
router.post('/signup',  usersControllers.signup);
router.post('/login' , usersControllers.login);
router.post('/logout', usersControllers.logout);

module.exports = router;