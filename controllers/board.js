const Board = require("../models/board");
const Profile = require("../models/profile");

const handleViewBoard = async (req, res) => {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId).populate('pins');
    const profile = await Profile.findOne({user : req.user._id});
    res.render('viewBoard', {board, user : req.user._id, profile});
}

const handleSavePinToBoard = async (req, res) => {
    const boardId = req.params.boardId;
    const pinId = req.params.pinId

    // save pin to board
    const board = await Board.findById(boardId);
    board.pins.push(pinId);
    
    await board.save();

    // save pin to user savedPin

    const profile = await Profile.findOne({user : req.user._id});
    profile.savedPins.push({
        pin : pinId,
        board : boardId
    })

    await profile.save();

    return res.json({ redirectURL : `/pin/${pinId}`});

}

const handleCreateBoard = async (req, res) => {
    const {name, secret} = req.body;

    //  create board
    const board = await Board.create({
        title : name, 
        private : (secret === 'yes' ? true : false),
        author : req.user._id,
    })

    const profile = await Profile.findOne({user : req.user._id});
    console.log(profile);
    profile.boards.push(board._id);
    
    await profile.save();

    console.log(board);
    return res.redirect('/profile');
}

const handleCreateBoardSavePin = async (req, res) => {
    const {name, secret} = req.body;
    const pinId = req.params.pinId;
    // create a new board
    const board = await Board.create({
        title : name,
        private : (secret === 'yes' ? true : false),
        author : req.user._id,
    })
    board.pins.push(pinId);
    await board.save();


    // add the created board into the profile and also add saved pin 

    const profile = await Profile.findOne({user : req.user._id});
    profile.boards.push(board._id);
    profile.savedPins.push({
        pin : pinId, 
        board : board._id,
    });

    await profile.save();


    return res.redirect(`/pin/${pinId}`);
}

module.exports = {
    handleSavePinToBoard,
    handleCreateBoard,
    handleCreateBoardSavePin,
    handleViewBoard,
}