const mongoose = require('mongoose');
const Pin = require('./pin');
const User = require('./user');
const Board = require('./board');

const profileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    fullname : {
        type : String,
    },
    about : {
        type : String,
    },
    DOB : {
        type : Date
    },
    profilePic : {
        type : String,
        default : "Learning-bro.svg"
    },
    profileSetupCompleted : {
        type : Boolean,
        default : false,
    },
    pins : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Pin'
    }],
    boards : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Board'
    }],
    quickSave : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Pin'
    }],
    savedPins : [{
        pin : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Pin'
        },
        board : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Board'
        },
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;