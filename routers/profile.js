const {Router} = require('express');
const upload = require('../middleware/multer');
const { handleProfile, handleProfileEdit } = require('../controllers/profile');
const Profile = require('../models/profile');
const router = Router();

router.get('/', handleProfile);

router.get('/:username');
router.get('/edit', async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id});
    return res.render('profileSetup', {
        title : !profile.profileSetupCompleted ? 'create' : 'edit',
        user : req.user,
        profile
    })
});

router.post('/edit', upload.single('profile-pic'), handleProfileEdit);

router.get('/quickSave', async (req, res) => {
    const profile = await Profile.findOne({user : req.user.id}).populate('quickSave');
    console.log(profile);
    return res.render('quickSave', {user : req.user, profile});
})

module.exports = router;