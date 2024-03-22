const { Router } = require("express");
const {handleVerifyUser, handleVerifyOTPandCreateUser, handleSendOTP, handleForgotPasswordSendOTP, handleForgotPasswordVerifyOTP, handleNewPassword } = require("../controllers/auth");

const router = Router();

router.get('/', (req, res) => res.render('landingPage'));

router.get('/signup', (req, res) => {res.render('auth/signup')});
router.post('/send-otp', handleSendOTP);
router.post('/verify-otp', handleVerifyOTPandCreateUser);

router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', handleVerifyUser);
router.get('/forgot-password', (req, res) => res.render('auth/forgot-password'))
router.post('/forgot-password-send-otp', handleForgotPasswordSendOTP);
router.post('/forgot-password-verify-otp', handleForgotPasswordVerifyOTP)

router.get('/new-password', (req, res) =>  res.render('auth/new-password'));
router.post('/new-password', handleNewPassword);

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})

module.exports = router;