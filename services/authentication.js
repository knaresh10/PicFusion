const JWT = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET_KEY;

const createTokenForUser = (user) => {
    const payLoad = {
        _id : user._id,
        name : user.username,
        email : user.email,
    }

    const token = JWT.sign(payLoad, secret);
    return token;
}

const verifyToken = (token) => {
    const payLoad = JWT.verify(token, secret);
    return payLoad;
}

module.exports = {
    createTokenForUser, 
    verifyToken,
}