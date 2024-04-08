const Pin = require('../models/pin');
const User = require('../models/user');
const Profile = require('../models/profile');
const mongoose = require('mongoose');

const handleLandingPage = (req, res) => {
    res.render('landingPage', {
        user : req.user,
    });
}

const handleFeedDisplay = async (req, res) => {
    console.log(req.user);
    const pins = await  Pin.find().populate('author');
    const profile = await Profile.findOne({user : req.user.id});
    return res.render('feed', {user : req.user, pins, profile});
}

const handleSearchUser = async (req, res) => {
    const query = req.body.query;
    // db = await mongoose.connection.db.collection('pinterest-clone')
    const profiles = await Profile.aggregate([
        {
            $search : {
                autocomplete : {
                    query : `${query}`,
                    path : "username",
                }
            }
        },
        {
            $limit: 5 
        },
        {
            $project : {
                'username' : 1
            }
        }
    ]);
    return res.json({profiles});
}

module.exports = {
    handleLandingPage,
    handleFeedDisplay,
    handleSearchUser
}