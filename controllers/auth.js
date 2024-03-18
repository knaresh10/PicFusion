const User = require('../models/user');
const Profile = require('../models/profile');

const handleCreateNewUser = async (req, res) => {
    const {username, email, password} = req.body;
    const result = await User.create({
        username,
        email,
        password,
    });

    const profile = await Profile.create({
        user : result._id,
        
    })
    
    res.render('login');
}

const handleVerifyUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        const user = await User.findOne({email});
        console.log(user)
        const profile = await Profile.findOne({user : user._id});
        
        if(!profile.profileSetupCompleted) return res.cookie('token', token).redirect('/profile/edit');
        res.cookie('token', token).redirect('/feed');
    } catch (e) {
        console.log(e);
    }
}

const handleProfileEdit = async (req, res) => {
    const {fullname, about, DOB} = req.body;
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
    const result = await Profile.findOneAndUpdate({user : req.user._id}, updateFields);

    return res.redirect('/feed')
}

module.exports = {
    handleCreateNewUser,
    handleVerifyUser,
    handleProfileEdit
}