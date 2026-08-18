const User = require("../../models/user");
const { deleteFile } = require("../../utils/fileHelper");

// Route: GET /api/user/profile
const viewProfile = async (req, res) => {

    try {
        const user = await User.findOne({
            _id: req.user._id,
            delete_at: null
        }).select("-password")

        if (!user) {
            return res.status(404).json({
                _status: false,
                _message: 'User not found',
                _data: null
            })
        }

        res.status(200).json({
            _status: true,
            _message: "Profile fetched successfully",
            _data: user
        })
    } catch (error) {
        res.status(500).json({
            _status: true,
            _message: "internal server error",
            _data: null
        })
    }

}
// Route: PUT /api/user/profile/update
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Email validation
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    _status: false,
                    _message: "Invalid email address",
                    _data: null
                });
            }
        }

        const user = await User.findOne({
            _id: req.user._id,
            delete_at: null
        }).select("-password")

        if (!user) {
            return res.status(404).json({
                _status: false,
                _message: 'User not found',
                _data: null
            })
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (req.files?.thumbnail?.length > 0) {
            // Old Delete file
            if (user.thumbnail) {
                deleteFile(user.thumbnail)
            }
            updateData.thumbnail = `${req.protocol}://${req.get("host")}/uploads/profile/${req.files.thumbnail[0].filename}`;
        }

        const updateUser = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                delete_at: null
            },
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");


        res.status(200).json({
            _status: true,
            _message: "Profile update successfully",
            _data: updateUser
        })
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);

        res.status(500).json({
            _status: true,
            _message: "internal server error",
            _data: null
        })
    }
}

// Route: GET /api/user?search=anil
const getUsers = async (req, res) => {
    try {
        const { search } = req.query; // query param

        let filter = {
            delete_at: null,
            status: true,
            _id: { $ne: req.user._id } // Ignore User search who loging and other all user search
        };

        if (search && search.trim() !== '') {
            const regex = new RegExp(search, 'i');
            // filter.name = { $regex: name, $options: 'i' };
            filter.$or = [
                { name: regex },
                { email: regex },
            ]
        }

        const users = await User.find(filter).select('-password');

        if (users.length === 0) {
            return res.status(404).json({
                _status: false,
                _message: "User not found",
                _data: []
            });
        }

        res.json({
            _status: true,
            _message: "Users fetched successfully",
            _count: users.length,
            _data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ _status: false, _message: "Something went wrong", _data: null });
    }
};


module.exports = {
    viewProfile,
    getUsers,
    updateProfile
}