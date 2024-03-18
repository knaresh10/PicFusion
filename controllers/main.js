const Pin = require('../models/pin');
const User = require('../models/user');
const Profile = require('../models/profile')

const handleFeedDisplay = async (req, res) => {
    const pins = await  Pin.find().populate('author');
    // console.log( pins[0]._id);
    const profile = await Profile.findOne({user : req.user._id});
    return res.render('feed', {user : req.user, pins, profile});
}

module.exports = {
    handleFeedDisplay,
}