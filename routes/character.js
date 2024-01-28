const express = require("express");
const router = express.Router();
const { User, Character, Avatar } = require("../user-model");
require("dotenv").config();
const authToken = require("../auth/token_verify");

router.post("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  const query = req.query.fields; // Misalnya fields = avatar, level, atau yang lainnya

  if (!query) {
    return res.status(400).json({
      message: "Anda harus menyertakan parameter 'fields' dalam query",
    });
  }

  const charaUser = await Character.findOne({ user_id: id });
  if (charaUser) {
    const requestedFields = query.split(",");
    const unselected = {};
    const selectedFields = {};

    requestedFields.forEach((field) => {
      if (charaUser[field] !== undefined) {
        selectedFields[field] = charaUser[field];
      } else {
        unselected[field] = charaUser[field];
      }
    });

    if (Object.keys(unselected).length > 0) {
      return res.status(404).json({
        message: `Character tidak memiliki properti berikut: ${Object.keys(
          unselected
        ).join(", ")}`,
        success: false,
      });
    }

    res.json({ selectedFields, success: true });
  } else {
    res.json({
      message: "User baru, belum memiliki karakter",
      success: false,
    });
  }
});

module.exports = router;
