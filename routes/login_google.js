const express = require("express");
const router = express.Router();
const passport = require("../auth/googleAuth");
const jwt = require("jsonwebtoken");
const { User } = require("../user-model");
require("dotenv").config();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const found = await User.findOne({ "email.value": req.user.data.email });
      if (!found) {
        const user = new User({
          username: req.user.data.displayName,
          googleId: req.user.data.id,
          email: {
            value: req.user.data.email,
            valid: true,
          },
          gender: undefined,
          age: undefined,
        });
        await user.save();
        const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
          expiresIn: "7d",
        });

        res.cookie("Token", token, { secure: true });
        res.json(
          { message: "berhasil login", success: true, pengguna: user },
          null,
          2
        );
      } else {
        const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
          expiresIn: "7d",
        });
        res.cookie("Token", token, { secure: true });
        res.json(
          { message: "berhasil login", success: true, pengguna: found },
          null,
          2
        );
      }
    } catch (error) {
      console.log(error);
      res.json({ error: error, success: false });
    }
  },
  (err, req, res, next) => {
    res
      .status(401)
      .json({ error: "Otentikasi gagal", success: false }, null, 2);
  }
);
module.exports = router;
