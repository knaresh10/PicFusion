const Profile = require('../models/profile');
const Pin = require('../models/pin');

const handleProfile = async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id}).populate(['pins', 'boards']);
    for(let i = 0; i < profile.boards.length; i++) {
        await profile.boards[i].populate('pins')
    } 
    return res.render('profile', {user : req.user, profile});
}

module.exports = {
    handleProfile,
}