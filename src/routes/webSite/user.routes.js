const express = require('express');
const { viewProfile, getUsers } = require('../../controllers/controllers');
const verifyLogin = require('../../middleware/verifylogin');

const router = express.Router();

router.get('/profile', verifyLogin, viewProfile);
router.get('/', verifyLogin, getUsers);


module.exports = router;
