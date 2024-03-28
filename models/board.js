const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    private : {
        type : Boolean,
        default : false,
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'Profile'
    },
    pins : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Pin'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;