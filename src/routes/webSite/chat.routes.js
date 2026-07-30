const express = require('express');
const verifyLogin = require('../../middleware/verifylogin');
const { accessChat, fetchChats, createGroupChat, renameGroup, addtoGroup, removeFromeGroup, updateGroupMembers, leaveGroup, deleteGroup } = require('../../controllers/controllers');
const { uploadWithImage } = require('../../middleware/multer');

const router = express.Router()


router.post('/', verifyLogin, accessChat);
router.get('/', verifyLogin, fetchChats);
router.post('/group', verifyLogin, uploadWithImage("group", "groupImage"), createGroupChat);
router.put("/rename", verifyLogin, uploadWithImage("group", "groupImage"), renameGroup);
router.put('/members', verifyLogin, updateGroupMembers); // Multiple Add&Remove users from Group
router.put("/leave", verifyLogin, leaveGroup);
router.delete("/deletegroup", verifyLogin, deleteGroup);


module.exports = router;