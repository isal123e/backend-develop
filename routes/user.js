const express = require("express");
const router = express.Router();
const { User, Character, Avatar } = require("../user-model");
const authToken = require("../auth/token_verify");
require("dotenv").config();

router.get("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select("-password");
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
    if (!user) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui data pengguna", success: false });
    }
    res.status(200).json({
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
