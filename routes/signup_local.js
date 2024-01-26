const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../sendEmail");
const { User } = require("../user-model");
const validator = require("validator");

const validEmail = (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Semua field harus diisi", success: false });
  }
  if (validator.isEmail(email)) {
    next();
  } else {
    res.json({ message: "silahkan masukan email yang valid", success: false });
  }
};

router.post("/", validEmail, async (req, res) => {
  try {
    const { username, password, email, gender, age } = req.body;
    const foundUsername = await User.findOne({ username });
    const foundEmail = await User.findOne({ "email.value": email });

    if (foundEmail) {
      return res.json({
        message: "Email sudah digunakan",
        success: false,
      });
    }
    if (foundUsername) {
      return res.json({
        message: "Username sudah digunakan",
        success: false,
      });
    }

    if (!foundUsername && !foundEmail) {
      const salt = 10;
      const user = new User({
        username,
        password: await bcrypt.hash(password, salt),
        email: {
          value: email,
        },
        gender,
        age,
      });

      const verifyEmailToken = jwt.sign({ user }, process.env.VERIFY_TOKEN, {
        expiresIn: "5m",
      });

      await sendVerificationEmail(email, verifyEmailToken, user.username);

      user.save().then(() => {
        console.log("berhasil menyimpan di database");
      });

      res.status(201).json({
        message:
          "Akun berhasil dibuat, silahkan cek email kamu untuk verifikasi",
        success: true,
      });
    }
  } catch (error) {
    res.json({ error, success: false });
  }
});

module.exports = router;
