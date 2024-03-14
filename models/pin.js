const mongoose = require('mongoose');
const User = require('./user');
const Board = require('./board');

const postSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    image : {
        type : String
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    board : {
        type : mongoose.Schema.ObjectId,
        ref : 'Board'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Pin = mongoose.model('Pin', postSchema);

module.exports = Pin;