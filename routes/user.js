const express = require("express");
const router = express.Router();
const { User } = require("../user-model");
const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  const token = req.cookies.Token;
  const id = req.params.id;

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Tidak ada sesi login, silahkan login dulu",
        success: false,
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    console.log(decoded);
    const user = await User.findById(decoded.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Pengguna tidak ditemukan", success: false });
    }

    if (user._id == id) {
      await next();
    } else {
      return res
        .status(403)
        .json({
          message: "Anda tidak memiliki izin untuk mengakses sumber daya ini",
          success: false,
        });
    }
  } catch (err) {
    return res.json({ message: "Token Tidak Valid", success: false });
  }
};

router.get("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res.status(200).json({ user, success: true });
});

router.put("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  try {
    const updateUserData = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User tidak ditemukan", success: false });
    }
    const user = await User.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });
    res
      .status(200)
      .json({
        message: "Data pengguna berhasil di perbarui",
        user,
        success: true,
      });
  } catch (error) {
    res.json({ error, success: false });
  }
});

router.delete("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User tidak ditemukan", success: false });
    }
    const user = await User.findByIdAndDelete(id, { new: true });
    res
      .status(200)
      .json({ message: "User berhasil dihapus", user, success: true });
  } catch (error) {
    res.json({ error, success: false });
  }
});

router.put("/", authToken, async (req, res) => {
  console.log("tidak ada id");
  return res
    .status(400)
    .json({ message: "Id User harus disertakan", success: false });
});

module.exports = router;
