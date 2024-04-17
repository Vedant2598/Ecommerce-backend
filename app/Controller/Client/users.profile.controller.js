const userModel =require("../../Models/user.model")
let {matchedData}=require("express-validator")
const fs=require("fs")
const { default: mongoose } = require("mongoose")

const getData=async(req,res)=>{
    try{
        let a=await userModel.findOne({_id:req.token._id},{_id:0,name:1,email:1,phone:1})
        if(a){
         
            res.json({status:"success",data:a})
        }
    }
    catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}

const updateData=async(req,res)=>{
    try{
        let data=matchedData(req)

        await userModel.updateOne({_id:req.token._id},{$set:{name:data.name,update:data.image}})
        res.json({status:"success"})
        
    }catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}

const updateAddress=async(req,res)=>{
    try{
        let data=matchedData(req)
        let token=new mongoose.Types.ObjectId(req.token._id)
        // console.log(data)
        if(data.index==0 || data.index==1){
            let updateData=await userModel.findOne({_id:token},{_id:0,address:1})
            let newData={state:data.state,city:data.city,landmark:data.landmark,address:data.address}
            
            updateData.address[data.index]=newData
            // console.log(updateData)
            await userModel.updateOne({_id:token},{$set:{address:updateData.address}})
            res.json({status:"success"})
            
        }
        else{
            res.json({status:"failed",message:"Wrong Index"})
        }
    }catch(e){
        // console.log(e)
        res.json({status:"failed",message:"Internal Server Error"})
    }
}

const getAddress=async(req,res)=>{
    try{
        let token=new mongoose.Types.ObjectId(req.token._id)
        let data=await userModel.findOne({_id:token},{_id:0,address:1})
        if(data){
            res.json({status:"success",data:data.address})
        }else{
            res.json({status:"failed",message:"No data found"})
        }
        
    }catch(e){
        res.json({status:"failed",message:"Internal Server Error"})
    }
}

const deleteAccount=async(req,res)=>{
    try{
        let data=matchedData(req)
        if(data.confirm==="CONFIRM"){
            await userModel.deleteOne({_id:req.token._id})
            res.json({status:"success"})
        }
    }catch(e){
        res.json({status:"failed",message:"End Point error"})
    }
}


module.exports={getData,updateData,deleteAccount,
                updateAddress,getAddress}