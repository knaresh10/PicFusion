const User = require('../models/user');
const Pin = require('../models/pin');
const Profile = require('../models/profile');

const handleCreatePin = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }
    const {title, description} = req.body;

    const user = await User.findOne({email : req.user.email})

    const pin = await Pin.create({
        title,
        description,
        image : req.file.filename,
        author : user._id
    });

    const profile = await Profile.findOne({user : user._id});
    console.log(profile);
    profile.pins.push(pin._id);
    profile.save();
    console.log(pin);
    console.log(title, description, req.file.filename);
    return res.redirect('/feed');
}


module.exports = {
    handleCreatePin,
}