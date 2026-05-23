const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyToken } = require("../utils/token");

const verifyLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                _status: false,
                _code: "TOKEN_MISSING",
                _message: "Please login to continue",
                _data: null
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            // decoded = jwt.verify(token, process.env.JWT_SECRET);
            decoded = verifyToken(token)
        } catch (err) {
            return res.status(401).json({
                _status: false,
                _code: "TOKEN_EXPIRED",
                _message: "Session expired. Please login again",
                _data: null
            });
        }

        const user = await User.findOne({
            _id: decoded.id,
            delete_at: null,
            status: true
        }).select("-password");

        if (!user) {
            return res.status(401).json({
                _status: false,
                _code: "USER_NOT_FOUND",
                _message: "Account not found. Please login again",
                _data: null
            });
        }

        req.user = user;
        next(); // ✅ success case
    } catch (error) {
        return res.status(500).json({
            _status: false,
            _code: "SERVER_ERROR",
            _message: "Something went wrong",
            _data: null
        });
    }
};

module.exports = verifyLogin;
