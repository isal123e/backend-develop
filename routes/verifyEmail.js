const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../user-model");
const sendVerificationEmail = require("../sendEmail");

router.get("/:token/:username", async (req, res) => {
  const token = req.params.token;
  const username = req.params.username;

  if (!token) {
    return res.status(401).json({
      message: "Tidak ada sesi login, silahkan login dulu",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.VERIFY_TOKEN);
    const user = await User.findById(decoded.user._id);
    if (user.usedVerifyToken.includes(token)) {
      return res.render("email", {
        header: "SILAHKAN LOGIN DETECTIVE!",
        text: "Akun Kamu sudah terverifikasi. Silahkan login",
        link: [
          { url: "https://emtris.team/", method: "get" },
          "MULAI PENYIDIKAN SEKARANG!",
        ],
      });
    } else {
      user.email.valid = true;
      user.usedVerifyToken.push(token);
      await user.save();
    }
  } catch (err) {
    return res.render("email", {
      header: "LINK KAMU SUDAH KADALUARSA",
      text: "Kamu bisa meminta link baru",
      link: [
        {
          url: `${process.env.CYCLIC_URL}/resend/verify/${username}`,
          method: "post",
        },
        "KIRIM ULANG LINK",
      ],
    });
  }

  res.render("email", {
    header: "SELAMAT DATANG DETECTIVE!",
    text: "Kami sangat senang atas bergabungnya kamu ke Tim Detektif Mr Defacto. Ayo, bantu Mr Defacto menyelesaikan kasus misteri yang mendebarkan dan penuh petualangan.",
    link: [
      { url: "https://emtris.team/", method: "get" },
      "MULAI PENYIDIKAN SEKARANG!",
    ],
  });
});

router.post("/resend/verify/:username", async (req, res) => {
  const username = req.params.username;
  const user = User.findOne({ username });
  const verifyEmailToken = jwt.sign({ user }, process.env.VERIFY_TOKEN, {
    expiresIn: "5m",
  });
  await sendVerificationEmail(email, verifyEmailToken, user.username);
  res.render("email", {
    header: "LINK VERIFICATION SUDAH DIKIRIM!",
    text: "Link sudah dikirim kembali, silahkan cek email anda",
    link: [{ url: "https://emtris.team/", method: "get" }, "OKEYY!"],
  });
});

module.exports = router;
