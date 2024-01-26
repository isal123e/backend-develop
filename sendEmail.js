const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = (email, verifyToken, username) => {
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
      subject: "MR DEFACTO - EMAIL VERIFICATION",
      html: `<p>Klik Di sini untuk Memverifikasi Email Kamu. Link akand kadaluarsa dalam 5 menit <a href="${verifyLink}/${username}">Verifikasi</a></p>`,
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
