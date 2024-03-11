const { Router } = require("express");
const { handleCreateNewUser, handleVerifyUser } = require("../controllers/auth");

const router = Router();

router.get('/', (req, res) => res.render('index'));

router.get('/signup', (req, res) => {res.render('signup')});
router.post('/signup', handleCreateNewUser);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', handleVerifyUser);

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})

module.exports = router;