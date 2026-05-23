const User = require("../../models/user");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../utils/token");

const saltRounds = 10;

const registerUser = async (req, res) => {

    try {
        const { password, name, email } = req.body

        const existingUser = await User.findOne({ email: email, delete_at: null });

        // checking user have or not
        if (existingUser) {
            return res.status(409).json({
                _status: false,
                _message: "User already exists with this email address.",
                _data: null
            });
        }
        // password validation
        if (!password || password.trim().length < 4) {
            return res.status(409).json({
                _status: false,
                _message: "Password must be at least 4 characters long.",
                _data: null
            });
        }

        let passwordHased = await bcrypt.hash(password, saltRounds);

        // const imagePath = req.file
        //     ? `/uploads/profile/${req.file.filename}`
        //     : undefined;

        let thumbnailPath = undefined;
        if (req.files?.thumbnail) {
            thumbnailPath = `${req.protocol}://${req.get('host')}/uploads/profile/${req.files.thumbnail[0].filename}`;
        }

        let user = await User.create({
            name,
            email,
            password: passwordHased,
            thumbnail: thumbnailPath
        })

        // generate Token
        let token = generateToken({ id: user._id })

        res.status(200).json({
            _status: true,
            _message: 'Registered successfully',
            token,
            _data: user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body

        // 1️⃣ Validation
        if (!email || !password) {
            return res.status(400).json({
                _status: false,
                _message: "Email and password are required",
                _data: null
            });
        }


        const user = await User.findOne({ email, delete_at: null });

        // user Check
        if (!user) {
            return res.status(401).json({ _message: "Invalid email or password" });
        }
        // password Check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ _message: "Invalid email or password" });
        }

        // User Status check
        if (user.status === false) {
            return res.status(401).json({
                _status: false,
                _message: 'Your account is inactive. Please contact support!',
                _data: null
            })
        }

        // Token Gen..
        const token = generateToken({ id: user._id })

        res.status(200).json({
            _status: true,
            _message: 'Login Successfull',
            _token: token,
            _data: user
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            _status: false,
            _message: 'Internal Server Error',
            _data: null
        })
    }
}



module.exports = {
    registerUser,
    loginUser

}