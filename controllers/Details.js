const getDetailsFile=(req,res)=>{
// res.send("details");
res.render("details");
}
const addDetails=(userData)=>async(req,res)=>{
    var response=[];
    let result= await userData.updateOne({ _id: req.session.user._id }, { $set: { u_city:req.body.u_city,u_phone:req.body.u_phone,LIC_NO:req.body.LIC_NO} })
    if(result.modifiedCount == 1){
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
        res.send(response)
       }else{
        response.push({
            "success":'false'
        },
           {
            "msg":"ERR in Database "
           }
        )
        res.send(response)
       }


};
module.exports = {
    getDetailsFile,
    addDetails
  };