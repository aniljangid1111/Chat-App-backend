const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },

        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chats",
        },

        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
        },

        type: {
            type: String,
            enum: [
                "message",
                "image",
                "video",
                "file",
                "group_add",
                "group_remove",
                "group_rename",
            ],
            default: "message",
        },

        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

    }, {
    timestamps: true,
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);