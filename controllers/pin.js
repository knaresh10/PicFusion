const User = require('../models/user');
const Pin = require('../models/pin');

const handleCreatePin = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }
    const {title, description} = req.body;

    const user = await User.find({email : req.user.email})

    const pin = await Pin.create({
        title,
        description,
        image : req.file.filename,
        author : user._id
    });

    console.log(pin);
    console.log(title, description, req.file.filename);
    return res.redirect('/');
}


module.exports = {
    handleCreatePin,
}