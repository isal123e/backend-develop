const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true,
});

app.use(
  cors({
    origin: "http://127.0.0.1:3000",
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", "views");
app.set("view engine", "ejs");

const login_google = require("./routes/login_google");
const login_local = require("./routes/login_local");
const signup_local = require("./routes/signup_local");
const verifyEmail = require("./routes/verifyEmail");
const character = require("./routes/character");
const user = require("./routes/user");

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/", (req, res) => {
  res.json("halooo");
});
app.use("/api/google", login_google);
app.use("/api/character", character);
app.use("/api/auth/signin", login_local);
app.use("/api/auth/signup", signup_local);
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
