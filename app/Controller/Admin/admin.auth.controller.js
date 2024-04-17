const {matchedData}=require("express-validator")
const adminModel=require("../../Models/admin.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const AdminloginData=async(req,res)=>{
    try{
        let data=matchedData(req)
        let a=await adminModel.findOne({username:data.username})
        console.log(data)
        if(a){
            let hashedResult=bcrypt.compareSync(data.password,a.password)
            if(hashedResult){
                let token=jwt.sign(JSON.stringify({_id:a._id}),process.env.ADMIN_JWT_SECRET)
                let socketToken=jwt.sign(JSON.stringify({_id:a._id}),process.env.JWT_SECRET)

                res.json({status:"success",token:token,dd_:socketToken})
            }
            else{
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


const createAdminAccount=async(req,res)=>{
    let data=matchedData(req)
    try{
        let password=bcrypt.hashSync(data.password,10)
        await adminModel.create({username:data.username,password:password,root:false})
        res.json({status:"success"})
    }catch(e){
        res.json({status:"failed",message:"Account Creation Failed"})
    }
}

module.exports={AdminloginData,createAdminAccount}