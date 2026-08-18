const express = require('express');
const { viewProfile, getUsers, updateProfile } = require('../../controllers/controllers');
const verifyLogin = require('../../middleware/verifylogin');
const { uploadWithImage } = require('../../middleware/multer');

const router = express.Router();

router.get('/profile', verifyLogin, viewProfile);
router.put('/profile/update', verifyLogin, uploadWithImage("profile", "thumbnail"), updateProfile);
router.get('/', verifyLogin, getUsers);


module.exports = router;
