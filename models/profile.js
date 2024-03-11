const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    profilePic : {type : String},
    about : {type : String},
    username : {
        type : String,
        unique : true
    },
    boards : {
        type : Array,
        default : []
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;