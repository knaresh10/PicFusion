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
        const user = User.find({email});
        if(!user.profileSetupCompleted) return res.cookie('token', token).redirect('/profile/edit');
        res.cookie('token', token).redirect('/');
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

    user.profileSetupCompleted = true
    
    user.save();
    
    console.log(result);

    return res.redirect('/')
}

module.exports = {
    handleCreateNewUser,
    handleVerifyUser,
    handleProfileEdit
}