const nodemailer = require('nodemailer')

const sendEmail = async (emailInfo) => {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    });

    await transporter.verify();

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: emailInfo.reciver,
        subject: emailInfo.subject,
        text: emailInfo.innerTxt,
    };

    transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error sending email');
    } else {
        console.log(info);
        res.send('Email sent');
    }
    });
}

exports.sendEmail = sendEmail