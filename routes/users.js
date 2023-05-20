const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const usersControllers = require('../controllers/users');

router.get('/', usersControllers.getPage);
router.get('/me', usersControllers.getMe);
router.post('/signup',  usersControllers.signup);
router.post('/login' , usersControllers.login);
router.delete('/delete', usersControllers.deleteAccount);
router.put('/updatePSWD', usersControllers.updatePSWD);
router.post('/logout', usersControllers.logout);

module.exports = router;