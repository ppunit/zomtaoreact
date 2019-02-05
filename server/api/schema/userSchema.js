const mongoose=require('mongoose');
let userSchema = mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "mobileno":{type:Number},
    "booking":[],
    "email":{
        type:String,
        required:true,
        unique:true
    }
 },{collection: 'userdata'});
 
 module.exports=mongoose.model('userdata',userSchema)