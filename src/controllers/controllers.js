// user auth
const { registerUser, loginUser } = require("./website/auth.controller");
const { accessChat, fetchChats, createGroupChat, renameGroup, updateGroupMembers, leaveGroup, deleteGroup } = require("./website/chat.controller");
const { sendMessage, fetchAllMessages } = require("./website/message.controller");
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications, markChatNotificationsRead } = require("./website/notification.controller");

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
  updateGroupMembers,
  leaveGroup,
  deleteGroup,

  sendMessage,
  fetchAllMessages,

  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  markChatNotificationsRead,

}