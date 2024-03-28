const User = require('../models/user');
const Pin = require('../models/pin');
const Profile = require('../models/profile');
const Board = require('../models/board');
const { default: mongoose, mongo } = require('mongoose');


const handleGetPinData = async (req, res) => {
    const pinId = req.params.pinId;
    const profile = await Profile.findById(req.profile.id).populate(['boards', 'savedPins.board']);
    let isPinSaved = false;
    let pinSavedAt = 'profile';
    profile.quickSave.forEach(pin => {
        if(pin._id == pinId) isPinSaved = true;
    });

    profile.savedPins.forEach(obj => {
        if(obj.pin == pinId) {
            isPinSaved = true;
            pinSavedAt = obj.board.title;
        }
    })

    let isLiked = false;
    profile.likedPins.forEach(pin => {
        if(pin._id == pinId) isLiked = true;
    })

    const pin = await Pin.findById(pinId);
    

    return res.json({isPinSaved, pinSavedAt, isLiked, likeCount : pin.likes});
}

const handleCreatePin = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }
    const {title, description, tags} = req.body;

    let tagArray;
    if(tags !== '') tagArray = tags.split(' ');
    
    
    let data = {
        title,
        description,
        image : req.file.filename,
        author : req.profile.id
    };
    
    if(tagArray.length > 0) data['tags'] = tagArray;

    console.log(data)
    
    const profile = await Profile.findById(req.profile.id);

    const pin = await Pin.create(data);

    profile.pins.push(pin._id);

    profile.save();

    return res.redirect('/feed');
}

const handleViewPin = async (req, res) => {
    const pinId = req.params.pinId;
    const profile = await Profile.findById(req.profile.id).populate(['boards', 'savedPins.board']);
    const pin = await Pin.findById(req.params.pinId).populate(['author', 'comments.profileId']);
    const authorProfile = await Profile.findById(pin.author._id)

    let isPinSaved = false;
    let pinSavedAt = 'profile';
    profile.quickSave.forEach(pin => {
        if(pin._id == pinId) isPinSaved = true;
    });

    profile.savedPins.forEach(obj => {
        if(obj.pin == pinId) {
            isPinSaved = true;
            pinSavedAt = obj.board.title;
        }
    })

    // console.log(pin);

    return res.render('pinDashboard', {user : req.user, profile, pin, author : authorProfile, isPinSaved, pinSavedAt});
}

const handleSavePin = async (req, res) => {
    const pinId = req.params.pinId;
    const profile = await Profile.findById(req.profile.id);
    profile.quickSave.push(pinId);
    await profile.save();
    return res.json({message : "pin is saved", pinSavedAt : 'profile'});
    // return res.redirect(`/pin/${pinId}`);
}

const handleUnsavePin = async (req, res) => {
    const pinId = req.params.pinId;
    const profile = await Profile.findByIdAndUpdate(
        req.profile.id,
        {
            $pull : {
                quickSave : {
                    _id : pinId
                }
            }
        }
    )
    return res.json({message : 'pin is unsaved from quick'});
    return res.redirect(`/pin/${pinId}`);
}

const handleUnsavePinToBoard = async (req, res) => {
    const pinId = req.params.pinId;
    const boardName = req.params.boardName;
    console.log(pinId, boardName);
    const boardData = await Board.findOne({title : boardName})
    console.log(boardData); 
    const profile = await Profile.findOneAndUpdate(
        {
            user : req.user.id
        }, 
        {
            $pull : {
                savedPins : {
                    pin : pinId,
                    board : boardData._id
                }
            }
        }
    );

    const board = await Board.findOneAndUpdate(
        {pins : pinId},
        {
            $pull : {pins : pinId},
        }
    );

    return res.json({message : 'pin in unsaved'});
}

const handleLikePin = async (req, res) => {
    const pinId = req.params.pinId;
    const pin = await Pin.findById(pinId);
    pin.likes++;
    await pin.save();
    const profile = await Profile.findById(req.profile.id);
    profile.likedPins.push(pin._id);
    await profile.save();
    return res.json({likeCount : pin.likes});
}

const handleUnLikePin = async (req, res) => {
    const pinId = req.params.pinId;
    const pin = await Pin.findById(pinId);
    pin.likes--;
    await pin.save();
    await Profile.findByIdAndUpdate(req.profile.id, {
        $pull : {
            likedPins : {
                _id : pinId
            }
        }
    })

    return res.json({likeCount : pin.likes});
}

const handleSaveComment = async (req, res) => {
    const pinId = req.params.pinId;
    console.log(pinId);
    const {message} = req.body;

    try {
        const pin = await Pin.findById(pinId);
        pin.comments.push({
            profileId : req.profile.id,
            message,
        })
        await pin.save();
        return res.json({message : 'comment has be added'});
    } catch (err) {
        return res.json({err});
    }
}

module.exports = {
    handleGetPinData,
    handleCreatePin,
    handleViewPin,
    handleSavePin,
    handleUnsavePin,
    handleUnsavePinToBoard,
    handleLikePin,
    handleUnLikePin,
    handleSaveComment,
}