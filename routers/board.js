const { Router } = require('express');
const { handleSavePinToBoard, handleCreateBoard, handleCreateBoardSavePin, handleViewBoard, handlePublicViewBoard, handleDeleteBoard } = require('../controllers/board');
const {checkForAuthentication} = require('../middleware/auth');

const router = Router();

// router.get('/create');
router.post('/create', checkForAuthentication('token'), checkForAuthentication('profile') , handleCreateBoard);
router.delete("/:boardTitle", checkForAuthentication('token'), checkForAuthentication('profile'), handleDeleteBoard);
router.get('/:boardId', checkForAuthentication('token'), checkForAuthentication('profile'), handleViewBoard);
router.get('/view/:boardId', checkForAuthentication('token'), checkForAuthentication('profile'), handlePublicViewBoard);
router.post('/create/save/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleCreateBoardSavePin);
router.post('/:boardId/save/:pinId', checkForAuthentication('token'), checkForAuthentication('profile'), handleSavePinToBoard);

module.exports = router;