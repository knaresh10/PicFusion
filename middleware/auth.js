const {verifyToken} = require('../services/authentication');


function checkForAuthentication(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return next();
        }

        try {
            const userPayLoad = verifyToken(tokenCookieValue);
            if(cookieName == 'token') req.user = userPayLoad;
            else req.profile = userPayLoad;
        } catch(error) {

        }
        return next();
    }
}

module.exports = {
    checkForAuthentication,
}