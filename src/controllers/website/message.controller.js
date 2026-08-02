const Chat = require('../../models/chat.js');
const Message = require('../../models/message.js');
const User = require('../../models/user.js');
const Notification = require("../../models/notification.js");



const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!chatId || !content?.trim()) {
        return res.status(400).json({
            _status: false,
            _message: "Invalid data passed into request"
        })
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        let message = await Message.create(newMessage);

        message = await message.populate('sender', 'name thumbnail')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.user',
            select: 'name thumbnail email'
        })

        // await Chat.findByIdAndUpdate(req.body.chatId, {
        //     latestMessage: message
        // })

        await Chat.findByIdAndUpdate(
            chatId,
            {
                latestMessage: message._id,
            }
        );

        await Chat.updateOne(
            { _id: chatId },
            {
                $inc: {
                    "unreadCounts.$[elem].count": 1,
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.user": {
                            $ne: req.user._id,
                        },
                    },
                ],
            }
        );

        // Create notification for every receiver except sender
        const notificationDocs = message.chat.user
            .filter(
                receiver =>
                    receiver._id.toString() !== req.user._id.toString()
            )
            .map(receiver => ({
                sender: req.user._id,
                receiver: receiver._id,
                chat: chatId,
                message: message._id,

                title: message.chat.isGroupChat
                    ? message.chat.chatName
                    : message.sender.name,

                body: message.content,

                type: "message",
            }));

        const notifications = await Notification.insertMany(notificationDocs);



        const io = req.app.get("io");


        message.chat.user.forEach((receiver) => {

            const room = receiver._id.toString();

            // realtime message
            io.to(room).emit("message received", message);

            // realtime notification
            if (receiver._id.toString() !== req.user._id.toString()) {

                const notification = notifications.find(
                    n => n.receiver.toString() === room
                );

                io.to(room).emit("notification received", {
                    _id: notification._id,
                    sender: message.sender,

                    receiver: room,

                    chat: {
                        _id: message.chat._id,
                        chatName: message.chat.chatName,
                        isGroupChat: message.chat.isGroupChat,
                        groupImage: message.chat.groupImage,
                    },

                    message: {
                        _id: message._id,
                        content: message.content,
                    },

                    title: notification.title,
                    body: notification.body,
                    type: notification.type,
                    isRead: notification.isRead,
                    createdAt: notification.createdAt,
                });
            }

        });

        return res.status(201).json({
            _status: true,
            _message: "Message sent successfully",
            _data: message,
        });

    } catch (error) {
        return res.status(500).json({
            _status: false,
            _message: error.message,
        });
    }
}


const fetchAllMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        // Check user is part of this chat
        const chat = await Chat.findOne({
            _id: chatId,
            user: req.user._id,
        });

        // if (!chat) {
        //     return res.status(403).json({
        //         _status: false,
        //         _message: "Access denied",
        //     });
        // }

        await Chat.updateOne(
            { _id: chatId },
            {
                $set: {
                    "unreadCounts.$[elem].count": 0,
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.user": req.user._id,
                    },
                ],
            }
        );

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name thumbnail email")
            .populate("chat")
            .sort({ createdAt: 1 });


        return res.status(200).json({
            _status: true,
            _message: "Messages fetched successfully",
            _data: messages,
        });

    } catch (error) {
        return res.status(500).json({
            _status: false,
            _message: error.message,
        });
    }
};

module.exports = { sendMessage, fetchAllMessages } 