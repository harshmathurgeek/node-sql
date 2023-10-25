const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const db=require('./db');
exports.initializingPassport=(passport)=>{
passport.use(new LocalStrategy( {usernameField:'email'},(email,password,done)=>{
    var userData;
               db.query(`SELECT * FROM user_data WHERE u_email='${email}'`,   function  (err,rows)     {
          console.log("Asdasadadasdasdasdad");
                if(rows.length <=0){
                    return done(null,false)
                }
            else{

                let user=JSON.parse(JSON.stringify(rows))
                userData=user;
            console.log(userData[0].u_password);
                if(userData[0].u_password !== password ){
                    return done(null,false)
                }
                return done(null,userData);
                }
            
            })    

            passport.serializeUser((user,done ) => {
                // console.log(user)
        
                      done(null, user);
                      // Saving the user details into session through user._id
                    }
                  );
                
                  passport.deserializeUser((id, done) => {
                    // Getting all the user information from user id
                      done(null, done);
                    
                  });  
}));


passport.use(new GoogleStrategy({
    clientID:     "984387427947-kisrs3h1urgmhbb3ekmg5o69tua4cnos.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true,
  },
  function(request, accessToken, refreshToken, profile, done) {
    // console.log(profile);
    return done(null,profile);
  }
));
passport.serializeUser(function(user, done) {
   done(null, user);

    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  
done(null, user);
});

}