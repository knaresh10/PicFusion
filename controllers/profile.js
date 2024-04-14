const Profile = require('../models/profile');
const s3Upload = require('../services/s3Upload');

const handleProfile = async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id}).populate(['pins', 'quickSave', 'boards']);
    if (profile && profile.boards) {
        for (let i = 0; i < profile.boards.length; i++) {
            if (profile.boards[i]) {
                await profile.boards[i].populate('pins');
            }
        }
    }
    return res.render('profile/userProfile', {user : req.user, profile});
}

const handleGetProfileEdit = async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id});
    return res.render('profile/editProfile', {
        title : !profile.profileSetupCompleted ? 'create' : 'edit',
        user : req.user,
        profile
    })
}

const handleProfileEdit = async (req, res) => {
    const {username, fullname, about} = req.body;
    // const 
    const updateFields = {
        fullname,
        about,
        profileSetupCompleted : true
    }

    if(req.file) {
        const url = await s3Upload.s3PinUpload(req.file, 'profilePics');
        updateFields.profilePic = url;
    }
    const result = await Profile.findOneAndUpdate({username}, updateFields);

    return res.redirect('/feed')
}
    
const handleProfileView = async (req, res) => {
    const profileId = req.params.profileId;
    if(profileId == req.profile.id) return res.redirect('/profile');
    const profile = await Profile.findById(req.profile.id, {username : 1, profilePic : 1})
    const searchProfile = await Profile.findById(profileId)
    .populate(['pins'])
    .populate({
        path: 'boards',
        match: { private: false } 
    })
    .exec();
    if (searchProfile && searchProfile.boards) {
        for (let i = 0; i < searchProfile.boards.length; i++) {
            if (searchProfile.boards[i]) {
                await searchProfile.boards[i].populate('pins');
            }
        }
    }
    // console.log(searchProfile.boards)
    return res.render('profile/viewProfile', {user : req.user, searchProfile, profile});
}

module.exports = {
    handleProfile,
    handleGetProfileEdit,
    handleProfileEdit,
    handleProfileView
}