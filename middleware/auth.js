const {verifyToken} = require('../services/authentication');


function checkForAuthentication(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return res.redirect('/');
        }

        try {
            const userPayLoad = verifyToken(tokenCookieValue);
            if(cookieName == 'token') req.user = userPayLoad;
            else req.profile = userPayLoad;
        } catch(error) {
            res.clearCookie('token');
            res.clearCookie('profile');
            return res.redirect('/');
        }
        return next();
    }
}

module.exports = {
    checkForAuthentication,
}