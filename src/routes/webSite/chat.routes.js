const express = require('express');
const verifyLogin = require('../../middleware/verifylogin');
const { accessChat, fetchChats, createGroupChat, renameGroup, addtoGroup, removeFromeGroup, updateGroupMembers } = require('../../controllers/controllers');
const { uploadWithImage } = require('../../middleware/multer');

const router = express.Router()


router.post('/', verifyLogin, accessChat);
router.get('/', verifyLogin, fetchChats);
router.post('/group', verifyLogin, uploadWithImage("group", "groupImage"), createGroupChat);
router.put("/rename", verifyLogin, uploadWithImage("group", "groupImage"), renameGroup);
router.put('/groupadd', verifyLogin, addtoGroup);
router.put('/groupremove', verifyLogin, removeFromeGroup);

router.put('/members', verifyLogin, updateGroupMembers);


module.exports = router;