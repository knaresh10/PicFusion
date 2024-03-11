const Profile = require('../models/profile');

const handleProfile = async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id});
    console.log(profile)
    console.log(profile.profilePic)
    return res.render('profile', {user : req.user, profileData : profile});
}

module.exports = {
    handleProfile,
}