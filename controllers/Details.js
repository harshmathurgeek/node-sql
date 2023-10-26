const getDetailsFile=(req,res)=>{
// res.send("details");
console.log("hey");
res.render("details");
}
const addDetails=(userData)=>async(req,res)=>{
    var response=[];
    let result= await userData.updateOne({ _id: req.session.user._id }, { $set: { u_city:req.body.u_city,u_phone:req.body.u_phone} },(err,result)=>{
        if(err){
            response.push({
                "success":'false'
            },
               {
                "msg":"ERR in Database"
               }
            )
        }
        else{
            response.push(
                {
                "success":'true',
               },
               {
    
                   "_id":req.session.user._id
               },
               {
                "msg":"Details Have Been Updated "
               }
            )
        }
    })
      
res.send(response)

};
module.exports = {
    getDetailsFile,
    addDetails
  };