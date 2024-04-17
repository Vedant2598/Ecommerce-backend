const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        unique:true
    },
    address:{
        type:Array,
        default:[{index:0},{index:1}]
    },
    balance:{
        type:Number,
        default:10000
    }
})

const userModel= mongoose.model("users",userSchema)
userModel.createIndexes({email:1,phone:1})

module.exports=userModel