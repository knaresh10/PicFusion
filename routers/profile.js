const {Router} = require('express');
const upload = require('../middleware/multer');
const { handleProfileEdit } = require('../controllers/auth');
const { handleProfile } = require('../controllers/profile');
const Profile = require('../models/profile');
const router = Router();

router.get('/', handleProfile);

router.get('/:username');
router.get('/edit', async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id});
    return res.render('profileSetup', {
        user : req.user,
        profile
    })
});

router.post('/edit', upload.single('profile-pic'), handleProfileEdit);

router.get('/quickSave', async (req, res) => {
    const profile = await Profile.findOne({user : req.user._id}).populate('quickSave');
    return res.render('quickSave', {user : req.user, profile});
})

module.exports = router;