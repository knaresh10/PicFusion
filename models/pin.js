const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    image : {
        type : String,
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'Profile'
    },
    board : {
        type : mongoose.Schema.ObjectId,
        ref : 'Board'
    },
    tags : [{
        type : String,
    }],
    comments : [{
        profileId : {
            type : mongoose.Schema.ObjectId,
            ref : 'Profile',
        },
        message : {
            type : String,
        }
    }],
    likes : {
        type : Number,
        default : 0
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;