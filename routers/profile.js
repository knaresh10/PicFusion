const {Router} = require('express');

const router = Router();

router.get('/:username');
router.get('/edit');

module.exports = router;