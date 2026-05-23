// user auth
const { registerUser, loginUser } = require("./website/auth.controller");
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromeGroup, addtoGroup } = require("./website/chat.controller");

// User
const { viewProfile, getUsers } = require("./website/user.controller");

module.exports = {
    registerUser,
    loginUser,
    viewProfile,
    getUsers,
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromeGroup,
    addtoGroup

}