const Chat = require("../../models/chat");
const userModels = require("../../models/user");

const accessChat = async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log('UserId Param not sent with request');
        return res.status(400).json({
            _status: false,
            _message: "UserId Param not sent with request",
            _data: null
        });
    }

    // 🔎 FIND CHAT
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { user: { $elemMatch: { $eq: req.user._id } } },
            { user: { $elemMatch: { $eq: userId } } }   // ✅ fixed
        ],
    })
        .populate('user', '-password')   // ✅ fixed
        .populate('latestMessage');

    // 🔎 Populate latest message sender
    isChat = await userModels.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name email thumbnail'
    });

    // ✅ If chat exists
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {

        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            user: [req.user._id, userId]
        };

        try {

            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({
                _id: createChat._id
            })
                .populate('user', '-password');   // ✅ fixed

            res.status(200).json({
                _status: true,
                _message: 'success',
                _data: fullChat
            });

        } catch (error) {
            return res.status(400).json({
                _status: false,
                _message: error.message,
                _data: null
            });
        }
    }
};

const fetchChats = async (req, res) => {
    try {
        Chat.find({ user: { $elemMatch: { $eq: req.user._id } } })
            .populate("user", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await userModels.populate(results, {
                    path: 'latestMessage',
                    select: 'name pic email'
                })
                res.status(200).json({
                    _status: true,
                    _message: 'success',
                    _data: results
                });
            })

    } catch (error) {
        return res.status(400).json({
            _status: false,
            _message: error.message,
            _data: null
        });
    }
}

const createGroupChat = async (req, res) => {
    if (!req.body.user || !req.body.name) {
        return res.status(400).json({
            _status: false,
            _message: "Please fill all the fields",
        });
    }

    var users = req.body.user;

    if (users.length < 2) {
        return res.status(400).json({
            _status: false,
            _message: "At least 2 users are required to form a group chat",
        });
    }

    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            user: users,
            isGroupChat: true,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("user", "-password")
            .populate("groupAdmin", "-password");

        return res.status(200).json({
            _status: true,
            _message: "success",
            _data: fullGroupChat,
        });

    } catch (error) {
        return res.status(400).json({
            _status: false,
            _message: error.message,
            _data: null,
        });
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    )
        .populate("user", "-password")
        .populate("groupAdmin", "-password");

    if (!updateChat) {
        return res.status(404).json({
            _message: 'Chat not found'
        })
    }

    return res.status(200).json({
        _status: true,
        _message: "Group renamed successfully",
        _data: updateChat,
    });
}

const addtoGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const addUser = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { user: userId }
        },
        {
            new: true
        }
    )
        .populate("user", "-password")
        .populate("groupAdmin", "-password");

    if (!addUser) {
        return res.status(404).json({
            _message: 'Chat not found'
        })
    }

    return res.status(200).json({
        _status: true,
        _message: "User Added successfully",
        _data: addUser
    });
}

const removeFromeGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { user: userId }
        },
        {
            new: true
        }
    )
        .populate("user", "-password")
        .populate("groupAdmin", "-password");

    if (!removeUser) {
        return res.status(404).json({
            _message: 'Chat not found'
        })
    }

    return res.status(200).json({
        _status: true,
        _message: "User Remove successfully",
        _data: removeUser
    });
}

// now UI make we complete 10 no playlist video


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromeGroup, addtoGroup };
