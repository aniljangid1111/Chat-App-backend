const express = require('express');
const { registerUser, loginUser } = require('../../controllers/controllers');
const { uploadWithImage, uploadNone } = require('../../middleware/multer');

const router = express.Router();

router.post('/register', uploadWithImage("profile", "thumbnail"), registerUser);
router.post('/login', uploadNone, loginUser);

module.exports = router;
