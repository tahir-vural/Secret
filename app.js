
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, (err, foundUser)=>{
    if(err){
      res.send("kullanici bulunamadi!");
    }else{
      if(foundUser){
        if(password === foundUser.password){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server has started on port 3000.");
});
