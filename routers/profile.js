const {Router} = require('express');
const upload = require('../middleware/multer');
const { handleProfileEdit } = require('../controllers/auth');
const { handleProfile } = require('../controllers/profile');
const router = Router();

router.get('/', handleProfile);

router.get('/:username');
router.get('/edit', (req, res) => {
    return res.render('profileSetup', {
        user : req.user,
    })
});

router.post('/edit', upload.single('profile-pic'), handleProfileEdit);

module.exports = router;