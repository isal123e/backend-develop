const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = (email, verifyToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_DEV,
      pass: process.env.PASSWORD_DEV,
    },
  });

  const verifyLink = `http://localhost:3000/api/verify/${verifyToken}`;

  const mailOptions = {
    from: process.env.EMAIL_DEV,
    to: email,
    subject: "Verifikasi Email Kamu",
    text: `Klik tautan ini untuk verifikasi email: ${verifyLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email terkirim");
    }
  });
};

module.exports = sendVerificationEmail;
