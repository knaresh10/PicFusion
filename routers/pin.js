const { Router } = require('express');
const upload = require('../middleware/multer');

const router = Router();

router.get('/create', (req, res) => {
        return res.render('create')
    }
);

router.post('/create', upload.single("image-pin"), (req, res) => {
    const {title, description} = req.body;
    // console.log(req.file.path);
    console.log(title, description);
    return res.redirect('/');
})
router.get('/:pinId');
router.get('/:pinId/edit');
router.get('/:pinId/delete');

module.exports = router;