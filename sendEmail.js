const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = (email, verifyToken) => {
  const verifyLink = `http://localhost:3000/api/verify/${verifyToken}`;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      clientId: process.env.EMAIL_ID,
      clientSecret: process.env.EMAIL_SECRET,
    },
  });

  transporter.sendMail({
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
  });
};

module.exports = sendVerificationEmail;
