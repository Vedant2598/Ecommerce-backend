const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/ecommerce")

const otpmodel=require("./app/Models/otp.model")

let f1=async()=>{
    // await otpmodel.updateOne({email:"akejrkejr"},{email:"akejrkejr",otp:12542,createdAt:new Date()},{upsert:true})
    let a=await otpmodel.findOne({email:"vedant.vartak250@gmail.com",otp:636635})
    console.log(a)
}

f1()

