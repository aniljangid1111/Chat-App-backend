const User = require("../../models/user");

const viewProfile = (req, res) => {

    try {
        res.status(200).json({
            _status: true,
            _message: "Sucessfull",
            _data: null
        })
    } catch (error) {
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
    getUsers
}