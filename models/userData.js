const mongoose=require('mongoose');
const Sc=mongoose.Schema({
    u_name:{type:String,required:true},
    u_email:{type:String,required:true,unique:true},
    u_password:{type:String,required:true},
    Image_URL:{type:String,required:true},
    u_phone:{type:Number,default:null} ,
    G_user:{type:Boolean,required:true,default:false}   
})
const Model=mongoose.model('userData',Sc)
module.exports=Model