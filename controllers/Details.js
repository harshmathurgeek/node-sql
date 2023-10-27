const getDetailsFile=(req,res)=>{
// res.send("details");
res.render("details");
}
const addDetails=(userData)=>async(req,res)=>{
    var response=[];
    let result= await userData.updateOne({ _id: req.session.user._id }, { $set: { u_city:req.body.u_city,u_phone:req.body.u_phone} })
       if(result){
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
       }else{
        response.push({
            "success":'false'
        },
           {
            "msg":"ERR in Database"
           }
        )
       }
res.send(response)

};
module.exports = {
    getDetailsFile,
    addDetails
  };