const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        user : req.user,
    });
});
router.get('/pins');
router.get('/boards');

module.exports = router;