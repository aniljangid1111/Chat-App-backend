const express = require('express');
const verifyLogin = require('../../middleware/verifylogin');
const { sendMessage, fetchAllMessages } = require('../../controllers/controllers');


const router = express.Router()


router.post('/', verifyLogin, sendMessage);
router.get('/fetchchat/:chatId', verifyLogin, fetchAllMessages)


module.exports = router;