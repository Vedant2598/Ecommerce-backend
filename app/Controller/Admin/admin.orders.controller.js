const { matchedData } = require("express-validator")
const ordersModel=require("../../Models/orders.model")
const userModel=require("../../Models/user.model")
const cartModel = require("../../Models/cart.model")
const { default: mongoose } = require("mongoose")

const getOrdersForAdmin=async(req,res)=>{
    try{

        let {search,category}=matchedData(req)
        console.log(search,category)
        let result=await ordersModel.find({})
        console.log(result)
        if(result){
            res.send({status:'success',data:result})
        }else{
            res.send({status:'success',data:[]})
        }

    }catch(e){
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

const updateOrderAdmin=async(req,res)=>{
    try{

        let {orderId,action}=matchedData(req)
        orderId=new mongoose.Types.ObjectId(orderId)
        
        await ordersModel.updateOne({_id:orderId},{$set:{status:action}})
       
        res.send({status:'success'})

    }catch(e){
        console.log(e)
        res.json({status:"failed",message:'Internal Server Error'})
    }
}

module.exports={getOrdersForAdmin,updateOrderAdmin}