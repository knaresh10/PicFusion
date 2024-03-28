const JWT = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET_KEY;

const createTokenForUser = (payLoad) => {
    const token = JWT.sign(payLoad, secret, {expiresIn : '60m'});
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