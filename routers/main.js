const { Router } = require('express');
const { handleFeedDisplay, handleSearchUser, handleLandingPage, handleTagSearch } = require('../controllers/main');
const {checkForAuthentication} = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = Router();

router.get('/', handleLandingPage);
router.get('/feed', checkForAuthentication('token'), checkForAuthentication('profile'), handleFeedDisplay);
router.post('/search', checkForAuthentication('token'), checkForAuthentication('profile'), handleSearchUser);
router.get('/search-tag/:query', checkForAuthentication('token'), checkForAuthentication('profile'), handleTagSearch);

module.exports = router;