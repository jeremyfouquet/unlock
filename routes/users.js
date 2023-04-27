const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users');

// const mid = (req, res, next) => {
//     console.log(req.body);
//     next();
// }

router.post('/signup',  usersControllers.signup);
router.post('/login' , usersControllers.login);

module.exports = router;