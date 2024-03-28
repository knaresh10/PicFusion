const otpGenerator = require('otp-generator')

const User = require('../models/user');
const Profile = require('../models/profile');
const Board = require('../models/board');
const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const {createTokenForUser} = require('../services/authentication');
const { sendMailToUser } = require('../services/mail');


const handleSendOTP = async (req, res) => {
    let {username, email, password} = req.body;

    try {

        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message : 'Username already exists'});
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const GeneratedOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

        req.session.userData = {username, email, password, GeneratedOTP};

        const html = `
                    <div>
                        <h1>Welcome to pinCraft</h1>
                        <p>Here is your otp for registeration ${GeneratedOTP}</p>
                    </div>
                    `
        await sendMailToUser(email, html);

        return res.status(200).json({message : "otp has be sent to mail"});
    } catch(error) {
        console.log('error registering user', error);
        res.status(500).json({message : 'Internal error'})
    }
}

const handleVerifyOTPandCreateUser = async (req, res) => {
    const {otp} = req.body;

    let {username, email, password, GeneratedOTP} = req.session.userData

    if(otp != GeneratedOTP) {
        res.status(400).json({message : "enter valid otp"});
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
        res.status(500).json({message : 'Internal error'})
    }
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

        const jwt = createTokenForUser({id : user._id});
        const profileData = createTokenForUser({id : profile._id});

        
        if(!profile.profileSetupCompleted) return res.cookie('token', jwt).cookie('profile', profileData).status(200).json({message : "user logged in", username : profile.username, profilePic : profile.profilePic, redirectURL : '/profile/edit'})
        res.cookie('token', jwt).cookie('profile', profileData).status(200).json({message : "user logged in", username : profile.username, profilePic : profile.profilePic, redirectURL : '/feed'});

    } catch (e) {
        console.log(e);
    }
}

const handleForgotPasswordSendOTP = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user === null) {
        return res.status(400).send({message : "Email not found"});
    } 

    try {
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
        await sendMailToUser(email, html);

        return res.status(200).json({message : "otp has been sent"});
    } catch(error) {
        return res.status(500).json({message : "internal error"});
    }
}

const handleForgotPasswordVerifyOTP = async (req, res) => {
    const {email, otp} = req.body;
    const otpData = await OTP.findOne({email});

    req.session.email = email;

    if(otpData.otp !== otp) {
        return res.status(400).json({message : "OTP not matched"});
    }   

    await OTP.findByIdAndDelete(otpData._id);

    return res.status(200).json({message : "otp has been verified"});

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
        return res.status(500).json({error});
    }
}



module.exports = {
    handleSendOTP,
    handleVerifyOTPandCreateUser,
    handleVerifyUser,
    handleForgotPasswordSendOTP,
    handleForgotPasswordVerifyOTP,
    handleNewPassword,
}