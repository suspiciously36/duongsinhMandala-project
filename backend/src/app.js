require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const authMiddleware = require("./middlewares/auth.middleware");
const validateMiddleware = require("./middlewares/validate.middleware");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { User } = require("./models/index");
const passportLocal = require("./passports/passport.local");
const passportGoogle = require("./passports/passport.google");
// const passportRememberMe = require("./passports/passport.rememberMe");

const authRouter = require("./routes/auth/auth");
var indexRouter = require("./routes/index");
const userRouter = require("./routes/users/user");

var app = express();

app.use(
  session({
    secret: "keyboard doggo",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use("local", passportLocal);
passport.use("google", passportGoogle);
// passport.use("remember-me", passportRememberMe);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set view engine as EJS
app.engine("html", require("ejs").renderFile);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findByPk(id);
  done(null, user);
});

// app.use(passport.authenticate("remember-me", { successRedirect: "/" }));

app.use(validateMiddleware);

app.use(expressEjsLayouts);

app.use("/auth", authRouter);
app.use(authMiddleware);
app.use("/", indexRouter);
app.use("/users", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.json({ error: err });
  res.render("error");
});

module.exports = app;
