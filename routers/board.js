const { Router } = require('express');

const router = Router();

router.get('/create');
router.get('/:boardId');
router.get('/:boardId/edit');
router.get('/:boardId/delete');

module.exports = router;