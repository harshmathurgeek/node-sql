const passport=require('passport');
const userData=require('./models/userData');
const firebase=require('firebase/app')
const multer=require('multer');
const path=require('path')
const { getStorage, ref, uploadBytesResumable,getDownloadURL } = require("firebase/storage");

const validator=require('validator')
const firebaseConfig = {
    apiKey: "AIzaSyDkTVL_FS17diZVH852oQRG-dB__o6Lnzw",
    authDomain: "care-club-4b0b6.firebaseapp.com",
    projectId: "care-club-4b0b6",
    storageBucket: "care-club-4b0b6.appspot.com",
    messagingSenderId: "1059626952989",
    appId: "1:1059626952989:web:1b186213e3a8e73cf599f4"
  };
  firebase.initializeApp(firebaseConfig);
  const storage = getStorage();
  
  const upload = multer({ storage: multer.memoryStorage() });
  
  
function routes(app){
app.get('/test1',(req,res)=>{
       res.send("this is working");
    })
app.get('/auth/google',
  passport.authenticate('google', { scope:[ 'email', 'profile' ] })
);

app.get( '/auth/google/callback',passport.authenticate( 'google',{failureRedirect: '/login/error'}),async(req,res)=>{
    var response=[];
    let user=await userData.findOne({u_email:req.user.email});
    if(user){
        response.push(
            {
            "success":'true'
            },
            {
                "msg":'welcome back old user'
            }
            )
            return res.send(response);
  }
else{
    let newUser=new userData({

        u_name:req.user.displayName,
        u_email:req.user.email,
        u_password:" ",
        Image_URL:req.user.photos[0].value,
        // u_phone:null,
        G_user:1
    })

    newUser.save().then((result)=>{
        console.log(result)
        response.push(
            {
                    "success":"true",
            },
            {
                "data":newUser
            },
            
            {
                "msg":"data inserted successfully using google API"
            }
            )
            req.session.user=req.user;

            return res.send(response);
       
    }).catch((err)=>{
        console.log(err);
        response.push(
            {
            "success":'false'
            },
            {
                "err":err
            }
            )
            return res.send(response);  
    })
}})



app.get('/click',(req,res)=>{
    res.send('<a href="http://localhost:3000/auth/google">Sign up with google</a> ')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
res.render('register')    
})
app.post('/login', 
  passport.authenticate('local', {failureRedirect:'/login/error'}),(req,res)=>{
    res.redirect('/login/success');
  });
  app.get('/login/success',(req,res)=>{
    var response=[{
        "success":'true',
    },{

        "msg":'login successfully'
    }
    ];
    req.session.user=req.user;

    return res.send(response);
      })
app.get('/login/error',(req,res)=>{
    let response=[
        {

            "success":'false',
        },{

            "msg":"can not login user"
        }
    ]
    res.send(response);
})
// app.post('/logout', function(req, res, next) {
//     let response=[]
//   req.logout(function(err) {
//     if (err) { return next(err); }
//   delete req.session.user;
//     response.push({
//         "sucess":'true'
//     },{
//         "msg":"logot successfully"
//     })  
//     res.send(response);
//   });
// });
app.post('/register',upload.single("Image_URL"),async(req,res)=>{

    var response=[];
    let u_name=req.body.name
    let u_email = req.body.email;
    let u_password = req.body.password;
    let errors = false;

    if(u_email.length === 0 || u_name === 0 || u_password.length === 0 ) {
        errors='true';
        response.push(
        {
            "success":'false'
        },
        {
            "err":'please fill all details'
        }
        ); 
        // set flash message
        return res.send(response);
    }
     if (!validator.isAlpha(req.body.name)) {
        errors='true';
    response.push({"success":'false'},{'err':" name can not include numbers and specaial symbols"})
      return res.send(response);
    }
 if (!validator.isEmail(req.body.email)) {
    errors='true';
    response.push({"success":'false'},{'err':"email is invalid"})
      return res.send(response);
    }
    if (!validator.isStrongPassword(req.body.password)) {
        errors='true';
    response.push({"success":'false'},{'err':"Password must be of 8 characters and it must contain a capital letter, a number and a special character"})
        return res.send(response)
    }
    let oldUser=await userData.findOne({u_email:req.body.email});
    if(oldUser){

        response.push({"success":'false'},{"err":"email already exits"})
     return   res.send(response);   
    }

    // if no error
    if (!errors) {
          
        // const hashpw = await bcrypt.hash(req.body.password, 10);
        const storageRef = ref(storage, `files/${+Math.floor((Math.random() * 1000) + 1)+"-"+req.file.originalname}`);
        const metaData={
            contentType:req.file.mimetype,
        };
        uploadBytesResumable(storageRef, req.file.buffer,metaData).then((snapshot) => {
          })
          const snapshot=await uploadBytesResumable(storageRef, req.file.buffer,metaData)
        const downloadurl=await getDownloadURL(snapshot.ref);
    
        let newUser =new userData ({
            u_name:req.body.name,
            u_email: req.body.email,
            u_password:req.body.password,
            Image_URL:downloadurl,
            // u_phone:null,
            G_user:0

        })
        newUser.save().then((result)=>{
            console.log(result)
            response.push(
                {
                        "success":"true",
                },
                {
                    "data":newUser
                },
                
                {
                    "msg":"data inserted successfully using Manual Sign up"
                }
                )
                req.session.user=req.user;
    
                return res.send(response);
           
        }).catch((err)=>{
            console.log(err);
            response.push(
                {
                "success":'false'
                },
                {
                    "err":err
                }
                )
                return res.send(response);  
        })
        // insert query
                }
        
})
}
module.exports=routes