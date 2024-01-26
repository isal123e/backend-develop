const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const sendMail = require("./sendEmail");
const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "views");
app.set("view engine", "ejs");

const login_google = require("./routes/login_google");
const login_local = require("./routes/login_local");
const signup_local = require("./routes/signup_local");
const verifyEmail = require("./routes/verifyEmail");
const user = require("./routes/user");

app.get("/", (req, res) => {
  res.json("halooo");
});
app.post("/cek", (req, res) => {
  const { email } = req.body;
  sendMail(email, "ini verify token ya kimak");
});
app.use("/api/google", login_google);
app.use("/api/login", login_local);
app.use("/api/signup", signup_local);
app.use("/api/verify", verifyEmail);
app.use("/api/user", user);

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

db().then(() => {
  app.listen(3000, function () {
    console.log("Listening on http://localhost:3000");
  });
});
