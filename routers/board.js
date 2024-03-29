const { Router } = require('express');
const { handleSavePinToBoard, handleCreateBoard, handleCreateBoardSavePin, handleViewBoard, handleDeleteBoard } = require('../controllers/board');

const router = Router();

// router.get('/create');
router.post('/create', handleCreateBoard);
router.delete("/:boardTitle", handleDeleteBoard);
router.get('/:boardId', handleViewBoard);
router.post('/create/save/:pinId', handleCreateBoardSavePin);
router.post('/:boardId/save/:pinId', handleSavePinToBoard);

module.exports = router;