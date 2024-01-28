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
      subject:
        "DEFACTO: HIDDEN TRUTH - DETECTIVE GAME - BETA EMAIL VERIFICATION",
      html: `
      <p>
      Halo, Selamat Datang di Beta Test Dfacto Hidden Truth Detective Game. Sebelum Anda memulai, harap verifikasi alamat email Anda. 
      Klik <a href="${verifyLink}/${username}">di sini</a> untuk verifikasi. Harap dicatat bahwa tautan ini hanya berlaku selama 5 menit.
      </p>
      <img src="cid:gbgPIUrI"/>
      `,
      attachments: [
        {
          filename: "image.png",
          path: "public/img/email.webp",
          cid: "gbgPIUrI",
        },
      ],
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
