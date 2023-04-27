const express = require('express');
const router = express.Router();

const errorControllers = require('../controllers/error');

router.get('/', errorControllers.getpage);

module.exports = router;