const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = "7d") => {
    console.log('gen==>>', payload)
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    // console.log('Verify==>>', token)
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }