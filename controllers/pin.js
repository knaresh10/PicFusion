const User = require('../models/user');
const Pin = require('../models/pin');
const Profile = require('../models/profile');
const Board = require('../models/board');

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
    profile.pins.push(pin._id);
    profile.save();
    return res.redirect('/feed');
}


const handleViewPin = async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id}).populate(['boards', 'savedPins.board']);
    const pin = await Pin.findById(req.params.pinId).populate('author');
    const authorProfile = await Profile.findOne({user : pin.author._id})
    return res.render('pinDashboard', {user : req.user, profile, pin, author : authorProfile});
}

const handleSavePin = async (req, res) => {
    const pinId = req.params.pinId;
    const profile = await Profile.findOne({user : req.user._id});
    profile.quickSave.push(pinId);
    await profile.save();
    return res.redirect(`/pin/${pinId}`);
}

const handleUnsavePin = async (req, res) => {
    const pinId = req.params.pinId;
    const boardId = req.params.boardId;
    const profile = await Profile.findOneAndUpdate(
        {
            user : req.user._id
        }, 
        {
            $pull : {
                savedPins : {
                    pin : pinId,
                    board : boardId
                }
            }
        }
    );
    
    // console.log(profile);
    console.log(boardId);
    const board = await Board.findOneAndUpdate(
        {pins : pinId},
        {
            $pull : {pins : pinId},
        }
    );
    console.log(board)
    // Board.findOneAndUpdate(
    //     { pins: pinId },
    //     { $pull: { pins: pinId } }, 
    //     { new: true } 
    // )
    // .then(updatedBoard => {
    //     if (!updatedBoard) {
    //         console.log('Board not found or pin not in board');
    //         return res.status(404).send('Board not found or pin not in board');
    //     }
    
    //     // Handle success
    //     console.log('Pin removed from board successfully');
    //     // Redirect or send response as needed
    // })
    // .catch(error => {
    //     // Handle error
    //     console.error('Error removing pin from board:', error);
    //     // Redirect or send error response as needed
    // });

    // console.log(board);

    return res.redirect(`/pin/${pinId}`);

}

module.exports = {
    handleCreatePin,
    handleViewPin,
    handleSavePin,
    handleUnsavePin,
}