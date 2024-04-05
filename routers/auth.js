const { Router } = require("express");
const {handleVerifyUser, handleVerifyOTPandCreateUser, handleSendOTP, handleForgotPasswordSendOTP, handleForgotPasswordVerifyOTP, handleNewPassword, handleGetLandingPage, handleGetSignUpPage, handleGetLoginPage, handleLogout, handleGetForgotPasswordPage, handleGetNewPasswordPage } = require("../controllers/auth");

const router = Router();

router.get('/', handleGetLandingPage);
router.get('/signup', handleGetSignUpPage);
router.post('/send-otp', handleSendOTP);
router.post('/verify-otp', handleVerifyOTPandCreateUser);
router.get('/login', handleGetLoginPage);
router.post('/login', handleVerifyUser);
router.get('/forgot-password', handleGetForgotPasswordPage)
router.post('/forgot-password-send-otp', handleForgotPasswordSendOTP);
router.post('/forgot-password-verify-otp', handleForgotPasswordVerifyOTP)
router.get('/new-password', handleGetNewPasswordPage);
router.post('/new-password', handleNewPassword);
router.get('/logout', handleLogout);

module.exports = router;