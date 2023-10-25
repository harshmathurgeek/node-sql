const passport=require('passport');
const firebase=require('firebase/app')
const multer=require('multer');
const { getStorage, ref, uploadBytesResumable,getDownloadURL } = require("firebase/storage");

const validator=require('validator')
const db=require('./db');
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
    db.query('show TABLES', function(err, result) {
        console.log(result)
        res.send(result);
    })
});
app.get('/auth/google',
  passport.authenticate('google', { scope:[ 'email', 'profile' ] })
);

app.get( '/auth/google/callback',passport.authenticate( 'google',{failureRedirect: '/login/error'}),(req,res)=>{
    var response=[];
    
    db.query(`SELECT * FROM user_data WHERE u_email='${req.user.email}'`,   function  (err,rows)     {
        if(err)
        {
            response.push(
                {
                "success":'false'
                },
                {
                    "err":err
                }
                )
                return res.send(response);




                
        }
        else{

            if(rows.length >0){
                response.push(
                    {
                    "success":'true'
                    },
                    {
                        "msg":"Welcome Back Old User"
                    }
                    )
                    req.session.user=req.user;
                res.send(response)
            }   
                else{
        var form_data = {
            u_name:req.user.displayName,
            u_email:req.user.email,
            u_password:" ",
            Image_URL:req.user.photos[0].value,
            u_phone:null,
            G_user:1
        }
        db.query('INSERT INTO user_data SET ?', form_data, function(err, result) {
            if (result) {
              
                response.push(
                    {
                            "success":"true",
                    },
                    {
                        "data":form_data
                    },
                    
                    {
                        "msg":"data inserted successfully using google API"
                    }
                    )
                    req.session.user=req.user;

                    return res.send(response);
               
            //    return res.send(response);
            } else {    
                response.push(
                    {
                    "success":'false'
                    },
                    {
                        "err":err
                    }
                    )
                    return res.send(response);
                    
                }
          });  
                     }
     }
    });
    
    
    // res.redirect('/login/success')
}
);

app.get('/click',(req,res)=>{
    res.send('<a href="http://localhost:3000/auth/google">Sign up with google</a> ')
})
app.get('/login',(req,res)=>{
    res.sendFile('E:/care club/login.html')
})
app.get('/register',(req,res)=>{
    res.sendFile('E:/care club/register.html')
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
app.post('/register',upload.single("Image_URL"),async(req,res)=>{

    var response=[];
    let u_name=req.body.u_name
    let u_email = req.body.u_email;
    let u_password = req.body.u_password;
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
 if (!validator.isEmail(req.body.u_email)) {
    errors='true';
    response.push({"success":'false'},{'err':"email is invalid"})
      return res.send(response);
    }
    if (!validator.isStrongPassword(req.body.u_password)) {
        errors='true';
    response.push({"success":'false'},{'err':"Password must be of 8 characters and it must contain a capital letter, a number and a special character"})
        return res.send(response)
    }

    db.query(`SELECT * FROM user_data WHERE u_email='${u_email}'`,function(err,rows)     {
        if(rows.length >0) {
            // render to views/users/index.ejs

            response.push({"success":'false'},{"err":"email already exits"})
         return   res.send(response);   
        } 
        
    });

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
    
        var form_data = {
            u_name:u_name,
            u_email: u_email,
            u_password:u_password,
            Image_URL:downloadurl,
            u_phone:null,
            G_user:0
        }
        
        // insert query
        db.query('INSERT INTO user_data SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (result) {
              
                response.push(
                    {
                            "success":"true",
                    },
                    {
                        "data":form_data
                    },
                    
                    {
                        "msg":"data inserted successfully"
                    }
                    )
                    return res.send(response);
               
            //    return res.send(response);
            } else {    
                response.push(
                    {
                    "success":'false'
                    },
                    {
                        "err":"can not insert data into table,check console for detail err"
                    }
                    )
                    return res.send(response);
                    
                }
            })
        }
        
})
}
module.exports=routes