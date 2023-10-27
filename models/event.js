const mongoose=require('mongoose');
const Sc=mongoose.Schema({
    e_name:{type:String,required:true},
    e_desc:{type:String,default:null},
    e_location:{type:String,required:true},
    e_date:{type:Date ,required:true},
    e_image:{type:String,required:true},
    e_time:{type:Number,required:true},
    e_timezone:{type:String,required:true},
    e_org_id:{type:mongoose.Schema.ObjectId,required:true} ,
    e_org_contact:{type:Number,required:true} ,

})
const Model=mongoose.model('event',Sc)
module.exports=Model