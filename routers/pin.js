const { Router } = require('express');
const upload = require('../middleware/multer');
const { handleCreatePin, handleViewPin, handleSavePin, handleUnsavePin, handleLikePin, handleUnsavePinToBoard, handleGetPinData, handleUnLikePin, handleSaveComment, handleDeletePin } = require('../controllers/pin');
const Profile = require('../models/profile');

const router = Router();

router.get('/create', async (req, res) => {
        const profile = await Profile.findOne({user : req.user.id});
        return res.render('create', {user : req.user, profile})
    }
);

router.post('/create', upload.single("image-pin"), handleCreatePin)
router.get('/:pinId', handleViewPin);
router.get('/pinData/:pinId', handleGetPinData);
router.post('/like/:pinId', handleLikePin);
router.post('/unlike/:pinId', handleUnLikePin);
router.post('/save/:pinId', handleSavePin);
router.post('/unsave/:pinId', handleUnsavePin);
router.post('/unsave/:pinId/:boardName', handleUnsavePinToBoard);
router.post('/:pinId/comment', handleSaveComment)
router.get('/:pinId/edit');
router.delete('/:pinId/delete', handleDeletePin);

module.exports = router;