const express = require("express");
const router = express.Router();
const passport = require("../auth/localAuth");
const { User } = require("../user-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    user = await User.findById(user.id).select("-password");

    if (user.email.valid) {
      const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
        expiresIn: "7d",
      });
      res.cookie("Token", token, { secure: true, sameSite: "none" });
      return res.json({
        success: true,
        message: "Login berhasil",
        user,
      });
    } else {
      return res.json({
        success: false,
        message: "Login gagal, kamu belum verifikasi email",
      });
    }
  })(req, res, next);
});
module.exports = router;
