const mongoose=require("mongoose")

let otpSchema=new mongoose.Schema({
    email:String,
    otp:Number,
    createdAt:Date
})

otpSchema.index({createdAt:1},{expireAfterSeconds:60})

let otpModel=mongoose.model("otps",otpSchema)


module.exports=otpModel