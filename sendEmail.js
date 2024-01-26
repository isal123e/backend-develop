const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = (email, verifyToken) => {
  const verifyLink = `${process.env.CYCLIC_URL}/api/verify/${verifyToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_DEV,
      pass: process.env.PASSWORD_DEV,
    },
  });

  return transporter
    .sendMail({
      from: process.env.EMAIL_DEV,
      to: email,
      subject: "Message",
      text: `link verifikasi kamu ${verifyLink}`,
      auth: {
        user: process.env.EMAIL_DEV,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: process.env.EXPIRES,
      },
    })
    .then(() => {
      console.log("berhasil terikirim!");
    });
};

module.exports = sendVerificationEmail;
