const User = require('../models/user');
const Profile = require('../models/profile');

const handleCreateNewUser = async (req, res) => {
    const {username, email, password} = req.body;
    const result = await User.create({
        username,
        email,
        password,
    });
    console.log(result);
    res.render('login');
}

const handleVerifyUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        const user = User.findOne({email});
        const profile = Profile.findOne({user : user._id});
        if(!profile) return res.cookie('token', token).redirect('/profile/edit');
        res.cookie('token', token).redirect('/feed');
    } catch (e) {
        console.log(e);
    }
}

const handleProfileEdit = async (req, res) => {
    const {fullname, about, DOB} = req.body;

    const result = await Profile.create({
        user : req.user._id,
        fullname,
        about,
        DOB,
        profilePic : req.file.filename,
    });

    const user = await User.findById(req.user._id);
    
    console.log(result);

    return res.redirect('/feed')
}

module.exports = {
    handleCreateNewUser,
    handleVerifyUser,
    handleProfileEdit
}