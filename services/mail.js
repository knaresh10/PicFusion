const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : false,
    auth : {
        user : process.env.MAIL_EMAIL,
        pass : process.env.MAIL_PASSWORD,
    },
})


const sendMailToUser = async (to, html) => {
    
    const options = {
        from : process.env.MAIL_EMAIL,
        to,
        subject : "NodeMailer Testing",
        html,
    }


    transporter.sendMail(options, (err, info) => {
        // console.log(info);
    })
}

module.exports = {
    sendMailToUser,
}