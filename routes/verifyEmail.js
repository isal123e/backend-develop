const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../user-model");

router.get("/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Tidak ada sesi login, silahkan login dulu",
        success: false,
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.VERIFY_TOKEN);
    const user = await User.findById(decoded.user._id);
    if (user.usedVerifyToken.includes(token)) {
      return res.json({
        message: "Akun anda sudah terverifikasi",
        success: false,
      });
    } else {
      user.email.valid = true;
      user.usedVerifyToken.push(token);
      await user.save();
    }
  } catch (err) {
    res.json({ message: "link anda tidak valid", success: false });
  }
  res
    .status(201)
    .json({ message: "Anda terverifikasi, silahkan login", success: true });
});

module.exports = router;
