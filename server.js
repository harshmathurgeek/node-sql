const expres=require('express');
const expressSession=require('express-session');
const passport=require('passport');
const bodyparser = require('body-parser')
const mongoose=require('mongoose')
const db=require('./db')
const LocalStrategy = require("passport-local").Strategy;
const {initializingPassport} =require("./passportConfig")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const app=expres();
const mysql=require('mysql');
const Add=require('./api/Add');
initializingPassport(passport);
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(passport.initialize());
app.use(expressSession({
  secret:'this is my secret',
  resave:false,
  saveUninitialized:true
}));
app.use(passport.session())
mongoose
  .connect('mongodb+srv://theharshrooprai:Mathurharsh18@cluster0.klmhr5d.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo Database connected Successfully"))
  .catch((err) => console.log(err + "error"));

require('./routes')(app);
app.listen(3000,()=>console.log("app is running"));