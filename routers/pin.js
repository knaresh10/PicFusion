const { Router } = require('express');
const upload = require('../middleware/multer');
const { handleCreatePin, handleViewPin, handleSavePin, handleUnsavePin } = require('../controllers/pin');
const Profile = require('../models/profile');

const router = Router();



router.get('/create', async (req, res) => {
        const profile = await Profile.findOne({user : req.user._id});
        return res.render('create', {user : req.user, profile})
    }
);

router.post('/create', upload.single("image-pin"), handleCreatePin)
router.get('/:pinId', handleViewPin);
router.get('/save/:pinId', handleSavePin);
router.get('/unsave/:pinId/:boardId', handleUnsavePin);
router.get('/:pinId/edit');
router.get('/:pinId/delete');

module.exports = router;