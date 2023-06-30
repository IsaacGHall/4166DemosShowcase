const { response } = require('express');
const express = require('express');
const controller = require('../controllers/mainController');
const router = express.Router();

router.get('/contact', controller.contact);
router.get('/aboutUs', controller.aboutUs);
router.get('/',controller.index);



module.exports = router;