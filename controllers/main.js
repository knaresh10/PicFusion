const Pin = require('../models/pin');
const User = require('../models/user');

const handleFeedDisplay = async (req, res) => {
    const pins = await  Pin.find().populate('author');
    return res.render('feed', {user : req.user, pins});
}

module.exports = {
    handleFeedDisplay,
}