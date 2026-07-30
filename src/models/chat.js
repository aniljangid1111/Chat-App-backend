const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupImage: {
        type: String,
    },
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages"
    },
    unreadCounts: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            },

            count: {
                type: Number,
                default: 0,
            },
        },
    ],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
    {
        timestamps: true
    }
);

const chatModal = mongoose.model("Chats", chatSchema)
module.exports = chatModal