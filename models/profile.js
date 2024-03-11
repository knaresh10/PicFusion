const mongoose = require('mongoose');

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
        default : "learning-bro.svg"
    },
    pins : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Pin'
    }],
    boards : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Board'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;