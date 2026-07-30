const Chat = require('../../models/chat');
const Message = require('../../models/message.js');
const User = require('../../models/user');



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

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        const io = req.app.get("io");

        // message.chat.user.forEach((user) => {

        //     console.log("Emit To:", user._id.toString());

        //     if (user._id.toString() === message.sender._id.toString()) {
        //         console.log("Skip Sender");
        //         return;
        //     }

        //     console.log("Sending To:", user._id.toString());

        //     io.to(user._id.toString()).emit("message received", message);
        // });

        message.chat.user.forEach((user) => {

            console.log("Sending To:", user._id.toString());

            io.to(user._id.toString()).emit("message received", message);

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
            users: req.user._id,
        });

        // if (!chat) {
        //     return res.status(403).json({
        //         _status: false,
        //         _message: "Access denied",
        //     });
        // }

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