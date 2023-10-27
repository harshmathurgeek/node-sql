
const { getStorage, ref, uploadBytesResumable,getDownloadURL } = require("firebase/storage");

const getEventFile=(req,res)=>{
res.render("event");
}
const createEvent=(eventData,storage)=>async(req,res)=>{
   
    const storageRef = ref(storage, `events/${+Math.floor((Math.random() * 1000) + 1)+"-"+req.file.originalname}`);
    const metaData={
        contentType:req.file.mimetype,
    };
    uploadBytesResumable(storageRef, req.file.buffer,metaData).then((snapshot) => {
      })
      const snapshot=await uploadBytesResumable(storageRef, req.file.buffer,metaData)
    const downloadurl=await getDownloadURL(snapshot.ref);

    var response=[];
    
    let tmp=req.body.e_hashtags
      toString(tmp);
      let hastags=[]
       hastags=tmp.split(',');
       console.log(hastags[0])
       console.log(typeof(hastags))
    let newEvent= new eventData({
        e_name:req.body.e_name,
        e_date:req.body.e_date,
        e_desc:req.body.e_desc,
        e_location:req.body.e_location,
        e_image:downloadurl,
        e_time:req.body.e_time,
        e_timezone:req.body.e_timezone,
        e_org_id:req.session.user._id,
        e_org_contact:req.session.user.u_phone,
        e_hashtags:hastags
    });
    
    newEvent.save().then((result)=>{
        console.log(result)
        response.push(
            {
                    "success":"true",
            },
            {
                "data":newEvent
            },
            
            {
                "msg":"event created successfully"
            }
            )

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
    });
}
module.exports={
    getEventFile,
    createEvent
}
