const Profile = require('../models/profile');
const Pin = require('../models/pin');
const Board = require('../models/board');

const handleProfile = async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id}).populate(['pins', 'quickSave', 'boards']);
    if (profile && profile.boards) {
        for (let i = 0; i < profile.boards.length; i++) {
            if (profile.boards[i]) {
                await profile.boards[i].populate('pins');
            }
        }
    }
    return res.render('profile', {user : req.user, profile});
}

const handleGetProfileEdit = async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id});
    return res.render('profileSetup', {
        title : !profile.profileSetupCompleted ? 'create' : 'edit',
        user : req.user,
        profile
    })
}

const handleProfileEdit = async (req, res) => {
    const {username, fullname, about, DOB} = req.body;
    // const 
    const updateFields = {
        fullname,
        about,
        DOB,
        profileSetupCompleted : true
    }

    if(req.file) {
        updateFields.profilePic = req.file.filename;
    }
    const result = await Profile.findOneAndUpdate({username}, updateFields);

    return res.redirect('/feed')
}
    
const handleProfileView = async (req, res) => {
    const profileId = req.params.profileId;
    if(profileId == req.profile.Id) return res.redirect('/profile');
    const profile = await Profile.findById(profileId).populate(['pins', 'quickSave', 'boards']);
    return res.render('profileView', {user : req.user, profile});
}

module.exports = {
    handleProfile,
    handleGetProfileEdit,
    handleProfileEdit,
    handleProfileView
}