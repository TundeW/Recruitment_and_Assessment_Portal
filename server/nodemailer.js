var nodemailer = require('nodemailer');

const dotenv = require('dotenv')
dotenv.config()
const db = require('./database')
const queries = require('./query')



const emailsendercontroller = (useremail, subject, text) => {
    const email = process.env.Email;
    const password = process.env.Password
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });
    const mailOptions = {
        from: 'Enyata Team',
        to: useremail,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {

        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = emailsendercontroller
