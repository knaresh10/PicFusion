const {Router} = require('express');
const { upload } = require('../middleware/multer');
const { handleProfile, handleProfileEdit, handleGetProfileEdit, handleProfileView } = require('../controllers/profile');
const router = Router();

router.get('/', handleProfile);
router.get('/edit', handleGetProfileEdit);
router.post('/edit', upload.single('profile-pic'), handleProfileEdit);
router.get('/view/:profileId', handleProfileView)

module.exports = router;