const User = require('../models/user');

const handleCreateNewUser = async (req, res) => {
    const {fullname, email, password} = req.body;
    const result = await User.create({
        fullname,
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
        res.cookie('token', token).redirect('/');
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    handleCreateNewUser,
    handleVerifyUser
}