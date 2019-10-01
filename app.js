//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
const User = new mongoose.model("User", userSchema);

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.render("home");
});

app.route("/login")
  .get((req, res) => {
    res.render("login");
  });

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({
    email: req.body.username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      if (foundUser.password === req.body.password) {
        res.render("secrets");
      }
    } else {
      res.redirect("/register");
    }
  });
});

app.listen(3000, () => {
  console.log("Server started listening on port 3000");
});
