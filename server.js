const expres=require('express');
const expressSession=require('express-session');
const passport=require('passport');
const bodyparser = require('body-parser')
const mongoose=require('mongoose')
const path=require('path')

const {initializingPassport} =require("./passportConfig")
const app=expres();
initializingPassport(passport);
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.set("view engine", "ejs");

app.set('views',path.join(__dirname,'/views'));

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
app.listen(process.env.PORT ||  3000,()=>console.log("app is running"));