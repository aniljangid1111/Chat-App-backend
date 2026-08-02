const express = require("express");
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    markChatNotificationsRead,
} = require("../../controllers/controllers.js");

const verifylogin = require("../../middleware/verifylogin.js");
const router = express.Router();

// Get all notifications
router.get("/", verifylogin, getNotifications);

// Mark single notification as read
router.put("/:id/read", verifylogin, markAsRead);

router.put(
    "/chat/:chatId/read",
    verifylogin,
    markChatNotificationsRead
);

// Mark all notifications as read
router.put("/read-all", verifylogin, markAllAsRead);


// Clear all notifications
router.delete("/clear-all", verifylogin, clearNotifications);

// Delete single notification
router.delete("/:id", verifylogin, deleteNotification);


module.exports = router;