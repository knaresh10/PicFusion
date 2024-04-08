const { Router } = require('express');
const { upload } = require('../middleware/multer');
const { handleCreatePin, handleViewPin, handleSavePin, handleUnsavePin, handleLikePin, handleUnsavePinToBoard, handleGetPinData, handleUnLikePin, handleSaveComment, handleDeletePin, handleGetCreatePin } = require('../controllers/pin');
const {checkForAuthentication} = require('../middleware/auth');
const router = Router();

router.get('/create', checkForAuthentication('token'), checkForAuthentication('profile'), handleGetCreatePin);
router.post('/create', checkForAuthentication('token'), checkForAuthentication('profile'), upload.single("image-pin"), handleCreatePin)
router.get('/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleViewPin);
router.get('/pinData/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleGetPinData);
router.post('/like/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleLikePin);
router.post('/unlike/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleUnLikePin);
router.post('/save/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleSavePin);
router.post('/unsave/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleUnsavePin);
router.post('/unsave/:pinId/:boardName', checkForAuthentication('token'), checkForAuthentication('profile'), handleUnsavePinToBoard);
router.post('/:pinId/comment', checkForAuthentication('token'), checkForAuthentication('profile'), handleSaveComment)
router.delete('/:pinId/delete', checkForAuthentication('token'), checkForAuthentication('profile'), handleDeletePin);

module.exports = router;