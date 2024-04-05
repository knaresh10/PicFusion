const { Router } = require('express');
const { handleFeedDisplay, handleSearchUser, handleLandingPage } = require('../controllers/main');
const upload = require('../middleware/multer');

const router = Router();

router.get('/', handleLandingPage);
router.get('/feed', handleFeedDisplay);
router.post('/search', handleSearchUser);

module.exports = router;