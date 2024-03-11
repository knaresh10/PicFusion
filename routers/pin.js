const { Router } = require('express');
const upload = require('../middleware/multer');
const { handleCreatePin } = require('../controllers/pin');

const router = Router();

router.get('/create', (req, res) => {
        return res.render('create')
    }
);

router.post('/create', upload.single("image-pin"), handleCreatePin)
router.get('/:pinId');
router.get('/:pinId/edit');
router.get('/:pinId/delete');

module.exports = router;