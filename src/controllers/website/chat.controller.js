const Chat = require("../../models/chat");
const userModels = require("../../models/user");
const fs = require("fs");
const path = require("path");
const { deleteFile } = require("../../utils/fileHelper");

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
        return res.status(200).json({
            _status: true,
            _message: "success",
            _data: isChat[0],
        });
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
                    path: "latestMessage.sender",
                    select: "name email thumbnail"
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

    var users = JSON.parse(req.body.user);

    if (users.length < 2) {
        return res.status(400).json({
            _status: false,
            _message: "At least 2 users are required to form a group chat",
        });
    }

    let groupImage;

    if (req.files?.groupImage?.length > 0) {
        groupImage = `${req.protocol}://${req.get("host")}/uploads/group/${req.files.groupImage[0].filename}`;
    }

    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            user: users,
            isGroupChat: true,
            groupAdmin: req.user._id,
            groupImage
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

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({
            _status: false,
            _message: "Chat not found",
        });
    }

    const updateData = {};

    if (chatName) {
        updateData.chatName = chatName;
    }

    if (req.files?.groupImage?.length > 0) {

        // deleteFile(chat.groupImage, "group");
        deleteFile(chat.groupImage);

        updateData.groupImage =
            `${req.protocol}://${req.get("host")}/uploads/group/${req.files.groupImage[0].filename}`;
    }

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        updateData,
        { new: true }
    )
        .populate("user", "-password")
        .populate("groupAdmin", "-password");

    return res.status(200).json({
        _status: true,
        _message: "Group updated successfully",
        _data: updateChat,
    });
};

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

const updateGroupMembers = async (req, res) => {
    try {
        const {
            chatId,
            addUsers = [],
            removeUsers = [],
        } = req.body;

        // Validation
        if (!chatId) {
            return res.status(400).json({
                _status: false,
                _message: "chatId is required",
            });
        }

        // Find chat
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                _status: false,
                _message: "Chat not found",
            });
        }

        // Group check
        if (!chat.isGroupChat) {
            return res.status(400).json({
                _status: false,
                _message: "This is not a group chat",
            });
        }

        // Admin check
        if (chat.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                _status: false,
                _message: "Only group admin can update members",
            });
        }

        // Remove duplicate ids
        const addIds = [...new Set(addUsers)];
        const removeIds = [...new Set(removeUsers)];

        // Same user add & remove
        const conflict = addIds.some(id => removeIds.includes(id));

        if (conflict) {
            return res.status(400).json({
                _status: false,
                _message: "Same user cannot be added and removed together",
            });
        }

        // Admin remove protection
        if (removeIds.includes(chat.groupAdmin.toString())) {
            return res.status(400).json({
                _status: false,
                _message: "Group admin cannot be removed",
            });
        }

        // Current members
        let members = chat.user.map(id => id.toString());

        // Remove users
        members = members.filter(id => !removeIds.includes(id));

        // Add users (ignore duplicates)
        addIds.forEach(id => {
            if (!members.includes(id)) {
                members.push(id);
            }
        });

        // Save
        chat.user = members;
        await chat.save();

        // Populate updated chat
        const updatedChat = await Chat.findById(chat._id)
            .populate("user", "-password")
            .populate("groupAdmin", "-password");

        return res.status(200).json({
            _status: true,
            _message: "Group members updated successfully",
            _data: updatedChat,
        });

    } catch (error) {
        return res.status(500).json({
            _status: false,
            _message: error.message,
        });
    }
};

// now UI make we complete 10 no playlist video


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromeGroup, addtoGroup, updateGroupMembers };
