const mongoose = require('mongoose')
const otpGenerator = require('otp-generator')
require('dotenv').config();

const User = require('../models/user');
const Profile = require('../models/profile');
const Board = require('../models/board');
const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const authentication = require('../services/authentication');
const mail = require('../services/mail');

const handleGetLandingPage = (req, res) => {
    res.render('landingPage')
}

const handleGetSignUpPage = (req, res) => {
    res.render('auth/signup')
}

const handleSendOTP = async (req, res) => {
    let {username, email, password} = req.body;

    try {
        // await mongoose.connect(process.env.DB_URL)
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message : 'Username already exists'});
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const GeneratedOTP = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

        req.session.userData = {username, email, password, GeneratedOTP};

        const html = `
                    <div>
                        <h1>Welcome to pinCraft</h1>
                        <p>Here is your otp for registeration ${GeneratedOTP}</p>
                    </div>
                    `
        await mail.sendMailToUser(email, html);

        return res.status(200).json({message : "otp has be sent to mail"});
    } catch(error) {
        res.status(500).json({message : error.message})
    }
}

const handleVerifyOTPandCreateUser = async (req, res) => {
    const {otp} = req.body;

    let {username, email, password, GeneratedOTP} = req.session.userData

    if(otp != GeneratedOTP) {
        return res.status(400).json({message : "enter valid otp"});
    }

    delete req.session.userData;
    
    try {
        
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt)

        const result = await User.create({
            email,
            password,
        });

        
        const profile = await Profile.create({
            user : result._id,
            username,
        })

        return res.status(201).json({message : 'User registered successfully', redirectURL : '/auth/login'});
    } catch(error) {
        console.log('error registering user', error);
        res.status(500).json({message : error.message})
    }
}

const handleGetLoginPage = (req, res) => {
    res.render('auth/login')
}

const handleVerifyUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message : 'Email not found'})
        }
        const result = await bcrypt.compare(password, user.password);

        if(!result) {
            return res.status(400).json({message : 'Password not matched'});
        }

        const profile = await Profile.findOne({user : user._id}, {username : 1, profilePic : 1, profileSetupCompleted : 1});

        const jwt = authentication.createTokenForUser({id : user._id});
        const profileData = authentication.createTokenForUser({id : profile._id});

        
        if(!profile.profileSetupCompleted) return res.cookie('token', jwt).cookie('profile', profileData).status(200).json({message : "user logged in", username : profile.username, profilePic : profile.profilePic, redirectURL : '/profile/edit'})
        return res.cookie('token', jwt).cookie('profile', profileData).status(200).json({message : "user logged in", username : profile.username, profilePic : profile.profilePic, redirectURL : '/feed'});

    } catch (e) {
        return res.status(500).json({message : e.message});
    }
}

const handleGetForgotPasswordPage = (req, res) => {
    res.render('auth/forgot-password')
}

const handleForgotPasswordSendOTP = async (req, res) => {
    const {email} = req.body;
    
    try {
        const user = await User.findOne({email});
        if(user === null) {
            return res.status(400).json({message : "Email not found"});
        } 
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        let data;
        const otpData = await OTP.findOne({email});
        if(otpData === null) {
            data = await OTP.create({
                email,
                otp,
            })
        } else {
            data = await OTP.findByIdAndUpdate(otpData._id, {
                otp
            });
        }

        const html = `
            <div>
                <p>Here is your otp for resetting password ${otp}</p>
            </div>
            `
        await mail.sendMailToUser(email, html);

        return res.status(200).json({message : "otp has been sent"});
    } catch(error) {
        return res.status(500).json({message : error.message});
    }
}

const handleForgotPasswordVerifyOTP = async (req, res) => {
    // await mongoose.connect(process.env.DB_URL)
    const {email, otp} = req.body;

    const otpData = await OTP.findOne({email});

    req.session.email = email;

    if(otpData.otp !== otp) {
        return res.status(400).json({message : "OTP not matched"});
    }   

    await OTP.findByIdAndDelete(otpData._id);

    return res.status(200).json({message : "otp has been verified"});

}

const handleGetNewPasswordPage = (req, res) =>  {
    res.render('auth/new-password')
}

const handleNewPassword = async (req, res) => {
    let {password} = req.body;
    const email = req.session.email;

    delete req.session.email;

    try {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt)

        const user = await User.findOneAndUpdate({email}, {password});

        return res.status(200).json({message : "password is reset"});
    } catch(error) {
        return res.status(500).json({message : error.message});
    }
}

const handleLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
}

module.exports = {
    handleGetLandingPage,
    handleGetSignUpPage,
    handleSendOTP,
    handleVerifyOTPandCreateUser,
    handleGetLoginPage,
    handleVerifyUser,
    handleGetForgotPasswordPage,
    handleForgotPasswordSendOTP,
    handleForgotPasswordVerifyOTP,
    handleGetNewPasswordPage,
    handleNewPassword,
    handleLogout,
}