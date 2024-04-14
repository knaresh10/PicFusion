const Pin = require('../models/pin');
const Profile = require('../models/profile');

const handleLandingPage = (req, res) => {
    res.render('landingPage', {
        user : req.user,
    });
}

const handleFeedDisplay = async (req, res) => {
    const pins = await  Pin.find().populate('author');
    const profile = await Profile.findOne({user : req.user.id});
    return res.render('feedPage', {user : req.user, pins, profile});
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

const handleTagSearch = async (req, res) => {
    const query = req.body.query;
    const profile = await Profile.findOne({user : req.user.id});
    const pins = await Pin.aggregate([
        {
          $search:
            {
              index: "tag-search",
              text: {
                query,
                path: ["title", "description", "tags"],
              },
            },
        },
    ])
    return res.render('searchPage', {user: req.user, pins, profile});
}

module.exports = {
    handleLandingPage,
    handleFeedDisplay,
    handleSearchUser,
    handleTagSearch,
}