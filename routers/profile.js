const {Router} = require('express');
const { upload } = require('../middleware/multer');
const { handleProfile, handleProfileEdit, handleGetProfileEdit, handleProfileView } = require('../controllers/profile');
const {checkForAuthentication} = require('../middleware/auth');
const router = Router();

router.get('/', checkForAuthentication('token'), checkForAuthentication('profile'), handleProfile);
router.get('/edit', checkForAuthentication('token'), checkForAuthentication('profile'), handleGetProfileEdit);
router.post('/edit', checkForAuthentication('token'), checkForAuthentication('profile'), upload.single('profile-pic'), handleProfileEdit);
router.get('/view/:profileId', checkForAuthentication('token'), checkForAuthentication('profile'), handleProfileView)

module.exports = router;