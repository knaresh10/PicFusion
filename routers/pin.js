const { Router } = require('express');
const { upload } = require('../middleware/multer');
const { handleCreatePin, handleViewPin, handleSavePin, handleUnsavePin, handleLikePin, handleUnsavePinToBoard, handleGetPinData, handleUnLikePin, handleSaveComment, handleDeletePin, handleGetCreatePin } = require('../controllers/pin');

const router = Router();

router.get('/create', handleGetCreatePin);
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