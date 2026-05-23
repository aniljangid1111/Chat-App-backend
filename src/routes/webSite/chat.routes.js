const express = require('express');
const verifyLogin = require('../../middleware/verifylogin');
const { accessChat, fetchChats, createGroupChat, renameGroup, addtoGroup, removeFromeGroup } = require('../../controllers/controllers');

const router = express.Router()


router.post('/', verifyLogin, accessChat); 
router.get('/', verifyLogin, fetchChats);
router.post('/group', verifyLogin, createGroupChat);
router.put('/rename', verifyLogin, renameGroup);
router.put('/groupadd', verifyLogin, addtoGroup);
router.put('/groupremove', verifyLogin, removeFromeGroup);
 

module.exports = router;