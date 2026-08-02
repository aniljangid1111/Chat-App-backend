const Notification = require("../../models/notification");

// =====================================
// Get All Notifications
// GET /api/user/notification
// =====================================
const getNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({
            receiver: req.user._id,
            isRead: false,
        })
            .populate("sender", "name thumbnail")
            .populate("chat", "chatName isGroupChat groupImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            _status: true,
            _message: "Notifications fetched successfully",
            _data: notifications,
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }
};


// =====================================
// Mark Single Notification Read
// PUT /api/user/notification/:id/read
// =====================================
const markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                receiver: req.user._id,
            },
            {
                isRead: true,
                readAt: new Date(),
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                _status: false,
                _message: "Notification not found",
            });
        }

        return res.status(200).json({
            _status: true,
            _message: "Notification marked as read",
            _data: notification,
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }

};

// =====================================
// Mark Chat Notifications Read
// PUT /api/user/notification/chat/:chatId/read
// =====================================
const markChatNotificationsRead = async (req, res) => {
    try {

        await Notification.updateMany(
            {
                receiver: req.user._id,
                chat: req.params.chatId,
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
            }
        );

        return res.status(200).json({
            _status: true,
            _message: "Chat notifications marked as read",
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }
};


// =====================================
// Mark All Read
// PUT /api/user/notification/read-all
// =====================================
const markAllAsRead = async (req, res) => {

    try {

        await Notification.updateMany(
            {
                receiver: req.user._id,
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
            }
        );

        return res.status(200).json({
            _status: true,
            _message: "All notifications marked as read",
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }

};


// =====================================
// Delete One Notification
// DELETE /api/user/notification/:id
// =====================================
const deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            receiver: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                _status: false,
                _message: "Notification not found",
            });
        }

        return res.status(200).json({
            _status: true,
            _message: "Notification deleted successfully",
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }

};


// =====================================
// Clear All Notifications
// DELETE /api/user/notification/clear-all
// =====================================
const clearNotifications = async (req, res) => {

    try {

        await Notification.deleteMany({
            receiver: req.user._id,
        });

        return res.status(200).json({
            _status: true,
            _message: "All notifications cleared",
        });

    } catch (error) {

        return res.status(500).json({
            _status: false,
            _message: error.message,
        });

    }

};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    markChatNotificationsRead
};