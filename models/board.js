const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    pins : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Pin'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Board = mongoose.model('Post', boardSchema);

module.exports = Board;