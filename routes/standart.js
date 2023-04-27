const express = require('express');
const router = express.Router();

const stdControllers = require('../controllers/standart');

router.get('/', stdControllers.getHome);
router.all('/connection/?', stdControllers.getBuildPage);
router.get('/connection/?', stdControllers.getPlaygroundPage);

module.exports = router;