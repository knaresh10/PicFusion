const { Router } = require('express');
const { handleFeedDisplay } = require('../controllers/main');

const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        user : req.user,
    });
});
router.get('/feed', handleFeedDisplay);
router.get('/boards');

module.exports = router;