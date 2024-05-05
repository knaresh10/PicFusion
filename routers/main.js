const { Router } = require('express');
const { handleFeedDisplay, handleSearchUser, handleLandingPage, handleTagSearch, handleGetData } = require('../controllers/main');
const {checkForAuthentication} = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = Router();

router.get('/', handleLandingPage);
router.get('/feed', checkForAuthentication('token'), checkForAuthentication('profile'), handleFeedDisplay);
router.post('/search', checkForAuthentication('token'), checkForAuthentication('profile'), handleSearchUser);
router.get('/search-pins/:query', checkForAuthentication('token'), checkForAuthentication('profile'), handleTagSearch);
router.get('/getData', handleGetData);

module.exports = router;