const Profile = require('../models/profile');
const Pin = require('../models/pin');

const handleProfile = async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id}).populate('pins');
    // console.log(profile)
    // console.log(profile.profilePic)
    return res.render('profile', {user : req.user, profileData : profile});
}

module.exports = {
    handleProfile,
}