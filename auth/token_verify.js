const jwt = require("jsonwebtoken");
const { User } = require("../user-model");
require("dotenv").config();

const authToken = (req, res, next) => {
  const token = req.cookies.Token;
  const id = req.params.id;

  if (!token) {
    return res.status(401).json({
      message: "Tidak ada sesi login, silahkan login dulu",
      success: false,
    });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, async function (err, decoded) {
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized", succes: false });
    }
    const user = await User.findById(decoded.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Pengguna tidak ditemukan", success: false });
    }
    if (user._id == id) {
      await next();
    } else {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk mengakses sumber daya ini",
        succes: false,
      });
    }
    if (err) {
      return res.status(500).json({ err });
    }
  });
};

module.exports = authToken;
