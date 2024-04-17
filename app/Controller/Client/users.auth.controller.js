const { matchedData } = require("express-validator")
const userModel=require("../../Models/user.model")
const otpModel=require("../../Models/otp.model")
const transport=require("../../Configs/mail.config")

const jwt=require("jsonwebtoken")
let bcrypt=require("bcrypt")
const otpgenerator=require("otp-generator")
const { default: mongoose } = require("mongoose")

// WITHOUT OTP API
const registerData=async(req,res)=>{
    let data=matchedData(req)
    try{
        let password=bcrypt.hashSync(data.password,10)
       
        let payload={name:data.name,email:data.email,password:password,phone:data.phone}
        await userModel.create(payload)
        // console.log(data)
        res.json({status:"success",message:"Account Created"})
    }
    catch(e){
        res.json({status:"failed",message:"Account Already Exist"})
    }
}

const loginData=async(req,res)=>{
    try{
        let data=matchedData(req)
        // console.log(data)
        let a=await userModel.findOne({email:data.email})
        if(a){
            let result=bcrypt.compareSync(data.password,a.password)
            if(result){
                let token=jwt.sign(JSON.stringify({_id:a._id}),process.env.JWT_SECRET)
                res.json({status:"success",token:token})
            }else{
                res.json({status:"failed",message:"Login Failed"})
            }
        }
        else{
            res.json({status:"failed",message:"Login Failed"})
        }
    }
    catch(e){
        res.json({status:"failed",message:"Login Failed"})
    }
}

const userAvailableOrNot=async(req,res)=>{
    try{
        let token=new mongoose.Types.ObjectId(req.token._id)

        let result=await userModel.findOne({_id:token})
        console.log(result)
        if(result){
            res.send({status:"success"})
        }else{
            res.send({status:"failed",message:"User Not Found"})
        }

    }catch(e){
        res.send({status:"failed",message:"Invalid Token"})
    }
}

const returnToken=(req,res)=>{
    try{
        let data=matchedData(req)
        let token=req.token._id

        // console.log(data)
        if(token){
            res.send({status:"success",token:data.token})
        }else{
            res.send({status:"failed",message:"Invalid Token"})
        }
    }catch(e){
        res.send({status:"failed",message:"Invalid Token"})
    }   
}


//WITH OTP REGISTER
// REMAINDER : CROSS CHECK IF IT IS ALREADY REGISTER OR NOT
const registerStep1=async(req,res)=>{
    try{
        let {name,email,phone,password}=matchedData(req)
        if(String(name) && String(email) && Number(phone) && String(password)){


            let data=await userModel.findOne({email:email})
            if(data){
                res.json({status:"failed",message:"Account Already Exist"})
            }
            else
            {

            let otp=otpgenerator.generate(6,{digits:true,lowerCaseAlphabets:false,specialChars:false,upperCaseAlphabets:false})
           
            await otpModel.updateOne({email:email},{email:email,otp:otp,createdAt:new Date()},{upsert:true})
            let mailOption={
                            from:"testers.2598@gmail.com",
                            to:email,
                            subject:"OTP ",
                            text:`Your OTP is ${otp}`
                }
                // res.send({status:"success"})
            transport.sendMail(mailOption,async(e,message)=>{
                    if(e){
                        console.log(e)
                        res.send({status:"failed"})
                    }else{
                        // await otpModel.create({otp:otp,email:email})
                        res.send({status:"success"})
                    }
                })   
            }
        }else{
            res.send({status:"failed"})
        }
    }
    catch(e){
        res.send({status:"failed",message:"Internal Server Error",error:e})
    }
}

const registerStep2=async(req,res)=>{

    try{
        let {otp,email,name,password,phone}=matchedData(req)
        let result=await otpModel.findOne({email:email,otp:otp})
        console.log(result,otp)
        if(result){
            let hashPassword=bcrypt.hashSync(password,10)
            let payload={name:name,email:email,password:hashPassword,phone:phone}
            await userModel.create(payload)
            res.json({status:"success",message:"Account Created"})
        }else{
            res.json({status:"failed",message:"Wrong OTP"})
        }

    }
    catch(e){
        console.log(e)
        // res.json({status:"failed",message:"Account Already Exist"})
    }
}

module.exports={registerData,loginData,returnToken,userAvailableOrNot,
                registerStep1,registerStep2}