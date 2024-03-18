const { Router } = require('express');
const { handleSavePinToBoard, handleCreateBoard, handleCreateBoardSavePin, handleViewBoard } = require('../controllers/board');

const router = Router();

// router.get('/create');
router.post('/create', handleCreateBoard);
router.get('/:boardId', handleViewBoard);
router.get('/:boardId/edit');
router.get('/:boardId/delete');
router.post('/create/save/:pinId', handleCreateBoardSavePin);
router.post('/:boardId/save/:pinId', handleSavePinToBoard);

module.exports = router;