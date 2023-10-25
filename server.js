const expres=require('express');
const expressSession=require('express-session');
const passport=require('passport');
const bodyparser = require('body-parser')
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
// app.post('/login', 
//   passport.authenticate("local", {failureRedirect:'/login/error',successRedirect:'/login/success'}),
//  );
//authenticating user from normal

//     passport.use(new LocalStrategy({ usernameField: "u_email" },  (u_email, u_password, done) => {
//       console.log("Asdasd");
//             var userData;
//              db.query(`SELECT * FROM user_data WHERE u_email='${u_email}'`,   function  (err,rows)     {
//       console.log("Asdasadadasdasdasdad");

//                 let user=JSON.parse(JSON.stringify(rows))
//                 userData=user;
//                 console.log(userData[0].u_password);
//               if(err) {
//                   // render to views/use--rs/index.ejs
//                   return done(err);  
//               } else{
                
//                 if(u_password == userData[0].u_password){
//                   return done(null,userData,'password matched')
//   ;
//                 }
//                 else{
//                   return done(err,null);
//                 }
//               }
//             })
              
                  
            
                           
//           }))
         
          
       
// passport.serializeUser((user,done ) => {
//       done(null, user._id);
//       // Saving the user details into session through user._id
//     }
//   );

//   passport.deserializeUser((id, done) => {
//     // Getting all the user information from user id
//       done(null, done);
    
//   });  

//authenticating user from googel
// passport.use(new GoogleStrategy({
//     clientID:     "984387427947-kisrs3h1urgmhbb3ekmg5o69tua4cnos.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:3000/auth/google/callback",
//     passReqToCallback   : true,
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     // console.log(profile);
//     return done(null,profile);
//   }
// ));
// passport.serializeUser(function(user, done) {
//   console.log("dasdasda")
//   console.log(user);  
//   done(null, user);

//     // if you use Model.id as your idAttribute maybe you'd want
//     // done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
  
// done(null, user);
// });

require('./routes')(app);
app.listen(3000,()=>console.log("app is running"));